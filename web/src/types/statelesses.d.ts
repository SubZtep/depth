interface LogShellState {
  position: [number, number, number]
  rotation: [number, number, number, number]

  a: [number, number]
  radius: [number, number]
  startAngle: number
  endAngle: number
  clockwise: boolean
  // rotation: number

  /** spiral turn counter that could represent its length */
  turns: number
}

interface Entity {
  id: string
  title: string
  component?: any
  order?: number
  children?: Entity[]
}

interface SceneState {
  hierarchy: Entity[]
}