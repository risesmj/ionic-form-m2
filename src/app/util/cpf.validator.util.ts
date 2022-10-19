export class CpfValidatorUtil {
  static isCpfValid(cpf: string): boolean {
    const cpfLength = 11;
    const weights = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    return this.isValid(cpf, cpfLength, weights);
  }

  private static isValid(digits: string, correctDigitsLength: number, weights: number[]): boolean {
    const cleanDigits = this.getOnlyNumbers(digits);
    if (cleanDigits.length !== correctDigitsLength || this.isAllTheSameDigits(cleanDigits)) {
      return false;
    }
    const digitsWithoutChecker = cleanDigits.substring(0, correctDigitsLength - 2);
    const digitsChecker = cleanDigits.substring(correctDigitsLength - 2, correctDigitsLength);
    const calculetedChecker = this.calcChecker(digitsWithoutChecker, weights);
    return digitsChecker === calculetedChecker;
  }

  private static getOnlyNumbers(digits: string): string {
    return digits.replace(/\D/g, '');
  }

  private static isAllTheSameDigits(digits: string): boolean {
    return !digits.split('').some((digit) => digit !== digits[0]);
  }

  private static calcChecker(digits: string, weights: number[]): string {
    const digitsLength = digits.length;
    const digitsLengthWithoutChecker = weights.length - 1;

    const sum = digits.split('').reduce((acc, digit, idx) => {
      return acc + +digit * weights[digitsLength - 1 - idx];
    }, 0);
    const sumDivisionRemainder = sum % 11;
    const checker = sumDivisionRemainder < 2 ? 0 : 11 - sumDivisionRemainder;

    if (digitsLength === digitsLengthWithoutChecker) {
      return this.calcChecker(`${digits}${checker}`, weights);
    }

    return `${digits[digitsLength - 1]}${checker}`;
  }
}