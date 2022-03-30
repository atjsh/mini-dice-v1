import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ServiceLayout } from '../layouts/service.layout';
import { useOthersProfiles } from '../libs/tdol-server/profile/use-others-profiles.hook';
import { IndexPageURL } from './routes';

export function RankingPage() {
  const limit = 40;
  const [page, setPage] = useState(1);
  const { data: othersProfiles, isLoading } = useOthersProfiles(limit, page);
  return (
    <ServiceLayout>
      <div className=" max-w-4xl self-center px-3 m-auto">
        <div className=" mb-10">
          <Link
            className=" text-lg text-blue-500 hover:underline"
            to={IndexPageURL}
          >
            ← Mini Dice로 돌아가기
          </Link>
          <h1 className=" text-4xl font-bold">순위</h1>
        </div>
        <div className=" flex flex-row gap-3 my-5 text-xl font-bold">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="hover:underline disabled:text-gray-500"
          >
            이전 페이지
          </button>
          <button onClick={() => setPage(page + 1)} className="hover:underline">
            다음 페이지
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <div className="text-center">불러오는 중...</div>
          ) : (
            othersProfiles &&
            othersProfiles.map((profile) => {
              const rank =
                (page - 1) * limit + othersProfiles.indexOf(profile) + 1;

              const rankClassName = {
                1: 'text-yellow-500',
                2: 'text-gray-600',
                3: 'text-yellow-800',
              };

              return (
                <div className="flex gap-3 flex-row flex-wrap items-center bg-white p-3 rounded-2xl border-2">
                  <div
                    className={
                      rank > 3
                        ? ' text-gray-400'
                        : `${rankClassName[rank]} font-bold`
                    }
                  >
                    {rank}위
                  </div>
                  <div className="flex flex-col gap-2 justify-center">
                    <div className="font-bold text-xl break-all">
                      {profile.username}
                    </div>
                  </div>
                  <div className=" flex flex-row gap-x-5 gap-y-2 flex-wrap">
                    <div className="font-bold text-base text-gray-500">
                      {new Date(profile.createdAt).toLocaleDateString('ko-kr')}{' '}
                      시작
                    </div>
                    <div className="font-bold text-base text-gray-500">
                      {`${BigInt(profile.cash).toLocaleString('en-us', {
                        style: 'currency',
                        currency: 'KRW',
                      })}`}{' '}
                      보유
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </ServiceLayout>
  );
}
