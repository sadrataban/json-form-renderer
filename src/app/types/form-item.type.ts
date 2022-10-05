import CustomFormValidator from './custom-form-validator.type';
import FormItemOption from './form-item-option';

type FormItem = {
  key: string;
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  options: FormItemOption;
  nativeOptions?: { cameraField: boolean; audioField: boolean };
  validation: { required: boolean; minLength?: number; maxLength?: number };
  validators: CustomFormValidator[];
};

export default FormItem;
