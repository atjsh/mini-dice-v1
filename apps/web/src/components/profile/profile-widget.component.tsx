import { Link } from 'react-router-dom';
import { useUser } from '../../libs';
import { LogoutPageURL } from '../../pages/routes';

export const ProfileWidget: React.FC = () => {
  const { data: user } = useUser();

  return (
    <div>
      {user ? (
        <div className="flex gap-4 flex-col bg-white px-4 py-5 rounded-3xl">
          <div className=" w-24">
            <img
              src={new URL('~/src/assets/logo512.png', import.meta.url).href}
              className="border-png"
              alt=""
            />
          </div>
          <div className="flex flex-col gap-2 justify-center">
            <div className="font-bold text-xl break-all">@{user.username}</div>
            <div className="font-bold text-base text-gray-500">
              {new Date(user.createdAt).toLocaleDateString('ko-kr')} 시작
            </div>
            <details className="300 rounded-lg bg-gray-100">
              <summary className="cursor-pointer text-sm font-bold p-2 hover:bg-gray-200 active:bg-gray-300 transition-colors bg-white rounded-lg border-gray-300 border hover:border-gray-400">
                설정
              </summary>
              <div className=" p-3 ">
                <ul className="flex flex-col gap-3 list-disc pl-3">
                  <li>
                    <Link to={LogoutPageURL} className="underline text-red-500">
                      로그아웃
                    </Link>
                  </li>
                </ul>
              </div>
            </details>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
