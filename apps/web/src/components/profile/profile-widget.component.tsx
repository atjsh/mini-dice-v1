import { useUser } from '../../libs';

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
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
