type Fn = () => void

type IStore<T extends object> = {
  [key in keyof T]: T[key]
} & Store<T>
