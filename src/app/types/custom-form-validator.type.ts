type CustomFormValidator = {
  fieldKey: string;
  fieldAttribute: string;
  fieldAttributeChild?: string;
  condition: string;
  conditionValue: string | number | boolean;
};

export default CustomFormValidator;
