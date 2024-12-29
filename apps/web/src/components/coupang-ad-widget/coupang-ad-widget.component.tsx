// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
function CoupangAdIFrame() {
  return (
    <>
      <iframe
        src="https://ads-partners.coupang.com/widgets.html?id=828013&template=carousel&trackingCode=AF9847023&subId=&width=340&height=110&tsource="
        width="340"
        height="110"
        frameBorder="0"
        scrolling="no"
        referrerPolicy="unsafe-url"
        browsingtopics="true"
      ></iframe>
    </>
  );
}

export function CoupangAdWidget() {
  return (
    <div className=" w-full md:flex justify-center hidden flex-col gap-1 select-none">
      <div className=" text-xs break-all text-left text-gray-600 dark:text-gray-400 ">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를
        제공받습니다.
      </div>
      <CoupangAdIFrame />
    </div>
  );
}
