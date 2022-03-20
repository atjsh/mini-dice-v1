import { useUser } from '../../libs';

export const ProfileWidget: React.FC = () => {
  const { data: user } = useUser();

  return (
    <div>
      {user ? (
        <div className="flex gap-4 p-5">
          <div className="w-36">
            <img src="/logo512.png" className="border-png" alt="" />
          </div>
          <div className="flex flex-col gap-2 justify-center pr-4">
            <div className="font-bold text-lg">@{user.username}</div>
            <div className="font-bold text-xs text-gray-500">
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
