<template lang="pug">
ParaPanel(title="Voxel Terrain")
  div Cell size
  InputNumber(v-model="state.cellSize" :min="0" :max="100" :hover="props.hover")

  div Cell height
  InputNumber(v-model="state.cellHeight" :min="0" :max="100" :hover="props.hover")

  //- div tileSize
  //- InputNumber(v-model="state.tileSize" :min="0" :max="100" :step="0.1" :hover="props.hover")

  //- div tileTextureWidth
  //- InputNumber(v-model="state.tileTextureWidth" :min="0" :max="512" :step="0.1" :hover="props.hover")

  //- div tileTextureHeight
  //- InputNumber(v-model="state.tileTextureHeight" :min="0" :max="512" :step="0.1" :hover="props.hover")

slot(:mesh="mesh" :cell-size="state.cellSize" :cell-height="state.cellHeight")
</template>

<script lang="ts" setup>
import { BufferAttribute } from "three/src/core/BufferAttribute"
import { BufferGeometry } from "three/src/core/BufferGeometry"
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial"
import { euclideanModulo } from "three/src/math/MathUtils"
import { Mesh } from "three/src/objects/Mesh"
import { useScene } from "@depth/canvas"
import { Material } from "three/src/materials/Material"

const scene = useScene()

const props = defineProps<{
  position: [number, number, number]
  cellSize: number
  cellHeight: number
  material?: Material
  hover?: boolean
}>()

const state = reactive({
  cellSize: props.cellSize ?? 10,
  cellHeight: props.cellHeight ?? 1,
  tileSize: 16,
  tileTextureWidth: 256,
  tileTextureHeight: 64,
})

interface GeometryData {
  positions: number[]
  normals: number[]
  indices: number[]
}

interface VoxelOptions {
  cellSize: number
  tileSize: number
  tileTextureWidth: number
  tileTextureHeight: number
}

const VoxelWorldData = {} as { faces: { uvRow: number; dir: [number, number, number]; corners: any[] }[] }
VoxelWorldData.faces = [
  {
    // left
    uvRow: 0,
    dir: [-1, 0, 0],
    corners: [
      [0, 1, 0],
      [0, 0, 0],
      [0, 1, 1],
      [0, 0, 1],
      { pos: [0, 1, 0], uv: [0, 1] },
      { pos: [0, 0, 0], uv: [0, 0] },
      { pos: [0, 1, 1], uv: [1, 1] },
      { pos: [0, 0, 1], uv: [1, 0] },
    ],
  },
  {
    // right
    uvRow: 0,
    dir: [1, 0, 0],
    corners: [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 0],
      [1, 0, 0],
      { pos: [1, 1, 1], uv: [0, 1] },
      { pos: [1, 0, 1], uv: [0, 0] },
      { pos: [1, 1, 0], uv: [1, 1] },
      { pos: [1, 0, 0], uv: [1, 0] },
    ],
  },
  {
    // bottom
    uvRow: 1,
    dir: [0, -1, 0],
    corners: [
      [1, 0, 1],
      [0, 0, 1],
      [1, 0, 0],
      [0, 0, 0],
      { pos: [1, 0, 1], uv: [1, 0] },
      { pos: [0, 0, 1], uv: [0, 0] },
      { pos: [1, 0, 0], uv: [1, 1] },
      { pos: [0, 0, 0], uv: [0, 1] },
    ],
  },
  {
    // top
    uvRow: 2,
    dir: [0, 1, 0],
    corners: [
      [0, 1, 1],
      [1, 1, 1],
      [0, 1, 0],
      [1, 1, 0],
      { pos: [0, 1, 1], uv: [1, 1] },
      { pos: [1, 1, 1], uv: [0, 1] },
      { pos: [0, 1, 0], uv: [1, 0] },
      { pos: [1, 1, 0], uv: [0, 0] },
    ],
  },
  {
    // back
    uvRow: 0,
    dir: [0, 0, -1],
    corners: [
      [1, 0, 0],
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
      { pos: [1, 0, 0], uv: [0, 0] },
      { pos: [0, 0, 0], uv: [1, 0] },
      { pos: [1, 1, 0], uv: [0, 1] },
      { pos: [0, 1, 0], uv: [1, 1] },
    ],
  },
  {
    // front
    uvRow: 0,
    dir: [0, 0, 1],
    corners: [
      [0, 0, 1],
      [1, 0, 1],
      [0, 1, 1],
      [1, 1, 1],
      { pos: [0, 0, 1], uv: [0, 0] },
      { pos: [1, 0, 1], uv: [1, 0] },
      { pos: [0, 1, 1], uv: [0, 1] },
      { pos: [1, 1, 1], uv: [1, 1] },
    ],
  },
]

class VoxelWorld {
  cellSize: number
  cellSliceSize: number
  cell: Uint8Array
  tileSize: number
  tileTextureWidth: number
  tileTextureHeight: number
  static faces: any

