import { BufferAttribute } from "three/src/core/BufferAttribute"
import { BufferGeometry } from "three/src/core/BufferGeometry"
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial"
// import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial"
import { euclideanModulo } from "three/src/math/MathUtils"
import { Mesh } from "three/src/objects/Mesh"
import type { PropType } from "vue"
import { getCurrentInstance, onScopeDispose } from "vue"

class VoxelWorld {
  cellSize: number
  cellSliceSize: number
  cell: Uint8Array
  static faces: any

  constructor(cellSize: number) {
    this.cellSize = cellSize
    this.cellSliceSize = cellSize * cellSize
    this.cell = new Uint8Array(cellSize * cellSize * cellSize)
  }

  computeVoxelOffset(x: number, y: number, z: number) {
    const { cellSize, cellSliceSize } = this
    const voxelX = Math.trunc(euclideanModulo(x, cellSize))
    const voxelY = Math.trunc(euclideanModulo(y, cellSize))
    const voxelZ = Math.trunc(euclideanModulo(z, cellSize))
    return voxelY * cellSliceSize + voxelZ * cellSize + voxelX
  }

  getCellForVoxel(x: number, y: number, z) {
    const { cellSize } = this
    const cellX = Math.floor(x / cellSize)
    const cellY = Math.floor(y / cellSize)
    const cellZ = Math.floor(z / cellSize)
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
    const { cellSize } = this
    const positions: number[] = []
    const normals: number[] = []
    const indices: number[] = []
    const startX = cellX * cellSize
    const startY = cellY * cellSize
    const startZ = cellZ * cellSize

    for (let y = 0; y < cellSize; ++y) {
      const voxelY = startY + y
      for (let z = 0; z < cellSize; ++z) {
        const voxelZ = startZ + z
        for (let x = 0; x < cellSize; ++x) {
          const voxelX = startX + x
          const voxel = this.getVoxel(voxelX, voxelY, voxelZ)
          if (voxel) {
            // There is a voxel here but do we need faces for it?
            for (const { dir, corners } of VoxelWorld.faces) {
              const neighbor = this.getVoxel(voxelX + dir[0], voxelY + dir[1], voxelZ + dir[2])
              if (!neighbor) {
                // this voxel has no neighbor in this direction so we need a face.
                const ndx = positions.length / 3
                for (const pos of corners) {
                  positions.push(pos[0] + x, pos[1] + y, pos[2] + z)
                  normals.push(...dir)
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
    }
  }
}

VoxelWorld.faces = [
  {
    // left
    dir: [-1, 0, 0],
    corners: [
      [0, 1, 0],
      [0, 0, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
  },
  {
    // right
    dir: [1, 0, 0],
    corners: [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 0],
      [1, 0, 0],
    ],
  },
  {
    // bottom
    dir: [0, -1, 0],
    corners: [
      [1, 0, 1],
      [0, 0, 1],
      [1, 0, 0],
      [0, 0, 0],
    ],
  },
  {
    // top
    dir: [0, 1, 0],
    corners: [
      [0, 1, 1],
      [1, 1, 1],
      [0, 1, 0],
      [1, 1, 0],
    ],
  },
  {
    // back
    dir: [0, 0, -1],
    corners: [
      [1, 0, 0],
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  },
  {
    // front
    dir: [0, 0, 1],
    corners: [
      [0, 0, 1],
      [1, 0, 1],
      [0, 1, 1],
      [1, 1, 1],
    ],
  },
]

export default defineComponent({
  props: {
    cellSize: { type: Number, default: 32 },
    cellHeight: { type: Number, default: 32 },
    position: { type: Array as unknown as PropType<[number, number, number]>, default: () => [0, 0, 0] },
  },
  setup({ cellSize, cellHeight, position }) {
    const instance = getCurrentInstance()
    if (!instance) throw new Error("Not in Vue scope")
    const { $scene } = instance.appContext.app.config.globalProperties

    const world = new VoxelWorld(cellSize)

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

    const { positions, normals, indices } = world.generateGeometryDataForCell(0, 0, 0)
    const geometry = new BufferGeometry()
    const material = new MeshLambertMaterial({
      color: "darkgreen",
      emissive: "darkred",
      emissiveIntensity: 0.001,
      wireframe: false,
      reflectivity: 1,
    })
    // const material = new MeshPhongMaterial({ color: "green" })
    // material.

    const positionNumComponents = 3
    const normalNumComponents = 3

    geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), positionNumComponents))
    geometry.setAttribute("normal", new BufferAttribute(new Float32Array(normals), normalNumComponents))
    geometry.setIndex(indices)
    // geometry.scale(4, 4, 4)
    const mesh = new Mesh(geometry, material)
    mesh.position.set(...position)
    $scene.add(mesh)

    onScopeDispose(() => {
      $scene.remove(mesh)
    })

    return () => null
  },
})
