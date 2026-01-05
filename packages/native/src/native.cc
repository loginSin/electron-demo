#include <node_api.h>
#include <string>

static napi_value HelloWithCallback(napi_env env, napi_callback_info info) {
  size_t argc = 2;
  napi_value args[2];
  napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);

  if (argc < 2) {
    napi_throw_type_error(env, nullptr, "Expected 2 arguments: name, callback");
    return nullptr;
  }

  // args[0] may be undefined or string
  napi_valuetype type0;
  napi_typeof(env, args[0], &type0);
  std::string name = "World";
  if (type0 == napi_string) {
    size_t str_len = 0;
    napi_get_value_string_utf8(env, args[0], nullptr, 0, &str_len);
    std::string tmp(str_len, '\0');
    if (str_len > 0) {
      napi_get_value_string_utf8(env, args[0], tmp.data(), str_len + 1, &str_len);
      // trim simple
      size_t start = tmp.find_first_not_of(" \t\n\r");
      size_t end = tmp.find_last_not_of(" \t\n\r");
      if (start != std::string::npos && end != std::string::npos) {
        name = tmp.substr(start, end - start + 1);
      } else {
        name = "World";
      }
    }
  }

  // args[1] must be a function
  napi_valuetype type1;
  napi_typeof(env, args[1], &type1);
  if (type1 != napi_function) {
    napi_throw_type_error(env, nullptr, "Second argument must be a function");
    return nullptr;
  }

  std::string message = "🔧 Hello from native, " + name + "!";

  napi_value jsMessage;
  napi_create_string_utf8(env, message.c_str(), message.size(), &jsMessage);

  napi_value undefinedValue;
  napi_get_undefined(env, &undefinedValue);

  napi_value callback = args[1];
  napi_value argv[1];
  argv[0] = jsMessage;
  // Call callback(message) synchronously
  napi_call_function(env, undefinedValue, callback, 1, argv, nullptr);

  return nullptr;
}

static napi_value Init(napi_env env, napi_value exports) {
  napi_value fn;
  napi_create_function(env, "helloWithCallback", NAPI_AUTO_LENGTH, HelloWithCallback, nullptr, &fn);
  napi_set_named_property(env, exports, "helloWithCallback", fn);
  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)


