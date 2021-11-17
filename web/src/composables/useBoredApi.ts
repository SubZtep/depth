import { set, useFetch, until, get } from "@vueuse/core"
import { ref } from "vue"

interface BoredApi {
  activity: string
  type: "education" | "recreational" | "social" | "diy" | "charity" | "cooking" | "relaxation" | "music" | "busywork"
  participants: number
  price: number
  link: string
  key: string
  accessibility: number
}

export function useBoredApi() {
  const bored = ref<BoredApi>()

  const query = async () => {
    set(bored, undefined)
    const { data, isFinished } = useFetch("https://www.boredapi.com/api/activity/", { mode: "cors" }).get().json()
    await until(isFinished).toBe(true)
    set(bored, get(data))
  }

  return {
    bored,
    query,
  }
}
