import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { CpfValidatorUtil } from "src/app/util/cpf.validator.util";

export function cpfValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let cpf = control.value;

        let isValid = CpfValidatorUtil.isCpfValid(cpf);

        return !isValid ? { cpfValidator: true } : null;
    };
}
