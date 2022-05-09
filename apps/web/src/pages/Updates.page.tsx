import { Link } from 'react-router-dom';
import { ServiceLayout } from '../layouts/service.layout';
import { IndexPageURL } from './routes';
import { formatDistance } from 'date-fns';
import { ko } from 'date-fns/locale';

const Entry: React.FC<{
  emoji?: string;
  title: string;
  author: string;
  date: Date;
  updates: string[];
}> = ({ emoji, title, author, date, updates }) => {
  return (
    <div className=" border-b-zinc-500 border-b py-6 last:border-b-0 flex flex-col">
      <div className=" text-7xl">{emoji}</div>
      <h2 className="text-2xl font-bold my-2">{title}</h2>
      <p className=" text-sm text-zinc-500 my-3">
        {date.toLocaleString('ko-KR', {
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })}{' '}
        (
        {formatDistance(new Date(date), new Date(), {
          locale: ko,
          addSuffix: true,
        })}
        )
      </p>
      <ul className="list-disc ml-10">
        {updates.map((update) => (
          <li key={update}>{update}</li>
        ))}
      </ul>
    </div>
  );
};

const entries: {
  emoji?: string;
  title: string;
  author: string;
  date: Date;
  updates: string[];
}[] = [
  {
    emoji: '👋',
    title: "이제 '새로운 소식'이 제공됩니다",
    author: 'ATJSH',
    date: new Date('2022-05-06T22:18:00+09:00'),
    updates: [
      '새로운 소식들이 이 페이지를 통해 공지됩니다.',
      '오늘은 "기부" 칸을 제작 중입니다. 다음 업데이트를 기대해 주세요.',
    ],
  },
  {
    emoji: '🗺️',
    title: "'일확천금 노리기' 외 1개의 칸이 새로 추가되었습니다",
    author: 'ATJSH',
    date: new Date('2022-05-07T23:55:00+09:00'),
    updates: [
      "'기부', '일확천금 노리기' 칸이 추가되었습니다. 유저들이 방문할 때마다 돈이 쌓이며 제때 칸에 방문하면 쌓인 돈을 가져갈 수 있습니다.",
      "현재 '동전 던지기 중급', '동전 던지기 고급' 칸을 제작 중입니다. 다음 업데이트를 기대해 주세요.",
    ],
  },
  {
    emoji: '🤯',
    title: "'책을 내다', '게임개발' 칸을 새로 꾸몄습니다",
    author: 'ATJSH',
    date: new Date('2022-05-08T17:37:00+09:00'),
    updates: [
      "'책을 내다' 칸에서 출판되는 책의 제목들을 재미나게 바꾸었습니다. 모두 Dogdrip.net 웹사이트 회원님들의 댓글로부터 영감을 받았습니다. 모두 참여해주셔서 감사합니다.",
      "마찬가지로 '게임개발' 칸에서 개발되는 게임들의 이름을 재미나게 바꾸었습니다.",
    ],
  },
  {
    emoji: '🧑‍🚒',
    title: "'화재' 칸을 개선했습니다",
    author: 'ATJSH',
    date: new Date('2022-05-09T21:28:00+09:00'),
    updates: [
      "'화재' 칸에서 잃을 수 있는 금액의 양을 줄였습니다.",
      "그래도 '화재' 칸을 주의하세요! 화재 칸은 여전히 치명적입니다. 하지만 화재는 보유중인 주식에 영향을 끼치지 않으니, 이에 따라서 전략적으로 자산을 운용하세요.",
    ],
  },
].reverse();

export function UpdatesPage() {
  return (
    <ServiceLayout>
      <div className="max-w-4xl self-center px-3 m-auto">
        <div className=" mb-10">
          <Link
            className=" text-lg text-blue-500 hover:underline"
            to={IndexPageURL}
          >
            ← Mini Dice로 돌아가기
          </Link>
          <h1 className=" text-4xl font-bold">새로운 소식</h1>
        </div>
        {entries.length === 0 ? (
          <div className=" text-2xl text-zinc-500">
            아직 알려드릴 새로운 소식이 없습니다. 나중에 다시 들러 주세요!
          </div>
        ) : (
          entries.map((entry) => <Entry key={entry.title} {...entry} />)
        )}
      </div>
    </ServiceLayout>
  );
}

export const NewestEntrySummary: React.FC = () => {
  const lastEntry = entries[0];
  return (
    <>
      {lastEntry.title}{' '}
      <span className=" opacity-50 ml-2 whitespace-nowrap">
        {formatDistance(new Date(lastEntry.date), new Date(), {
          locale: ko,
          addSuffix: true,
        }).toString()}{' '}
        게시됨
      </span>
    </>
  );
};
