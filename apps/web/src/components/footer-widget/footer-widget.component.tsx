import { strEllipsis } from '@packages/shared-types';
import { Link } from 'react-router-dom';
import { useAccessToken } from '../../libs';
import {
  IndexPageURL,
  LogoutPageURL,
  PrivacyPolicyPageURL,
  RankingPgaeURL,
  TerminatePageURL,
  TermsPageURL,
  UpdatesPageURL,
} from '../../pages/routes';

export const FooterWidgetComponent: React.FC = () => {
  const { data: accessToken } = useAccessToken();

  return (
    <div className="self-center mb-10 flex flex-col gap-5 max-w-7xl px-2">
      <hr className=" border-gray-300" />
      <div className=" flex gap-y-1 flex-col ">
        <div className="font-bold select-none text-zinc-400 dark:text-zinc-500">
          서비스
        </div>
        <div className="flex gap-x-5 gap-y-3 flex-wrap">
          <a className="hover:underline" href={IndexPageURL}>
            Mini Dice
          </a>
          <Link className="hover:underline" to={RankingPgaeURL}>
            순위
          </Link>
          <Link className="hover:underline" to={UpdatesPageURL}>
            새로운 소식
          </Link>
        </div>
      </div>
      <div className=" flex gap-y-1 flex-col ">
        <div className="font-bold select-none text-zinc-400 dark:text-zinc-500 ">
          외부 링크
        </div>
        <div className="flex gap-x-5 gap-y-3 flex-wrap">
          <a
            href="https://discord.gg/2dhUGXwmBq"
            className="hover:underline"
            target="_blank"
          >
            커뮤니티(디스코드)↗
          </a>
          <a
            href="https://twitter.com/TeamMiniDice1"
            target="_blank"
            className="hover:underline"
          >
            트위터↗
          </a>
          <a
            target="_blank"
            className="hover:underline"
            href="https://toss.me/%EB%AF%B8%EB%8B%88%EB%8B%A4%EC%9D%B4%EC%8A%A4"
          >
            서버비용 후원(토스)↗
          </a>
        </div>
      </div>
      <div className={`flex gap-y-1 flex-col ${accessToken ? '' : 'hidden'}`}>
        <div className="font-bold select-none text-zinc-400 dark:text-zinc-500">
          관리
        </div>
        <div className="flex gap-x-5 gap-y-3 flex-wrap">
          <Link className={`hover:underline`} to={LogoutPageURL}>
            로그아웃
          </Link>
          <Link className={`hover:underline`} to={TerminatePageURL}>
            회원탈퇴
          </Link>
        </div>
      </div>
      <div className=" flex gap-y-1 flex-col ">
        <div className="font-bold select-none text-zinc-400 dark:text-zinc-500">
          정보
        </div>
        <div className="flex gap-x-5 gap-y-3 flex-wrap">
          <Link className="hover:underline" to={PrivacyPolicyPageURL}>
            개인정보 처리방침
          </Link>
          <Link className="hover:underline" to={TermsPageURL}>
            이용약관
          </Link>
          <a
            className="hover:underline"
            href="mailto:lifegame2021team@gmail.com"
            target="_blank"
          >
            문의(이메일)↗
          </a>
        </div>
      </div>
      <div className="text-gray-400">
        클라이언트 버전:{' '}
        {strEllipsis(
          process.env.VERCEL_GIT_COMMIT_SHA ||
            process.env.BUILD_VERSION ||
            'unknown',
          6,
          '+',
        )}
        {process.env.WEB_VERSION_KIND || 'unknown'} -{' '}
        <a
          href="/"
          className=" underline hover:text-black hover:dark:text-white"
        >
          새로고침
        </a>
        <br />
        <br />
        일러스트 및 이미지 저작권 © Miyobi (미요비). 모든 권리 보유.
        <br /> Mini Dice 저작권 © 2022 Mini Dice Team. 모든 권리 보유.
      </div>
    </div>
  );
};
