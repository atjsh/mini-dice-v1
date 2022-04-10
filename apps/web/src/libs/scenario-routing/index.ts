import { SkillRoutePath, SkillRouteType } from '@packages/scenario-routing';

export enum SkillCallingClients {
  Discord = 'discord',
  Web = 'web',
}
/**
 * SkillRouteURL 문자열을 SKillRouteType의 객체로 변환함.
 */
export function getSkillRouteFromSkillRouteURL(
  skillRouteURL: SkillRoutePath,
): SkillRouteType {
  const [scenarioName, skillGroupName, name] = skillRouteURL.split('/');

  return {
    scenarioName,
    skillGroupName,
    name,
  };
}

/**
 * 인자로 받은 SkillGroupType 인자들의 SkillGroup 값이 서로 동일한지 확인한다.
 * @param left
 * @param right
 * @returns
 */
export function isSameSkillGroup(left: SkillRouteType, right: SkillRouteType) {
  return (
    left.scenarioName == right.scenarioName &&
    left.skillGroupName == right.skillGroupName
  );
}
