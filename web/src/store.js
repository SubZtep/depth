import { stateMake } from "@depth/statem";
const initialState = {
    running: false,
    antialias: false,
    preferOffscreen: true,
    txt: "test"
};
const actions = {
    startLoop(context) {
        context.commit("setRunning", true);
    },
    stopLoop(context) {
        context.commit("setRunning", false);
    },
};
const mutations = {
    setRunning(state, payload) {
        if (state.running !== payload) {
            state.running = payload;
        }
        return state;
    },
};
export default stateMake({ initialState, actions, mutations });
//# sourceMappingURL=store.js.map