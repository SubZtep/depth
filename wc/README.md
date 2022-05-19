# css3d-cube

Display a 3D CSS cube.

## Properties

| Property | Type     | Description |
|----------|----------|-------------|
| `statem` | `String` | Statem ID   |

## CSS Custom Properties

| Property     | Default | Description             |
|--------------|---------|-------------------------|
| `--edge`     | "100px" | Cube edge size          |
| `--rotate3d` | "0deg"  | 3D rotation on all axis |


# d-debug

Display statem value.

## Properties

| Property | Type     | Description |
|----------|----------|-------------|
| `statem` | `String` | Statem ID   |


# statem-debug

Display statem value.

## Properties

| Property | Type     | Description |
|----------|----------|-------------|
| `statem` | `String` | Statem ID   |


# svg-icon

Display a responsive, inline SVG icon.

Included shapes:
- play
- stop
- hamburger

## Properties

| Property | Attribute | Modifiers | Type         | Description              |
|----------|-----------|-----------|--------------|--------------------------|
| `name`   | `name`    |           | `String`     | Reactive icon shape name |
| `svgEl`  |           | readonly  | `SVGElement` |                          |

## CSS Custom Properties

| Property        | Default        | Description      |
|-----------------|----------------|------------------|
| `--icon-fill`   | "currentColor" | Primary colour   |
| `--icon-height` | "1rem"         | Inline font size |
