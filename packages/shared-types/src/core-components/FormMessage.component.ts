import { ChatElement } from 'chat-element-json-ts';
import { FormMessageElementName } from './constants';
import { DataFieldType } from './DataField.component';
import { InputFieldType } from './InputField.component';
import { BaseMessage } from './Message.base.component';

export class FormMessagePropsType implements BaseMessage {
  type: 'formMessage';

  title?: string;

  description: string;

  dataFields: DataFieldType[];

  inputFields: InputFieldType[];

  submitButtonLabel: string;

  submitSkillRouteURL: string;
}

export type FormMessageType = ChatElement<
  typeof FormMessageElementName,
  FormMessagePropsType
>;

export function FormMessage(
  props: Omit<FormMessagePropsType, 'type'>,
): FormMessageType {
  return new ChatElement(FormMessageElementName, {
    ...props,
    type: 'formMessage',
  });
}
