import { getScenarioRoute, SkillRouteType } from '@packages/scenario-routing';
import { IndexSkill } from '../../skill-group-lib/constants';
import { SCENARIO_NAMES } from '../scenarios.constants';

export const D1ScenarioRoutes = getScenarioRoute(SCENARIO_NAMES.D1, {
  defaultStart: [IndexSkill],
  mapStarter: [IndexSkill],
  carAccident: [IndexSkill],
  rps: [IndexSkill, 'submit'],
  nightFood: [IndexSkill],
  land1: [IndexSkill, 'submit'],
  gameDev: [IndexSkill],
  noBus: [IndexSkill],
  moneyCollectionHungeum: [IndexSkill],
  pickedItem: [IndexSkill],
  fire: [IndexSkill],
  stock: [IndexSkill],
  minigameEasy: [IndexSkill],
  lottery: [IndexSkill],
  land2: [IndexSkill],
  thief: [IndexSkill],
  land3: [IndexSkill],
  horseGameble: [IndexSkill],
  earfquake: [IndexSkill],
  partTimeWork: [IndexSkill],
  land4: [IndexSkill],
  zeroWait: [IndexSkill],
  pickupWallet: [IndexSkill],
  moneyCollectionHelpingHands: [IndexSkill],
  book: [IndexSkill],
  land5: [IndexSkill],
  dragonMoney: [IndexSkill],
  fastCar: [IndexSkill],
  stockDown: [IndexSkill],
  stockUp: [IndexSkill],
  minigameHard: [IndexSkill],
  land6: [IndexSkill],
  travel: [IndexSkill],
  witch: [IndexSkill],
  moneyCollectionBeggers: [IndexSkill],
} as const);

export const OrderedD1ScenarioRoutes: SkillRouteType[] = [
  D1ScenarioRoutes.skillGroups.mapStarter,
  D1ScenarioRoutes.skillGroups.carAccident,
  D1ScenarioRoutes.skillGroups.rps,
  D1ScenarioRoutes.skillGroups.nightFood,
  D1ScenarioRoutes.skillGroups.land1,
].map((skillGroup) => skillGroup.skills[IndexSkill]);
