/**
 * 이벤트 케이스 프로세싱
 * 일반 이벤트와 캐시 변동 이벤트를 확률적으로 처리할 수 있도록 관련 함수와 타입들을 제공한다.
 */

import * as _ from 'lodash';
import { weightedRandom } from './weighted-random';

/**
 * 이벤트 이름과 확률 가중치로 구성된 이벤트 케이스 객체 인터페이스
 */
export type EventCase = {
  causeName: string;
  weight: number;
};

/**
 * 수의 범위를 나타내는 객체 타입
 */
export type NumberRange = {
  from: number;
  to: number;
};

/**
 * EventCase에 value가 추가된 타입.
 * value는 수 또는 NumberRange가 할당될 수 있다.
 */
export type DynamicValueEventCase = EventCase & {
  value: number | NumberRange;
};

/**
 * 인자로 들어온 EventCase 배열 중 요소 1개를 선택하여 리턴함.
 * 이 때, 요소를 선정할 때 EventCase.weight에 따라 가중치가 부여되어, 확률적으로 선정된다.
 * @param eventCases
 * @returns
 */
export function selectEventCaseRandomly<T extends EventCase>(
  eventCases: T[],
): T {
  const shuffledcases = _.shuffle(eventCases);

  const weightedRandomParam = shuffledcases.reduce((acc, cur, index) => {
    acc[index] = cur.weight;
    return acc;
  }, {});

  const result = weightedRandom(weightedRandomParam);
  return shuffledcases[result];
}

/**
 * 인자로 들어온 CashChangeEventCase 배열 중 1개를 선택하여
 * 그 이벤트 케이스에 설정된 값을 리턴함.
 * @param cashChangeEventCases
 * @returns
 */
export function calcRandomCashChangeEvent(
  cashChangeEventCases: DynamicValueEventCase[],
) {
  const eventCase = selectEventCaseRandomly(cashChangeEventCases);
  if (typeof eventCase.value === 'number') {
    return {
      eventCase: eventCase,
      value: eventCase.value,
    };
  }

  return {
    eventCase,
    value:
      Math.floor(
        Math.random() * (eventCase.value.to - eventCase.value.from + 1),
      ) + eventCase.value.from,
  };
}
