import { useSingleton } from "@depth/misc"
import { stateMake } from  "../index"

/** Input button state */
export interface InputStatem {
  space: boolean
}

const initialState: InputStatem = {
  space: false
}

const inputState = stateMake<InputStatem>({ initialState })

const { singleton } = useSingleton()
singleton.set("inputState", inputState)

export default inputState
