import { ReadonlySignal, signal } from 'svev-frontend';

export class StopwatchModel {
  #startTime: number | null = null;
  #elapsedTime: number = 0;
  #intervalId: number | null = null;
  readonly #isRunning = signal(false);
  readonly #currentTime = signal(0);

  public get currentTime(): ReadonlySignal<number> {
    return this.#currentTime;
  }

  public get isRunning(): ReadonlySignal<boolean> {
    return this.#isRunning;
  }

  public start = (): void => {
    if (this.#isRunning()) {
      return; // Already running
    }

    this.#isRunning(true);
    this.#startTime = Date.now();
    this.#updateTime();

    // Update every 10ms for smooth display
    this.#intervalId = window.setInterval(() => {
      this.#updateTime();
    }, 10);
  };

  public stop = (): void => {
    if (!this.#isRunning()) {
      return; // Already stopped
    }

    if (this.#startTime !== null) {
      this.#elapsedTime += Date.now() - this.#startTime;
    }

    this.#isRunning(false);
    this.#startTime = null;

    if (this.#intervalId !== null) {
      clearInterval(this.#intervalId);
      this.#intervalId = null;
    }

    this.#updateTime();
  };

  public reset = (): void => {
    this.stop();
    this.#elapsedTime = 0;
    this.#updateTime();
  };

  #updateTime(): void {
    if (this.#isRunning() && this.#startTime !== null) {
      this.#currentTime(this.#elapsedTime + (Date.now() - this.#startTime));
    } else {
      this.#currentTime(this.#elapsedTime);
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
