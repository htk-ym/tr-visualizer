This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

```
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## コードリーディングポイント
app/_features/_calculator/CalculatorView.tsxから読み進めると理解しやすいと思います。

### ViewModel
```
type ViewModelFunc<State, Action, Argument extends any[] = []> = (...args: Argument) => {
    state: State,
    action: Action
}
```
コンポーネント毎に画面に表示するStateと副作用を伴うActionを定義して上記の型で抽象化する方針になっています。  
  
命名規則はXXXComponent, XXXView, XXXModal... に対してXXXViewModelです。

### Selector
状態管理ライブラリはRecoilです。  
状態をジェネリクスで宣言できるAtomとAtomの状態に反応して処理をかけるSelectorが使用されています。
  
### Flow of Control
View -> ViewModel(action) -> Atom -> (Selector) -> ViewModel(State) -> View
View -> ViewModel(action) -> component state(React Hooks) -> ViewModel(State) -> View

RecoilはReact Hooksと同様に状態変化で再レンダリングされる。これを利用して主にSelectorでリアクティブに値が画面に流れるようにしている。

### Dependency
View -> ViewModel -> Atom, Selector, Domain





```


 




