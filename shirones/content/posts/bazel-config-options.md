---
title: Bazel使用配置项
category: 构建工具
published: 2026-11-11
draft: false
tags:
  - 工具
  - Bazel
  - 古法编程
---
## 1. config_setting

使用 `config_setting` 定义构建条件，通过 `select()` 根据条件选择不同的依赖或编译选项。

```
config_setting(
    name = "use_cuda",
    define_values = {
        "use_cuda": "true",
    },
)
```

构建时传入自定义参数：

```
bazel build //app:target --define use_cuda=true
```

通过 `select()` 匹配配置：

```
cc_binary(
    name = "app",
    srcs = ["main.cc"],
    deps = select({
        ":use_cuda": ["//cuda:cuda_lib"],
        "//conditions:default": ["//cpu:cpu_lib"],
    }),
)
```

`config_setting` 也可以匹配 Bazel 原生构建选项：

```
config_setting(
    name = "linux_build",
    values = {
        "cpu": "k8",
    },
)
```

## 2. Label 名称解析

Bazel 使用 Label 唯一标识一个构建目标，基本格式：

```
@仓库名//包路径:目标名
```

常见写法：

|Label|含义|
|---|---|
|`//app:main`|当前主仓库中 app 包下的 main 目标|
|`//app`|等价于 `//app:app`|
|`:main`|当前包下的 main 目标|
|`main`|当前包下的 main 目标（在 Label 属性中）|
|`//:main`|主仓库根包下的 main 目标|
|`@repo//app:main`|外部仓库 repo 中 app 包下的 main 目标|
|`@@repo//app:main`|通过规范仓库名引用 repo 中的目标|

### 仓库标识

- `//`：当前主仓库。
    
- `@repo//`：通过仓库名称引用外部仓库。
    
- `@@repo//`：通过规范仓库名称引用外部仓库。
    

### 包路径与目标名

```
//package/path:target
```

- `package/path`：BUILD 文件所在的包路径。
    
- `target`：BUILD 文件中定义的目标名称。
    
- `:`：分隔包路径和目标名称。
    

省略目标名时，默认目标名为包的最后一个路径组件，例如：

```
"//app/backend"
```

等价于：

```
"//app/backend:backend"
```

省略仓库名时，默认使用当前仓库；省略包路径时，默认使用当前包（具体取决于 Label 所在的上下文）。