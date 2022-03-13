import { applyDecorators, Controller } from '@nestjs/common';
import { ScenarioRouteType } from '../scenario-route.interface';

/**
 * 일반 컨트롤러를 시나리오 컨트롤러로 만듬
 */
export const ScenarioController = (scenarioRoute: ScenarioRouteType) =>
  applyDecorators(
    Controller(`chatbot-scenarios/${scenarioRoute.scenarioName}/metadata`),
  );
