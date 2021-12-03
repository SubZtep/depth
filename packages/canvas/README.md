# `@depth/canvas`

- Handling 3D canvas by wrapping [Three.js](https://threejs.org/).
- Running the main game loop.

## Global Property

`app.config.globalProperties.`:jigsaw:

| Property        | Description                                                                       |
| --------------- | --------------------------------------------------------------------------------- |
| `$setCanvas`    | _WebGL_ renderer initialisation function.                                         |
| `$loopin.value` | Reactive switch of gameloop status.                                               |
| `$scene`        | Three.js [Scene](https://threejs.org/docs/index.html#api/en/scenes/Scene) object. |

## Global Functions

| Function | Description              |
| -------- | ------------------------ |
| `exec3D` | Run callback once in 3D. |
| `loop3D` | Run in every tick in 3D. |
