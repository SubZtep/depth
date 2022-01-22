import type { DefineComponent } from "vue"
import { defineAsyncComponent, shallowRef } from "vue"

export const loadAsset =
  (pkg: string = "@depth/assets") =>
  ({ name }: Omit<AssetData, "id">) =>

    defineAsyncComponent(
      () =>
        new Promise<DefineComponent>((resolve, reject) =>
          import(pkg).then(pkg => {
            console.log("LOAD", [pkg, name])
            if (pkg[name] === undefined) {
              return reject(new Error(`Asset ${name} not found`))
            }
            return resolve(pkg[name] as DefineComponent)
          })
        )
    )

export const loadAssets = (componentData: AssetsData) => {
  const loader = loadAsset()
  return componentData.map(dataWithID => {
    const { id, ...data } = dataWithID
    return [id, { cmp: shallowRef(loader(data)), ...data }]
  })
}
