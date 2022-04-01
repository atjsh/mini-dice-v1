import { useEffect, useRef, useState } from 'react';
import { ConnectWithOauthWidget } from '../components/connect-with-oauth/connect-with-oauth.component';
import { DiceTossButton } from '../components/dice-toss-button/dice-toss-button.component';
import { useDisplayingMessages } from '../components/displaying-messages/use-displaying-messages.hook';
import { FooterWidgetComponent } from '../components/footer-widget/footer-widget.component';
import { MapStatusBar } from '../components/map/map-status-bar.component';
import { ProfileWidget } from '../components/profile/profile-widget.component';
import { WalletWidget } from '../components/wallet/wallet-widget.component';
import { WordmarkComponent } from '../components/wordmark/wordmark.component';
import { useDiceToss, useUser } from '../libs';

const Messages = ({ messages }: { messages: any[] }) => {
  const messagesEndRef: any = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })!;
  };
  useEffect(scrollToBottom, [messages]);

  return (
    <div className="px-5 flex-grow md:pb-0 pb-52">
      {messages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
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
  const { displayingMessages } = useDisplayingMessages();

  return (
    <div
      className={`custom-h-screen flex-1 overflow-y-auto transition-colors duration-300 ${
        isSidebarShowing
          ? ' bg-gray-300 dark:bg-zinc-800'
          : 'bg-white dark:bg-black'
      } md:bg-white md:dark:bg-black md:transition-none`}
    >
      <div className="sticky top-0 box-content w-auto p-3 justify-center flex flex-col md:flex-row pr-0 backdrop-blur-lg bg-white dark:bg-black bg-opacity-75 backdrop-filter gap-3 border-b md:border-b-0 z-20">
        <div className="md:hidden text-center tracking-tighter text-2xl font-bold">
          Mini Dice
        </div>
        <div className="flex gap-x-3 items-center text-sm md:text-xl max-w-5xl w-full">
          <div className="md:text-3xl text-base">🗺</div>
          <MapStatusBar />
        </div>
      </div>
      <div className="mx-auto my-0 max-w-5xl">
        <div className=" px-3">
          <div className="text-center bg-blue-100 dark:bg-slate-600 w-fit mx-auto rounded-2xl py-3 px-6 my-5">
            <p className="text-xl">
              "🎲 주사위 굴리기" 버튼을 계속 눌러 게임을 진행하세요!
            </p>
          </div>
        </div>
        <Messages messages={displayingMessages} />

        <div className="md:p-7 p-3 text-center md:sticky fixed w-full bottom-0 mt-4 backdrop-blur-lg bg-white dark:bg-black bg-opacity-25 dark:bg-opacity-50 backdrop-filter pt-3 pb-15 z-40 flex flex-col gap-3">
          <div className=" md:hidden">
            <button
              onClick={() => {
                setisSidebarShowing(!isSidebarShowing);
              }}
              className={`${
                isSidebarShowing == false
                  ? 'border-gray-300 bg-white hover:bg-gray-100 active:bg-gray-300 text-black dark:border-gray-600  dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:active:bg-zinc-600 dark:text-white'
                  : ' border-gray-600  bg-gray-900 hover:bg-gray-700 active:bg-gray-500 text-white dark:border-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-500 dark:text-white'
              } border-2 px-4 py-2 rounded-xl transition duration-150 text-base font-semibold select-none transform active:scale-95`}
            >
              💵{' '}
              {`${BigInt(user?.cash ?? 0).toLocaleString('en-us', {
                style: 'currency',
                currency: 'KRW',
              })}`}
            </button>
          </div>
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
  );
}

export function ServicePage() {
  const [isSidebarShowing, setisSidebarShowing] = useState(false);

  return (
    <div className="custom-h-screen w-screen flex relative overflow-x-hidden">
      <div
        className={`custom-h-screen px-3 p-2 flex-col gap-1 md:gap-3  flex-shrink-0 flex md:relative absolute w-screen ${
          isSidebarShowing == false ? ' -right-[100vw]' : 'right-0'
        } z-30 bg-gray-100 md:bg-white dark:md:bg-black dark:bg-zinc-800 drop-shadow-2xl md:drop-shadow-none transition-[right] duration-300 md:right-auto md:w-auto bg-opacity-90`}
      >
        <WordmarkComponent />

        <div className="md:bg-gray-100 dark:md:bg-black rounded-3xl px-3 h-full overflow-y-auto md:w-96 p-3 flex flex-col gap-3 pb-48 md:pb-3">
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
