import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ConnectWithOauthWidget } from '../components/connect-with-oauth/connect-with-oauth.component';
import { CoupangAdWidget } from '../components/coupang-ad-widget/coupang-ad-widget.component';
import { DiceTossButton } from '../components/dice-toss-button/dice-toss-button.component';
import { FooterWidgetComponent } from '../components/footer-widget/footer-widget.component';
import { currentSkillRouteAtom } from '../components/map/current-skill-route.atom';
import { MapStatusBar } from '../components/map/map-status-bar.component';
import { ProfileWidget } from '../components/profile/profile-widget.component';
import { skillLogMessagesState } from '../components/skill-log-message/atoms/skill-log-messages.atom';
import { RenderedSkillLogMessages } from '../components/skill-log-message/rendered-skill-log-messages.component';
import {
  usePageTimeout,
  useSkillLogMessages,
} from '../components/skill-log-message/use-skill-log-messages.hook';
import { UpdatesWidget } from '../components/updates-widget/updates-widget.component';
import { WalletWidget } from '../components/wallet/wallet-widget.component';
import { WordmarkComponent } from '../components/wordmark/wordmark.component';
import {
  DiceTossActivityEnum,
  diceTossActivityStatusAtom,
  useDiceToss,
  useSkillLogs,
  useUser,
} from '../libs';
import { NewestEntrySummary } from './Updates.page';
import { NotificationPageURL, RankingPgaeURL, UpdatesPageURL } from './routes';

const Messages = () => {
  const skillLogMessages = useRecoilValue(skillLogMessagesState);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef!.current!.scrollIntoView({ behavior: 'smooth' })!;
  };
  useEffect(scrollToBottom, [skillLogMessages.length]);

  return (
    <div className="flex-grow md:pb-0 px-2 custom-min-h-screen">
      <RenderedSkillLogMessages />
      <div ref={messagesEndRef} />
    </div>
  );
};

