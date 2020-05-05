import { Directive, Input, OnChanges, SimpleChanges } from "@angular/core";
import {
  ValidatorFn,
  AbstractControl,
  Validator,
  NG_VALIDATORS,
} from "@angular/forms";
import * as lodash from "lodash";
import BigNumber from "bignumber.js";

@Directive({
  selector: "[appSufficientBalance]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: SufficientBalanceValidatorDirective,
      multi: true,
    },
  ],
})
export class SufficientBalanceValidatorDirective
  implements Validator, OnChanges {
  private onChange: () => void;

  @Input("appSufficientBalance") balance: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.balance && this.onChange) {
      setTimeout(() => {
        this.onChange();
      });
    }
  }

  validate(control: AbstractControl): { [key: string]: any } | null {
    return lodash.isNil(this.balance)
      ? null
      : sufficientBalanceValidator(this.balance)(control);
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onChange = fn;
  }
}
export function sufficientBalanceValidator(balance: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value || new BigNumber(control.value).isNaN()) {
      return null;
    }
    const valid = new BigNumber(balance).isGreaterThanOrEqualTo(control.value);
    return valid
      ? null
      : {
          sufficientBalance: {
            balance,
            value: control.value,
          },
        };
  };
}
