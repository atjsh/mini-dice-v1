import { Link } from 'react-router-dom';
import { ServiceLayout } from '../layouts/service.layout';
import { IndexPageURL, PrivacyPolicyPageURL } from './routes';

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
    <ol className=" list-decimal ml-4 my-3">{children}</ol>
  ) : (
    <ul className=" list-disc ml-4 my-3">{children}</ul>
  );
}

function SectionListItem({ children }: { children: React.ReactNode }) {
  return <li className=" ">{children}</li>;
}

export function TermsPage() {
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
          <h1 className=" text-4xl font-bold">이용약관</h1>
        </div>
        <div>
          <SectionHeader>제1조 목적</SectionHeader>
          <SectionList ordered>
            <SectionListItem>
              Mini Dice(www.mini-dice.com) 서비스 약관(이하 "본 약관"이라
              합니다)은 회원이 Mini Dice Team에서 제공하는 인터넷 관련
              서비스(이하 "서비스"라 합니다)를 이용함에 있어 회원과 서비스의
              권리·의무 및 책임사항을 규정함을 목적으로 합니다.
            </SectionListItem>
            <SectionListItem>
              회원이 되고자 하는 자가 서비스에서 정한 소정의 절차를 거쳐서
              "약관동의" 단추를 누르면 본 약관에 동의하는 것으로 간주합니다. 본
              약관에 정하는 이외의 회원과 서비스의 권리, 의무 및 책임사항에
              관해서는 전기통신사업법 기타 대한민국의 관련 법령과 상관습에
              의합니다.
            </SectionListItem>
          </SectionList>
          <SectionHeader>제2조 용어 정의</SectionHeader>
          <SectionList ordered>
            <SectionListItem>
              회원: 서비스에 접속하여 본 약관에 따라 서비스 회원으로 가입하여
              서비스에서 제공하는 서비스를 받는 자를 말합니다.
            </SectionListItem>
            <SectionListItem>
              기타 약관에서 정하지 아니한 용어는 관계 법령 및 일반 관례에
              따릅니다.
            </SectionListItem>
          </SectionList>
          <SectionHeader>제3조 이용약관의 효력 및 변경</SectionHeader>
          <SectionList ordered>
            <SectionListItem>
              이 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을
              발생합니다.
            </SectionListItem>
            <SectionListItem>
              이 약관의 내용은 회원이 이에 동의하여 서비스에 가입함으로써 효력이
              발생합니다.
            </SectionListItem>
            <SectionListItem>
              약관에 대한 동의는 이용 신청시 화면 상의 '회원 가입 약관' - '위의
              내용을 모두 읽었으며 동의합니다.' 항목에 체크를 함으로써
              이루어지는 것으로 간주합니다. 기존 가입 회원의 동의 여부는 제4항에
              의합니다.
            </SectionListItem>
            <SectionListItem>
              회원은 변경된 약관에 대하여 동의하지 않을 경우 서비스 이용을
              중단하고 이용 계약을 해지(회원 탈퇴)할 수 있으며, 만약 변경된
              약관의 적용 이후에도 서비스를 계속 이용하는 경우에는 약관의 변경
              사항에 동의한 것으로 간주합니다.
            </SectionListItem>
            <SectionListItem>
              서비스는 필요한 사유가 발생할 경우 관련 법령에 위배되지 않는 범위
              안에서 약관을 개정할 수 있습니다. 개정 사실은 공지를 통해 고지되며
              개정된 약관은 게시된 지 7일 후부터 효력을 발휘합니다.
            </SectionListItem>
          </SectionList>
          <SectionHeader>제4조 회원 가입</SectionHeader>
          <SectionList ordered>
            <SectionListItem>
              회원이 되고자 하는 자는 서비스에서 정한 가입 양식에 따라
              회원정보를 기입하고 "시작", "회원가입하고 시작", 또는 "회원가입"
              버튼을 누르는 방법으로 회원 가입을 신청합니다.
            </SectionListItem>
            <SectionListItem>
              서비스는 제1항과 같이 회원으로 가입할 것을 신청한 자가 다음 각
              호에 해당하지 않는 한 신청한 자를 회원으로 인정합니다.
              <SectionList ordered>
                <SectionListItem>
                  등록 내용에 허위, 기재누락, 오기가 있는 경우
                </SectionListItem>
                <SectionListItem>
                  법률 또는 약관 위반, 기타 회원의 귀책사유, 제7조 제2항에
                  의하여 회원 자격의 정지 및 회원 자격의 상실 경험이 있는 회원이
                  다시 신청하는 경우
                </SectionListItem>
                <SectionListItem>
                  기타 회원으로 등록하는 것이 서비스의 서비스 운영에 현저히
                  지장이 있다고 판단되는 경우
                </SectionListItem>
              </SectionList>
            </SectionListItem>
            <SectionListItem>
              회원가입계약의 성립시기는 서비스의 회원 등록완료한 시점으로
              합니다.
            </SectionListItem>
            <SectionListItem>
              회원가입계약이 성립된 이후라도 제2항 각 호에 따른 사유 발견시 이용
              승낙을 철회할 수 있으며 해당 회원은 서비스 이용과 관련하여 아무런
              권리를 주장할 수 없습니다.
            </SectionListItem>
          </SectionList>
          <SectionHeader>제5조 서비스의 제공 및 변경</SectionHeader>
          <SectionList ordered>
            <SectionListItem>
              서비스는 회원에게 아래와 같은 서비스를 제공합니다.
              <SectionList ordered>
                <SectionListItem>사이트내의 컨텐츠 이용 서비스</SectionListItem>
                <SectionListItem>
                  기타 서비스에서 자체 개발하거나 다른 회사와의 협력계약 등을
                  통해 회원들에게 제공할 일체의 서비스
                </SectionListItem>
              </SectionList>
            </SectionListItem>
            <SectionListItem>
              서비스는 그 변경될 서비스의 내용 및 제공일자를 제8조에서 정한
              방법으로 회원에게 통지할 수 있습니다.
            </SectionListItem>
          </SectionList>
          <SectionHeader>제6조 서비스의 중단</SectionHeader>
          <SectionList ordered>
            <SectionListItem>
              서비스는 컴퓨터 등 정보통신설비의 보수점검·교체 및 고장, 통신의
              두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할
              수 있고, 새로운 서비스로의 교체나 기타 서비스이 적절하다고
              판단하는 사유에 기하여 현재 제공되는 서비스를 완전히 중단할 수
              있습니다.
            </SectionListItem>
            <SectionListItem>
              제1항에 의한 서비스 중단의 경우에는 서비스는 제8조 제2항에서 정한
              방법으로 회원에게 통지합니다. 다만, 서비스에서 통제할 수 없는
              사유로 인한 서비스의 중단(시스템 관리자의 고의, 과실이 없는 디스크
              장애, 시스템 다운 등)으로 인하여 사전 통지가 불가능한 경우에는
              그러하지 아니합니다.
            </SectionListItem>
          </SectionList>
          <SectionHeader>제7조 회원 탈퇴 및 자격 상실 등</SectionHeader>
          <SectionList ordered>
            <SectionListItem>
              회원은 서비스에 언제든지 자신의 회원 등록을 말소해 줄 것(회원
              탈퇴)을 요청할 수 있으며 서비스는 개인정보취급방침에 따라 해당
              회원의 회원 등록 말소를 위한 절차를 밟습니다.
            </SectionListItem>
            <SectionListItem>
              회원이 다음 각 호의 사유에 해당하는 경우, 서비스는 회원의
              회원자격을 적절한 방법으로 제한 및 정지 또는 상실시킬 수 있습니다.
              <SectionList ordered>
                <SectionListItem>
                  공지사항 또는 서비스 규칙에 위반하는 활동을 하는 경우
                </SectionListItem>
                <SectionListItem>
                  가입 신청 시에 허위 내용을 등록한 경우
                </SectionListItem>
                <SectionListItem>
                  다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등
                  서비스상 위협에 해당하는 행동의 경우
                </SectionListItem>
                <SectionListItem>
                  법령과 본 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우
                </SectionListItem>
              </SectionList>
            </SectionListItem>
            <SectionListItem>
              서비스는 회원의 회원자격을 상실시키기로 결정한 경우에는 회원등록을
              말소합니다.
            </SectionListItem>
            <SectionListItem>
              4. 회원이 본 약관에 의해서 회원 가입 후 서비스를 이용하는 도중,
              연속하여 1년 동안 서비스를 이용하기 위한 로그인 기록이 없는 경우,
              휴면계정으로 취급 될 수 있으며, 서비스는 회원의 회원자격을
              상실시킬 수 있습니다.
            </SectionListItem>
          </SectionList>
          <SectionHeader>제8조 회원에 대한 통지</SectionHeader>
          <SectionList ordered>
            <SectionListItem>
              서비스는 특정 회원에게 대한 통지를 하는 경우 서비스의 회원정보에
              기재된 E-mail 및 공지사항으로 통지 할 수 있습니다.
            </SectionListItem>
            <SectionListItem>
              서비스는 불특정다수 회원에 대한 통지를 하는 경우 서비스의
              공지사항에 게시함으로써 개별 통지에 갈음할 수 있습니다.
            </SectionListItem>
          </SectionList>
          <SectionHeader>제9조 회원의 개인정보보호</SectionHeader>
          <SectionList ordered>
            <SectionListItem>
              서비스는 관련법령이 정하는 바에 따라서 회원 등록정보를 포함한
              회원의 개인정보를 보호하기 위하여 노력합니다.
            </SectionListItem>
            <SectionListItem>
              회원의 개인정보보호에 관해서는 관련법령 및 서비스에서 정하는{' '}
              <Link to={PrivacyPolicyPageURL} className="underline">
                개인정보취급방침
              </Link>
              에 정한 바에 의합니다.
            </SectionListItem>
          </SectionList>
          <SectionHeader>제10조 서비스의 의무</SectionHeader>
          <SectionList ordered>
            <SectionListItem>
              서비스는 법령과 본 약관이 금지하거나 공서양속에 반하는 행위를 하지
              않으며 본 약관이 정하는 바에 따라 지속적이고, 안정적으로 서비스를
              제공하기 위해서 노력합니다.
            </SectionListItem>
            <SectionListItem>
              서비스는 회원이 원하지 않는 영리목적의 광고성 전자우편을 발송하지
              않습니다.
            </SectionListItem>
          </SectionList>
          <SectionHeader>
            제11조 회원의 ID 및 비밀번호에 대한 의무
          </SectionHeader>
          <SectionList ordered>
            <SectionListItem>
              서비스는 관계법령,{' '}
              <Link to={PrivacyPolicyPageURL} className="underline">
                개인정보취급방침
              </Link>
              에 의해서 그 책임을 지는 경우를 제외하고, 자신의 ID와 비밀번호 등
              계정 로그인에 필요한 정보의 관리책임은 각 회원에게 있습니다.
            </SectionListItem>
            <SectionListItem>
              회원은 자신의 ID와 비밀번호 등 계정 로그인에 필요한 정보를
              제3자에게 이용하게 해서는 안됩니다.
            </SectionListItem>
            <SectionListItem>
              회원은 자신의 ID와 비밀번호 등 계정 로그인에 필요한 정보를
              도난당하거나 제3자가 사용하고 있음을 인지한 경우에는 바로 서비스에
              통보하고 서비스의 안내가 있는 경우에는 그에 따라야 합니다.
            </SectionListItem>
          </SectionList>
          <SectionHeader>제12조 회원의 의무</SectionHeader>
          <SectionBody>
            회원은 다음 각 호의 행위를 하여서는 안됩니다.
          </SectionBody>
          <SectionList ordered>
            <SectionListItem>
              서비스에서 제공하는 서비스에 정한 약관 기타 서비스 이용에 관한
              규정을 위반하는 행위
            </SectionListItem>
            <SectionListItem>서비스 공지사항에 위반하는 행위</SectionListItem>
            <SectionListItem>
              서비스 기타 제3자의 인격권 또는 지적재산권을 침해하거나 업무를
              방해하는 행위
            </SectionListItem>
            <SectionListItem>
              다른 회원의 ID와 비밀번호 등 계정 로그인에 필요한 정보를 도용하는
              행위
            </SectionListItem>
            <SectionListItem>
              정크메일(junk mail), 스팸메일(spam mail), 행운의 편지(chain
              letters), 피라미드 조직에 가입할 것을 권유하는 메일, 외설 또는
              폭력적인 메시지 ·화상·음성 등이 담긴 메일을 보내거나 기타
              공서양속에 반하는 정보를 공개 또는게시하는 행위.
            </SectionListItem>
            <SectionListItem>
              관련 법령에 의하여 그 전송 또는 게시가 금지되는 정보(컴퓨터
              프로그램 등)의 전송 또는 게시하는 행위
            </SectionListItem>
            <SectionListItem>
              서비스의 직원이나 서비스 서비스의 관리자를 가장하거나 사칭하여
              또는 타인의 명의를 모용하여 글을 게시하거나 메일을 발송하는 행위
            </SectionListItem>
            <SectionListItem>
              컴퓨터 소프트웨어, 하드웨어, 전기통신 장비의 정상적인 가동을 방해,
              파괴할 목적으로 고안된 소프트웨어 바이러스, 기타 다른 컴퓨터 코드,
              파일, 프로그램을 포함하고 있는 자료를 게시하거나 전자우편으로
              발송하는 행위
            </SectionListItem>
            <SectionListItem>
              스토킹(stalking) 등 다른 회원을 괴롭히는 행위
            </SectionListItem>
            <SectionListItem>
              다른 회원에 대한 개인정보를 그 동의 없이 수집,저장,공개하는 행위
            </SectionListItem>
            <SectionListItem>
              불특정 다수의 자를 대상으로 하여 광고 또는 선전을 게시하거나
              스팸메일을 전송하는 등의 방법으로 서비스의 서비스를 이용하여
              영리목적의 활동을 하는 행위
            </SectionListItem>
            <SectionListItem>
              서버나 회선에 무리를 줄 수 있는 행위
            </SectionListItem>
          </SectionList>
          <SectionBody>
            위의 각 호에 해당하는 행위를 한 회원이 있을 경우 서비스는 회원의
            회원자격을 적절한 방법으로 제한 및 정지, 상실시킬 수 있으며, 회원은
            그 귀책사유로 인하여 서비스이나 다른 회원이 입은 손해를 배상할
            책임이 있습니다.
          </SectionBody>
          <SectionHeader>제13조 게시물 관련 사항</SectionHeader>
          <SectionList ordered>
            <SectionListItem>
              서비스는 유저가 게시 가능한 게시물("댓글" 등)에 관한 세부
              이용지침(공지사항)을 별도로 정하여 운영할 수 있으며 회원은 그
              지침에 따라 내용을 등록하여야 합니다.
            </SectionListItem>
            <SectionListItem>
              서비스는 회원이 게시한 게시물의 내용이 다음 각 호에 해당하는 경우
              회원에게 사전 통지 없이 해당 공개게시물을 임시 차단 조치 또는
              삭제나 이동할 수 있고, 해당 회원의 회원 자격을 제한, 정지 또는
              상실시킬 수 있습니다.
              <SectionList ordered>
                <SectionListItem>
                  서비스에서 제공하는 서비스에 정한 약관 기타 서비스 이용에 관한
                  규정을 위반하는 행위
                </SectionListItem>
                <SectionListItem>
                  서비스 공지사항에 위반하는 내용
                </SectionListItem>
                <SectionListItem>
                  다른 회원 또는 제3자를 비방하거나 중상 모략으로 명예를
                  손상시키는 내용
                </SectionListItem>
                <SectionListItem>
                  제3자의 저작권 등 권리를 침해하는 내용
                </SectionListItem>
                <SectionListItem>
                  범죄행위와 관련이 있다고 판단되는 내용
                </SectionListItem>
                <SectionListItem>
                  기타 관계 법령에 위배된다고 판단되는 내용
                </SectionListItem>
              </SectionList>
            </SectionListItem>
            <SectionListItem>
              서비스는 회원이 게시한 게시물 등에 대하여 다른 회원 혹은 제3자의
              법률상 권리 침해를 근거로 게시 중단 요청을 받은 경우 게시물을 게시
              중단할 수 있으며, 게시 중단 요청자와 게시물 등록 회원간의 합의
              또는 법적 조치의 결과 등이 서비스에 접수되면 그에 따릅니다.
            </SectionListItem>
          </SectionList>
          <SectionHeader>제14조 저작권의 귀속 및 이용제한</SectionHeader>
          <SectionList ordered>
            <SectionListItem>
              서비스이 작성한 저작물에 대한 저작권 기타 지적재산권은 서비스에
              귀속합니다.
            </SectionListItem>
            <SectionListItem>
              회원은 서비스을 이용함으로써 얻은 정보를 서비스의 사전승낙 없이
              복제, 전송, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로
              이용하거나 제3자에게 이용하게 하여서는 안됩니다.
            </SectionListItem>
            <SectionListItem>
              회원이 서비스 내에 게시한 게시물의 저작권은 게시한 회원에게
              귀속됩니다. 단, 서비스은 서비스의 운영, 전시, 전송, 배포, 홍보의
              목적으로 회원의 별도의 허락 없이 무상으로 저작권법에 규정하는
              공정한 관행에 합치되게 합리적인 범위 내에서 다음과 같이 회원이
              등록한 게시물을 사용할 수 있습니다.
              <SectionList ordered>
                <SectionListItem>
                  서비스 내에서 회원 게시물의 복제, 수정, 개조, 전시, 전송, 배포
                  및 저작물성을 해치지 않는 범위 내에서의 편집 저작물 작성
                </SectionListItem>
                <SectionListItem>
                  게시물 검색 서비스 등 향상된 서비스 제공을 위하여 관련
                  제휴사에게 필요한 자료(게시물 제목 및 내용, 게시일, 조회수
                  등)를 복제, 전송하는 것. 단, 이 경우 서비스는 별도의 동의 없이
                  회원의 개인정보를 제공하지 않습니다.
                </SectionListItem>
                <SectionListItem>
                  미디어, 통신사 등 서비스 제휴사에게 회원의 게시물 내용을 제공,
                  전시 혹은 홍보하게 하는 것. 단, 이 경우 서비스는 별도의 동의
                  없이 회원의 개인정보를 제공하지 않습니다.
                </SectionListItem>
              </SectionList>
            </SectionListItem>
            <SectionListItem>
              서비스는 전항 이외의 방법으로 회원의 게시물을 이용하고자 하는
              경우, 이메일 또는 기타 방식으로 회원의 사전 동의를 얻어야 합니다.
            </SectionListItem>
            <SectionListItem>
              작성한 게시물로 인해 발생되는 문제에 대해서는 해당 게시물을 게시한
              게시자에게 책임이 있으며, 타인의 권리를 침해한 게시물은 침해
              당사자 또는 권한 대리인의 요청에 의해 삭제될 수 있습니다.
            </SectionListItem>
            <SectionListItem>
              작성한 게시물로 인해 타인 및 저작물의 저작권을 침해하는 경우 이에
              대한 민.형사상의 책임은 글 게시자에게 있습니다. 만일 이를 이유로
              서비스이 타인에게 손해배상청구 등 이의 제기를 받은 경우 해당
              게시자는 그로 인해 발생되는 모든 손해를 부담해야 합니다.
            </SectionListItem>
          </SectionList>
          <SectionHeader>제15조 광고 게재 및 정보의 제공</SectionHeader>
          <SectionList ordered>
            <SectionListItem>
              서비스는 서비스 이용에 필요가 있다고 인정되는 각종 정보 또는
              광고를 서비스 화면에 게재할 수 있습니다. 회원은 회원이 등록한
              게시물의 내용을 활용한 광고게재 및 기타 서비스상에 노출되는
              광고게재에 대해 동의합니다.
            </SectionListItem>
            <SectionListItem>
              서비스는 서비스상에 게재되어 있거나 서비스를 통한 광고주의
              판촉활동에 회원이 참여하거나 교신 또는 거래를 함으로써 발생하는
              손실과 손해에 대해 책임을 지지 않습니다.
            </SectionListItem>
          </SectionList>
          <SectionHeader>부칙</SectionHeader>
          <SectionBody>본 약관은 2022년 1월 1일부터 적용됩니다.</SectionBody>
        </div>
      </div>
    </ServiceLayout>
  );
}
