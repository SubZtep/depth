// ^o.O https://codepen.io/calebgannon/pen/vYXMazq
import { ShaderMaterial } from "three/src/materials/ShaderMaterial"
import { DoubleSide } from "three/src/constants"
import { Mesh } from "three/src/objects/Mesh"
import { BufferGeometry } from "three/src/core/BufferGeometry"
import { Vector3 } from "three/src/math/Vector3"
import { useScene } from "@depth/canvas"
import { Float32BufferAttribute, Uint8BufferAttribute } from "three/src/core/BufferAttribute"
// Initialize Scene parameters
// const frequency_samples = 128 // Y resolution
// const DATA = new Uint8Array(frequency_samples) // for later
// const time_samples = 400 // X resolution
// const n_vertices = (frequency_samples + 1) * (time_samples + 1)
const xsegments = 10 //time_samples
const ysegments = 10 //frequency_samples
const xsize = 777
const ysize = 777
const xhalfSize = xsize / 2
const yhalfSize = ysize / 2
const xsegmentSize = xsize / xsegments //Size of one square
const ysegmentSize = ysize / ysegments

export default defineComponent({
  setup() {
    const scene = useScene()

    const geometry = new BufferGeometry()
    const indices: number[] = []
    const heights: number[] = []
    const vertices: number[] = []

    // generate vertices for a simple grid geometry
    for (let i = 0; i <= xsegments; i++) {
      const x = i * xsegmentSize - xhalfSize //midpoint of mesh is 0,0
      for (let j = 0; j <= ysegments; j++) {
        const y = j * ysegmentSize - yhalfSize
        vertices.push(x, y, 0)
        heights.push(Math.random() * 255) // for now our mesh is flat, so heights are zero
      }
    }
    // Add the position data to the geometry buffer
    geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3))

    for (let i = 0; i < xsegments; i++) {
      for (let index = 0; index < ysegments; index++) {
        const a = i * (ysegments + 1) + (index + 1)
        const b = i * (ysegments + 1) + index
        const c = (i + 1) * (ysegments + 1) + index
        const d = (i + 1) * (ysegments + 1) + (index + 1)
        // generate two faces (triangles) per iteration
        indices.push(a, b, d, b, c, d) // face two
      }
    }
    geometry.setIndex(indices)

    const string = [[0.5, 0, 0]] // [R, G, B]
    const lut: Vector3[] = []
    for (let n = 0; n < 1; n++) {
      //Fill out LUT with the color information
      lut.push(
        new Vector3((string[n][0] * 255 - 49) / 206, (string[n][1] * 255 - 19) / 236, (string[n][2] * 255 - 50) / 190)
      )
    }

    geometry.setAttribute("displacement", new Uint8BufferAttribute(heights, 1))

    // const geometry = new PlaneGeometry(2, 2, 1, 1)
    const material = new ShaderMaterial({
      // glslVersion: GLSL3,
      side: DoubleSide,
      // transparent: true,
      // lights: true,
      // TODO: receive shadow

      uniforms: {
        time: { value: 1 },
        // @ts-ignore
        vLut: { type: "v3v", value: lut },
        // vColor: { value: new Color("cyan") },
        //   uSize: { value: props.size },
        //   uColor: { value: new Color(props.color) },
        //   uDistance: { value: props.distance },
        //   uTime: { value: new Uniform(0) },
        //   mousePos: { value: new Vector3() },
      },

      vertexShader: `
        attribute float displacement;
        vec3 vLut[256] =vec3[](vec3(0.18995,0.07176,0.23217),vec3(0.19483,0.08339,0.26149),vec3(0.19956,0.09498,0.29024),vec3(0.20415,0.10652,0.31844),vec3(0.20860,0.11802,0.34607),vec3(0.21291,0.12947,0.37314),vec3(0.21708,0.14087,0.39964),vec3(0.22111,0.15223,0.42558),vec3(0.22500,0.16354,0.45096),vec3(0.22875,0.17481,0.47578),vec3(0.23236,0.18603,0.50004),vec3(0.23582,0.19720,0.52373),vec3(0.23915,0.20833,0.54686),vec3(0.24234,0.21941,0.56942),vec3(0.24539,0.23044,0.59142),vec3(0.24830,0.24143,0.61286),vec3(0.25107,0.25237,0.63374),vec3(0.25369,0.26327,0.65406),vec3(0.25618,0.27412,0.67381),vec3(0.25853,0.28492,0.69300),vec3(0.26074,0.29568,0.71162),vec3(0.26280,0.30639,0.72968),vec3(0.26473,0.31706,0.74718),vec3(0.26652,0.32768,0.76412),vec3(0.26816,0.33825,0.78050),vec3(0.26967,0.34878,0.79631),vec3(0.27103,0.35926,0.81156),vec3(0.27226,0.36970,0.82624),vec3(0.27334,0.38008,0.84037),vec3(0.27429,0.39043,0.85393),vec3(0.27509,0.40072,0.86692),vec3(0.27576,0.41097,0.87936),vec3(0.27628,0.42118,0.89123),vec3(0.27667,0.43134,0.90254),vec3(0.27691,0.44145,0.91328),vec3(0.27701,0.45152,0.92347),vec3(0.27698,0.46153,0.93309),vec3(0.27680,0.47151,0.94214),vec3(0.27648,0.48144,0.95064),vec3(0.27603,0.49132,0.95857),vec3(0.27543,0.50115,0.96594),vec3(0.27469,0.51094,0.97275),vec3(0.27381,0.52069,0.97899),vec3(0.27273,0.53040,0.98461),vec3(0.27106,0.54015,0.98930),vec3(0.26878,0.54995,0.99303),vec3(0.26592,0.55979,0.99583),vec3(0.26252,0.56967,0.99773),vec3(0.25862,0.57958,0.99876),vec3(0.25425,0.58950,0.99896),vec3(0.24946,0.59943,0.99835),vec3(0.24427,0.60937,0.99697),vec3(0.23874,0.61931,0.99485),vec3(0.23288,0.62923,0.99202),vec3(0.22676,0.63913,0.98851),vec3(0.22039,0.64901,0.98436),vec3(0.21382,0.65886,0.97959),vec3(0.20708,0.66866,0.97423),vec3(0.20021,0.67842,0.96833),vec3(0.19326,0.68812,0.96190),vec3(0.18625,0.69775,0.95498),vec3(0.17923,0.70732,0.94761),vec3(0.17223,0.71680,0.93981),vec3(0.16529,0.72620,0.93161),vec3(0.15844,0.73551,0.92305),vec3(0.15173,0.74472,0.91416),vec3(0.14519,0.75381,0.90496),vec3(0.13886,0.76279,0.89550),vec3(0.13278,0.77165,0.88580),vec3(0.12698,0.78037,0.87590),vec3(0.12151,0.78896,0.86581),vec3(0.11639,0.79740,0.85559),vec3(0.11167,0.80569,0.84525),vec3(0.10738,0.81381,0.83484),vec3(0.10357,0.82177,0.82437),vec3(0.10026,0.82955,0.81389),vec3(0.09750,0.83714,0.80342),vec3(0.09532,0.84455,0.79299),vec3(0.09377,0.85175,0.78264),vec3(0.09287,0.85875,0.77240),vec3(0.09267,0.86554,0.76230),vec3(0.09320,0.87211,0.75237),vec3(0.09451,0.87844,0.74265),vec3(0.09662,0.88454,0.73316),vec3(0.09958,0.89040,0.72393),vec3(0.10342,0.89600,0.71500),vec3(0.10815,0.90142,0.70599),vec3(0.11374,0.90673,0.69651),vec3(0.12014,0.91193,0.68660),vec3(0.12733,0.91701,0.67627),vec3(0.13526,0.92197,0.66556),vec3(0.14391,0.92680,0.65448),vec3(0.15323,0.93151,0.64308),vec3(0.16319,0.93609,0.63137),vec3(0.17377,0.94053,0.61938),vec3(0.18491,0.94484,0.60713),vec3(0.19659,0.94901,0.59466),vec3(0.20877,0.95304,0.58199),vec3(0.22142,0.95692,0.56914),vec3(0.23449,0.96065,0.55614),vec3(0.24797,0.96423,0.54303),vec3(0.26180,0.96765,0.52981),vec3(0.27597,0.97092,0.51653),vec3(0.29042,0.97403,0.50321),vec3(0.30513,0.97697,0.48987),vec3(0.32006,0.97974,0.47654),vec3(0.33517,0.98234,0.46325),vec3(0.35043,0.98477,0.45002),vec3(0.36581,0.98702,0.43688),vec3(0.38127,0.98909,0.42386),vec3(0.39678,0.99098,0.41098),vec3(0.41229,0.99268,0.39826),vec3(0.42778,0.99419,0.38575),vec3(0.44321,0.99551,0.37345),vec3(0.45854,0.99663,0.36140),vec3(0.47375,0.99755,0.34963),vec3(0.48879,0.99828,0.33816),vec3(0.50362,0.99879,0.32701),vec3(0.51822,0.99910,0.31622),vec3(0.53255,0.99919,0.30581),vec3(0.54658,0.99907,0.29581),vec3(0.56026,0.99873,0.28623),vec3(0.57357,0.99817,0.27712),vec3(0.58646,0.99739,0.26849),vec3(0.59891,0.99638,0.26038),vec3(0.61088,0.99514,0.25280),vec3(0.62233,0.99366,0.24579),vec3(0.63323,0.99195,0.23937),vec3(0.64362,0.98999,0.23356),vec3(0.65394,0.98775,0.22835),vec3(0.66428,0.98524,0.22370),vec3(0.67462,0.98246,0.21960),vec3(0.68494,0.97941,0.21602),vec3(0.69525,0.97610,0.21294),vec3(0.70553,0.97255,0.21032),vec3(0.71577,0.96875,0.20815),vec3(0.72596,0.96470,0.20640),vec3(0.73610,0.96043,0.20504),vec3(0.74617,0.95593,0.20406),vec3(0.75617,0.95121,0.20343),vec3(0.76608,0.94627,0.20311),vec3(0.77591,0.94113,0.20310),vec3(0.78563,0.93579,0.20336),vec3(0.79524,0.93025,0.20386),vec3(0.80473,0.92452,0.20459),vec3(0.81410,0.91861,0.20552),vec3(0.82333,0.91253,0.20663),vec3(0.83241,0.90627,0.20788),vec3(0.84133,0.89986,0.20926),vec3(0.85010,0.89328,0.21074),vec3(0.85868,0.88655,0.21230),vec3(0.86709,0.87968,0.21391),vec3(0.87530,0.87267,0.21555),vec3(0.88331,0.86553,0.21719),vec3(0.89112,0.85826,0.21880),vec3(0.89870,0.85087,0.22038),vec3(0.90605,0.84337,0.22188),vec3(0.91317,0.83576,0.22328),vec3(0.92004,0.82806,0.22456),vec3(0.92666,0.82025,0.22570),vec3(0.93301,0.81236,0.22667),vec3(0.93909,0.80439,0.22744),vec3(0.94489,0.79634,0.22800),vec3(0.95039,0.78823,0.22831),vec3(0.95560,0.78005,0.22836),vec3(0.96049,0.77181,0.22811),vec3(0.96507,0.76352,0.22754),vec3(0.96931,0.75519,0.22663),vec3(0.97323,0.74682,0.22536),vec3(0.97679,0.73842,0.22369),vec3(0.98000,0.73000,0.22161),vec3(0.98289,0.72140,0.21918),vec3(0.98549,0.71250,0.21650),vec3(0.98781,0.70330,0.21358),vec3(0.98986,0.69382,0.21043),vec3(0.99163,0.68408,0.20706),vec3(0.99314,0.67408,0.20348),vec3(0.99438,0.66386,0.19971),vec3(0.99535,0.65341,0.19577),vec3(0.99607,0.64277,0.19165),vec3(0.99654,0.63193,0.18738),vec3(0.99675,0.62093,0.18297),vec3(0.99672,0.60977,0.17842),vec3(0.99644,0.59846,0.17376),vec3(0.99593,0.58703,0.16899),vec3(0.99517,0.57549,0.16412),vec3(0.99419,0.56386,0.15918),vec3(0.99297,0.55214,0.15417),vec3(0.99153,0.54036,0.14910),vec3(0.98987,0.52854,0.14398),vec3(0.98799,0.51667,0.13883),vec3(0.98590,0.50479,0.13367),vec3(0.98360,0.49291,0.12849),vec3(0.98108,0.48104,0.12332),vec3(0.97837,0.46920,0.11817),vec3(0.97545,0.45740,0.11305),vec3(0.97234,0.44565,0.10797),vec3(0.96904,0.43399,0.10294),vec3(0.96555,0.42241,0.09798),vec3(0.96187,0.41093,0.09310),vec3(0.95801,0.39958,0.08831),vec3(0.95398,0.38836,0.08362),vec3(0.94977,0.37729,0.07905),vec3(0.94538,0.36638,0.07461),vec3(0.94084,0.35566,0.07031),vec3(0.93612,0.34513,0.06616),vec3(0.93125,0.33482,0.06218),vec3(0.92623,0.32473,0.05837),vec3(0.92105,0.31489,0.05475),vec3(0.91572,0.30530,0.05134),vec3(0.91024,0.29599,0.04814),vec3(0.90463,0.28696,0.04516),vec3(0.89888,0.27824,0.04243),vec3(0.89298,0.26981,0.03993),vec3(0.88691,0.26152,0.03753),vec3(0.88066,0.25334,0.03521),vec3(0.87422,0.24526,0.03297),vec3(0.86760,0.23730,0.03082),vec3(0.86079,0.22945,0.02875),vec3(0.85380,0.22170,0.02677),vec3(0.84662,0.21407,0.02487),vec3(0.83926,0.20654,0.02305),vec3(0.83172,0.19912,0.02131),vec3(0.82399,0.19182,0.01966),vec3(0.81608,0.18462,0.01809),vec3(0.80799,0.17753,0.01660),vec3(0.79971,0.17055,0.01520),vec3(0.79125,0.16368,0.01387),vec3(0.78260,0.15693,0.01264),vec3(0.77377,0.15028,0.01148),vec3(0.76476,0.14374,0.01041),vec3(0.75556,0.13731,0.00942),vec3(0.74617,0.13098,0.00851),vec3(0.73661,0.12477,0.00769),vec3(0.72686,0.11867,0.00695),vec3(0.71692,0.11268,0.00629),vec3(0.70680,0.10680,0.00571),vec3(0.69650,0.10102,0.00522),vec3(0.68602,0.09536,0.00481),vec3(0.67535,0.08980,0.00449),vec3(0.66449,0.08436,0.00424),vec3(0.65345,0.07902,0.00408),vec3(0.64223,0.07380,0.00401),vec3(0.63082,0.06868,0.00401),vec3(0.61923,0.06367,0.00410),vec3(0.60746,0.05878,0.00427),vec3(0.59550,0.05399,0.00453),vec3(0.58336,0.04931,0.00486),vec3(0.57103,0.04474,0.00529),vec3(0.55852,0.04028,0.00579),vec3(0.54583,0.03593,0.00638),vec3(0.53295,0.03169,0.00705),vec3(0.51989,0.02756,0.00780),vec3(0.50664,0.02354,0.00863),vec3(0.49321,0.01963,0.00955),vec3(0.47960,0.01583,0.01055));
        varying vec3 vColor;
        varying float time;

        void main() {
          int index = int(displacement);
          vColor = vLut[index];
          vColor.x = (vColor.x * 255.0 - 49.0) / 206.0;
          vColor.y = (vColor.y * 255.0 - 19.0) / 236.0;
          vColor.z = (vColor.z * 255.0 - 50.0) / 190.0;

          vec3 newPosition = position + normal * displacement / 25.5;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float time;
        void main(){
          gl_FragColor = vec4(vColor, time);
          // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
        `,
    })

    const mesh = new Mesh(geometry, material)
    mesh.rotateX(Math.PI / 2)
    mesh.position.setY(0.1001)
    mesh.matrixAutoUpdate = true

    scene.add(mesh)
    // instance.appContext.app.config.globalProperties.$scene.add(mesh)

    // mesh.geometry.computeTangents()
    mesh.geometry.computeVertexNormals()

    onScopeDispose(() => {
      scene.remove(mesh)
      // instance.appContext.app.config.globalProperties.$scene.remove(mesh)
      geometry.dispose()
      material.dispose()
    })

    return () => null
  },
})
