#include "init.h"
#include "rcim_header.h"
#include <stdio.h>
#include <string>

namespace rcim {
    napi_value createEngine(napi_env env, napi_callback_info info) {
        // 必传参数：第一个参数为存储路径字符串
        size_t argc = 1;
        napi_value args[1];
        napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);
        if (argc < 1) {
            napi_throw_type_error(env, nullptr, "createEngine requires 1 argument: storePath(string)");
            return nullptr;
        }
        napi_valuetype t0;
        napi_typeof(env, args[0], &t0);
        if (t0 != napi_string) {
            napi_throw_type_error(env, nullptr, "storePath must be a string");
            return nullptr;
        }
        size_t slen = 0;
        napi_get_value_string_utf8(env, args[0], nullptr, 0, &slen);
        if (slen == 0) {
            napi_throw_type_error(env, nullptr, "storePath cannot be empty");
            return nullptr;
        }
        std::string storePath;
        storePath.resize(slen);
        size_t outlen = 0;
        napi_get_value_string_utf8(env, args[0], storePath.data(), slen + 1, &outlen);

        RcimEngineBuilderParam param;
        param.app_key = "n19jmcy59f1q9";
        param.platform = RcimPlatform_MacOS;
        param.device_id = "deviceId";
        param.package_name = "com.electron.app";
        param.imlib_version = "1.0.0";
        param.device_model = "MacBook Pro";
        param.device_manufacturer = "Apple";
        param.os_version = "15.5";
        
        static const char kSdkName[] = "electron-sdk";
        static const char kSdkVer[] = "1.0.0";
        static RcimSDKVersion kVersions[1] = {
            { kSdkName, kSdkVer }
        };
        param.sdk_version_vec = kVersions;
        param.sdk_version_vec_len = 1;
        param.app_version = "1.0.0";

        RcimEngineBuilder *builder;
        RcimEngineError code = rcim_create_engine_builder(&param, &builder);
        code = rcim_engine_builder_set_store_path(builder, storePath.c_str());
        code = rcim_engine_builder_set_area_code(builder, RcimAreaCode_Bj);

        // uint32_t naviLen = trans::lengthFromValue(env, naviServerArrayValue);
        // if (naviLen > 0) {
        //     char **naviServerCharArray = nullptr;
        //     trans::charPointPointFromValue(env, naviServerArrayValue, naviLen, &naviServerCharArray);
        //     code = rcim_engine_builder_set_navi_server(builder, naviServerCharArray, naviLen);
        //     trans::freeCharPointPoint(naviServerCharArray, naviLen);
        // } else {
            code = rcim_engine_builder_set_navi_server(builder, nullptr, 0);
        // }

        code = rcim_engine_builder_set_statistic_server(builder,"");

        int cloudType = 108;
        RcimCloudType cloud_type = RcimCloudType_PublicCloud;
        if (106 == cloudType) {
            cloud_type = RcimCloudType_PrivateCloud;
        } else if (104 == cloudType) {
            cloud_type = RcimCloudType_PrivateCloud104;
        }
        code = rcim_engine_builder_set_cloud_type(builder, cloud_type);
        // 数据库：公有云不加密，私有云加密
        bool is_db_encrypted = RcimCloudType_PublicCloud == cloud_type ? false : true;
        code = rcim_engine_builder_set_db_encrypted(builder, is_db_encrypted);
        code = rcim_engine_builder_set_enable_group_call(builder, true);
        code = rcim_engine_builder_set_enable_reconnect_kick(builder, true);
        code = rcim_engine_builder_set_file_path(builder, "");
        // if (!networkEnv.empty()) {
        //     code = rcim_engine_builder_set_network_env(builder, networkEnv.c_str());
        // }
        code = rcim_engine_builder_set_enable_sync_empty_top_conversation(builder, true);

        RcimEngineSync *engine;
        code = rcim_engine_builder_build(builder, &engine);
        fprintf(stderr, "[rcim] build code=%d, engine=%p\n", code, (void*)engine);
        if (code != RcimEngineError_Success || engine == nullptr) {
            napi_throw_error(env, nullptr, "rcim_engine_builder_build failed");
            return nullptr;
        }
        // 将 RcimEngineSync *engine 指针转为 64 位整数并返回（BigInt, int64）
        napi_value ret;
        int64_t ptr = (int64_t)(uintptr_t)engine;
        // 打印日志，在控制台查看 ptr 的值
        fprintf(stderr, "[rcim] engine ptr: %lld\n", (long long)ptr);
        fflush(stderr);
        napi_create_bigint_int64(env, ptr, &ret);
        return ret;
    }

}


