export const FooterWidgetComponent: React.FC = () => (
  <div className="self-center mb-10 flex flex-col gap-3 max-w-7xl px-2">
    <hr />
    <div className="flex gap-3">
      <a className="hover:underline" href="">
        개인정보 처리방침
      </a>
      <a className="hover:underline" href="">
        이용약관
      </a>
      <a className="hover:underline" href="mailto:lifegame2021team@gmail.com">
        문의(이메일)
      </a>
    </div>
    <div className="text-gray-400">
      Copyright © 2022 Mini Dice Team. All rights reserved. <br />
    </div>
  </div>
);
