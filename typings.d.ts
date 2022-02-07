/*
 ** Global type definitions
 */
interface HTMLCanvasElement {
  /** https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/transferControlToOffscreen */
  transferControlToOffscreen?: () => OffscreenCanvas & MessagePort
}

type Fn = () => void

interface Dimensions {
  width: number
  height: number
}

// declare module "@depth/misc" {
//   // declare function single<T = any>(key: string, object: T): T
//   // export default function useSingleton(): {
//   //   singleton: Map<string, any>
//   //   single: <T = any>(key: string, object: T) => T
//   // }
//   export function useSingleton(): {
//     singleton: Map<string, any>
//     single: <T = any>(key: string, object?: T) => T
//   }
// }
