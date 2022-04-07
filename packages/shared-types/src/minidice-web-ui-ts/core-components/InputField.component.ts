import { ChatElement } from 'chat-element-json-ts';
import { InputFieldElementName } from './constants';

export class InputFieldPropsType {
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

export type InputFieldType = ChatElement<
  typeof InputFieldElementName,
  InputFieldPropsType
>;

export function InputField(props: InputFieldPropsType): InputFieldType {
  return new ChatElement(InputFieldElementName, props);
}
