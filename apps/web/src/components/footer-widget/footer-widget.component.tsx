import { strEllipsis } from '@packages/shared-types';
import { Link } from 'react-router-dom';
import { useAccessToken } from '../../libs';
import {
  IndexPageURL,
  LogoutPageURL,
  NotificationPageURL,
  PrivacyPolicyPageURL,
  RankingPgaeURL,
  TerminatePageURL,
  TermsPageURL,
  UpdatesPageURL,
} from '../../pages/routes';

interface FooterLinkSpec {
  type: 'internal' | 'external';
  link: string;
  label: string;
  openInNewPage?: boolean;
}

interface FooterLinkGroupSpec {
  label: string;
  links: FooterLinkSpec[];
  isHidden?: boolean;
}

const FooterLink: React.FC<FooterLinkSpec> = ({
  type,
  link,
  label,
  openInNewPage,
}) =>
  type === 'internal' ? (
    <Link className="hover:underline" to={link}>
      {label}
    </Link>
  ) : (
    <a
      className="hover:underline"
      href={link}
      target={
        openInNewPage != undefined && openInNewPage == false
          ? '_parent'
          : '_blank'
      }
    >
      {label}
    </a>
  );

const FooterLinkGroup: React.FC<FooterLinkGroupSpec> = ({
  label,
  links,
  isHidden,
}) =>
  isHidden ? null : (
    <div className={`flex gap-y-1 flex-col`}>
      <div className="font-bold select-none text-zinc-400 dark:text-zinc-500">
        {label}
      </div>
      <div className="flex gap-x-5 gap-y-3 flex-wrap">
        {links.map((link) => (
          <FooterLink key={`${link.link}${link.label}`} {...link} />
        ))}
      </div>
    </div>
  );

export const FooterWidgetComponent: React.FC = () => {
  const { data: accessToken } = useAccessToken();

  const footerLinkGroupData: FooterLinkGroupSpec[] = [
    {
      label: '서비스',
      links: [
        {
          label: 'Mini Dice',
          link: IndexPageURL,
          type: 'external',
          openInNewPage: false,
        },
        {
          label: '순위',
          link: RankingPgaeURL,
          type: 'internal',
        },
        { label: '알림 센터', link: NotificationPageURL, type: 'internal' },
        {
          label: '새로운 소식',
          link: UpdatesPageURL,
          type: 'internal',
        },
      ],
    },
    {
      label: '외부 링크',
      links: [
        {
          label: '커뮤니티(디스코드)↗',
          link: 'https://discord.gg/2dhUGXwmBq',
          type: 'external',
        },
        {
          label: '트위터↗',
          link: 'https://twitter.com/TeamMiniDice',
          type: 'external',
        },
        // {
        //   label: '서버비용 후원(토스)↗',
        //   link: 'https://toss.me/%EB%AF%B8%EB%8B%88%EB%8B%A4%EC%9D%B4%EC%8A%A4',
        //   type: 'external',
        // },
      ],
    },
    {
      label: '관리',
      isHidden: accessToken ? false : true,
      links: [
        {
          label: '로그아웃',
          link: LogoutPageURL,
          type: 'internal',
        },
        {
          label: '회원탈퇴',
          link: TerminatePageURL,
          type: 'internal',
        },
      ],
    },
    {
      label: '정보',
      links: [
        {
          label: '개인정보 처리방침',
          link: PrivacyPolicyPageURL,
          type: 'internal',
        },
        {
          label: '이용약관',
          link: TermsPageURL,
          type: 'internal',
        },
        {
          label: '문의(이메일)↗',
          link: 'mailto:lifegame2021team@gmail.com',
          type: 'external',
        },
        {
          label: '제휴 및 광고 문의(이메일)↗',
          link: 'mailto:lifegame2021team@gmail.com',
          type: 'external',
        },
      ],
    },
    {
      label: '서버 선택',
      links: [
        {
          label: 'Mini Dice (공식 서비스)',
          link: 'https://www.mini-dice.com',
          type: 'external',
        },
        {
          label: 'Mini Dice Beta (베타 서비스, 불안정할 수 있음)',
          link: 'https://beta.mini-dice.com',
          type: 'external',
        },
      ],
    },
  ];

  return (
    <div className="self-center mb-10 flex flex-col gap-5 max-w-7xl px-2 text-sm md:text-base">
      <hr className=" border-gray-300" />
      {footerLinkGroupData.map((group) => (
        <FooterLinkGroup key={group.label} {...group} />
      ))}
      <div className="text-gray-400">
        일러스트 및 이미지 저작권 © Miyobi (미요비). 모든 권리 보유.
        <br /> Mini Dice 저작권 © 2022 Mini Dice Team. 모든 권리 보유.
      </div>
    </div>
  );
};
