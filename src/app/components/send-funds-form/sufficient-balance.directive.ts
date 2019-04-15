import { Directive, Input, OnChanges, SimpleChanges } from "@angular/core";
import {
  ValidatorFn,
  AbstractControl,
  Validator,
  NG_VALIDATORS,
  CheckboxControlValueAccessor
} from "@angular/forms";
import BigNumber from "bignumber.js";

@Directive({
  selector: "[appSufficientBalance]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: SufficientBalanceValidatorDirective,
      multi: true
    }
  ]
})
export class SufficientBalanceValidatorDirective implements Validator, OnChanges {
  private onChange: () => void;

  @Input("appSufficientBalance") balance: BigNumber;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.balance && this.onChange) {
      this.onChange();
    }
  }

  validate(control: AbstractControl): { [key: string]: any } | null {
    return this.balance ? sufficientBalanceValidator(this.balance)(control) : null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onChange = fn;
  }
}
export function sufficientBalanceValidator(balance: BigNumber): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }
    const valid = balance.isGreaterThanOrEqualTo(control.value);
    return valid
      ? null
      : {
          sufficientBalance: {
            balance,
            value: control.value
          }
        };
  };
}
