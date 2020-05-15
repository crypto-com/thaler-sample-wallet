import { Directive } from "@angular/core";
import {
  ValidatorFn,
  AbstractControl,
  Validator,
  NG_VALIDATORS,
} from "@angular/forms";

@Directive({
  selector: "[appStakingAddress]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: StakingAddressValidatorDirective,
      multi: true,
    },
  ],
})
export class StakingAddressValidatorDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    return addressValidator()(control);
  }
}
export function addressValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }
    const valid = control.value.startsWith("0x");
    return valid
      ? null
      : {
          address: {
            value: control.value,
          },
        };
  };
}
