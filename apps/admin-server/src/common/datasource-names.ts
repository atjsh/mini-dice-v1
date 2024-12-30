export const DATASOURCE_NAMES = {
  MYSQL: 'mysql',
  POSTGRESQL: 'postgresql',
} as const;
export type DATASOURCE_NAMES =
  (typeof DATASOURCE_NAMES)[keyof typeof DATASOURCE_NAMES];
