import type CameraControls from "camera-controls"
import { Vector3 } from "three/src/math/Vector3"

const ONE_SECOND = 1000
const FPS = 60
const _vec3b = new Vector3()

export class CameraShake {
  _cameraControls: CameraControls
  _duration: number
  _strength: number
  _noiseX: number[]
  _noiseY: number[]
  _noiseZ: number[]
  _lastOffsetX: number
  _lastOffsetY: number
  _lastOffsetZ: number

  /**@param frequency cycle per second */
  constructor(cameraControls: CameraControls, duration = ONE_SECOND, frequency = 10, strength = 1) {
    this._cameraControls = cameraControls
    this._duration = duration
    this._strength = strength
    this._noiseX = makePNoise1D((duration / ONE_SECOND) * frequency, (duration / ONE_SECOND) * FPS)
    this._noiseY = makePNoise1D((duration / ONE_SECOND) * frequency, (duration / ONE_SECOND) * FPS)
    this._noiseZ = makePNoise1D((duration / ONE_SECOND) * frequency, (duration / ONE_SECOND) * FPS)

    this._lastOffsetX = 0
    this._lastOffsetY = 0
    this._lastOffsetZ = 0
  }

  shake() {
    const startTime = performance.now()

    const anim = () => {
      const elapsedTime = performance.now() - startTime
      const frameNumber = ((elapsedTime / ONE_SECOND) * FPS) | 0
      const progress = elapsedTime / this._duration
      const ease = sineOut(1 - progress)

      if (progress >= 1) {
        // this._cameraControls.setPosition(
        // 	_vec3a.x - this._lastOffsetX,
        // 	_vec3a.y - this._lastOffsetY,
        // 	_vec3a.z - this._lastOffsetZ,
        // 	false
        // );

        this._cameraControls.setTarget(
          _vec3b.x - this._lastOffsetX,
          _vec3b.y - this._lastOffsetY,
          _vec3b.z - this._lastOffsetZ,
          false
        )

        this._lastOffsetX = 0
        this._lastOffsetY = 0
        this._lastOffsetZ = 0
        return
      }

      requestAnimationFrame(anim)

      // this._cameraControls.getPosition( _vec3a );
      this._cameraControls.getTarget(_vec3b)

      const offsetX = this._noiseX[frameNumber] * this._strength * ease
      const offsetY = this._noiseY[frameNumber] * this._strength * ease
      const offsetZ = this._noiseZ[frameNumber] * this._strength * ease

      // this._cameraControls.setPosition(
      // 	_vec3a.x + offsetX - this._lastOffsetX,
      // 	_vec3a.y + offsetY - this._lastOffsetY,
      // 	_vec3a.z + offsetZ - this._lastOffsetZ,
      // 	false
      // );

      this._cameraControls.setTarget(
        _vec3b.x + offsetX - this._lastOffsetX,
        _vec3b.y + offsetY - this._lastOffsetY,
        _vec3b.z + offsetZ - this._lastOffsetZ,
        false
      )

      this._lastOffsetX = offsetX
      this._lastOffsetY = offsetY
      this._lastOffsetZ = offsetZ
    }

    anim()
  }
}

function makePNoise1D(length: number, step: number) {
  const noise: number[] = []
  const gradients: number[] = []

  for (let i = 0; i < length; i++) {
    gradients[i] = Math.random() * 2 - 1
  }

  for (let t = 0; t < step; t++) {
    const x = ((length - 1) / (step - 1)) * t

    const i0 = x | 0
    const i1 = (i0 + 1) | 0

    const g0 = gradients[i0]
    const g1 = gradients[i1] || gradients[i0]

    const u0 = x - i0
    const u1 = u0 - 1

    const n0 = g0 * u0
    const n1 = g1 * u1

    noise.push(n0 * (1 - fade(u0)) + n1 * fade(u0))
  }

  return noise
}

function fade(t: number) {
  return t * t * t * (t * (6 * t - 15) + 10)
}

const HALF_PI = Math.PI * 0.5

function sineOut(t: number) {
  return Math.sin(t * HALF_PI)
}
