import { Directive } from "@angular/core";
import {
  ValidatorFn,
  AbstractControl,
  Validator,
  NG_VALIDATORS,
} from "@angular/forms";

@Directive({
  selector: "[appAddress]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: AddressValidatorDirective,
      multi: true,
    },
  ],
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
    const valid =
      control.value.startsWith("cro") ||
      control.value.startsWith("tcro") ||
      control.value.startsWith("dcro");
    return valid
      ? null
      : {
          address: {
            value: control.value,
          },
        };
  };
}
