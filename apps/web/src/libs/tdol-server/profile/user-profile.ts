import { authedAxios } from "..";

export enum SupportedCountryEnum {
  SOUTH_KOREA = "skr",
  UNITED_STATES = "us"
}

export class UserProfile {
  email: string;
  username: string;
  cash: string;
  allowedSkillRoute: null | object;
  isUserDiceTossForbidden: boolean;
  callCallSkillAfter: null | Date;
  createdAt: Date;
  country: SupportedCountryEnum;
}

export async function getUserProfile(): Promise<UserProfile> {
  const response = await authedAxios.get<UserProfile>(`/profile/me`);
  return response.data;
}

export async function updateUserProfile(
  partialUser: Partial<UserProfile>
): Promise<UserProfile> {
  const response = await authedAxios.patch<Partial<UserProfile>, UserProfile>(
    `/profile/me`,
    partialUser
  );
  return response;
}
