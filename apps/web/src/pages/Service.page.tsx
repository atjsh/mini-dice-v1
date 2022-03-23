import { useEffect, useRef } from 'react';
import { DiceTossButton } from '../components/dice-toss-button/dice-toss-button.component';
import { useDisplayingMessages } from '../components/displaying-messages/use-displaying-messages.hook';
import { MapStatusBar } from '../components/map/map-status-bar.component';
import { ProfileWidget } from '../components/profile/profile-widget.component';
import { WalletWidget } from '../components/wallet/wallet-widget.component';
import { WordmarkComponent } from '../components/wordmark/wordmark.component';
import { useDiceToss, useSkillLogs, useUser } from '../libs';

const Messages = ({ messages }: { messages: any[] }) => {
  const messagesEndRef: any = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })!;
  };
  useEffect(scrollToBottom, [messages]);

  return (
    <div className="px-5 flex-grow">
      {messages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export function Ingame() {
  const { data: logs } = useSkillLogs();
  const { data: user } = useUser();
  const mutation = useDiceToss();
  const { displayingMessages, initExposedSkillLogs } = useDisplayingMessages();

  useEffect(() => {
    if (logs) {
      initExposedSkillLogs(logs);
    }
  }, [logs]);

  return (
    <div className="flex-1 overflow-y-auto h-screen">
      <div className="sticky top-0 box-content w-auto p-5 justify-center flex pr-0 bg-white">
        <div className="flex gap-x-3 items-center text-xl max-w-5xl w-full">
          <div className="text-3xl">🗺</div>
          <MapStatusBar />
        </div>
      </div>
      <div className="mx-auto my-0 max-w-5xl">
        <Messages messages={displayingMessages} />

        <div className="p-7 text-center sticky bottom-0 mt-4 backdrop-blur-lg bg-white bg-opacity-25 backdrop-filter pt-3 pb-15">
          <DiceTossButton
            canTossDiceAfter={
              user?.canTossDiceAfter
                ? new Date(user.canTossDiceAfter)
                : undefined
            }
            isDiceTossForbidden={user?.isUserDiceTossForbidden}
            onClick={() => mutation.mutate()}
          />
        </div>
      </div>
    </div>
  );
}

export function ServicePage() {
  return (
    <div className="w-screen h-screen bg-white text-black flex">
      <div className="px-3 p-2 flex flex-col gap-3 h-screen flex-shrink-0">
        <WordmarkComponent />

        <div className="bg-gray-100 rounded-3xl px-3 h-full overflow-y-auto">
          <ProfileWidget />
          <WalletWidget />
        </div>
      </div>
      <Ingame />
    </div>
  );
}
