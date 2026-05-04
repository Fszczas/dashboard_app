export class DataGenerator {
  #value;
  #opts;

  constructor(options = {}) {
    this.#opts = {
      min: options.min ?? 0,
      max: options.max ?? 100,
      mean: options.mean ?? 50,
      reversionRate: options.reversionRate ?? 0.06,
      volatility: options.volatility ?? 3,
      decimals: options.decimals ?? 1,
    };
    this.#value = options.initialValue ?? this.#opts.mean;
  }

  next() {
    const { min, max, mean, reversionRate, volatility, decimals } = this.#opts;
    const reversion = reversionRate * (mean - this.#value);
    const noise = (Math.random() - 0.5) * volatility * 2;
    this.#value = Math.max(min, Math.min(max, this.#value + reversion + noise));
    const factor = 10 ** decimals;
    return Math.round(this.#value * factor) / factor;
  }

  spike(magnitude = 0.7) {
    const { max, mean } = this.#opts;
    this.#value = Math.min(max, mean + (max - mean) * magnitude);
  }

  drop(magnitude = 0.7) {
    const { min, mean } = this.#opts;
    this.#value = Math.max(min, mean - (mean - min) * magnitude);
  }
}
