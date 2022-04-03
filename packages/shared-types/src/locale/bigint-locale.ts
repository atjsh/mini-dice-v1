export const cashLocale = (
  cash: bigint | number | undefined | null,
  currency: 'KRW' | 'USD' = 'KRW',
) =>
  cash != null || cash != undefined
    ? BigInt(cash).toLocaleString(currency == 'KRW' ? 'ko-kr' : 'en-us', {
        style: 'currency',
        currency: currency,
      })
    : '';
