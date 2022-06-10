import { Link } from 'react-router-dom';
import { NotificationPlainMessage } from '../components/skill-log-message/rendered-skill-log-messages.component';
import { ServiceLayout } from '../layouts/service.layout';
import { useNotifications } from '../libs';
import { IndexPageURL } from './routes';

export function NotificationPage() {
  const { data: notifications, isLoading } = useNotifications();

  return (
    <ServiceLayout>
      <div className="self-center max-w-lg m-auto">
        <div className=" flex flex-col gap-2">
          <Link
            className=" text-lg text-blue-500 hover:underline"
            to={IndexPageURL}
          >
            ← Mini Dice로 돌아가기
          </Link>
          <h1 className=" text-4xl font-bold">알림 센터</h1>
        </div>
        <div className="mt-4 flex flex-col gap-3 items-center">
          {notifications && notifications?.length > 0 ? (
            notifications?.map((notification) => (
              <NotificationPlainMessage notificationMessage={notification} />
            ))
          ) : isLoading ? (
            <></>
          ) : (
            <div>알림 없음</div>
          )}
        </div>
      </div>
    </ServiceLayout>
  );
}
