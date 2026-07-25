export interface AdminDto {
  id: string;
  displayName: string;
  role: string;
}

export interface ListResponse<T> {
  items: T[];
}

export interface PagedResponse<T> extends ListResponse<T> {
  page: number;
  limit: number;
}

export interface SuccessResponse {
  success: true;
}

export interface CommentDto {
  id: string;
  userId: string;
  username: string;
  landId: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatedCommentDto {
  id: string;
  comment: string;
  updatedAt: string;
}

export interface ActivityDto {
  id: string;
  userId: string;
  username: string;
  skillRoute: string;
  skillDrawProps: unknown;
  read: boolean;
  createdAt: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface UserDetailDto extends UserListDto {
  isUserDiceTossForbidden: boolean;
  canTossDiceAfter: string | null;
}

export interface UpdatedUserDto {
  userId: string;
  username: string;
  countryCode3: string;
  updatedAt: string;
}

export interface InviteDto {
  id: string;
  expiresAt: string;
  usedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  createdBy: string | null;
  usedBy: string | null;
}

export interface CreatedInviteDto {
  id: string;
  expiresAt: string;
  token: string;
}

export interface ActivityTrendDto {
  hourBucket: string;
  activityCount: number;
  activeUserCount: number;
  skillLogCount: number;
}

export interface JoinTrendDto {
  hourBucket: string;
  authProvider: string;
  countryCode3: string;
  joinCount: number;
}

export interface CommentTrendDto {
  hourBucket: string;
  commentCount: number;
  commentingUserCount: number;
}

export interface StreakCountDto {
  days: number;
  userCount: number;
}
