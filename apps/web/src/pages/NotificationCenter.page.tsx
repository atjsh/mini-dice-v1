import { Link } from 'react-router-dom';
import { NotificationPlainMessage } from '../components/skill-log-message/rendered-skill-log-messages.component';
import { ServiceLayout } from '../layouts/service.layout';
import { useNotifications } from '../libs';
import { IndexPageURL } from './routes';

export function NotificationPage() {
  const { data: notifications } = useNotifications();

  return (
    <ServiceLayout>
      <div className="self-center px-3 max-w-5xl m-auto">
        <div className="">
          <Link
            className=" text-lg text-blue-500 hover:underline"
            to={IndexPageURL}
          >
            ← Mini Dice로 돌아가기
          </Link>
          <h1 className=" text-4xl font-bold">알림 센터</h1>
        </div>
        <div className="mt-4 flex flex-col p-3 dark:bg-zinc-900 rounded-3xl">
          {notifications?.map((notification) => (
            <NotificationPlainMessage plainMessage={notification} />
          ))}
        </div>
      </div>
    </ServiceLayout>
  );
}
