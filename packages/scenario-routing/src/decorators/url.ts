import { SkillRouteType } from '../scenario-route.interface';

export function getSkillGroupControllerUrl(
  scenarioName: string,
  skillGroupName: string,
) {
  return `scenarios/${scenarioName}/${skillGroupName}`;
}

export function getSkillMethodUrl(skillName: string) {
  return `${skillName}`;
}

export function getFullSkillUrl(skillRoute: SkillRouteType) {
  return `/${getSkillGroupControllerUrl(
    skillRoute.scenarioName,
    skillRoute.skillGroupName,
  )}/${getSkillMethodUrl(skillRoute.name)}`;
}
