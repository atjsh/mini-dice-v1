export const WordmarkComponent: React.FC<{ colored?: boolean }> = ({
  colored,
}) => (
  <div className="flex gap-2 items-end justify-center w-full">
    <div className="whitespace-nowrap">빅찬웅</div>{' '}
    <div
      className={`${
        colored == undefined || colored == true ? 'text-minidice_red' : ''
      } whitespace-nowrap`}
    >
      Dice
    </div>
    {import.meta.env.VITE_WEB_VERSION_KIND !== 'prod' && (
      <div className="font-medium bg-gray-400 text-xs md:text-lg px-3 py-1 dark:text-black rounded-xl text-white h-fit">
        Beta
      </div>
    )}
  </div>
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
