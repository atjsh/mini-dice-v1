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
    <div className=" w-full md:flex justify-center hidden">
      <CoupangAdIFrame />
    </div>
  );
}
