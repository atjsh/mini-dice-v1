export const WordmarkComponent: React.FC<{ colored?: boolean }> = ({
  colored,
}) => (
  <>
    <span className="whitespace-nowrap">Mini</span>{' '}
    <span
      className={`${
        colored == undefined || colored == true ? 'text-minidice_red' : ''
      } whitespace-nowrap`}
    >
      {' '}
      Dice
    </span>{' '}
    {import.meta.env.VITE_WEB_VERSION_KIND !== 'prod' && (
      <span className=" font-light">Beta</span>
    )}
  </>
);

export const KoreanWordmarkComponent: React.FC<{ colored?: boolean }> = ({
  colored,
}) => (
  <>
    <span className="whitespace-nowrap">미니다이스</span>{' '}
    <span
      className={`${
        colored == undefined || colored == true ? 'text-minidice_red' : ''
      } whitespace-nowrap`}
    >
      인생게임
    </span>{' '}
    {import.meta.env.VITE_WEB_VERSION_KIND !== 'prod' && (
      <span className="font-light">베타</span>
    )}
  </>
);
