import { getScenarioRoute } from '@packages/scenario-routing';
import { SCENARIO_NAMES } from '../scenarios.constants';

export const D1_ROUTES = getScenarioRoute(SCENARIO_NAMES.D1, {});

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
