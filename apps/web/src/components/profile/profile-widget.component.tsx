import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../libs';
import {
  NotificationPageURL,
  PreferencesPageURL,
  RankingPgaeURL,
} from '../../pages/routes';

export const ProfileWidget: React.FC = () => {
  const { data: user } = useUser();

  return (
    <div>
      {user ? (
        <div className="flex gap-4 flex-col bg-white dark:md:bg-zinc-800 dark:bg-black px-4 py-5 rounded-3xl">
          <div className="flex flex-col gap-2 md:gap-4 justify-center">
            <div className="text-2xl md:text-4xl font-bold">😀 내 계정</div>
            <div>
              <div className="font-bold text-lg break-all text-zinc-800 dark:text-zinc-300 md:dark:text-zinc-300">
                {user.username}
              </div>
              <div className="font-bold text-base text-zinc-400 dark:text-zinc-600 md:dark:text-zinc-500">
                {new Date(user.createdAt).toLocaleDateString('ko-kr')} 시작
              </div>
            </div>
            <div className=" flex gap-4">
              <div>
                <Link
                  className="text-blue-600 dark:text-white hover:underline"
                  to={RankingPgaeURL}
                >
                  🏆 순위 확인하기→
                </Link>
              </div>
              <div>
                <Link
                  className="text-blue-600 dark:text-white hover:underline"
                  to={NotificationPageURL}
                >
                  📨 알림 센터→
                </Link>
              </div>
            </div>
            <div>
              <Link
                className="text-blue-600 dark:text-white hover:underline"
                to={PreferencesPageURL}
              >
                ⚙️ 설정→
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
