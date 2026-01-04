export interface IInvokable {
  setOnInvoke(fn: VoidFunction): this;
  invoke(): void;
}
