import { Directive, Input } from "@angular/core";
import {
  ValidatorFn,
  AbstractControl,
  Validator,
  NG_VALIDATORS
} from "@angular/forms";

@Directive({
  selector: "[appAddress]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: AddressValidatorDirective,
      multi: true
    }
  ]
})
export class AddressValidatorDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    return addressValidator()(control);
  }
}
export function addressValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }
    const valid = /^0x.+$/.test(control.value);
    return valid
      ? null
      : {
          address: {
            value: control.value
          }
        };
  };
}
