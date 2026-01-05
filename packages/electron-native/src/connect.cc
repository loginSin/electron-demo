#include "connect.h"
#include "rcim_header.h"
#include <stdio.h>
#include <string>

namespace rcim {
    // todo qixinbing 需要抽象 context，仿照鸿蒙
    struct ConnectCtx {
        napi_env env;
        napi_threadsafe_function tsfn;
    };

    struct CallbackData {
        int error;
        const char* userId;
    };

    static void callJS(napi_env env, napi_value js_cb, void* /*context*/, void* data) {
        if (env == nullptr || js_cb == nullptr || data == nullptr) return;
        CallbackData* payload = static_cast<CallbackData*>(data);
        napi_value undefinedValue;
        napi_get_undefined(env, &undefinedValue);
        napi_value argv[2];
        napi_create_int32(env, payload->error, &argv[0]);
        napi_create_string_utf8(env, payload->userId ? payload->userId : "", NAPI_AUTO_LENGTH, &argv[1]);
        napi_value result;
        napi_call_function(env, undefinedValue, js_cb, 2, argv, &result);
        // free copied C-string
        if (payload->userId) {
            delete[] payload->userId;
        }
        delete payload;
    }

    void connectAdapter(const void *context, enum RcimEngineError error, const char *user_id) {
        const char* uid = user_id ? user_id : "(null)";
        fprintf(stderr, "[rcim] connectAdapter() with error: %d, user_id: %s\n", error, uid);
        fflush(stderr);
        const ConnectCtx* ctx = static_cast<const ConnectCtx*>(context);
        if (ctx && ctx->tsfn) {
            CallbackData* payload = new CallbackData();
            payload->error = static_cast<int>(error);
            if (user_id) {
                size_t len = strlen(user_id);
                char* copy = new char[len + 1];
                memcpy(copy, user_id, len);
                copy[len] = '\0';
                payload->userId = copy;
            } else {
                payload->userId = nullptr;
            }
            napi_call_threadsafe_function(ctx->tsfn, payload, napi_tsfn_nonblocking);
            napi_release_threadsafe_function(ctx->tsfn, napi_tsfn_release);
            delete ctx;
        }
    }
    napi_value connect(napi_env env, napi_callback_info info) {
        size_t argc = 4;
        napi_value args[4];
        napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);
        if (argc < 1) {
            napi_throw_type_error(env, nullptr, "connect requires arguments: engine(BigInt), token(string)?, timeout(number)?, callback(function)?");
            return nullptr;
        }
        // arg0: engine
        int64_t s = 0;
        bool lossless = false;
        napi_get_value_bigint_int64(env, args[0], &s, &lossless);
        RcimEngineSync* engine = (RcimEngineSync*)(uintptr_t)s;
        fprintf(stderr, "[rcim] connect() with engine ptr: %lld\n", (long long)s);
        fflush(stderr);
        // optional args
        std::string token = "demo_token";
        int timeout = 5;
        napi_valuetype t1;
        if (argc >= 2 && napi_typeof(env, args[1], &t1) == napi_ok && t1 == napi_string) {
            size_t len = 0;
            napi_get_value_string_utf8(env, args[1], nullptr, 0, &len);
            if (len > 0) {
                token.resize(len);
                size_t out = 0;
                napi_get_value_string_utf8(env, args[1], token.data(), len + 1, &out);
            }
        }
        napi_valuetype t2;
        if (argc >= 3 && napi_typeof(env, args[2], &t2) == napi_ok && (t2 == napi_number)) {
            double to = 0;
            napi_get_value_double(env, args[2], &to);
            timeout = static_cast<int>(to);
        }
        // optional callback
        ConnectCtx* ctx = nullptr;
        napi_threadsafe_function tsfn = nullptr;
        napi_valuetype t3;
        if (argc >= 4 && napi_typeof(env, args[3], &t3) == napi_ok && t3 == napi_function) {
            napi_value resource_name;
            napi_create_string_utf8(env, "connectCallback", NAPI_AUTO_LENGTH, &resource_name);
            napi_create_threadsafe_function(
                env,
                args[3],
                nullptr,
                resource_name,
                0,
                1,
                nullptr,
                nullptr,
                nullptr,
                callJS,
                &tsfn
            );
            ctx = new ConnectCtx{ env, tsfn };
        }
        void *context = static_cast<void*>(ctx);
        rcim_engine_connect(engine, token.c_str(), timeout, context, connectAdapter);
        napi_value undef;
        napi_get_undefined(env, &undef);
        return undef;
    }
}


