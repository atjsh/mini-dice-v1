import { useServerHealth } from '../../libs/tdol-server/server-health/use-server-health.hook';

export const HealthCheckComponent: React.FC = () => {
  const { data: isServerOn, isLoading } = useServerHealth();
  return isLoading == false && isServerOn != false ? (
    <></>
  ) : (
    <div className=" bg-yellow-500 text-center text-black font-bold px-6 py-2 text-base w-fit block mx-auto my-3 rounded-2xl cursor-default select-none">
      서버 준비 중입니다. <br /> 로그인 등의 기능이 동작하지 않을 수 있습니다.
    </div>
  );
};
