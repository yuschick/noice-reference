export class PercentileCalculator {
  private bucketSize: number;
  private maxValue: number;
  private minValue: number;
  private size: number;
  private values: Uint32Array;
  private count: number;

  constructor(bucketSize: number, minValue: number, maxValue: number) {
    this.bucketSize = bucketSize;
    this.maxValue = maxValue;
    this.minValue = minValue;

    this.size = Math.floor((this.maxValue - this.minValue) / this.bucketSize);
    this.values = new Uint32Array(this.size);
    this.count = 0;
  }

  public add(d: number) {
    if (d < this.minValue) {
      d = this.minValue;
    } else if (d > this.maxValue) {
      d = this.maxValue;
    }

    const indx = Math.floor((d - this.minValue) / this.bucketSize);
    this.count++;
    this.values[indx]++;
  }

  public reset() {
    this.count = 0;
    this.values.fill(0);
  }

  public average() {
    let sum = 0;

    for (let i = 0; i < this.values.length; i++) {
      sum += this.values[i] * (this.minValue + i * this.bucketSize);
    }

    return Math.round(sum / this.count);
  }

  public percentile(percentile: number) {
    if (percentile < 0 || percentile > 1) {
      throw new Error('percentile must be between 0 and 1');
    }

    const target = Math.floor(this.count * percentile);
    let sum = 0;

    for (let i = 0; i < this.values.length; i++) {
      sum += this.values[i];

      if (sum >= target) {
        return this.minValue + i * this.bucketSize;
      }
    }

    return this.maxValue;
  }
}
