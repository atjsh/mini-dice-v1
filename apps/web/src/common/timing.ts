export const skillLogMessageAddingDelayTiming = [0, 1200, 2100, 2900];

export const diceTossingDelayTimeMS = 2500;
export const mapMovingDelayTimeMS = 4000;

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const getSkillLogMessageAddingDelayTiming = (index: number) =>
  skillLogMessageAddingDelayTiming[index] ?? (index + 1) * 1000;
