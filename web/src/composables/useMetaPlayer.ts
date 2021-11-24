// import { usePlayerStore } from "~/stores/player"
import useResources from "~/composables/useResources"
import { Snail } from "~/3D/entities/Snail"
import { useKeyboard } from "~/composables/useKeyboard"
import getSnailShell from "~/3D/goodybag/snail-shell-photo"

export async function useMetaPlayer() {
  // const playerStore = usePlayerStore()
  const { loader } = useResources()

  const snailShell = await loader("SnailShell", getSnailShell)
  const player = Snail.initialize(snailShell)
  player.setInput(useKeyboard())

  return {
    player,
  }
}
