type ViewModelFunc<State, Action, Argument extends any[] = []> = (...args: Argument) => {
  state: State,
  action: Action
}

type OperatorType = "and" | "or" | "sub";