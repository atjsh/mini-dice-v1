import { SkillRouteType, SkillRouteURLType } from "../skill-draw-ui-ts/types";

export enum SkillCallingClients {
  Discord = "discord",
  Web = "web"
}
/**
 * SkillRouteURL 문자열을 SKillRouteType의 객체로 변환함.
 */
export function getSkillRouteFromSkillRouteURL(
  skillRouteURL: SkillRouteURLType
): SkillRouteType {
  const [scenarioName, skillGroupName, name] = skillRouteURL.split("/");

  return {
    scenarioName,
    skillGroupName,
    name
  };
}

/**
 * SKillRouteType의 객체를 SkillRouteURL 문자열로 변환함.
 */
export function getSkillRouteURLFromSkillRoute(
  skillRoute: SkillRouteType,
  skillCallingClient: SkillCallingClients
): SkillRouteURLType {
  return `${skillRoute.scenarioName}/${skillRoute.skillGroupName}/${skillRoute.name}/${skillCallingClient}`;
}

export function getWebSkillRouteURLFromSkillRoute(skillRoute: SkillRouteType) {
  return getSkillRouteURLFromSkillRoute(skillRoute, SkillCallingClients.Web);
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
