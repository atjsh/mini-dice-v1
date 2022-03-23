export interface SkillGroupController {
  getSkillGroupAlias(): Promise<string> | string;
}
