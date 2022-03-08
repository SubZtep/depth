type Action<T extends object> = (context: Store<T>, payload?: any) => void
type Mutation<T> = (state: T, payload?: any) => T
type Callback<T> = (data: T) => void

/** Store class */
export class Store<State extends object> {
  actions: Record<string, Action<State>> = {}
  mutations: Record<string, Mutation<State>> = {}
  state!: State
  status: "resting" | "action" | "mutation" = "resting"
  callbacks: Callback<State>[] = []

  constructor(params: { initialState: State, actions?: Record<string, Action<State>>, mutations?: Record<string, Mutation<State>> }) {
    const self = this
    params.hasOwnProperty("actions") && (self.actions = params.actions!)
    params.hasOwnProperty("mutations") && (self.mutations = params.mutations!)

    // TODO: types
    for (const key in params.initialState) {
      Object.defineProperty(self, key, {
        set(v: any) {
          self.state[key] = v
        }
      })
    }

    // Set our state to be a Proxy. We are setting the default state by
    // checking the params and defaulting to an empty object if no default
    // state is passed in
    self.state = new Proxy<State>((params.initialState), {
      set(state, key, value) {
        // Set the value as we would normally
        state[key] = value

        // Fire off our callback processor because if there's listeners,
        // they're going to want to know that something has changed
        self.processCallbacks(self.state)

        // Reset the status ready for the next operation
        self.status = "resting"

        return true
      },
    })
  }

  /**
   * A dispatcher for actions that looks in the actions
   * collection and runs the action if it can find it
   */
  dispatch(actionKey: keyof Store<State>["actions"], payload?: any) {
    const self = this

    // Run a quick check to see if the action actually exists
    // before we try to run it
    if (typeof self.actions[actionKey] !== "function") {
      console.error(`Action "${actionKey}" doesn't exist.`)
      return false
    }

    // Let anything that's watching the status know that we're dispatching an action
    self.status = "action"

    // Actually call the action and pass it the Store context and whatever payload was passed
    return self.actions[actionKey](self, payload)
  }

  /**
   * Look for a mutation and modify the state object
   * if that mutation exists by calling it
   */
  commit(mutationKey: string, payload?: any) {
    const self = this

    // Run a quick check to see if this mutation actually exists
    // before trying to run it
    if (typeof self.mutations[mutationKey] !== "function") {
      console.error(`Mutation "${mutationKey}" doesn't exist`)
      return
    }

    // Let anything that's watching the status know that we're mutating state
    self.status = "mutation"

    // Get a new version of the state by running the mutation and storing the result of it
    // @ts-ignore
    let newState = self.mutations[mutationKey](self.state, payload)

    // Update the old state with the new state returned from our mutation
    self.state = newState
  }

  /**
   * Fire off each callback that's run whenever the state changes
   * We pass in some data as the one and only parameter.
   * Returns a boolean depending if callbacks were found or not
   */
  processCallbacks(data: State) {
    const self = this

    // if (!self.callbacks.length) {
    //   return false
    // }

    // We've got callbacks, so loop each one and fire it off
    self.callbacks.forEach(callback => callback(data))
  }

  /**
   * Allow an outside entity to subscribe to state changes with a valid callback.
   * Returns boolean based on wether or not the callback was added to the collection
   */
  subscribe(callback: Callback<State>) {
    const self = this

    // if (typeof callback !== "function") {
    //   console.error("You can only subscribe to Store changes with a valid function")
    //   return false
    // }

    // A valid function, so it belongs in our collection
    self.callbacks.push(callback)
  }
}
