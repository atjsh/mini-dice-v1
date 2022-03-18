import * as _ from 'lodash';

/**
 * 리스트에서 객체를 1개 랜덤하게 가져온다.
 */
export function selectRandomItemFromList<T>(list: T[]): T {
  return _.sample(list)!;
}
