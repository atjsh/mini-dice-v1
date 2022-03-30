import { Link } from 'react-router-dom';
import { ServiceLayout } from '../layouts/service.layout';
import { useTerminateUser } from '../libs/tdol-server/profile/use-terminate-user.hook';
import { IndexPageURL } from './routes';

export function TerminatePage() {
  const terminateUserMutation = useTerminateUser();

  return (
    <ServiceLayout>
      <div className=" max-w-4xl px-3 self-center m-auto">
        <div className=" mb-10">
          <Link
            className=" text-lg text-blue-500 hover:underline p-6 inline-block pl-0"
            to={IndexPageURL}
          >
            ← Mini Dice로 돌아가기
          </Link>
          <h1 className=" text-4xl font-bold">회원 탈퇴</h1>
        </div>
        <div>
          <p className=" text-lg font-bold mb-5">
            정말로 <span className=" text-red-500">회원 탈퇴</span>하시겠습니까?
            <ul className="list-disc pl-6">
              <li>회원 탈퇴 시, 기존 계정에 로그인할 수 없게 됩니다.</li>
              <li>코인과 보유 주식이 무효화됩니다.</li>
            </ul>
          </p>

          <div
            className="inline-block text-xl text-red-500 hover:underline cursor-pointer"
            onClick={() => {
              if (confirm('정말로 탈퇴하시겠습니까?')) {
                if (
                  confirm(
                    '확인 버튼을 누르면 정말로 탈퇴가 시작됩니다. 아니라면 취소를 누르거나 창을 닫아주세요.',
                  )
                ) {
                  terminateUserMutation.mutate({} as unknown as void, {
                    onSuccess: () => {
                      alert('탈퇴가 완료되었습니다.');
                      location.href = '/';
                    },
                  });
                } else {
                  location.href = '/';
                }
              } else {
                location.href = '/';
              }
            }}
          >
            탈퇴하기 →
          </div>
        </div>
      </div>
    </ServiceLayout>
  );
}
