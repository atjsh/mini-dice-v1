export type SkillRouteURLType = string;

/**
 * 시나리오 이름의 타입
 */
export type ScenarioNameType = string;

/**
 * 스킬 이름의 타입
 */
export type SkillNameType = string;

/**
 * 스킬 라우팅 정보 1개의 타입.
 */
export type SkillRouteType = {
  name: SkillNameType;
  scenarioName: ScenarioNameType;
  skillGroupName: string;
};

/**
 * -Message 클래스들이 상속받아야 하는 클래스
 */
export interface BaseMessage {
  type: string;
}

export class HostedImageType {
  imageUrl: string;
  altName: string;
}

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

/**
 * PlainMessage에 속할 수 있는 값들을 담고 있는 클래스
 */
export class DataFieldType {
  // 표시할 값에 대한 설명
  label: string;

  // 표시할 값
  value: string;

  // '이 값을 다른 값 옆에 표시할 것인가?' 여부
  inline: boolean;

  // '이 값이 돈과 관련된 값인가?' 여부
  isCash: boolean;
}

export class LinkType<T = Record<string, string>> {
  skillRouteURL: string;

  param: T;

  displayText: string;
}

export class LinkGroupType implements BaseMessage {
  type: 'linkGroup';

  description: string;

  links: LinkType[];
}

/**
 * 서비스에서 보낸 메세지
 */
export class PlainMessageType implements BaseMessage {
  // 타입
  type: 'plainMessage';

  // 타이틀
  title?: string;

  // 설명
  description: string;

  // 표시할 DafaField 객체들
  dataFields?: DataFieldType[];

  // 표시할 이미지
  thumbnail?: HostedImageType;
}

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

export class UserActivityMessageType implements BaseMessage {
  type: 'diceTossUserActivityMessage' | 'interactionUserActivityMessage';

  title: string;

  description?: string;
}

/**
 * 클라이언트로 보낼 메세지 객체
 */
export class MessageResponseType {
  userRequestDrawings: UserActivityMessageType;

  // 메세지들
  actionResultDrawings: (
    | PlainMessageType
    | FormMessageType
    | PlainMessageType[]
    | FormMessageType[]
    | LinkGroupType
  )[];

  // 메세지들을 보낸 날짜
  date: Date;
}
