import { ReadonlySignal, signal } from 'svev-frontend';

export class StopwatchModel {
  private _startTime: number | null = null;
  private _elapsedTime: number = 0;
  private _intervalId: number | null = null;
  private _isRunning = signal(false);
  private readonly _currentTime = signal(0);

  get currentTime(): ReadonlySignal<number> {
    return this._currentTime;
  }

  get isRunning(): ReadonlySignal<boolean> {
    return this._isRunning;
  }

  start(): void {
    if (this._isRunning()) {
      return; // Already running
    }

    this._isRunning(true);
    this._startTime = Date.now();
    this._updateTime();

    // Update every 10ms for smooth display
    this._intervalId = window.setInterval(() => {
      this._updateTime();
    }, 10);
  }

  stop(): void {
    if (!this._isRunning) {
      return; // Already stopped
    }

    if (this._startTime !== null) {
      this._elapsedTime += Date.now() - this._startTime;
    }

    this._isRunning(false);
    this._startTime = null;

    if (this._intervalId !== null) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }

    this._updateTime();
  }

  reset(): void {
    this.stop();
    this._elapsedTime = 0;
    this._updateTime();
  }

  private _updateTime(): void {
    if (this._isRunning() && this._startTime !== null) {
      this._currentTime(this._elapsedTime + (Date.now() - this._startTime));
    } else {
      this._currentTime(this._elapsedTime);
    }
  }

  /**
   * Formats the duration as MM:SS:mmm (minutes:seconds:milliseconds)
   */
  public static format(timeInMs: number): string {
    const minutes = Math.floor(timeInMs / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    const milliseconds = timeInMs % 1000;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;
  }
}
