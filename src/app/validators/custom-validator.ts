import {
  AbstractControl,
  ValidationErrors,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import CustomFormValidator from '../types/custom-form-validator.type';

const customValidator =
  (form: FormGroup, validation: CustomFormValidator): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const functionBody = buildValidationFunctionBody(form, validation);
    // eslint-disable-next-line no-eval
    const validationResult = eval(functionBody);

    return validationResult ? null : { error: 'error' };
  };

const buildValidationFunctionBody = (
  form: FormGroup,
  validation: CustomFormValidator
): string => {
  let body = `form.get('${validation.fieldKey}')['${validation.fieldAttribute}']`;

  if (validation.fieldAttributeChild) {
    body = body.concat(`['${validation.fieldAttributeChild}']`);
  }

  body = body.concat(` ${validation.condition} ${validation.conditionValue}`);

  return body;
};

export default customValidator;
