import { BaseInput } from './BaseInput';

export class BoolInput extends BaseInput<boolean> {
  public constructor() {
    super(false);
  }
}
