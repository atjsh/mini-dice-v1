import { useUser } from '../../libs';

const ValueDisplay: React.FC<{
  value: string;
  label: string;
  fontSize: 'text-md' | 'text-3xl' | 'text-4xl';
}> = ({ value, label, fontSize }) => (
  <div className="flex-1">
    <div className="font-extrabold">{label}</div>
    <div className={`${fontSize} break-all`}>{value}</div>
  </div>
);

const ValueDisplayContainer: React.FC = ({ children }) => (
  <div className="flex gap-4">{children}</div>
);

export const WalletWidget: React.FC = () => {
  const { data: user } = useUser();

  return user ? (
    <div className="bg-white py-5 px-7 rounded-3xl">
      <div className="flex gap-4 flex-col">
        <ValueDisplayContainer>
          <ValueDisplay
            value={`${BigInt(user.cash).toLocaleString('ko-kr', {
              style: 'currency',
              currency: 'KRW',
            })}`}
            label="잔고"
            fontSize="text-4xl"
          />
        </ValueDisplayContainer>
        <ValueDisplayContainer>
          <ValueDisplay
            value={`${BigInt(user.cash).toLocaleString('ko-kr', {
              style: 'currency',
              currency: 'KRW',
            })}`}
            label="보유중인 현금"
            fontSize="text-3xl"
          />
        </ValueDisplayContainer>
        <ValueDisplayContainer>
          <ValueDisplay
            value={`${BigInt(0).toLocaleString('ko-kr', {
              style: 'currency',
              currency: 'KRW',
            })}`}
            label="주식 총평가금액"
            fontSize="text-3xl"
          />
        </ValueDisplayContainer>
        <ValueDisplayContainer>
          <ValueDisplay
            value={`${BigInt(0).toLocaleString('ko-kr', {
              style: 'currency',
              currency: 'KRW',
            })}`}
            label="소유중인 주식 종목"
            fontSize="text-md"
          />
          <ValueDisplay
            value={`${BigInt(0).toLocaleString('ko-kr', {
              style: 'currency',
              currency: 'KRW',
            })}`}
            label="더블 시 주가 증감"
            fontSize="text-md"
          />
        </ValueDisplayContainer>
        <ValueDisplayContainer>
          <ValueDisplay
            value={`${BigInt(0).toLocaleString('ko-kr', {
              style: 'currency',
              currency: 'KRW',
            })}`}
            label="1주당 금액"
            fontSize="text-md"
          />
          <ValueDisplay
            value={`${BigInt(0).toLocaleString('ko-kr', {
              style: 'currency',
              currency: 'KRW',
            })}`}
            label="평가손익"
            fontSize="text-md"
          />
        </ValueDisplayContainer>
      </div>
    </div>
  ) : (
    <div></div>
  );
};
