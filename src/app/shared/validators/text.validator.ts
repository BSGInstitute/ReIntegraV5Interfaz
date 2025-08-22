import { AbstractControl, ValidationErrors } from "@angular/forms";

// export function ValidateSpace(control: AbstractControl) {
//   if (!control.value.startsWith('https') || !control.value.includes('.io')) {
//     return { invalidUrl: true };
//   }
//   return null;
// }

// export function NoStartSpace(control: AbstractControl) {
//   if (!control.value.startsWith(' ')) {
//     NoStartSpace2(null);
//     return { startSpace: true };
//   }
//   return null;
// }

// export function NoStartSpace2(control: AbstractControl) {
//   if (!control.value.startsWith(' ')) {
//     return { startSpace: true };
//   }
//   return null;
// }

export class TextValidator {
  // static multiplo5(control: AbstractControl): ValidationErrors| null {
  //     let nro = parseInt(control.value);
  //     if (nro % 5 == 0)
  //         return null;
  //     else
  //         return { multiplo5: true }
  // }

  static noStartSpace(control: AbstractControl): ValidationErrors| null {
    if (control.value != null  && control.value.startsWith(' ')) {
      return { noStartSpace: true };
    }
    return null;
  }

  static noEndSpace(control: AbstractControl): ValidationErrors| null {
    if (control.value != null  && control.value.endsWith(' ')) {
      return { noEndSpace: true };
    }
    return null;
  }
}
