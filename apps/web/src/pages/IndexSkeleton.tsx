import { ServiceLayout } from '../layouts/service.layout';

export function IndexSkeletonPage() {
  return (
    <ServiceLayout hideFooter={true}>
      <div className=" flex flex-col gap-10">
        <div className="text-center">
          <div className="text-4xl mb-6 tracking-widest">🎲🗺💵</div>
          <div className="flex-col flex gap-1">
            <h1 className="text-5xl font-bold">Mini Dice</h1>
            <div className="font-medium text-base">인생게임</div>
            <div className=" self-center mt-5 text-xl">
              주사위를 굴리며 맵을 모험하고 <br /> 코인을 벌어 랭킹에 오르세요.
            </div>
          </div>
        </div>
        <div className=" flex flex-col text-center gap-5"></div>
      </div>
    </ServiceLayout>
  );
}
