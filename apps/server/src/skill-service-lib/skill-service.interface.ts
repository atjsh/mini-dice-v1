import { SkillServiceProps } from './skill-service-lib';

export interface SkillService {
  index: (props: SkillServiceProps) => any | Promise<any>;
}
