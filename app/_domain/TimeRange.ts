export default class TimeRange {

  times: number[] = [];

  static EPS = 0; // 浮動小数点の誤差を考慮するための定数
  static MIN_TIME = Number.MIN_SAFE_INTEGER;
  static MAX_TIME = Number.MAX_SAFE_INTEGER;


  public constructor(times: number[] = []) {
    this.times = [...times];
  }

  public static calculate(op: OperatorType, times1: number[], times2: number[]): number[] {
    switch (op) {
      case 'or':
        return TimeRange.OR(times1, times2);
      case 'and':
        return TimeRange.AND(times1, times2);
      case 'sub':
        return TimeRange.SUB(times1, times2);
      default:
        return [];
    }
  }

  // ========================================================================================
  // facades
  static OR(times1: number[], times2: number[]): number[] {
    let op1TR = new TimeRange(times1);
    let op2TR = new TimeRange(times2);
    op1TR.addTR(op2TR);
    return op1TR.times;
  }

  static AND(times1: number[], times2: number[]): number[] {
    let op1TR = new TimeRange(times1);
    let op2TR = new TimeRange(times2);

    const r0 = op1TR.rnot();
    r0.addTRNot(op2TR);
    r0.inverse();
    return r0.times;
  }

  static SUB(times1: number[], times2: number[]): number[] {
    let op1TR = new TimeRange(times1);
    let op2TR = new TimeRange(times2);

    const r0 = op1TR.rnot();
    r0.addTR(op2TR);
    r0.inverse();
    return r0.times;
  }

  // ========================================================================================

  addTR(range2: TimeRange): void {
    let cursor = 0;
    for (let i = 0; i < range2.times.length; i += 2) {
      cursor = this.merge(range2.times[i], range2.times[i + 1], cursor);
    }
  }

  addTRNot(range2: TimeRange): void {
    let six = 0;
    if (range2.times.length <= 0) {
      // 空の場合は全時間帯を追加する
      six = this.merge(TimeRange.MIN_TIME, TimeRange.MAX_TIME, six);
    }
    else {
      if (!TimeRange.isMINTIME(range2.times[0])) {
        //最初の時刻が無限小でなければ、無限小からの時間帯を追加する。無現小なら無視する
        six = this.merge(TimeRange.MIN_TIME, range2.times[0], six);
      }
      for (let i = 1; i < range2.times.length - 1; i += 2) {
        //時間帯の間の時間を、時間帯として追加する
        six = this.merge(range2.times[i], range2.times[i + 1], six);
      }
      if (!TimeRange.isMAXTIME(range2.times[range2.times.length - 1])) {
        //最後の時刻が無限大でなければ、無限大までの時間帯を追加する。無現大なら無視する
        six = this.merge(range2.times[range2.times.length - 1], TimeRange.MAX_TIME, six);
      }
    }
  }

  static isMINTIME(t: number): boolean {
    return t <= TimeRange.MIN_TIME + TimeRange.EPS;
  }

  static isMAXTIME(t: number): boolean {
    return t >= TimeRange.MAX_TIME - TimeRange.EPS;
  }

  inverse() {
    const min1st = (this.times.length > 0 && TimeRange.isMINTIME(this.times[0]));
    const maxlast = (this.times.length > 0 && TimeRange.isMAXTIME(this.times[this.times.length - 1]));
    if (min1st) {
      this.times.splice(0, 1);
    }
    else if (this.times.length > 0) {
      this.times.unshift(TimeRange.MIN_TIME);
    }
    else {
      this.times.push(TimeRange.MIN_TIME);
    }
    if (maxlast) {
      this.times.splice(this.times.length - 1, 1);
    }
    else {
      this.times.push(TimeRange.MAX_TIME);
    }
  }

  rnot() {
    const r = new TimeRange(this.times.slice());
    r.inverse();
    return r;
  }

  merge(startTime: number, endTime: number, cursor: number): number {
    if (startTime + TimeRange.EPS >= endTime) return cursor;

    let i = cursor;
    for (; i < this.times.length; i += 2) {
      if (startTime <= this.times[i + 1] + TimeRange.EPS) {
        break;
      }
    }
    cursor = i;

    for (; i < this.times.length; i += 2) {
      if (this.times[i] > endTime + TimeRange.EPS) {
        break;
      }
    }

    if (cursor < this.times.length && cursor < i) {
      if (startTime > this.times[cursor]) {
        startTime = this.times[cursor];
      }
      if (endTime < this.times[i - 1]) {
        endTime = this.times[i - 1];
      }
    }

    if (cursor >= i) {
      if (this.times.length > cursor) {
        this.times.splice(cursor, 0, startTime);
        this.times.splice(cursor + 1, 0, endTime);
      }
      else {
        this.times.push(startTime);
        this.times.push(endTime);
      }
    }
    else {
      this.times[cursor] = startTime;
      this.times[cursor + 1] = endTime;
      for (let j = i - 1; j >= cursor + 2; j--) {
        this.times.splice(j, 1);
      }
    }

    return cursor;
  }

  public static rawString(times: number[]): string {
    const str: string[] = [];
    for (let i = 0; i < times.length; i += 2) {
      str.push((TimeRange.isMINTIME(times[i]) ? 'null' : times[i] + '')
        + '-'
        + (TimeRange.isMAXTIME(times[i + 1]) ? 'null' : times[i + 1] + ''));
    }
    return "[" + str.join(', ') + "]";
  }
}