export function Ingame({
  isSidebarShowing,
  setisSidebarShowing,
}: {
  isSidebarShowing: boolean;
  setisSidebarShowing: (param: boolean) => any;
}) {
  const { data: user } = useUser();
  const mutation = useDiceToss();
  const { data: skillLogs } = useSkillLogs();
  const { initSkillLogMessages } = useSkillLogMessages();
  const [, setCurrentSkillRoute] = useRecoilState(currentSkillRouteAtom);
  const { pageTimeouts } = usePageTimeout();
  const [, setDiceTossActivity] = useRecoilState(diceTossActivityStatusAtom);

  useEffect(() => {
    pageTimeouts.map(clearTimeout);
    setDiceTossActivity({
      enum: DiceTossActivityEnum.Idle,
      reason: null,
    });
  }, []);

  useEffect(() => {
    if (skillLogs != undefined) {
      if (skillLogs.length > 0) {
        setCurrentSkillRoute(skillLogs[skillLogs.length - 1].skillRoute);
        initSkillLogMessages(
          skillLogs
            .map((skillLog) => [
              ...skillLog.skillDrawResult.userRequestDrawings.map(
                (message) => ({
                  date: new Date(skillLog.skillDrawResult.date),
                  skillLogId: skillLog.id,
                  message: message,
                }),
              ),
              ...skillLog.skillDrawResult.actionResultDrawings.map(
                (message) => ({
                  date: new Date(skillLog.skillDrawResult.date),
                  skillLogId: skillLog.id,
                  message: message,
                }),
              ),
            ])
            .flat(),
        );
      } else {
        setCurrentSkillRoute(null);
      }
    }
  }, [skillLogs != undefined]);

  return (
    <div
      className={` flex-1 overflow-y-auto transition-colors duration-300 ${'bg-white dark:bg-black'} md:bg-white md:dark:bg-black md:transition-none`}
    >
      <div className="mx-auto my-0 max-w-7xl">
        <div className="md:hidden sticky top-0 bg-white dark:bg-black bg-opacity-25 dark:bg-opacity-50 backdrop-filter z-40 w-full py-3 px-7 backdrop-blur-lg  flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="text-lg font-extrabold">
                <WordmarkComponent />
              </div>
            </div>
            {import.meta.env.VITE_WEB_VERSION_KIND !== 'prod' && (
              <div className="text-xs text-right">
                <a className="underline " href="https://www.mini-dice.com">
                  공식 서비스로 돌아가기
                </a>
              </div>
            )}
          </div>
          <div className=" flex justify-center flex-col items-center gap-1">
            <div className=" text-xs break-all text-left text-gray-600 dark:text-gray-400 ">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의
              수수료를 제공받습니다.
            </div>
            <iframe
              src="https://ads-partners.coupang.com/widgets.html?id=828026&template=carousel&trackingCode=AF9847023&subId=&width=400&height=52&tsource="
              width="400"
              height="52"
              frameBorder="0"
              scrolling="no"
              referrerPolicy="unsafe-url"
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              browsingtopics="true"
            ></iframe>
          </div>
        </div>
        <div className=" px-3">
          <div className="text-center bg-blue-100 dark:bg-slate-600 w-fit mx-auto rounded-2xl py-3 px-6 my-5">
            <p className="text-xl">
              "🎲 주사위 굴리기" 버튼을 계속 눌러 진행하세요!
            </p>
          </div>
        </div>
        <Messages />

        <div className="pt-1.5 pb-15 text-center sticky w-full bottom-0 mt-1 md:mt-4 backdrop-blur-lg bg-white dark:bg-black bg-opacity-25 dark:bg-opacity-50 backdrop-filter z-40 flex flex-col gap-1.5 border-t dark:border-zinc-800 border-gray-300 justify-center items-center">
          <div className="flex gap-x-3 items-start max-w-7xl w-full px-1.5">
            <MapStatusBar />
          </div>
          <div className=" w-full overflow-x-auto whitespace-nowrap px-1.5 box-border text-left sm:text-center">
            <button
              onClick={() => {
                setisSidebarShowing(!isSidebarShowing);
              }}
              className={`${
                !isSidebarShowing
                  ? 'border-gray-300 bg-zinc-100 hover:bg-gray-200 active:bg-gray-400 text-black dark:border-gray-600  dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:active:bg-zinc-600 dark:text-white'
                  : ' border-gray-600  bg-gray-900 hover:bg-gray-700 active:bg-gray-500 text-white dark:border-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-500 dark:text-white'
              } border-2 px-3.5 py-1.5 rounded-xl transition duration-150 text-sm font-normal select-none transform active:scale-95 md:hidden inline-block`}
            >
              💵{' '}
              {user
                ? `${BigInt(
                    BigInt(user.cash) +
                      (user.stockStatus
                        ? BigInt(user.stockStatus.stockAmount) *
                          BigInt(user.stockStatus.stockCurrentPrice)
                        : BigInt(0)),
                  ).toLocaleString('ko-kr', {
                    style: 'currency',
                    currency: 'KRW',
                  })}`
                : `${BigInt(0).toLocaleString('ko-kr', {
                    style: 'currency',
                    currency: 'KRW',
                  })}`}
            </button>{' '}
            <Link
              to={RankingPgaeURL}
              className="md:hidden inline-block border-gray-300 bg-zinc-100 hover:bg-gray-200 active:bg-gray-400 text-black dark:border-gray-600  dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:active:bg-zinc-600 dark:text-white border-2 px-3.5 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl transition duration-150 text-sm md:text-base font-normal select-none transform active:scale-95"
            >
              🏆 순위
            </Link>{' '}
            <Link
              to={NotificationPageURL}
              className="md:hidden inline-block border-gray-300 bg-zinc-100 hover:bg-gray-200 active:bg-gray-400 text-black dark:border-gray-600  dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:active:bg-zinc-600 dark:text-white border-2 px-3.5 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl transition duration-150 text-sm md:text-base font-normal select-none transform active:scale-95"
            >
              📨 알림 센터
            </Link>{' '}
            <Link
              to={UpdatesPageURL}
              className="md:hidden inline-block border-gray-300 bg-zinc-100 hover:bg-gray-200 active:bg-gray-400 text-black dark:border-gray-600  dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:active:bg-zinc-600 dark:text-white border-2 px-3.5 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl transition duration-150 text-sm md:text-base font-normal select-none transform active:scale-95"
            >
              🎙️ <NewestEntrySummary />
            </Link>
          </div>
          <div className=" w-full px-1.5 pb-3">
            <DiceTossButton
              canTossDiceAfter={
                user?.canTossDiceAfter
                  ? new Date(user.canTossDiceAfter)
                  : undefined
              }
              isDiceTossForbidden={user?.isUserDiceTossForbidden}
              onClick={() => {
                mutation.mutate();
              }}
              setisSidebarShowing={() => setisSidebarShowing(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServicePage() {
  const [isSidebarShowing, setisSidebarShowing] = useState(false);

  return (
    <div className="custom-h-screen w-screen flex relative overflow-x-hidden">
      <div
        className={`custom-h-screen px-3 p-3 flex-col gap-1 md:gap-2 flex-shrink-0 flex md:relative absolute w-screen ${
          !isSidebarShowing ? ' -right-[100vw]' : 'right-0'
        } z-30 bg-gray-100 md:bg-white dark:md:bg-black dark:bg-zinc-900 transition-[right] drop-shadow-none md:right-auto md:w-auto`}
      >
        <div className="font-bold tracking-tight pl-2 text-center md:text-left hidden md:block">
          <div className="text-5xl w-fit">
            <WordmarkComponent />
          </div>
          {import.meta.env.VITE_WEB_VERSION_KIND !== 'prod' && (
            <div>
              <a className="hover:underline " href="https://www.mini-dice.com">
                공식 서비스로 돌아가기
              </a>
            </div>
          )}
        </div>
        <div className="md:bg-gray-100 dark:md:bg-black md:rounded-3xl mt-24 md:mt-auto pt-6 px-0 p-3 pb-60 md:px-3 md:pt-3 md:pb-3 h-full overflow-y-auto md:w-96 flex flex-col gap-3 md:dark:border md:dark:border-zinc-800 box-border">
          <ConnectWithOauthWidget />
          <ProfileWidget />
          <CoupangAdWidget />
          <WalletWidget />
          <UpdatesWidget />
          <FooterWidgetComponent />
        </div>
      </div>
      <Ingame
        isSidebarShowing={isSidebarShowing}
        setisSidebarShowing={setisSidebarShowing}
      />
    </div>
  );
}
