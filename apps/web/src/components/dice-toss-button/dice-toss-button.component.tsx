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
}> = ({ isDiceTossForbidden, onClick, canTossDiceAfter }) => {
  const useDateTime = DateTime();
  const [diceButtonState, setDiceButtonState] =
    useRecoilState(diceTossButtonState);

  const baseButtonClassNames =
    'text-white px-5 py-7 rounded-2xl transition duration-150 text-2xl font-semibold';
  if (isDiceTossForbidden == true) {
    return (
      <div className="">
        <button
          className={`${baseButtonClassNames} cursor-not-allowed bg-gray-500 select-none`}
        >
          🎲 먼저 칸을 마치세요
          <div className="mt-2 font-normal text-base">
            칸을 마치세요! 그래야 주사위를 굴릴 수 있어요.
          </div>
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
        >
          🎲 주사위 기다리기
          <div className="mt-2 font-normal text-base">
            <span className="font-bold text-gray-200">{needTime}초</span>{' '}
            <span className="text-gray-300">
              후에 주사위를 굴릴 수 있습니다.
            </span>
          </div>
        </button>
      </div>
    );
  } else if (diceButtonState.isPending) {
    return (
      <div className="">
        <button
          className={`${baseButtonClassNames} cursor-wait bg-gray-500 select-none`}
        >
          🎲 주사위를 굴리는 중 ...
        </button>
        <br />
        <br />
      </div>
    );
  }

  return (
    <div className="">
      <button
        className={`${baseButtonClassNames} bg-blue-500 hover:bg-blue-400 active:bg-blue-700 select-none transform active:scale-95`}
        onClick={() => {
          setDiceButtonState({ isPending: true });
          onClick();
        }}
      >
        🎲 주사위 굴리기
      </button>
      <br />
      <br />
    </div>
  );
};
