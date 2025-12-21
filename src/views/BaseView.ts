export abstract class BaseView {
  private _cleanups: VoidFunction[] = [];

  public abstract onMount(): HTMLElement;

  public onUnmount(): void {
    this._cleanups.forEach((cleanup) => cleanup());
    this._cleanups = [];
  }

  protected onCleanup(cleanup: VoidFunction): void {
    this._cleanups.push(cleanup);
  }
}
