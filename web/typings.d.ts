interface State extends RendererState {
  preferOffscreen?: boolean
}

/** Local store */
declare module "beedle" {
  export default class {
    constructor(params: { actions: unknown; mutations: unknown; initialState: State })
    state: State
  }
}
