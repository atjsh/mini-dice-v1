import { Link } from 'react-router-dom';
import { useAccessToken } from '../../libs';
import {
  IndexPageURL,
  LogoutPageURL,
  PrivacyPolicyPageURL,
  RankingPgaeURL,
  TerminatePageURL,
  TermsPageURL,
} from '../../pages/routes';

export const FooterWidgetComponent: React.FC = () => {
  const { data: accessToken } = useAccessToken();

  return (
    <div className="self-center mb-10 flex flex-col gap-5 max-w-7xl px-2">
      <hr className=" border-gray-300" />
      <div className=" flex gap-y-1 flex-col ">
        <div className="font-bold select-none">서비스</div>
        <div className="flex gap-x-5 gap-y-3 flex-wrap">
          <a className="hover:underline" href={IndexPageURL}>
            Mini Dice
          </a>
          <Link className="hover:underline" to={RankingPgaeURL}>
            랭킹
          </Link>
        </div>
      </div>
      <div className=" flex gap-y-1 flex-col ">
        <div className="font-bold select-none">외부 링크</div>
        <div className="flex gap-x-5 gap-y-3 flex-wrap">
          <a
            href="https://discord.gg/2dhUGXwmBq"
            className="hover:underline"
            target="_blank"
          >
            디스코드 채널↗
          </a>
          <a
            href="https://twitter.com/TeamMiniDice1"
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
        <div className="font-bold select-none">관리</div>
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
        <div className="font-bold select-none">정보</div>
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
        Copyright © 2022 Mini Dice Team. All rights reserved. <br />
      </div>
    </div>
  );
};
