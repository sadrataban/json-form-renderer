import FormItem from './form-item.type';

type FormStep = {
  stepNumber: number;
  items: FormItem[];
  validators: string[];
  canMoveOnInvalid: boolean;
};

export default FormStep;