  constructor(options: VoxelOptions) {
    this.cellSize = options.cellSize
    this.cellSliceSize = options.cellSize * options.cellSize
    this.cell = new Uint8Array(options.cellSize * options.cellSize * options.cellSize)
    this.tileSize = options.tileSize
    this.tileTextureWidth = options.tileTextureWidth
    this.tileTextureHeight = options.tileTextureHeight
  }

  computeVoxelOffset(x: number, y: number, z: number) {
    const voxelX = Math.trunc(euclideanModulo(x, this.cellSize))
    const voxelY = Math.trunc(euclideanModulo(y, this.cellSize))
    const voxelZ = Math.trunc(euclideanModulo(z, this.cellSize))
    return voxelY * this.cellSliceSize + voxelZ * this.cellSize + voxelX
  }

  getCellForVoxel(x: number, y: number, z: number) {
    const cellX = Math.floor(x / this.cellSize)
    const cellY = Math.floor(y / this.cellSize)
    const cellZ = Math.floor(z / this.cellSize)
    if (cellX !== 0 || cellY !== 0 || cellZ !== 0) {
      return null
    }
    return this.cell
  }

  setVoxel(x: number, y: number, z: number, v: number) {
    const cell = this.getCellForVoxel(x, y, z)
    if (!cell) {
      return // TODO: add a new cell?
    }
    const voxelOffset = this.computeVoxelOffset(x, y, z)
    cell[voxelOffset] = v
  }

  getVoxel(x: number, y: number, z: number) {
    const cell = this.getCellForVoxel(x, y, z)
    if (!cell) {
      return 0
    }
    const voxelOffset = this.computeVoxelOffset(x, y, z)
    return cell[voxelOffset]
  }

  generateGeometryDataForCell(cellX: number, cellY: number, cellZ: number) {
    const positions: number[] = []
    const normals: number[] = []
    const uvs: number[] = []
    const indices: number[] = []
    const startX = cellX * this.cellSize
    const startY = cellY * this.cellSize
    const startZ = cellZ * this.cellSize

    for (let y = 0; y < this.cellSize; ++y) {
      const voxelY = startY + y
      for (let z = 0; z < this.cellSize; ++z) {
        const voxelZ = startZ + z
        for (let x = 0; x < this.cellSize; ++x) {
          const voxelX = startX + x
          const voxel = this.getVoxel(voxelX, voxelY, voxelZ)
          if (voxel) {
            const uvVoxel = voxel - 1 // voxel 0 is sky so for UVs we start at 0
            // There is a voxel here but do we need faces for it?
            for (const { dir, corners, uvRow } of VoxelWorldData.faces) {
              const neighbor = this.getVoxel(voxelX + dir[0], voxelY + dir[1], voxelZ + dir[2])

              if (!neighbor) {
                // this voxel has no neighbor in this direction so we need a face.
                const ndx = positions.length / 3
                for (const { pos, uv } of corners.filter(v => !Array.isArray(v))) {
                  positions.push(pos[0] + x, pos[1] + y, pos[2] + z)
                  normals.push(...dir)
                  uvs.push(
                    ((uvVoxel + uv[0]) * this.tileSize) / this.tileTextureWidth,
                    1 - ((uvRow + 1 - uv[1]) * this.tileSize) / this.tileTextureHeight
                  )
                }
                indices.push(ndx, ndx + 1, ndx + 2, ndx + 2, ndx + 1, ndx + 3)
              }
            }
          }
        }
      }
    }

    return {
      positions,
      normals,
      indices,
    } as GeometryData
  }
}

const world = new VoxelWorld(state)

const setVoxelHeights = (cellSize: number, cellHeight: number) => {
  for (let y = 0; y < cellHeight; ++y) {
    for (let z = 0; z < cellSize; ++z) {
      for (let x = 0; x < cellSize; ++x) {
        const height =
          (Math.sin((x / cellSize) * Math.PI * 2) + Math.sin((z / cellSize) * Math.PI * 3)) * (cellSize / 6) +
          cellHeight / 2
        if (y < height) {
          world.setVoxel(x, y, z, 1)
        }
      }
    }
  }
}

const geometry = new BufferGeometry()
const material =
  props.material ??
  new MeshLambertMaterial({
    color: "darkgreen",
    emissive: "darkred",
    emissiveIntensity: 0.001,
    wireframe: false,
    reflectivity: 1,
  })

const mesh = new Mesh(geometry, material)
scene.add(mesh)

watchEffect(() => {
  mesh.position.set(...props.position)

  world.cellSize = state.cellSize
  world.cellSliceSize = state.cellSize * state.cellSize
  world.cell = new Uint8Array(state.cellSize * state.cellSize * state.cellSize)
  world.tileSize = state.tileSize
  world.tileTextureWidth = state.tileTextureWidth
  world.tileTextureHeight = state.tileTextureHeight
  setVoxelHeights(state.cellSize, state.cellHeight)

  const worldData = world.generateGeometryDataForCell(0, 0, 0)
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(worldData.positions), 3))
  geometry.setAttribute("normal", new BufferAttribute(new Float32Array(worldData.normals), 3))
  geometry.setIndex(worldData.indices)
})

onScopeDispose(() => {
  scene.remove(mesh)
})
</script>
