---
title: YUV视频像素格式
tags:
  - 视频
  - 格式
category: 音视频
published: 2026-11-12
---
YUV 格式主要有两种区分维度：

1. **采样方式**：YUV420、YUV422、YUV444。
2. **内存排列方式**：Packed（打包）、Planar（平面）、Semi-Planar（半平面）。
## 1. YUV420、YUV422、YUV444

这三种格式的主要区别在于 U、V 色度分量的采样频率。

### YUV444

每个像素都有独立的 Y、U、V 分量，不进行色度降采样。

```
Y0 U0 V0    Y1 U1 V1
Y2 U2 V2    Y3 U3 V3
```

每个像素需要 3 Bytes（8-bit）。

### YUV422

水平方向每两个相邻像素共享一组 U、V 色度分量，垂直方向不进行降采样。

```
Y0 U0 V0    Y1 U0 V0
Y2 U1 V1    Y3 U1 V1
```

平均每个像素需要 2 Bytes（8-bit）。

### YUV420

水平方向和垂直方向均进行色度降采样，每个 2×2 像素块共享一组 U、V。

```
Y0       Y1
Y2       Y3

U0 V0
```

平均每个像素需要 1.5 Bytes（8-bit）。

### 三种采样方式对比

|格式|色度采样方式|平均每像素大小|
|---|---|---|
|YUV444|水平、垂直均不降采样|3 Bytes|
|YUV422|水平 2:1 降采样|2 Bytes|
|YUV420|水平、垂直均 2:1 降采样|1.5 Bytes|

## 2. Packed

FourCC（Four-Character Code）是 AVI、DirectShow、V4L2 等接口使用的四字符格式标识。它描述具体的内存布局；同一布局可能有多个名字，例如 `YUY2` 与 `YUYV`。

Y、U、V 交错存放在同一段内存中，相邻像素共享色度分量。下面四种格式都属于 YUV422，8-bit 下每 4 Bytes 表示两个像素。

### YUY2 / YUYV

```
Y0 U0 Y1 V0 | Y2 U1 Y3 V1 | ...
```

两个像素分别取 `Y0`、`Y1`，共用 `U0`、`V0`。`YUY2` 与 `YUYV` 通常表示同一种布局，只是常见于不同接口。

### UYVY

```
U0 Y0 V0 Y1 | U1 Y2 V1 Y3 | ...
```

与 YUYV 相同，只是 Y、U、V 的排列顺序不同。

### YVYU、VYUY

```
YVYU: Y0 V0 Y1 U0 | Y2 V1 Y3 U1 | ...
VYUY: V0 Y0 U0 Y1 | V1 Y2 U1 Y3 | ...
```

两者同样是 YUV422 打包格式，仅字节顺序不同。

## 3. Semi-Planar

Y 单独存放，U、V 交错存放在另一个平面。NV12 和 NV21 都属于 YUV420。

### NV12

```
Y Plane:  Y0 Y1 Y2 Y3 ...
UV Plane: U0 V0 U1 V1 ...
```

Y 与 UV 分为两个平面，色度按 UV 顺序交错。

### NV21

```
Y Plane:  Y0 Y1 Y2 Y3 ...
VU Plane: V0 U0 V1 U1 ...
```

与 NV12 的唯一区别是色度按 VU 顺序交错。

### NV16

NV16 是 YUV422 Semi-Planar：Y 与 UV 仍分为两个平面，但色度只在水平方向 2:1 降采样，垂直方向不降采样。

### P010 / P016

两者都是 YUV420 Semi-Planar，平面顺序与 NV12 相同，区别是每个分量使用 16-bit 容器：P010 的有效位深为 10-bit，P016 为 16-bit。具体填充和对齐方式由接口定义。

## 4. Planar

Y、U、V 分别存放在三个独立平面中。I420 和 YV12 都属于 YUV420，每个 2×2 像素块共享一组 U、V。

### I420 / IYUV

```
Y Plane -> U Plane -> V Plane
```

三个平面的顺序为 Y、U、V。`IYUV` 通常作为 I420 的别名。

### YV12

```
Y Plane -> V Plane -> U Plane
```

与 I420 的唯一区别是 U、V 平面顺序互换。

## 5. 总结

| FourCC | 采样方式 | 内存布局 | 特点 |
| --- | --- | --- | --- |
| YUY2 / YUYV | 4:2:2 | Packed | Y0 U0 Y1 V0 |
| UYVY | 4:2:2 | Packed | U0 Y0 V0 Y1 |
| YVYU | 4:2:2 | Packed | Y0 V0 Y1 U0 |
| VYUY | 4:2:2 | Packed | V0 Y0 U0 Y1 |
| NV12 | 4:2:0 | Semi-Planar | Y + UV |
| NV21 | 4:2:0 | Semi-Planar | Y + VU |
| NV16 | 4:2:2 | Semi-Planar | Y + UV |
| P010 | 4:2:0 | Semi-Planar | Y + UV, 10-bit |
| P016 | 4:2:0 | Semi-Planar | Y + UV, 16-bit |
| I420 / IYUV | 4:2:0 | Planar | Y + U + V |
| YV12 | 4:2:0 | Planar | Y + V + U |
