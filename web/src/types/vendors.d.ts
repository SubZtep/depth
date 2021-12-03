type PropType<T> = import("@vue/runtime-core").PropType<T>
type Ref<T = any> = import("@vue/reactivity").Ref
type Fn = import("@vueuse/core").Fn

// type Mesh = import("three").Mesh
// type SphereGeometry = import("three").SphereGeometry
// type ConeGeometry = import("three").ConeGeometry
// type Material = import("three").Material
type KeypointMesh = Mesh<SphereGeometry | ConeGeometry, Material>
// type Object3D = import("three").Object3D
// type Quaternion = import("three").Quaternion
// type Group = import("three").Group
// type Vector3 = import("three").Vector3
// type Quaternion = import("three").Quaternion
// type Color = import("three").Color

type Vector = import("@dimforge/rapier3d-compat").Vector
type Rotation = import("@dimforge/rapier3d-compat").Rotation