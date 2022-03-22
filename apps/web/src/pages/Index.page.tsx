import { Link } from 'react-router-dom';
import { useUser } from '../libs';
import { LinkArrowImage } from '../components/link-arrow/link-box.component';
import { ProfilePageURL } from './routes';

const linkBoxCommonStyle =
  'rounded-xl w-96 max-w-full h-60 relative font-bold transition-colors mr-2';

export function IndexPage() {
  const { data, isLoading } = useUser();

  return (
    <div className="bg-gray-100 w-screen h-screen">
      <div className="max-w-5xl mx-auto px-3">
        <h1 className="text-6xl font-bold py-16">Mini Dice</h1>
        <div>
          <Link to="/service" className="w-min inline-block">
            <div
              className={`${linkBoxCommonStyle} bg-white hover:bg-blue-500 hover:text-white`}
            >
              <div className="absolute left-4 top-4 text-3xl">🎲🗺 인생게임</div>
              <div className="absolute bottom-14 right-4 text-xs font-normal">
                주사위로 전 세계를 탐험하며 돈을 벌어 보세요.
              </div>
              <div className="absolute bottom-4 right-4 text-lg">
                시작하기 {LinkArrowImage}
              </div>
            </div>
          </Link>
          <hr className="my-6 border-gray-300" />
          {isLoading ? (
            ''
          ) : (
            <Link to={ProfilePageURL} className="w-min inline-block">
              <div
                className={`${linkBoxCommonStyle} bg-white hover:bg-red-500 hover:text-white`}
              >
                <div className="absolute left-4 top-4 text-3xl">
                  🤖 프로필 ({data?.username})
                </div>
                <div className="absolute top-20 left-4">
                  <div>잔고</div>
                  <div className="text-4xl">{data?.cash}</div>
                </div>

                <div className="absolute bottom-4 right-4 text-lg">
                  {LinkArrowImage}
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
