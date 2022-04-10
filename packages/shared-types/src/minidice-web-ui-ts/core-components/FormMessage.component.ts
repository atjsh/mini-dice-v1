import { DataFieldType } from './DataField.component';
import { InputFieldType } from './InputField.component';
import { BaseMessage } from './Message.base.component';

export class FormMessageType implements BaseMessage {
  type: 'formMessage';

  title?: string;

  description: string;

  dataFields: DataFieldType[];

  inputFields: InputFieldType[];

  submitButtonLabel: string;

  isSubmitButtonDisabled?: boolean;

  submitSkillRouteURL: string;
}

export function FormMessage(
  props: Omit<FormMessageType, 'type'>,
): FormMessageType {
  return {
    ...props,
    type: 'formMessage',
  };
}
