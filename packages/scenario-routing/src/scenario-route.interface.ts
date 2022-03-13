/**
 * 스킬 라우팅
 *
 * 챗봇은 스킬을 통해 챗봇 응답을 생성한다. 챗봇이 스킬에 접근하기 위해서는
 * 스킬에 관해 스킬의 이름, 스킬 그룹명, 시나리오명 등의 정보를 알고 있어야 하는데,
 * 스킬 라우팅 타입을 통해 스킬을 호출하기 위한 정보를 규격화하고 저장할 수 있다.
 */

/**
 * 시나리오 이름의 타입
 */
export type ScenarioNameType = string;

/**
 * 스킬 이름의 타입
 */
export type SkillNameType = string;

/**
 * 스킬 라우팅 정보 1개의 타입.
 */
export type SkillRouteType = {
  name: SkillNameType;
  scenarioName: ScenarioNameType;
  skillGroupName: string;
};

/**
 * SkillRoute 데이터 객체를 문자열로 변환한 문자열 데이터
 */
export type SkillRoutePath = string;
export type SkillGroupPath = string;

/**
 * 스킬 이름에 대해 SkillRouteType를 매칭시킨 타입.
 */
export type SkillRouteMapType = {
  [skillName: string]: SkillRouteType;
};

/**
 * 스킬 그룹 라우팅 정보 1개의 타입.
 */
export type SkillGroupRouteType = {
  scenarioName: ScenarioNameType;
  skillGroupName: string;
  skills: SkillRouteMapType;
};

/**
 * 스킬 그룹 이름에 대해 SkillGroupRouteType를 매칭시킨 타입.
 */
export type SkillGroupRouteMapType = {
  [skillGroupName: string]: SkillGroupRouteType;
};

/**
 * 시나리오 라우팅 정보 1개의 타입.
 */
export type ScenarioRouteType = {
  scenarioName: ScenarioNameType;
  skillGroups: SkillGroupRouteMapType;
};

/**
 * 시나리오 내 스킬의 정보를 저장하는 데이터. SkillNameType이거나 [string, string] 형식 Tuple일 수 있음.
 */
export type RawSkillType = SkillNameType;

/**
 * 시나리오 내 스킬 그룹 타입을 저장하는 객체 타입.
 * 아래와 같이 정의된 객체를 RawSkillGroupMapType로 간주함.
 *
 * @example
 * const rawSKillGroupMap = {skillGroupOne: ['skillOne', 'skillTwo'], skillGroupFive: ['skillThree' } as const
 *
 */
export type RawSkillGroupMapType = Record<string, readonly RawSkillType[]>;

/**
 * ScenarioName과 RawSkillGroupMapType을 제네릭으로 받아 챗봇 시나리오 라우트의 타입을 만듬.
 *
 * @example
 * const rawSKillGroupMap = {skillGroupOne: ['skillOne', 'skillTwo'], skillGroupFive: ['skillThree'] } as const
 * type MyScenario = ScenarioRouteType<typeof 'NikeChatbotScenario', typeof rawSKillGroupMap>
 */
export type ConvertRawToScenarioRouteType<
  ScenarioName,
  RawSkillGroupMap extends RawSkillGroupMapType,
> = {
  scenarioName: ScenarioName;
  skillGroups: {
    [skillGroupName in keyof RawSkillGroupMap]: {
      skillGroupName: skillGroupName;
      scenarioName: ScenarioName;
      skills: {
        [RawSkill in RawSkillGroupMap[skillGroupName][number] as RawSkill extends SkillNameType
          ? RawSkill
          : RawSkill[0]]: {
          /**
           * 스킬 이름.
           */
          name: RawSkill;

          /**
           * 스킬 스룹 이름
           */
          skillGroupName: skillGroupName;

          /**
           * 시나리오명
           */
          scenarioName: ScenarioNameType;
        };
      };
    };
  };
};
