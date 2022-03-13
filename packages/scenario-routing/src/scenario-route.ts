import { SkillGroupPath, SkillRoutePath, SkillRouteType } from '.';
import {
  SkillGroupRouteType,
  SkillGroupRouteMapType,
  SkillRouteMapType,
  RawSkillGroupMapType,
  ConvertRawToScenarioRouteType,
  RawSkillType,
} from './scenario-route.interface';

function getSkillRouteMap(
  skillName: string,
  scenarioName: string,
  skillGroupName: string,
): SkillRouteMapType {
  return {
    [skillName]: {
      name: skillName,
      scenarioName,
      skillGroupName,
    },
  };
}

function getSkillGroupRoute<RawSkill extends RawSkillType>(
  skillGroupName: string,
  skills: readonly RawSkill[],
  scenarioName: string,
): SkillGroupRouteType {
  return {
    scenarioName: scenarioName,
    skillGroupName: skillGroupName,
    skills: skills
      .map((skill) => getSkillRouteMap(skill, scenarioName, skillGroupName))
      .reduce((result, current) => Object.assign(result, current)),
  };
}

function getSkillGroupRouteMap<RawSkillGroupMap extends RawSkillGroupMapType>(
  rawSkillGroupMap: RawSkillGroupMap,
  scenarioName: string,
): SkillGroupRouteMapType {
  return Object.entries(rawSkillGroupMap)
    .map(([skillGroupName, skills]) => ({
      [skillGroupName]: getSkillGroupRoute(
        skillGroupName,
        skills,
        scenarioName,
      ),
    }))
    .reduce((result, current) => Object.assign(result, current));
}

/**
 *
 * @param scenarioName 시나리오의 이름
 * @param rawSkillGroupMap RawSkillGroupMapType 타입의 객체.
 * @returns 시나리오 라우트 타입의 객체
 */
export function getScenarioRoute<
  ScenarioName extends string,
  RawSkillGroupMap extends RawSkillGroupMapType,
>(
  scenarioName: ScenarioName,
  rawSkillGroupMap: RawSkillGroupMap,
): ConvertRawToScenarioRouteType<ScenarioName, RawSkillGroupMap> {
  return {
    scenarioName: scenarioName,
    skillGroups: getSkillGroupRouteMap(rawSkillGroupMap, scenarioName),
  } as unknown as ConvertRawToScenarioRouteType<ScenarioName, RawSkillGroupMap>;
}

export function getSkillGroupPath(
  skillGroup: SkillGroupRouteType,
): SkillGroupPath {
  return `${skillGroup.scenarioName}/${skillGroup.skillGroupName}`;
}

export function getSkillRoutePath(skill: SkillRouteType): SkillRoutePath {
  return `${skill.scenarioName}/${skill.skillGroupName}/${skill.name}`;
}
