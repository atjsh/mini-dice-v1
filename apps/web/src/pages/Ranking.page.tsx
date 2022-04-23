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

const UPDATED_AT_OFFSET_24H = 1000 * 60 * 60 * 24;
const UPDATED_AT_OFFSET_7DAYS = 1000 * 60 * 60 * 24 * 7;
const UPDATED_AT_OFFSET_ALLTIME = undefined;

export function RankingPage() {
  const limit = 25;
  const [page, setPage] = useState(1);
  const [updatedAtOffset, setupdatedAtOffset] = useState<number | undefined>(
    UPDATED_AT_OFFSET_24H,
  );
  const { data: othersProfiles, isLoading } = useOthersProfiles(
    limit,
    page,
    updatedAtOffset,
  );
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
          <h1 className=" text-4xl font-bold">순위</h1>
        </div>
        <div className="flex flex-col gap-3 max-w-5xl">
          <div className="flex flex-col gap-3 my-5 sticky top-0 z-50 dark:bg-black bg-white py-5">
            <div>
              <div className="font-bold select-none text-zinc-400 dark:text-zinc-500">
                순위 선택
              </div>
              <div className="flex flex-row gap-x-3 text-xl font-bold">
                <button
                  onClick={() => {
                    setupdatedAtOffset(UPDATED_AT_OFFSET_24H);
                    setPage(1);
                  }}
                  disabled={updatedAtOffset === UPDATED_AT_OFFSET_24H}
                  className="hover:underline disabled:font-bold disabled:underline"
                >
                  24시간 순위
                </button>
                <button
                  onClick={() => {
                    setupdatedAtOffset(UPDATED_AT_OFFSET_7DAYS);
                    setPage(1);
                  }}
                  disabled={updatedAtOffset === UPDATED_AT_OFFSET_7DAYS}
                  className="hover:underline disabled:font-bold disabled:underline"
                >
                  일주일 순위
                </button>
                <button
                  onClick={() => {
                    setupdatedAtOffset(UPDATED_AT_OFFSET_ALLTIME);
                    setPage(1);
                  }}
                  disabled={updatedAtOffset === UPDATED_AT_OFFSET_ALLTIME}
                  className="hover:underline disabled:font-bold disabled:underline"
                >
                  전체 순위
                </button>
              </div>
            </div>
            <div>
              <div className="font-bold select-none text-zinc-400 dark:text-zinc-500">
                페이지 이동
              </div>
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
