import { getRandomInteger } from '../common/random/random-number';
import { SCENARIO_NAMES } from './scenarios.constants';

export function getUserCanTossDice(
  scenarioName: typeof SCENARIO_NAMES[keyof typeof SCENARIO_NAMES],
): Date {
  switch (scenarioName) {
    case SCENARIO_NAMES.D1: {
      const currentDate = new Date();
      currentDate.setSeconds(
        currentDate.getSeconds() + getRandomInteger(13, 29),
      );
      return currentDate;
    }

    default: {
      const currentDate = new Date();
      currentDate.setSeconds(
        currentDate.getSeconds() + getRandomInteger(13, 29),
      );
      return currentDate;
    }
  }
}
