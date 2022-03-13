import { applyDecorators, Controller, SetMetadata } from '@nestjs/common';
import { SkillGroupMetadataKey } from '../constants';
import { SkillGroupRouteType } from '../scenario-route.interface';
import { getSkillGroupControllerUrl } from './url';

const SetAsSkillGroupController = (skillGroupRoute: SkillGroupRouteType) =>
  SetMetadata(SkillGroupMetadataKey, skillGroupRoute);

/**
 * 컨트롤러를 스킬 그룹으로 만들고, 스킬 그룹을 시나리오에 등록함
 */
export const SkillGroup = (skillGroupRoute: SkillGroupRouteType) =>
  applyDecorators(
    /**
     * 스킬 및 스킬 그룹 전용의 HTTP 엔드포인트를 등록함
     */
    Controller(
      getSkillGroupControllerUrl(
        skillGroupRoute.scenarioName,
        skillGroupRoute.skillGroupName,
      ),
    ),

    /**
     * 컨트롤러를 스킬 그룹으로 만들고, 스킬 그룹을 시나리오에 등록함.
     */
    SetAsSkillGroupController(skillGroupRoute),
  );
