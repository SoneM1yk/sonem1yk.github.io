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

## 2. NV12 和 NV21

NV12 和 NV21 都属于 YUV420 Semi-Planar（半平面）格式。

它们将 Y 分量和 UV 分量分别存放在两个平面中，其中 UV 分量交错排列。

### NV12

内存布局：

```
Y Plane:
Y0 Y1 Y2 Y3
Y4 Y5 Y6 Y7
...

UV Plane:
U0 V0 U1 V1
...
```

- Y：独立平面。
    
- UV：交错排列。
    
- 色度顺序：UV。
    

### NV21

NV21 与 NV12 的区别仅在于 UV 的排列顺序：

```
Y Plane:
Y0 Y1 Y2 Y3
Y4 Y5 Y6 Y7
...

VU Plane:
V0 U0 V1 U1
...
```

- Y：独立平面。
    
- VU：交错排列。
    
- 色度顺序：VU。
    

**核心区别：NV12 是 UV 排列，NV21 是 VU 排列。**

## 3. YUYV 和 UYVY

YUYV 和 UYVY 都属于 YUV422 Packed（打包）格式。

它们将 Y、U、V 分量交错存放在同一段内存中，每两个像素共用一组 U、V。

### YUYV

内存排列：

```
Y0 U0 Y1 V0 | Y2 U1 Y3 V1 | ...
```

每四个字节表示两个像素：

```
Pixel 0: Y0 + U0 + V0
Pixel 1: Y1 + U0 + V0
```

### UYVY

内存排列：

```
U0 Y0 V0 Y1 | U1 Y2 V1 Y3 | ...
```

同样，每四个字节表示两个像素。

**核心区别：YUYV 和 UYVY 仅仅是 Y、U、V 在内存中的排列顺序不同。**

## 4. I420和YV12

### I420

I420 是 YUV420 Planar 格式。

Y、U、V 分别存放在三个独立平面中：

```
+------------------+
|                  |
|      Y Plane     |
|                  |
+------------------+
|      U Plane     |
+------------------+
|      V Plane     |
+------------------+
```

数据排列：

```
Y Plane -> U Plane -> V Plane
```

每个 2×2 像素块共享一组 U、V。

### YV12

YV12 与 I420 一样属于 YUV420 Planar 格式。

区别在于 U、V 平面的排列顺序：

```
Y Plane -> V Plane -> U Plane
```
## 5. 总结

| 格式   | 采样方式  | 内存布局        | 特点          |
| ---- | ----- | ----------- | ----------- |
| NV12 | 4:2:0 | Semi-Planar | Y + UV      |
| NV21 | 4:2:0 | Semi-Planar | Y + VU      |
| YUYV | 4:2:2 | Packed      | Y0 U0 Y1 V0 |
| UYVY | 4:2:2 | Packed      | U0 Y0 V0 Y1 |
| I420 | 4:2:2 | Planar      | Y + U + V   |
| YV12 | 4:2:0 | Planar      | Y + V + U   |
