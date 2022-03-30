import { Link } from 'react-router-dom';
import { ServiceLayout } from '../layouts/service.layout';
import { IndexPageURL } from './routes';

export function FourOhFourPage() {
  return (
    <ServiceLayout>
      <div className=" text-center">
        <h1 className=" text-xl">404</h1>
        <p className=" text-4xl">Page not found</p>
        <p className="text-4xl">페이지를 찾을 수 없음</p>
        <Link
          className="text-2xl text-blue-500 hover:underline mt-10 block p-4"
          to={IndexPageURL}
        >
          ← Mini Dice로 돌아가기
        </Link>
      </div>
    </ServiceLayout>
  );
}
