import ThreeGlobe from "three-globe"
import { loop3D, useScene } from "@depth/canvas"
import { Mesh } from "three/src/objects/Mesh"
import { SphereBufferGeometry } from "three/src/geometries/SphereGeometry"
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial"
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial"

export const terrains = ["topology", "water"]
export const surfaces = ["blue-marble", "day", "night", "dark"]

export default defineComponent({
  props: {
    position: {
      type: Object as PropType<PositionTuple>,
      default: () => [0, 0, 0] as PositionTuple,
    },
    scale: {
      type: Number,
      default: 1,
    },
    surface: {
      type: String,
      default: surfaces[0],
      validator: (v: string) => surfaces.includes(v),
    },
    terrain: {
      type: String,
      default: terrains[0],
      validator: (v: string) => terrains.includes(v),
    },
    points: {
      type: Array as PropType<Array<{ lat: number; lng: number }>>,
      required: false,
    },
  },
  setup(props, { slots }) {
    const Globe = new ThreeGlobe().showAtmosphere(false)
    Globe.rotateY(-Math.PI / 2)
    Globe.castShadow = true
    Globe.receiveShadow = true
    // @ts-ignore
    // Globe.globeMaterial().shininess = 0
    Globe.updateMatrix()

    const scene = useScene()
    scene.add(Globe)

    if (props.points) {
      Globe.hexBinPointsData(props.points)
      Globe.hexBinPointWeight(3)
      Globe.hexBinResolution(2)
      Globe.hexMargin(0.2)
      Globe.hexTopColor(() => "darkgreen")
      Globe.hexSideColor(() => "green")
      Globe.hexBinMerge(true)
    }

    onScopeDispose(() => {
      scene.remove(Globe)
    })

    watchEffect(() => {
      Globe.position.set(...(props.position as PositionTuple))
      Globe.scale.set(props.scale, props.scale, props.scale)
      Globe.globeImageUrl(`/textures/globe/earth-${props.surface}.jpg`)
      Globe.bumpImageUrl(`/textures/globe/earth-${props.terrain}.png`)
    })

    const N = 300
    const gData = [...Array.from({ length: N }).keys()].map(() => ({
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      alt: Math.random(),
      radius: Math.random() * 3,
      color: ["red", "black"][Math.round(Math.random())],
    }))

    Globe.customLayerData(gData)
    .customThreeObject((d, globeRadius) => {
        // @ts-ignore
        const mesh = new Mesh(new SphereBufferGeometry(d.radius, 5, 4), new MeshPhongMaterial({ color: d.color, shininess: 1 }))
        // const mesh = new Mesh(new SphereBufferGeometry(d.radius), new MeshLambertMaterial({ color: d.color }))
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.material.needsUpdate = true

        loop3D(() => {
          mesh.rotateY(Math.random() * 0.01)
        })

        return mesh
      })
      .customThreeObjectUpdate((obj, d) => {
        // @ts-ignore
        Object.assign(obj.position, Globe.getCoords(d.lat, d.lng, d.alt))
      })

    loop3D(({ deltaTime }) => {
      for (const d of gData) d.lat += 10 * deltaTime
      Globe.customLayerData(Globe.customLayerData())
    })

    return () => slots.default?.()
  },
})
