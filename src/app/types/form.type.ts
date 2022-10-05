import FormStep from './form-step.type';

type Form = {
  id: string;
  title: string;
  steps: FormStep[];
  validators: string[];
  submitUri: string;
};

export default Form;
