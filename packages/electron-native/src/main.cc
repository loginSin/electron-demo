#include <node_api.h>
#include "init.h"
#include "connect.h"

namespace rcim {

napi_status register_function(napi_env env, napi_value exports, const char* name, napi_callback cb) {
    napi_value fn;
    napi_status status = napi_create_function(env, name, NAPI_AUTO_LENGTH, cb, nullptr, &fn);
    if (status != napi_ok) return status;
    status = napi_set_named_property(env, exports, name, fn);
    return status;
}

static napi_value Init(napi_env env, napi_value exports) {
  register_function(env, exports, "init", init);
  register_function(env, exports, "connect", connect);
  return exports;
}
}  // namespace rcim

NAPI_MODULE(NODE_GYP_MODULE_NAME, rcim::Init)



