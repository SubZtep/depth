import "../../typings.d"

type IStore<T extends object> = {
  [key in keyof T]: T[key]
} & Store<T>
