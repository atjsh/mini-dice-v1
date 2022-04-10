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

export function DataField(props: DataFieldType) {
  return props;
}
