import { PublicProfileVo } from '@packages/shared-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ServiceLayout } from '../layouts/service.layout';
import { useOthersProfiles } from '../libs/tdol-server/profile/use-others-profiles.hook';
import { IndexPageURL } from './routes';

const RankingProfile: React.FC<{ profile: PublicProfileVo; rank: number }> = ({
  profile,
  rank,
}) => {
  const [isProfileDetailShowing, setIsProfileDetailShowing] = useState(false);

  const rankClassName = {
    1: 'text-yellow-500',
    2: 'text-gray-600',
    3: 'text-yellow-800',
  };
  return (
    <button
      className=" w-fit border-gray-300 bg-zinc-100 hover:bg-gray-200 active:bg-gray-400 text-black dark:border-gray-600  dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:active:bg-zinc-600 dark:text-white border-2 px-4 py-2 rounded-2xl transition duration-150 text-base font-semibold select-none transform active:scale-95 text-left block"
      onClick={() => setIsProfileDetailShowing(!isProfileDetailShowing)}
    >
      <div
        className={
          rank > 3 ? ' text-gray-400' : `${rankClassName[rank]} font-bold`
        }
      >
        {rank}위
      </div>
      <div className="flex flex-col gap-2 justify-center">
        <div className="font-bold text-xl break-all">{profile.username}</div>
      </div>
      <div className=" flex flex-col gap-x-5 gap-y-2 flex-wrap">
        <div className=" flex flex-row gap-x-5 flex-wrap">
          <div className="font-bold text-base text-gray-500">
            잔고{' '}
            {`${BigInt(profile.cash).toLocaleString('en-us', {
              style: 'currency',
              currency: 'KRW',
            })}`}{' '}
          </div>
          <div className="font-bold text-base text-gray-500">
            {new Date(profile.updatedAt).toLocaleString('ko-kr')} 마지막 활동
          </div>
        </div>
        {isProfileDetailShowing && (
          <div>
            <div className="font-bold text-base text-gray-500">
              현금{' '}
              {`${(
                BigInt(profile.cash) - BigInt(profile.stockCash)
              ).toLocaleString('en-us', {
                style: 'currency',
                currency: 'KRW',
              })}`}{' '}
            </div>
            <div className="font-bold text-base text-gray-500">
              주식 총평가금액{' '}
              {`${BigInt(profile.stockCash).toLocaleString('en-us', {
                style: 'currency',
                currency: 'KRW',
              })}`}{' '}
            </div>
            <div className="font-bold text-base text-gray-500">
              {new Date(profile.createdAt).toLocaleDateString('ko-kr')} 시작
            </div>
          </div>
        )}
      </div>
    </button>
  );
};

export function RankingPage() {
  const limit = 50;
  const [page, setPage] = useState(1);
  const { data: othersProfiles, isLoading } = useOthersProfiles(limit, page);
  return (
    <ServiceLayout>
      <div className="self-center px-3 m-auto">
        <div className="">
          <Link
            className=" text-lg text-blue-500 hover:underline"
            to={IndexPageURL}
          >
            ← Mini Dice로 돌아가기
          </Link>
          <h1 className=" text-4xl font-bold">랭킹</h1>
        </div>
        <div className="flex flex-col gap-3 max-w-5xl">
          <div className="flex flex-col gap-3 my-5 sticky top-0 z-50 dark:bg-black bg-white py-5">
            <div className="flex flex-row gap-x-3 text-xl font-bold">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="hover:underline disabled:text-gray-500"
              >
                이전 페이지
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === 10 || othersProfiles?.length! < limit}
                className="hover:underline disabled:text-gray-500"
              >
                다음 페이지
              </button>
            </div>
            <p className=" text-sm">
              유저 닉네임을 클릭하여 상세정보 조회 가능
            </p>
          </div>
          {isLoading ? (
            <div className="text-center">불러오는 중...</div>
          ) : (
            othersProfiles &&
            othersProfiles.map((profile) => {
              return (
                <RankingProfile
                  profile={profile}
                  rank={
                    (page - 1) * limit + othersProfiles.indexOf(profile) + 1
                  }
                />
              );
            })
          )}
        </div>
      </div>
    </ServiceLayout>
  );
}
