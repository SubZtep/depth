# `@depth/dat.gui`

:link: [Origin](https://github.com/dataarts/dat.gui)

Always visible head-up display with permanent navigation and settings folder.

Respect reactive target objects with primitive or options values.

## Usage

Call `addGuiFolder` in a page or component for a new gui folder until its parent mounted.

```ts
const state = reactive({
  scale: 1,
  zMulti: 0.5,
})

addGuiFolder(folder => {
  folder.name = "🤸 Stickman"
  folder.add(state, "scale", 0.1, 5, 0.1).name("Scale objects")
  folder.add(state, "zMulti", 0.1, 2, 0.1).name("Z multiplier")
})
```

Works together well with `reactive` objects by default.

## Additional functions


- ### `addTextInput( payload )`

  > With fulfilled `filter`, trigger `onChange` and `onFinishChange` callbacks without the object to be manipulated.

   Payload object:
   - filter — RegExp
   - placeholder — ?string
   - keepValue — ?boolean

- ### `addVector3( payload )`

  > Create subfolder for the X, Y and Z axis numeric values.

   Payload parameter:
   - xyz — THREE.Vector3Tuple

## Additional exports

- GuiPlugin — Mandatory **Vue** plugin.
- useGui — Inject the main **dat.GUI** instance.

## Custom styling

New class `.depth` added to the root div. Based on this selector the original CSS was updated to be more flexible and scalable.
