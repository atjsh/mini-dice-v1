export const WordmarkComponent: React.FC<{ colored?: boolean }> = ({
  colored,
}) => (
  <>
    <span className="whitespace-nowrap">Mini Dice</span>{' '}
    <span
      className={`${
        colored == undefined || colored == true ? 'text-minidice_red' : ''
      } whitespace-nowrap`}
    >
      {' '}
      Life
    </span>
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
    </span>
  </>
);
