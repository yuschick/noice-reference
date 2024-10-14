export class Timekeeper {
  private _time: number;
  private _moment: number;

  private _speed: number;

  public constructor() {
    this._time = 0.0;
    this._moment = 0.0;

    this._speed = 1.0;
  }

  public get time(): number {
    return this._time;
  }

  public get moment(): number {
    return this._moment;
  }

  public get speed(): number {
    return this._speed;
  }

  public set speed(speed: number) {
    this._speed = Math.max(Number.EPSILON, speed);
  }

  public update(moment: number): void {
    this._moment = moment * this._speed;
    this._time += this._moment;
  }

  public reset(): void {
    this._time = 0.0;
    this._moment = 0.0;
  }
}
