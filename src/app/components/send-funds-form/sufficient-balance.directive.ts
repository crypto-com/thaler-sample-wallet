import { Directive, Input } from "@angular/core";
import {
  ValidatorFn,
  AbstractControl,
  Validator,
  NG_VALIDATORS
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
export class SufficientBalanceValidatorDirective implements Validator {
  @Input("appSufficientBalance") balance: string;

  validate(control: AbstractControl): { [key: string]: any } | null {
    return this.balance ? sufficientBalanceValidator(this.balance)(control) : null;
  }
}
export function sufficientBalanceValidator(balance: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }
    const valid = new BigNumber(balance).isGreaterThanOrEqualTo(control.value);
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
