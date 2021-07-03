import { createGlobalState, useStorage } from '@vueuse/core'

export const useGlobalState = createGlobalState(
  () => useStorage<GlobalState>('vue-use-locale-storage', {
  })
)
