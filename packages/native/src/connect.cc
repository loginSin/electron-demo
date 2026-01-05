#include "connect.h"
#include "rcim_header.h"
#include <stdio.h>
#include <string>

namespace rcim {
    void connectAdapter(const void *context, enum RcimEngineError error, const char *user_id) {
        const char* uid = user_id ? user_id : "(null)";
        fprintf(stderr, "[rcim] connectAdapter() with error: %d, user_id: %s\n", error, uid);
        fflush(stderr);
    }
    napi_value connect(napi_env env, napi_callback_info info) {
        size_t argc = 1;
        napi_value args[1];
        napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);
        if (argc < 1) {
            napi_throw_type_error(env, nullptr, "connect requires 1 argument: engine(BigInt)");
            return nullptr;
        }
        int64_t s = 0;
        bool lossless = false;

        // RcimEngineSync *engine;
        // code = rcim_engine_builder_build(builder, &engine);
        // // 将 RcimEngineSync *engine 指针转为 64 位整数并返回（BigInt）
        // napi_value ret;
        // int64_t ptr = (int64_t)(uintptr_t)engine;

        napi_get_value_bigint_int64(env, args[0], &s, &lossless);
        RcimEngineSync* engine = (RcimEngineSync*)(uintptr_t)s;
        fprintf(stderr, "[rcim] connect() with engine ptr: %lld\n", (long long)s);
        fflush(stderr);
        // 调用 rcim 的实际连接接口
        std::string token = "rdIKubNd6vTWuKUdlUU6eOF+lwb3rejulGH0HEWstV0=@h4mx.cn.rongnav.com;h4mx.cn.rongcfg.com";
        int timeout = 5;
        void *context = nullptr;
        rcim_engine_connect(engine, token.c_str(), timeout, context, connectAdapter);
        napi_value undef;
        napi_get_undefined(env, &undef);
        return undef;
    }
}