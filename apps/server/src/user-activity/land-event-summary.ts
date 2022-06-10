import { PlainMessageType, PlainMessage } from '@packages/shared-types';
import * as _ from 'lodash';
import { LandEventsSummarizeResultType } from '../skill-log/types/skill-draw-props.dto';

export function renderRecentLandEventSummary(
  landEventSummaries: LandEventsSummarizeResultType[],
): PlainMessageType {
  const changedCashAmountSum = _.sum(
    landEventSummaries.map((summary) => summary.cashChangeAmount),
  );

  return PlainMessage({
    title: '📨 새 알림',
    description: `${landEventSummaries
      .map((summary) => `- ${summary.summaryText}`)
      .join('\n')}`,
  });
}
