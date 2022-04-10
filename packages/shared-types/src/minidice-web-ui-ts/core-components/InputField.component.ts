export class InputFieldType {
  name: string;

  label: string;

  type: 'string' | 'number';

  placeholder?: string;

  minLength?: number;

  maxLength?: number;

  minNumber?: string;

  maxNumber?: string;

  isDisabled?: boolean;

  defaultValue?: any;

  isHidden?: boolean;
}

export function InputField(props: InputFieldType) {
  return props;
}
