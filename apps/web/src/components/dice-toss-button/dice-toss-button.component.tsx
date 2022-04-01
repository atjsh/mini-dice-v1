import { UserVo } from '@packages/shared-types';
import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { diceTossButtonState } from './dice-toss-button-state.atom';

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
  const [diceButtonState, setDiceButtonState] =
    useRecoilState(diceTossButtonState);

  const baseButtonClassNames =
    'text-white md:px-5 md:py-7 px-7 py-5 rounded-2xl transition duration-150 text-lg md:text-2xl font-semibold';

  if (isDiceTossForbidden == true) {
    return (
      <div className="">
        <button
          className={`${baseButtonClassNames} cursor-not-allowed bg-gray-500 select-none`}
          onClick={setisSidebarShowing}
        >
          🎲 먼저 칸을 마치세요
        </button>
      </div>
    );
  } else if (canTossDiceAfter && canTossDiceAfter > useDateTime) {
    const needTime = Math.ceil(
      (canTossDiceAfter.getTime() - useDateTime.getTime()) / 1000,
    );

    return (
      <div className="">
        <button
          className={`${baseButtonClassNames} cursor-not-allowed bg-gray-500 select-none`}
          onClick={setisSidebarShowing}
        >
          🎲 주사위 기다리기: <span className="font-bold">{needTime}초</span>
        </button>
      </div>
    );
  } else if (diceButtonState.isPending) {
    return (
      <div className="">
        <button
          className={`${baseButtonClassNames} cursor-wait bg-gray-500 select-none`}
          onClick={setisSidebarShowing}
        >
          🎲 주사위를 굴리는 중 ...
        </button>
      </div>
    );
  }

  return (
    <div className="">
      <button
        className={`${baseButtonClassNames} bg-blue-500 dark:bg-blue-600 hover:bg-blue-400 active:bg-blue-700 select-none transform active:scale-95`}
        onClick={() => {
          setDiceButtonState({ isPending: true });
          onClick();
          setisSidebarShowing();
        }}
      >
        🎲 주사위 굴리기
      </button>
    </div>
  );
};
