import { Link } from 'react-router-dom';
import { UpdatesPageURL } from '../../pages/routes';
import { getNewestEntryDetail } from '../../pages/Updates.page';

export function UpdatesWidget() {
  const { title, dateFormatDistance } = getNewestEntryDetail();

  return (
    <div className="bg-white dark:md:bg-zinc-800 dark:bg-black px-4 py-5 rounded-3xl">
      <div className="flex gap-2 md:gap-4 flex-col">
        <div className="text-2xl md:text-4xl font-bold">🎙️ 새로운 소식</div>
        <Link
          to={UpdatesPageURL}
          className="text-black dark:text-white hover:underline"
        >
          {title}
          <br />
          <span className=" opacity-50">🕒 {dateFormatDistance}</span>
        </Link>
      </div>
    </div>
  );
}
