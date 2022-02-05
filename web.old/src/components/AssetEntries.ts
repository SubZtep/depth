import { AssetsData } from "@depth/assets"
import { defineAsyncComponent, DefineComponent, defineComponent, h } from "vue"

export default defineComponent({
  props: {
    assetsData: {
      type: Array as unknown as PropType<any[]>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const entries = props.assetsData.map(dataWithID => {
      const { id, ...data } = dataWithID

      const assetComponent = defineAsyncComponent(
        () =>
          new Promise<DefineComponent>((resolve, reject) => {
            import("@depth/assets").then(pkg => {
              if (pkg[id] === undefined) {
                return reject(new Error(`Asset ${id} not found`))
              }
              return resolve(pkg[id] as DefineComponent)
            })
          })
      )

      return [id, { assetComponent, ...data }]
    })

    return () => slots.default?.({ entries })
  },
})
