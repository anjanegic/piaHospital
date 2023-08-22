import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const password = control.value;

    // Definišite regex i ostale zahteve za lozinku ovde
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&][^\s]{6,14}$/;

    if (!passwordRegex.test(password)) {
      return { 'passwordRequirements': true };
    }

    // Provera za ponavljajuće karaktere
    for (let i = 0; i < password.length - 1; i++) {
      if (password[i] === password[i + 1]) {
        return { 'repeatingCharacters': true };
      }
    }

    return null; // Lozinka ispunjava sve zahteve
  };
}
