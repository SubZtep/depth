export default defineComponent({
  props: {
    ArrowUp: { type: Boolean, require: true },
    ArrowRight: { type: Boolean, require: true },
    ArrowDown: { type: Boolean, require: true },
    ArrowLeft: { type: Boolean, require: true },
    ControlLeft: { type: Boolean, require: true },
  },
  setup(properties, { slots }) {
    // TODO: state should be just a prop
    const playerState = reactive({
      moveForward: false,
      moveBackward: false,
      moveLeft: false,
      moveRight: false,
      rotateLeft: false,
      rotateRight: false,
    })

    // TODO: from config
    const { ArrowUp, ArrowRight, ArrowDown, ArrowLeft, ControlLeft } = useMagicKeys()

    const { moveForward, moveBackward, moveLeft, moveRight, rotateLeft, rotateRight } = toRefs(playerState)

    syncRef(ArrowUp, moveForward)
    syncRef(ArrowDown, moveBackward)
    syncRef(and(ArrowLeft, ControlLeft), moveLeft)
    syncRef(and(ArrowLeft, not(ControlLeft)), rotateLeft)
    syncRef(and(ArrowRight, ControlLeft), moveRight)
    syncRef(and(ArrowRight, not(ControlLeft)), rotateRight)

    return () => slots.default && slots.default(playerState)
    // slots.default && slots.default({ moveForward, moveBackward, moveLeft, moveRight, rotateLeft, rotateRight })
  },
})
