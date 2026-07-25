import { useUser } from '../../libs';

const ValueDisplay: React.FC<{
  value: string;
  label: string;
  mdFontSize: 'text-xs' | 'text-md' | 'text-3xl' | 'text-4xl';
  fontSize:
    | 'text-xs'
    | 'text-md'
    | 'text-lg'
    | 'text-xl'
    | 'text-2xl'
    | 'text-3xl'
    | 'text-4xl';
}> = ({ value, label, mdFontSize, fontSize }) => (
  <div className="flex-1">
    <div className="font-extrabold text-zinc-400 dark:text-zinc-600 md:dark:text-zinc-500 text-sm md:text-base">
      {label}
    </div>
    <div
      className={`${fontSize} md:${mdFontSize} break-all text-zinc-800 dark:text-zinc-300 md:dark:text-zinc-300`}
    >
      {value.includes('\n')
        ? value.split('\n').map((line, index) => (
            <div key={index}>
              {line}
              <br />
            </div>
          ))
        : value}
    </div>
  </div>
);

const ValueDisplayContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="flex gap-4">{children}</div>;

export const WalletWidget: React.FC = () => {
  const { data: user } = useUser();

  return user ? (
    <div className="bg-white dark:md:bg-zinc-800 dark:bg-black px-4 py-5 rounded-3xl">
      <div className="flex gap-2 md:gap-4 flex-col">
        <div className="text-2xl md:text-4xl font-bold">💵 내 자산</div>
        <ValueDisplayContainer>
          <ValueDisplay
            value={`${BigInt(
              BigInt(user.cash) +
                (user.stockStatus
                  ? BigInt(user.stockStatus.stockAmount) *
                    BigInt(user.stockStatus.stockCurrentPrice)
                  : BigInt(0)),
            ).toLocaleString('ko-kr', {
              style: 'currency',
              currency: 'KRW',
            })}`}
            label="보유중인 자산의 총합"
            mdFontSize="text-4xl"
            fontSize="text-2xl"
          />
        </ValueDisplayContainer>
        <ValueDisplayContainer>
          <ValueDisplay
            value={`${BigInt(user.cash).toLocaleString('ko-kr', {
              style: 'currency',
              currency: 'KRW',
            })}`}
            label="현금"
            mdFontSize="text-3xl"
            fontSize="text-xl"
          />
        </ValueDisplayContainer>
        <ValueDisplayContainer>
          <ValueDisplay
            value={`${BigInt(
              user.stockStatus
                ? BigInt(user.stockStatus.stockAmount) *
                    BigInt(user.stockStatus.stockCurrentPrice)
                : 0,
            ).toLocaleString('ko-kr', {
              style: 'currency',
              currency: 'KRW',
            })}`}
            label="주식 총평가금액"
            mdFontSize="text-3xl"
            fontSize="text-xl"
          />
        </ValueDisplayContainer>
        <ValueDisplayContainer>
          <ValueDisplay
            value={`${
              user.stockStatus
                ? `${user.stockStatus.stockName} ${user.stockStatus.stockAmount}주\n (TICKER: ${user.stockStatus.stockTicker})`
                : '-'
            }`}
            label="소유중인 주식 종목"
            mdFontSize="text-md"
            fontSize="text-md"
          />
          <ValueDisplay
            value={`${
              user.stockStatus
                ? `↑${BigInt(user.stockStatus.stockRisingPrice).toLocaleString(
                    'ko-kr',
                    {
                      style: 'currency',
                      currency: 'KRW',
                    },
                  )}\n ↓${BigInt(
                    user.stockStatus.stockFallingPrice,
                  ).toLocaleString('ko-kr', {
                    style: 'currency',
                    currency: 'KRW',
                  })}`
                : '-'
            }`}
            label="더블 시 주가 증감"
            mdFontSize="text-md"
            fontSize="text-md"
          />
        </ValueDisplayContainer>
        <ValueDisplayContainer>
          <ValueDisplay
            value={`${
              user.stockStatus
                ? `시작가 ${BigInt(
                    user?.stockStatus?.stockStartingPrice,
                  ).toLocaleString('ko-kr', {
                    style: 'currency',
                    currency: 'KRW',
                  })} → \n 현재 ${BigInt(
                    user?.stockStatus?.stockCurrentPrice,
                  ).toLocaleString('ko-kr', {
                    style: 'currency',
                    currency: 'KRW',
                  })}`
                : '-'
            }`}
            label="1주당 금액"
            mdFontSize="text-md"
            fontSize="text-md"
          />
          {user.stockStatus &&
          BigInt(user.stockStatus.stockCashPurchaseSum || 0) > 0 ? (
            <ValueDisplay
              value={`${(
                BigInt(user.stockStatus.stockAmount) *
                  BigInt(user.stockStatus.stockCurrentPrice) -
                BigInt(user.stockStatus.stockCashPurchaseSum)
              ).toLocaleString('ko-kr', {
                style: 'currency',
                currency: 'KRW',
              })}`}
              label="평가손익"
              mdFontSize="text-md"
              fontSize="text-md"
            />
          ) : user.stockStatus ? (
            <ValueDisplay
              label="평가손익"
              value={`주식 재구매 후 
              확인 가능`}
              mdFontSize="text-md"
              fontSize="text-md"
            />
          ) : (
            <ValueDisplay
              label="평가손익"
              value="-"
              mdFontSize="text-md"
              fontSize="text-md"
            />
          )}
        </ValueDisplayContainer>
      </div>
    </div>
  ) : (
    <div></div>
  );
};
