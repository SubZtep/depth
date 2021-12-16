# `web`

## Pages

| Name                                              | Description                           |
| ------------------------------------------------- | ------------------------------------- |
| [`/depth`](./src/pages/DepthPage.vue)             | halu                                  |
| [`/player`](./src/pages/PlayerPage.vue)           | Player character settings.            |
| [`/environment`](./src/pages/EnvironmentPage.vue) | Environment (light, skybox) settings. |
| [`/video`](./src/pages/VideoPage.vue)             | Video processing test page.           |

## 3D

Ready to use WebGL objects, mostly cached and with physics.

### Components

| Name                                                         |             Test              | Description                                           |
| ------------------------------------------------------------ | :---------------------------: | ----------------------------------------------------- |
| [`FloorPlane`](./src/3d/components/FloorPlane.ts)            |         :latin_cross:         | Floor with collider.                                  |
| [`SkyBox`](./src/3d/components/SkyBox.ts)                    |         :latin_cross:         | Photo realistic skybox with multiple part of the day. |
| [`GradientPyramis`](./src/3d/components/GradientPyramis.vue) |         :latin_cross:         | Ugly pyramid.                                         |
| [`SkyBox`](./src/3d/components/SkyBox.vue)                   | :negative_squared_cross_mark: | Parentable box mesh.                                  |

### Materials

| Name                                                         |     Test      | Description |
| ------------------------------------------------------------ | :-----------: | ----------- |
| [`GradientMaterial`](./src/3d/materials/GradientMaterial.ts) | :latin_cross: | Gradient.   |

## Components

### 3D

| Name                                             |     Test      | Description                     |
| ------------------------------------------------ | :-----------: | ------------------------------- |
| [`DefaultLights`](./src/components/ui/Debug.vue) | :latin_cross: | Ambient and directional lights. |

### UI

| Name                                               |             Test              | Description                               |
| -------------------------------------------------- | :---------------------------: | ----------------------------------------- |
| [`Debug`](./src/components/ui/Debug.vue)           | :negative_squared_cross_mark: | Movable and resizable debug data display. |
| [`Title`](./src/components/ui/Title.vue)           | :negative_squared_cross_mark: | Fancy temporary text for labels.          |
| [`MemoryInfo`](./src/components/ui/MemoryInfo.vue) |         :latin_cross:         | Debug info.                               |
