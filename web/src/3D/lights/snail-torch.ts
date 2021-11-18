import { SpotLight, SpotLightHelper } from "three"

export default function () {
  const spotLight = new SpotLight(0xffffff, 0.8, 3, 0.3, 0.25, 2)
  spotLight.position.set(0, 1.3, 1.8)
  spotLight.target.position.set(0, 0.2, 0)
  spotLight.castShadow = true
  const spotLightHelper = new SpotLightHelper(spotLight)

  return {
    spotLight,
    spotLightHelper,
  }
}
