import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ConnectWithOauthWidget } from '../components/connect-with-oauth/connect-with-oauth.component';
import { DiceTossButton } from '../components/dice-toss-button/dice-toss-button.component';
import { FooterWidgetComponent } from '../components/footer-widget/footer-widget.component';
import { currentSkillRouteAtom } from '../components/map/current-skill-route.atom';
import { MapStatusBar } from '../components/map/map-status-bar.component';
import { ProfileWidget } from '../components/profile/profile-widget.component';
import { skillLogMessagesState } from '../components/skill-log-message/atoms/skill-log-messages.atom';
import { RenderedSkillLogMessages } from '../components/skill-log-message/rendered-skill-log-messages.component';
import { useSkillLogMessages } from '../components/skill-log-message/use-skill-log-messages.hook';
import { WalletWidget } from '../components/wallet/wallet-widget.component';
import {
  KoreanWordmarkComponent,
  WordmarkComponent,
} from '../components/wordmark/wordmark.component';
import { useDiceToss, useSkillLogs, useUser } from '../libs';

const Messages = () => {
  const skillLogMessages = useRecoilValue(skillLogMessagesState);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef!.current!.scrollIntoView({ behavior: 'smooth' })!;
  };
  useEffect(scrollToBottom, [skillLogMessages.length]);

  return (
    <div className="px-5 flex-grow md:pb-0 custom-min-h-screen">
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
  const [currentSkillRoute, setCurrentSkillRoute] = useRecoilState(
    currentSkillRouteAtom,
  );

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
  }, [skillLogs]);

  return (
    <div
      className={` flex-1 overflow-y-auto transition-colors duration-300 ${
        isSidebarShowing
          ? ' bg-gray-300 dark:bg-zinc-800'
          : 'bg-white dark:bg-black'
      } md:bg-white md:dark:bg-black md:transition-none`}
    >
      <div className="mx-auto my-0 max-w-7xl">
        <div className=" px-3">
          <div className="text-center bg-blue-100 dark:bg-slate-600 w-fit mx-auto rounded-2xl py-3 px-6 my-5">
            <p className="text-xl">
              "🎲 주사위 굴리기" 버튼을 계속 눌러 진행하세요!
            </p>
          </div>
        </div>
        <Messages />

        <div className="md:p-3 p-3 pt-3 pb-15 text-center sticky w-full bottom-0 mt-4 backdrop-blur-lg bg-white dark:bg-black bg-opacity-25 dark:bg-opacity-50 backdrop-filter z-40 flex flex-col gap-3 border-t dark:border-zinc-800 border-gray-300">
          <div className="flex gap-x-3 items-start max-w-7xl w-full">
            <MapStatusBar />
          </div>
          <div className=" ">
            <button
              onClick={() => {
                setisSidebarShowing(!isSidebarShowing);
              }}
              className={`${
                !isSidebarShowing
                  ? 'border-gray-300 bg-zinc-100 hover:bg-gray-200 active:bg-gray-400 text-black dark:border-gray-600  dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:active:bg-zinc-600 dark:text-white'
                  : ' border-gray-600  bg-gray-900 hover:bg-gray-700 active:bg-gray-500 text-white dark:border-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-500 dark:text-white'
              } border-2 px-4 py-2 rounded-2xl transition duration-150 text-base font-semibold select-none transform active:scale-95  md:hidden`}
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
                  })}`}{' '}
              | <span className=" whitespace-nowrap">자산 더보기</span>
            </button>
            <div className="px-4 py-2 rounded-2xl text-base font-semibold select-none md:inline-block bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white hidden">
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
            </div>
            <div className=" mb-3"></div>
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
        className={`custom-h-screen px-3 p-2 flex-col gap-1 md:gap-3  flex-shrink-0 flex md:relative absolute w-screen ${
          !isSidebarShowing ? ' -right-[100vw]' : 'right-0'
        } z-30 bg-gray-100 md:bg-white dark:md:bg-black dark:bg-zinc-800 transition-[right] drop-shadow-2xl md:drop-shadow-none md:right-auto md:w-auto bg-opacity-90`}
      >
        <div className="font-bold tracking-tight select-none pt-3 text-center md:text-left md:pl-3 md:pt-3">
          <div className="text-4xl md:text-4xl">
            <KoreanWordmarkComponent />
          </div>
          <div className="text-2xl md:text-2xl">
            <WordmarkComponent />
          </div>
        </div>
        <div className="md:bg-gray-100 dark:md:bg-black rounded-3xl px-3 h-full overflow-y-auto md:w-96 p-3 flex flex-col gap-3 pb-60 md:pb-3 md:dark:border md:dark:border-zinc-800 box-border ">
          <ConnectWithOauthWidget />
          <WalletWidget />
          <ProfileWidget />
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
