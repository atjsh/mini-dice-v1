export interface InviteTokenRecord {
  id: string;
  expiresAt: Date;
}

export interface AnalyticsRefreshStateRecord {
  lastSourceAt: Date | null;
}

export interface AnalyticsSourceStartRecord {
  since: Date;
}

export interface JoinChallengeRecord {
  id: string;
  challenge: string;
  inviteId: string;
  metadata: unknown;
}

export interface LoginChallengeRecord {
  id: string;
  challenge: string;
}

export interface AdminPasskeyRecord {
  id: string;
  adminUserId: string;
  publicKey: string;
  counter: number;
  isDisabled: boolean;
}

export interface CommentDto {
  id: string;
  userId: string;
  username: string;
  landId: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdatedCommentDto {
  id: string;
  comment: string;
  updatedAt: Date;
}

export interface ActivityDto {
  id: string;
  userId: string;
  username: string;
  skillRoute: string;
  skillDrawProps: unknown;
  read: boolean;
  createdAt: Date;
}

export interface UserListDto {
  userId: string;
  username: string;
  plain_email: string | null;
  authProvider: string;
  countryCode3: string;
  signupCompleted: boolean;
  isTerminated: boolean;
  cash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDetailDto extends UserListDto {
  isUserDiceTossForbidden: boolean;
  canTossDiceAfter: Date | null;
}

export interface EditableUserRecord {
  username: string;
  countryCode3: string;
}

export interface UpdatedUserDto {
  userId: string;
  username: string;
  countryCode3: string;
  updatedAt: Date;
}

export interface InviteDto {
  id: string;
  expiresAt: Date;
  usedAt: Date | null;
  revokedAt: Date | null;
  createdAt: Date;
  createdBy: string | null;
  usedBy: string | null;
}

export interface ActivityTrendDto {
  hourBucket: Date;
  activityCount: number;
  activeUserCount: number;
  skillLogCount: number;
}

export interface JoinTrendDto {
  hourBucket: Date;
  authProvider: string;
  countryCode3: string;
  joinCount: number;
}

export interface CommentTrendDto {
  hourBucket: Date;
  commentCount: number;
  commentingUserCount: number;
}

export interface StreakCountDto {
  userCount: number;
}
