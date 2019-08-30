import { Directive } from '@angular/core';
import {
  ValidatorFn,
  AbstractControl,
  Validator,
  NG_VALIDATORS
} from "@angular/forms";

@Directive({
  selector: '[appViewKey]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ViewKeyValidatorDirective,
      multi: true
    }
  ]
})
export class ViewKeyValidatorDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    return viewKeyValidator()(control);
  }
}

export function viewKeyValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }
    const valid = (control.value.length === 66)
    return valid
      ? null
      : {
        address: {
          value: control.value
        }
      };
  };
}
