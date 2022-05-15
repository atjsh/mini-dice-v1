import {
  KoreanWordmarkComponent,
  WordmarkComponent,
} from '../components/wordmark/wordmark.component';
import { ServiceLayout } from '../layouts/service.layout';

export function IndexSkeletonPage() {
  return (
    <ServiceLayout hideFooter={true}>
      <div className=" flex flex-col gap-10">
        <div className="text-center">
          <div className="text-4xl mb-6 tracking-widest">🎲🗺💵</div>
          <div className="flex-col flex gap-1">
            <h1 className="text-4xl md:text-6xl font-extrabold">
              <WordmarkComponent />
            </h1>
            <h2 className=" self-center mt-5 text-base md:text-xl">
              주사위를 굴리며 맵을 모험하고 <br /> 코인을 벌어 순위에 오르세요.
              <br />
              <br />
            </h2>
          </div>
        </div>
        <div className=" flex flex-col text-center gap-5"></div>
      </div>
    </ServiceLayout>
  );
}
