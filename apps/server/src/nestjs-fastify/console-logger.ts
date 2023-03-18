/**
 * SAM CLI 환경에서 분석하기 쉽도록 에러 로그를 남김
 */
export function consoleLogLambdaError(error: unknown): void {
  console.error(error);
  console.log(JSON.stringify(error));
}
