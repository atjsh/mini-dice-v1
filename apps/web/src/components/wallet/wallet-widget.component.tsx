import { useUser } from '../../libs';

const ValueDisplay: React.FC<{
  value: string;
  label: string;
  fontSize: 'text-xs' | 'text-md' | 'text-3xl' | 'text-4xl';
}> = ({ value, label, fontSize }) => (
  <div className="flex-1">
    <div className="font-extrabold text-zinc-400 dark:text-zinc-600 md:dark:text-zinc-500">
      {label}
    </div>
    <div className={`${fontSize} break-all`}>
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

const ValueDisplayContainer: React.FC = ({ children }) => (
  <div className="flex gap-4">{children}</div>
);

export const WalletWidget: React.FC = () => {
  const { data: user } = useUser();

  return user ? (
    <div className="bg-white dark:md:bg-zinc-800 dark:bg-black py-5 px-7 rounded-3xl">
      <div className="flex gap-4 flex-col">
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
            fontSize="text-4xl"
          />
        </ValueDisplayContainer>
        <ValueDisplayContainer>
          <ValueDisplay
            value={`${BigInt(user.cash).toLocaleString('ko-kr', {
              style: 'currency',
              currency: 'KRW',
            })}`}
            label="현금"
            fontSize="text-3xl"
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
            fontSize="text-3xl"
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
            fontSize="text-md"
          />
          {user.stockStatus &&
          BigInt(user.stockStatus.stockCashPurchaseSum || 0) > 0 ? (
            <ValueDisplay
              value={`${(
                BigInt(user.stockStatus.stockAmount) *
                  BigInt(user.stockStatus.stockCurrentPrice) -
                BigInt(user.stockStatus.stockCashPurchaseSum!)
              ).toLocaleString('ko-kr', {
                style: 'currency',
                currency: 'KRW',
              })}`}
              label="평가손익"
              fontSize="text-md"
            />
          ) : user.stockStatus ? (
            <ValueDisplay
              label="평가손익"
              value={`주식 재구매 후 
              확인 가능`}
              fontSize="text-md"
            />
          ) : (
            <ValueDisplay label="평가손익" value="-" fontSize="text-md" />
          )}
        </ValueDisplayContainer>
      </div>
    </div>
  ) : (
    <div></div>
  );
};
