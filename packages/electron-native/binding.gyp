{
  "targets": [
    {
      "target_name": "native",
      "sources": [
        "src/main.cc",
        "src/init.cc",
        "src/connect.cc"
      ],
      "conditions": [
        [ "OS==\"mac\"", {
          "include_dirs": [ "libs/mac/include" ],
          "xcode_settings": {
            "MACOSX_DEPLOYMENT_TARGET": "15.5"
          },
          "conditions": [
            [ "target_arch==\"arm64\"", {
              "libraries": [
                "<!(node -p \"require('path').resolve(__dirname,'libs/mac/arm64/librust_universal_imsdk.a')\")"
              ]
            }],
            [ "target_arch==\"x64\"", {
              "libraries": [
                "<!(node -p \"require('path').resolve(__dirname,'libs/mac/x86_64/librust_universal_imsdk.a')\")"
              ]
            }]
          ]
        }],
        [ "OS==\"linux\"", {
          "include_dirs": [ "libs/linux/include" ],
          "conditions": [
            [ "target_arch==\"arm64\"", {
              "libraries": [
                "<!(node -p \"require('path').resolve(__dirname,'libs/linux/arm64/librust_universal_imsdk.a')\")"
              ]
            }],
            [ "target_arch==\"x64\"", {
              "libraries": [
                "<!(node -p \"require('path').resolve(__dirname,'libs/linux/x86_64/librust_universal_imsdk.a')\")"
              ]
            }]
          ]
        }]
      ]
    }
  ]
}


