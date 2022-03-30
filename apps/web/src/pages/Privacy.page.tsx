import { Link } from 'react-router-dom';
import { ServiceLayout } from '../layouts/service.layout';
import { IndexPageURL } from './routes';

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
        <p>
          <p className="ls2 lh6 bs5 ts4">
            <em className="emphasis">
              -Mini Dice Team-('www.mini-dice.com'이하 'Mini Dice')
            </em>
            은(는) 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를
            보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기
            위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
          </p>
          <p className="ls2">
            ○ 이 개인정보처리방침은 <em className="emphasis">2022</em>년{' '}
            <em className="emphasis">1</em>월 <em className="emphasis">1</em>
            부터 적용됩니다.
          </p>
          <p className="lh6 bs4">
            <strong>
              제1조(개인정보의 처리 목적)
              <br />
              <br />
              <em className="emphasis">
                -Mini Dice Team-('www.mini-dice.com'이하 'Mini Dice')
              </em>
              은(는) 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는
              개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이
              변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를
              받는 등 필요한 조치를 이행할 예정입니다.
            </strong>
          </p>
          <ul className="list_indent2 mgt10">
            <p className="ls2">1. 홈페이지 회원가입 및 관리</p>
            <p className="ls2">
              회원자격 유지·관리, 서비스 부정이용 방지 목적으로 개인정보를
              처리합니다.
            </p>
            <p className="ls2">2. 민원사무 처리</p>
            <p className="ls2">
              민원인의 신원 확인, 사실조사를 위한 연락·통지 목적으로 개인정보를
              처리합니다.
            </p>
            <p className="ls2">3. 재화 또는 서비스 제공</p>
            <p className="ls2">
              서비스 제공, 콘텐츠 제공을 목적으로 개인정보를 처리합니다.
            </p>
          </ul>
          <p className="lh6 bs4">
            <strong>제2조(개인정보의 처리 및 보유 기간)</strong>①{' '}
            <em className="emphasis">-Mini Dice Team-</em>은(는) 법령에 따른
            개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에
            동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.②
            각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
          </p>
          <ul className="list_indent2 mgt10">
            <li className="tt">1. 홈페이지 회원가입 및 관리 </li>
            <li className="tt">
              {' '}
              홈페이지 회원가입 및 관리 와 관련한 개인정보는 수집.이용에 관한
              동의일로부터 3년까지 위 이용목적을 위하여 보유.이용됩니다.
            </li>
            <li>보유근거 : 회원정보 유지</li>
            <li>
              관련법령 : 신용정보의 수집/처리 및 이용 등에 관한 기록 : 3년
            </li>
            <li>예외사유 : </li>
          </ul>
          <p className="lh6 bs4">
            <strong>제3조(개인정보의 제3자 제공)</strong> ①{' '}
            <em className="emphasis">-Mini Dice Team-</em>은(는) 개인정보를
            제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며,
            정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및
            제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
          </p>
          <p className="sub_p mgt10">
            ② <span className="colorLightBlue">-Mini Dice Team-</span>은(는)
            다음과 같이 개인정보를 제3자에게 제공하고 있습니다.
          </p>
          <ul className="list_indent2 mgt10">
            <li className="tt">1. --</li>
            <li>개인정보를 제공받는 자 : </li>
            <li>제공받는 자의 개인정보 이용목적 : </li>
            <li>제공받는 자의 보유.이용기간: </li>
          </ul>
          <p className="lh6 bs4">
            <strong>제4조(개인정보처리 위탁)</strong> ①{' '}
            <em className="emphasis">-Mini Dice Team-</em>은(는) 원활한 개인정보
            업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
          </p>
          <ul className="list_indent2 mgt10">
            <li className="tt">1. --</li>
            <li>위탁받는 자 (수탁자) : </li>
            <li>위탁하는 업무의 내용 : </li>
            <li>위탁기간 : </li>
          </ul>
          <p className="sub_p mgt10">
            ② <span className="colorLightBlue">-Mini Dice Team-</span>은(는)
            위탁계약 체결시 「개인정보 보호법」 제26조에 따라 위탁업무 수행목적
            외 개인정보 처리금지, 기술적․관리적 보호조치, 재위탁 제한, 수탁자에
            대한 관리․감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에
            명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고
            있습니다.
          </p>
          <p className="sub_p mgt10">
            ③ 위탁업무의 내용이나 수탁자가 변경될 경우에는 지체없이 본 개인정보
            처리방침을 통하여 공개하도록 하겠습니다.
          </p>
          <br />
          <br />
          <p className="lh6 bs4">
            <strong>
              제5조(정보주체와 법정대리인의 권리·의무 및 그 행사방법)
            </strong>
          </p>
          <p className="ls2">
            <br />
            <br />① 정보주체는 Mini Dice Team에 대해 언제든지 개인정보
            열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.
          </p>
          <p className="sub_p">
            ② 제1항에 따른 권리 행사는Mini Dice Team에 대해 「개인정보 보호법」
            시행령 제41조제1항에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여
            하실 수 있으며 Mini Dice Team은(는) 이에 대해 지체 없이
            조치하겠습니다.
          </p>
          <p className="sub_p">
            ③ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자
            등 대리인을 통하여 하실 수 있습니다.이 경우 “개인정보 처리 방법에
            관한 고시(제2020-7호)” 별지 제11호 서식에 따른 위임장을 제출하셔야
            합니다.
          </p>
          <p className="sub_p">
            ④ 개인정보 열람 및 처리정지 요구는 「개인정보 보호법」 제35조 제4항,
            제37조 제2항에 의하여 정보주체의 권리가 제한 될 수 있습니다.
          </p>
          <p className="sub_p">
            ⑤ 개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가 수집
            대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수 없습니다.
          </p>
          <p className="sub_p">
            ⑥ Mini Dice Team은(는) 정보주체 권리에 따른 열람의 요구, 정정·삭제의
            요구, 처리정지의 요구 시 열람 등 요구를 한 자가 본인이거나 정당한
            대리인인지를 확인합니다.
          </p>
          <p className="lh6 bs4">
            <strong>제6조(처리하는 개인정보의 항목 작성) </strong> ①{' '}
            <em className="emphasis">-Mini Dice Team-</em>은(는) 다음의 개인정보
            항목을 처리하고 있습니다.
          </p>
          <ul className="list_indent2 mgt10">
            <li className="tt">1-홈페이지 회원가입 및 관리-</li>
            <li>
              필수항목 : 이메일, 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보
            </li>
            <li>선택항목 : </li>
          </ul>
          <p className="lh6 bs4">
            <strong>제7조(개인정보의 파기)</strong>
          </p>
          <p className="ls2">
            ① -Mini Dice Team- 은(는) 개인정보 보유기간의 경과, 처리목적 달성 등
            개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를
            파기합니다.② 정보주체로부터 동의받은 개인정보 보유기간이 경과하거나
            처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속
            보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로
            옮기거나 보관장소를 달리하여 보존합니다.1. 법령 근거 :2. 보존하는
            개인정보 항목 : 계좌정보, 거래날짜③ 개인정보 파기의 절차 및 방법은
            다음과 같습니다.1. 파기절차 -Mini Dice Team- 은(는) 파기 사유가
            발생한 개인정보를 선정하고, -Mini Dice Team- 의 개인정보
            보호책임자의 승인을 받아 개인정보를 파기합니다.
          </p>
          <p className="sub_p mgt10">2. 파기방법</p>
          <p className="sub_p">
            전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을
            사용합니다.
          </p>
          종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다
        </p>
        <p className="lh6 bs4">
          <strong>
            제8조(개인정보의 안전성 확보 조치)
            <em className="emphasis">-Mini Dice Team-</em>은(는) 개인정보의
            안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
          </strong>
        </p>
        <p className="sub_p mgt10">
          1. 정기적인 자체 감사 실시 개인정보 취급 관련 안정성 확보를 위해
          정기적(분기 1회)으로 자체 감사를 실시하고 있습니다.2. 해킹 등에 대비한
          기술적 대책 <em className="emphasis">Mini Dice Team</em>('
          <em className="emphasis">Mini Dice</em>')은 해킹이나 컴퓨터 바이러스
          등에 의한 개인정보 유출 및 훼손을 막기 위하여 보안프로그램을 설치하고
          주기적인 갱신·점검을 하며 외부로부터 접근이 통제된 구역에 시스템을
          설치하고 기술적/물리적으로 감시 및 차단하고 있습니다.3. 접속기록의
          보관 및 위변조 방지 개인정보처리시스템에 접속한 기록을 최소 1년 이상
          보관, 관리하고 있으며,다만, 5만명 이상의 정보주체에 관하여 개인정보를
          추가하거나, 고유식별정보 또는 민감정보를 처리하는 경우에는 2년이상
          보관, 관리하고 있습니다.
          <br />
          또한, 접속기록이 위변조 및 도난, 분실되지 않도록 보안기능을 사용하고
          있습니다.4. 개인정보에 대한 접근 제한 개인정보를 처리하는
          데이터베이스시스템에 대한 접근권한의 부여,변경,말소를 통하여
          개인정보에 대한 접근통제를 위하여 필요한 조치를 하고 있으며
          침입차단시스템을 이용하여 외부로부터의 무단 접근을 통제하고
          있습니다.5. 비인가자에 대한 출입 통제 개인정보를 보관하고 있는 물리적
          보관 장소를 별도로 두고 이에 대해 출입통제 절차를 수립, 운영하고
          있습니다.
        </p>
        <p className="lh6 bs4">
          <strong>
            제9조(개인정보 자동 수집 장치의 설치•운영 및 거부에 관한 사항)
          </strong>
        </p>
        <p className="ls2">
          <br />
          <br />① Mini Dice Team 은(는) 이용자에게 개별적인 맞춤서비스를
          제공하기 위해 이용정보를 저장하고 수시로 불러오는 ‘쿠키(cookie)’를
          사용합니다.② 쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가
          이용자의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자들의 PC
          컴퓨터내의 하드디스크에 저장되기도 합니다.가. 쿠키의 사용 목적 :
          이용자가 방문한 각 서비스와 웹 사이트들에 대한 방문 및 이용형태, 인기
          검색어, 보안접속 여부, 등을 파악하여 이용자에게 최적화된 정보 제공을
          위해 사용됩니다.나. 쿠키의 설치•운영 및 거부 : 웹브라우저 상단의 도구
          {`>`}인터넷 옵션{`>`}개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을 거부
          할 수 있습니다.다. 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에
          어려움이 발생할 수 있습니다.
          <p className="sub_p mgt30">
            <strong>제10조 (개인정보 보호책임자) </strong>
          </p>
          <p className="sub_p mgt10">
            {' '}
            ① <span className="colorLightBlue">Mini Dice Team</span> 은(는)
            개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와
            관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이
            개인정보 보호책임자를 지정하고 있습니다.
          </p>
          <ul className="list_indent2 mgt10">
            <li className="tt">▶ 개인정보 보호책임자 </li>
            <li>성명 :전성훈</li>
            <li>직책 :매니저</li>
            <li>직급 :매니저</li>
            <li>연락처 :01030028103, lifegame2021team@gmail.com, </li>
          </ul>
          <p className="sub_p">
            ※ 개인정보 보호 담당부서로 연결됩니다.
            <p />{' '}
            <ul className="list_indent2 mgt10">
              <li className="tt">▶ 개인정보 보호 담당부서</li>
              <li>부서명 :</li>
              <li>담당자 :</li>
              <li>연락처 :, , </li>
            </ul>
            <p className="sub_p">
              ② 정보주체께서는 Mini Dice Team 의 서비스(또는 사업)을
              이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리,
              피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로
              문의하실 수 있습니다. Mini Dice Team 은(는) 정보주체의 문의에 대해
              지체 없이 답변 및 처리해드릴 것입니다.
            </p>
            <p className="sub_p mgt30">
              <strong>
                제11조(개인정보 열람청구) 정보주체는 ｢개인정보 보호법｣ 제35조에
                따른 개인정보의 열람 청구를 아래의 부서에 할 수 있습니다.
                <br />
                -Mini Dice Team-은(는) 정보주체의 개인정보 열람청구가 신속하게
                처리되도록 노력하겠습니다.{' '}
              </strong>
            </p>
            <ul className="list_indent2 mgt10">
              <li className="tt">▶ 개인정보 열람청구 접수·처리 부서 </li>
              <li>부서명 : Mini Dice Team</li>
              <li>담당자 : 전성훈</li>
              <li>연락처 : 01030028103, lifegame2021team@gmail.com, </li>
            </ul>
            <p className="lh6 bs4">
              <strong>
                제12조(권익침해 구제방법)<em className="emphasis"></em>
              </strong>
            </p>
            <br />
            <br />
            정보주체는 개인정보침해로 인한 구제를 받기 위하여
            개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에
            분쟁해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타
            개인정보침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기
            바랍니다.
            <br />
            <br />
            1. 개인정보분쟁조정위원회 : (국번없이) 1833-6972 (www.kopico.go.kr)
            <br />
            2. 개인정보침해신고센터 : (국번없이) 118 (privacy.kisa.or.kr)
            <br />
            3. 대검찰청 : (국번없이) 1301 (www.spo.go.kr)
            <br />
            4. 경찰청 : (국번없이) 182 (ecrm.cyber.go.kr)
            <br />
            <br />
            「개인정보보호법」제35조(개인정보의 열람), 제36조(개인정보의
            정정·삭제), 제37조(개인정보의 처리정지 등)의 규정에 의한 요구에 대
            하여 공공기관의 장이 행한 처분 또는 부작위로 인하여 권리 또는 이익의
            침해를 받은 자는 행정심판법이 정하는 바에 따라 행정심판을 청구할 수
            있습니다.
            <br />
            <br />※ 행정심판에 대해 자세한 사항은
            중앙행정심판위원회(www.simpan.go.kr) 홈페이지를 참고하시기 바랍니다.
            <p className="lh6 bs4">
              <strong>
                제13조(개인정보 처리방침 변경)<em className="emphasis"></em>
              </strong>
            </p>
            <br />
          </p>
          <p className="sub_p">
            ① 이 개인정보처리방침은 2022년 1월 1부터 적용됩니다.
          </p>
          <p className="sub_p"></p>
          <p className="sub_p"></p>
          <p className="sub_p">
            ② 이전의 개인정보 처리방침은 아래에서 확인하실 수 있습니다.{' '}
          </p>
          <p className="sub_p"></p>
          <p className="sub_p"></p>
          <p className="sub_p">예시 ) - 20XX. X. X ~ 20XX. X. X 적용 (클릭) </p>
          <p className="sub_p"></p>
          <p className="sub_p"></p>
          <p className="sub_p">예시 ) - 20XX. X. X ~ 20XX. X. X 적용 (클릭) </p>
          <p className="sub_p"></p>
          <p className="sub_p"></p>
          <p className="sub_p">예시 ) - 20XX. X. X ~ 20XX. X. X 적용 (클릭)</p>
        </p>
      </div>
    </ServiceLayout>
  );
}
