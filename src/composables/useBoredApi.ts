interface BoredApi {
  activity: string
  type: "education" | "recreational" | "social" | "diy" | "charity" | "cooking" | "relaxation" | "music" | "busywork"
  participants: number
  price: number
  link: string
  key: string
  accessibility: number
}

export default function useBoredApi() {
  const bored = ref<BoredApi | null>(null)

  const query = async () => {
    set(bored, null)
    const { data, isFinished } = useFetch("https://www.boredapi.com/api/activity/", { mode: "cors" }).get().json()
    await until(isFinished).toBe(true)
    set(bored, get(data))
  }

  return {
    bored,
    query,
  }
}
