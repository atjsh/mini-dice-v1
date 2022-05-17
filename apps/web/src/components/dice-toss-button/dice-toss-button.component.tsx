import { UserVo } from '@packages/shared-types';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { DiceTossActivityEnum, diceTossActivityStatusAtom } from '../../libs';

export const DateTime = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setDateTime(new Date()), 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return dateTime;
};

export const DiceTossButton: React.FC<{
  isDiceTossForbidden?: UserVo['isUserDiceTossForbidden'];
  canTossDiceAfter?: UserVo['canTossDiceAfter'];
  onClick: () => any;
  setisSidebarShowing: () => any;
}> = ({
  isDiceTossForbidden,
  onClick,
  canTossDiceAfter,
  setisSidebarShowing,
}) => {
  const useDateTime = DateTime();
  const diceButtonState = useRecoilValue(diceTossActivityStatusAtom);

  const baseButtonClassNames =
    'text-white md:px-5 md:py-7 px-5 py-4 max-w-2xl w-full rounded-2xl transition duration-150 text-lg md:text-2xl font-semibold flex-shrink-0';

  if (
    diceButtonState.enum == DiceTossActivityEnum.Processing ||
    diceButtonState.enum == DiceTossActivityEnum.Submitted ||
    diceButtonState.enum == DiceTossActivityEnum.ResultShowing
  ) {
    return (
      <button
        className={`${baseButtonClassNames} cursor-default bg-gray-500 select-none`}
        onClick={setisSidebarShowing}
      >
        {diceButtonState.reason
          ? diceButtonState.reason
          : diceButtonState.enum == DiceTossActivityEnum.Submitted
          ? '📡 서버와 통신 중...'
          : '🎲 주사위를 굴리는 중 ...'}
      </button>
    );
  } else if (isDiceTossForbidden == true) {
    return (
      <button
        className={`${baseButtonClassNames} cursor-default bg-gray-500 select-none`}
        onClick={setisSidebarShowing}
      >
        🎲 먼저 칸을 마치세요
      </button>
    );
  } else if (canTossDiceAfter && canTossDiceAfter > useDateTime) {
    const needTime = Math.ceil(
      (canTossDiceAfter.getTime() - useDateTime.getTime()) / 1000,
    );

    return (
      <button
        className={`${baseButtonClassNames} cursor-default bg-gray-500 select-none`}
        onClick={setisSidebarShowing}
      >
        🎲 주사위 기다리기: <span className="font-bold">{needTime}초</span>
      </button>
    );
  }

  return (
    <button
      className={`${baseButtonClassNames} bg-blue-500 dark:bg-blue-600 hover:bg-blue-400 active:bg-blue-700 select-none transform active:scale-95`}
      onClick={() => {
        onClick();
        setisSidebarShowing();
      }}
    >
      🎲 주사위 굴리기
    </button>
  );
};
