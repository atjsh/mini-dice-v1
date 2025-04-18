import { Link } from 'react-router-dom';
import { ServiceLayout } from '../layouts/service.layout';
import { IndexPageURL } from './routes';

function SectionHeader({ children }: { children: React.ReactNode }) {
  return <h2 className=" text-3xl mt-8 mb-4">{children}</h2>;
}

function SectionBody({ children }: { children: React.ReactNode }) {
  return <p className=" my-3">{children}</p>;
}

function SectionList({
  children,
  ordered,
}: {
  children: React.ReactNode;
  ordered?: boolean;
}) {
  return ordered ? (
    <ol className=" list-decimal ml-4">{children}</ol>
  ) : (
    <ul className=" list-disc ml-4">{children}</ul>
  );
}

function SectionListItem({ children }: { children: React.ReactNode }) {
  return <li className=" ">{children}</li>;
}

export function PrivaryPage() {
  return (
    <ServiceLayout>
      <div className=" max-w-4xl self-center px-3 m-auto">
        <div className=" mb-10">
          <Link
            className=" text-lg text-blue-500 hover:underline"
            to={IndexPageURL}
          >
            ← Mini Dice로 돌아가기
          </Link>
          <h1 className=" text-4xl font-bold">개인정보 처리방침</h1>
        </div>
        <SectionBody>
          <em>Mini Dice Team</em>은 「개인정보 보호법」 제30조에 따라 정보주체의
          개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수
          있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
        </SectionBody>
        <SectionBody>
          이 개인정보처리방침은 2022년 1월 1일부터 적용됩니다.
        </SectionBody>
        <hr />
        <SectionHeader>제1조(개인정보의 처리 목적)</SectionHeader>
        <SectionBody>
          Mini Dice Team은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고
          있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용
          목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의
          동의를 받는 등 필요한 조치를 이행할 예정입니다.
        </SectionBody>
        <SectionList ordered>
          <SectionListItem>
            홈페이지 회원가입 및 관리: 회원자격 유지·관리, 서비스 부정이용 방지
            목적으로 개인정보를 처리합니다.
          </SectionListItem>
          <SectionListItem>
            민원사무 처리 민원인의 신원 확인, 사실조사를 위한 연락·통지 목적으로
            개인정보를 처리합니다.
          </SectionListItem>
          <SectionListItem>
            재화 또는 서비스 제공 서비스 제공, 콘텐츠 제공을 목적으로 개인정보를
            처리합니다.
          </SectionListItem>
        </SectionList>
        <SectionHeader>제2조(개인정보의 처리 및 보유 기간)</SectionHeader>
        <SectionBody>
          ① Mini Dice Team은 법령에 따른 개인정보 보유·이용기간 또는
          정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간
          내에서 개인정보를 처리·보유합니다.
        </SectionBody>
        <SectionBody>
          ② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
        </SectionBody>
        <SectionList ordered>
          <SectionListItem>홈페이지 회원가입 및 관리</SectionListItem>
          <SectionList>
            <SectionListItem>
              홈페이지 회원가입 및 관리 와 관련한 개인정보는 수집.이용에 관한
              동의일로부터 3년까지 위 이용목적을 위하여 보유.이용됩니다.
            </SectionListItem>
            <SectionListItem>보유근거 : 회원정보 유지</SectionListItem>
            <SectionListItem>
              관련법령 : 신용정보의 수집/처리 및 이용 등에 관한 기록 : 3년
            </SectionListItem>
          </SectionList>
        </SectionList>
        <SectionHeader>제3조(개인정보처리 위탁)</SectionHeader>
        <SectionBody>
          ① Mini Dice Team은 원활한 개인정보 업무처리를 위하여 다음과 같이
          개인정보 처리업무를 위탁하고 있습니다.
        </SectionBody>
        <SectionList ordered>
          <SectionListItem>
            위탁받는 자 (수탁자) : AWS(한국)
            <SectionList>
              <SectionListItem>
                위탁하는 업무의 내용 : 개인정보가 저장된 인프라 운영.
              </SectionListItem>
              <SectionListItem>
                위탁기간 : 이용 목적 달성 시 까지
              </SectionListItem>
            </SectionList>
          </SectionListItem>
        </SectionList>
        <SectionBody>
          ② Mini Dice Team은 위탁계약 체결시 「개인정보 보호법」 제26조에 따라
          위탁업무 수행목적 외 개인정보 처리금지, 기술적․관리적 보호조치, 재위탁
          제한, 수탁자에 대한 관리․감독, 손해배상 등 책임에 관한 사항을 계약서
          등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고
          있습니다.
        </SectionBody>
        <SectionBody>
          ③ 위탁업무의 내용이나 수탁자가 변경될 경우에는 지체없이 본 개인정보
          처리방침을 통하여 공개하도록 하겠습니다.
        </SectionBody>
        <SectionHeader>
          제4조(정보주체와 법정대리인의 권리·의무 및 그 행사방법)
        </SectionHeader>
        <SectionBody>
          ① 정보주체는 Mini Dice Team에 대해 언제든지 개인정보
          열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.
        </SectionBody>
        <SectionBody>
          ② 제1항에 따른 권리 행사는 Mini Dice Team에 대해 「개인정보 보호법」
          시행령 제41조제1항에 따라 서면, 전자우편 등을 통하여 하실 수 있으며
          Mini Dice Team은 이에 대해 지체 없이 조치하겠습니다.
        </SectionBody>
        <SectionBody>
          ③ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등
          대리인을 통하여 하실 수 있습니다. 이 경우 “개인정보 처리 방법에 관한
          고시(제2020-7호)” 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.
        </SectionBody>
        <SectionBody>
          ④ 개인정보 열람 및 처리정지 요구는 「개인정보 보호법」 제35조 제4항,
          제37조 제2항에 의하여 정보주체의 권리가 제한 될 수 있습니다.
        </SectionBody>
        <SectionBody>
          ⑤ 개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가 수집
          대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수 없습니다.
        </SectionBody>
        <SectionBody>
          ⑥ Mini Dice Team은 정보주체 권리에 따른 열람의 요구, 정정·삭제의 요구,
          처리정지의 요구 시 열람 등 요구를 한 자가 본인이거나 정당한
          대리인인지를 확인합니다.
        </SectionBody>
        <SectionHeader>제5조(처리하는 개인정보의 항목 작성)</SectionHeader>
        <SectionBody>
          ① Mini Dice Team은 다음의 개인정보 항목을 처리하고 있습니다.
        </SectionBody>
        <SectionList ordered>
          <SectionListItem>
            홈페이지 회원가입 및 관리
            <SectionList>
              <SectionListItem>
                필수항목 : 이메일, 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP
                정보
              </SectionListItem>
            </SectionList>
          </SectionListItem>
        </SectionList>
        <SectionHeader>제6조(개인정보의 파기)</SectionHeader>
        <SectionBody>
          ① Mini Dice Team은 개인정보 보유기간의 경과, 처리목적 달성 등
          개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를
          파기합니다.
        </SectionBody>
        <SectionBody>
          ② 개인정보 파기의 절차 및 방법은 다음과 같습니다.
        </SectionBody>
        <SectionList ordered>
          <SectionListItem>
            파기절차: Mini Dice Team은 파기 사유가 발생한 개인정보를 선정하고,
            Mini Dice Team의 개인정보 보호책임자의 승인을 받아 개인정보를
            파기합니다.
          </SectionListItem>
          <SectionListItem>
            파기방법: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적
            방법을 사용합니다. 종이에 출력된 개인정보는 분쇄기로 분쇄하거나
            소각을 통하여 파기합니다
          </SectionListItem>
        </SectionList>
        <SectionHeader>제7조(개인정보의 안전성 확보 조치)</SectionHeader>
        <SectionBody>
          Mini Dice Team은 개인정보의 안전성 확보를 위해 다음과 같은 조치를
          취하고 있습니다.
        </SectionBody>
        <SectionList ordered>
          <SectionListItem>
            정기적인 자체 감사 실시 개인정보 취급 관련 안정성 확보를 위해
            정기적(분기 1회)으로 자체 감사를 실시하고 있습니다.
          </SectionListItem>
          <SectionListItem>
            해킹 등에 대비한 기술적 대책 Mini Dice Team은 해킹이나 컴퓨터
            바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위하여
            보안프로그램을 설치하고 주기적인 갱신·점검을 하며 외부로부터 접근이
            통제된 구역에 시스템을 설치하고 기술적/물리적으로 감시 및 차단하고
            있습니다.
          </SectionListItem>
          <SectionListItem>
            접속기록의 보관 및 위변조 방지 개인정보처리시스템에 접속한 기록을
            최소 1년 이상 보관, 관리하고 있으며, 다만, 5만명 이상의 정보주체에
            관하여 개인정보를 추가하거나, 고유식별정보 또는 민감정보를 처리하는
            경우에는 2년이상 보관, 관리하고 있습니다. 또한, 접속기록이 위변조 및
            도난, 분실되지 않도록 보안기능을 사용하고 있습니다.
          </SectionListItem>
          <SectionListItem>
            개인정보에 대한 접근 제한 개인정보를 처리하는 데이터베이스시스템에
            대한 접근권한의 부여, 변경, 말소를 통하여 개인정보에 대한 접근통제를
            위하여 필요한 조치를 하고 있으며 침입차단시스템을 이용하여
            외부로부터의 무단 접근을 통제하고 있습니다.
          </SectionListItem>
          <SectionListItem>
            비인가자에 대한 출입 통제 개인정보를 보관하고 있는 물리적 보관
            장소를 별도로 두고 이에 대해 출입통제 절차를 수립, 운영하고
            있습니다.
          </SectionListItem>
        </SectionList>
        <SectionHeader>
          제8조(개인정보 자동 수집 장치의 설치•운영 및 거부에 관한 사항)
        </SectionHeader>
        <SectionBody>
          ① Mini Dice Team은 이용자에게 개별적인 맞춤서비스를 제공하기 위해
          이용정보를 저장하고 수시로 불러오는 ‘쿠키(cookie)’를 사용합니다.
        </SectionBody>
        <SectionBody>
          ② 쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터
          브라우저에게 보내는 소량의 정보이며 이용자들의 PC 컴퓨터내의
          하드디스크에 저장되기도 합니다.
        </SectionBody>
        <SectionList ordered>
          <SectionListItem>
            쿠키의 사용 목적 : 이용자가 방문한 각 서비스와 웹 사이트들에 대한
            방문 및 이용형태, 인기 검색어, 보안접속 여부, 등을 파악하여
            이용자에게 최적화된 정보 제공을 위해 사용됩니다.
          </SectionListItem>
          <SectionListItem>
            쿠키의 설치•운영 및 거부 : 웹브라우저 상단의 도구
            {`>`}인터넷 옵션{`>`}개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을
            거부 할 수 있습니다.
          </SectionListItem>
          <SectionListItem>
            쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수
            있습니다.
          </SectionListItem>
        </SectionList>
        <SectionHeader>제9조 (개인정보 보호책임자)</SectionHeader>
        <SectionBody>
          ① Mini Dice Team은 개인정보 처리에 관한 업무를 총괄해서 책임지고,
          개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여
          아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
        </SectionBody>
        <SectionList>
          <SectionListItem>
            개인정보 보호책임자
            <SectionList>
              <SectionListItem>성명: 전성훈</SectionListItem>
              <SectionListItem>직책: 운영자</SectionListItem>
              <SectionListItem>직급: 운영자</SectionListItem>
              <SectionListItem>
                연락처: lifegame2021team@gmail.com
              </SectionListItem>
            </SectionList>
          </SectionListItem>
        </SectionList>
        <SectionBody>
          ② 정보주체께서는 Mini Dice Team의 서비스(또는 사업)을 이용하시면서
          발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한
          사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. Mini
          Dice Team은 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴
          것입니다.
        </SectionBody>
        <SectionHeader>제10조(권익침해 구제방법)</SectionHeader>
        <SectionBody>
          정보주체는 개인정보침해로 인한 구제를 받기 위하여
          개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에
          분쟁해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타 개인정보침해의
          신고, 상담에 대하여는 아래의 기관에 문의하시기 바랍니다.
        </SectionBody>
        <SectionList ordered>
          <SectionListItem>
            개인정보분쟁조정위원회 : (국번없이) 1833-6972 (www.kopico.go.kr)
          </SectionListItem>
          <SectionListItem>
            개인정보침해신고센터 : (국번없이) 118 (privacy.kisa.or.kr)
          </SectionListItem>
          <SectionListItem>
            대검찰청 : (국번없이) 1301 (www.spo.go.kr)
          </SectionListItem>
          <SectionListItem>
            경찰청 : (국번없이) 182 (ecrm.cyber.go.kr)
          </SectionListItem>
        </SectionList>
        <SectionBody>
          「개인정보보호법」제35조(개인정보의 열람), 제36조(개인정보의
          정정·삭제), 제37조(개인정보의 처리정지 등)의 규정에 의한 요구에 대
          하여 공공기관의 장이 행한 처분 또는 부작위로 인하여 권리 또는 이익의
          침해를 받은 자는 행정심판법이 정하는 바에 따라 행정심판을 청구할 수
          있습니다.
        </SectionBody>
        <SectionBody>
          ※ 행정심판에 대해 자세한 사항은 중앙행정심판위원회(www.simpan.go.kr)
          홈페이지를 참고하시기 바랍니다.
        </SectionBody>
        <SectionHeader>제11조(개인정보 처리방침 변경)</SectionHeader>
        <SectionBody>
          ① 이 개인정보처리방침은 2022년 1월 1부터 적용됩니다.
        </SectionBody>
        {/* <SectionBody>
            ② 이전의 개인정보 처리방침은 아래에서 확인하실 수 있습니다.
          </SectionBody> */}
      </div>
    </ServiceLayout>
  );
}
