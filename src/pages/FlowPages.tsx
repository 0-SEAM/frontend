import type { FormEvent, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Page({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="page-content">
      <Link className="text-app-muted mb-6 inline-block text-sm" to="/timeline">
        ← 이전 화면
      </Link>
      <h1 className="page-title">{title}</h1>
      {children}
    </section>
  );
}

function TextField({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <label className="field-label">
      <span>{label}</span>
      <input className="field-control" type={type} />
    </label>
  );
}

function FormButton({ children }: { children: ReactNode }) {
  return (
    <button className="primary-action mt-6 w-full" type="submit">
      {children}
    </button>
  );
}

export function LandingPage() {
  return (
    <section className="page-content text-center">
      <div className="surface-card mb-8 py-12">
        <strong className="text-3xl">0:SEAM</strong>
        <p className="page-lede mb-0">대전 생활, 순서대로 쉽게</p>
      </div>
      <h1 className="page-title">외국인 직원을 위한 맞춤 생활정착 안내</h1>
      <p className="page-lede">통신·금융·주거·행정 업무를 조건에 맞는 순서로 안내합니다.</p>
      <div className="mt-8 grid grid-cols-2 gap-2">
        <Link className="secondary-action no-underline" to="/signup">
          English
        </Link>
        <Link className="secondary-action no-underline" to="/signup">
          中文
        </Link>
        <Link className="secondary-action no-underline" to="/signup">
          Tiếng Việt
        </Link>
        <Link className="secondary-action no-underline" to="/signup">
          日本語
        </Link>
      </div>
      <Link className="primary-action mt-8 w-full no-underline" to="/signup">
        회원가입
      </Link>
      <Link className="text-app-text mt-4 inline-block underline" to="/login">
        이미 계정이 있어요 - 로그인
      </Link>
    </section>
  );
}

export function SignupPage() {
  const navigate = useNavigate();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    navigate("/onboarding");
  };
  return (
    <Page title="회원가입 화면">
      <form onSubmit={submit}>
        <h2 className="section-title">계정 만들기</h2>
        <p className="page-lede">0:SEAM에 오신 것을 환영합니다. 아래 정보를 입력해 가입을 완료하세요.</p>
        <TextField label="이름 (영문 또는 한국어)" />
        <TextField label="이메일 주소" type="email" />
        <TextField label="비밀번호" type="password" />
        <TextField label="비밀번호 확인" type="password" />
        <p className="page-note">비밀번호는 8자 이상, 영문·숫자·특수문자를 포함해야 합니다.</p>
        <FormButton>가입하기</FormButton>
      </form>
      <Link className="text-app-text mt-4 inline-block underline" to="/login">
        이미 계정이 있으신가요? 로그인
      </Link>
      <div className="surface-card mt-8">
        <h2 className="card-title">개인정보 수집 안내</h2>
        <p className="page-note">
          입력하신 이메일과 이름은 계정 식별 목적으로만 사용되며, 생활 조건 입력 전까지 추가 정보는 수집되지 않습니다.
        </p>
      </div>
    </Page>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    navigate("/timeline");
  };
  return (
    <Page title="로그인 화면">
      <form onSubmit={submit}>
        <h2 className="section-title">0:SEAM에 로그인</h2>
        <p className="page-lede">계정의 이메일과 비밀번호를 입력하세요.</p>
        <TextField label="이메일" type="email" />
        <TextField label="비밀번호" type="password" />
        <FormButton>로그인</FormButton>
      </form>
      <p className="text-center">
        <span className="text-app-muted">계정이 없으신가요? </span>
        <Link className="underline" to="/signup">
          계정 생성
        </Link>
      </p>
    </Page>
  );
}

export function SaveFailurePage() {
  return (
    <Page title="저장 실패 안내">
      <div className="result-panel">
        <div className="result-icon error">×</div>
        <h2>저장 실패</h2>
        <p>생활 조건을 저장할 수 없습니다.</p>
        <p>네트워크 연결을 확인하고 다시 시도해 주세요.</p>
      </div>
      <h2 className="section-title">다음과 같은 경우 실패할 수 있습니다</h2>
      <ul className="page-lede">
        <li>인터넷 연결이 불안정합니다</li>
        <li>입력한 정보에 누락이 있습니다</li>
        <li>일시적 서버 오류가 발생했습니다</li>
      </ul>
      <Link className="primary-action mx-auto mt-6 block w-fit no-underline" to="/conditions">
        다시 시도
      </Link>
    </Page>
  );
}

export function ExpiryWarningPage() {
  return (
    <Page title="등록증 만료 경고 카드">
      <h2 className="section-title">외국인등록증 만료 경고</h2>
      <div className="surface-card">
        <p className="page-note">만료 위험도</p>
        <h2 className="text-2xl font-bold">높음 - 30일 이내 만료</h2>
        <p className="page-lede">현재 체류 자격이 만료되기 전에 갱신 절차를 시작하세요.</p>
      </div>
      <Link className="surface-card mt-4 block no-underline" to="/official-guide">
        <h3 className="card-title">만료 정보</h3>
        <Info label="만료일" value="2025년 8월 14일" />
        <Info label="남은 기간" value="28일" />
        <Info label="비자 종류" value="E-7 (특정활동)" />
      </Link>
      <div className="surface-card mt-4">
        <h3 className="card-title">지금 해야 할 일</h3>
        <p>1. 출입국·외국인청에 체류기간 연장 신청서를 접수하세요.</p>
        <p>2. 고용주의 고용계약서 및 사업자등록증 사본을 준비하세요.</p>
      </div>
      <Link className="primary-action mt-6 w-full no-underline" to="/alert-request">
        HR 동행 지원 요청
      </Link>
    </Page>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex justify-between gap-4">
      <span className="text-app-muted">{label}</span>
      <strong>{value}</strong>
    </p>
  );
}

export function OfficialGuidePage() {
  return (
    <Page title="공식 안내 외부 링크">
      <h2 className="section-title">외국인등록증 만료 대비</h2>
      <p className="page-lede">체류자격 연장 신청</p>
      <h2 className="section-title">공식 절차</h2>
      <p className="page-lede">
        외국인등록증 유효기간 만료 전에 거주지 관할 출입국관리사무소에 체류자격 연장을 신청해야 합니다.
      </p>
      <div className="surface-card">
        <p className="card-title">출입국관리청</p>
        <p>대한민국 공식 안내</p>
        <a className="font-semibold underline" href="https://www.hikorea.go.kr" target="_blank" rel="noreferrer">
          출입국 안내 보기 ↗
        </a>
      </div>
    </Page>
  );
}

export function AlertRequestPage() {
  const navigate = useNavigate();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    navigate("/alert-result");
  };
  return (
    <Page title="알림 전송 요청 화면">
      <form onSubmit={submit}>
        <h2 className="section-title">알림 전송 요청</h2>
        <p className="page-lede">아래 내용을 확인한 후 HR 담당자에게 알림을 전송하세요.</p>
        <div className="surface-card">
          <h3 className="card-title">수신 대상</h3>
          <p>HR 담당자</p>
        </div>
        <div className="surface-card">
          <h3 className="card-title">전송 내용 요약</h3>
          <Info label="만료 예정일" value="2025년 8월 14일" />
          <Info label="남은 기간" value="28일" />
          <Info label="등록증 종류" value="E-7" />
        </div>
        <TextField label="지원 요청 사유" />
        <TextField label="긴급도" />
        <div className="surface-card mt-4">
          <h3 className="card-title">전송 전 주의사항</h3>
          <p className="page-note">
            이 알림은 HR 담당자에게 참고용으로 전송됩니다. 체류 자격 연장 신청의 접수·심사·대행은 포함되지 않습니다.
          </p>
        </div>
        <FormButton>알림 전송</FormButton>
      </form>
    </Page>
  );
}
export function AlertResultPage() {
  return (
    <Page title="전송 결과 카드 화면">
      <div className="result-panel">
        <div className="result-icon">✓</div>
        <h2>알림이 전송되었습니다</h2>
        <p>담당 HR 담당자에게 외국인등록증 만료 경고가 전달되었습니다.</p>
      </div>
      <h2 className="section-title">다음 단계</h2>
      <p className="page-lede">
        담당자가 경고를 확인한 후 동행 지원 여부를 알려드립니다. 긴급한 경우 담당자에게 직접 연락하세요.
      </p>
      <Link className="primary-action mx-auto mt-6 block w-fit no-underline" to="/timeline">
        홈으로 돌아가기
      </Link>
      <Link className="secondary-action mx-auto mt-3 block w-fit no-underline" to="/alert-request">
        다시 전송
      </Link>
    </Page>
  );
}
export function AlertFailurePage() {
  return (
    <Page title="전송 실패 안내 화면">
      <div className="result-panel">
        <h2>전송 실패</h2>
        <p>요청 전송에 실패했습니다.</p>
      </div>
      <h2 className="section-title">실패 사유</h2>
      <p className="page-lede">네트워크 연결을 확인하고 다시 시도해 주세요.</p>
      <Link className="primary-action mt-6 w-full no-underline" to="/alert-request">
        다시 시도
      </Link>
      <Link className="secondary-action mt-3 w-full no-underline" to="/timeline">
        이전 화면으로
      </Link>
    </Page>
  );
}

export function SimGuidePage() {
  return (
    <Page title="선불 유심 절차 카드">
      <h2 className="section-title">선불 유심 개통 안내</h2>
      <p className="page-lede">임시 한국 번호를 확보하는 방법을 단계별로 안내합니다.</p>
      <p className="page-note">이 서비스는 유심 판매·결제·개통을 대신하지 않습니다.</p>
      <h2 className="section-title">준비물</h2>
      {["여권 (유효한 원본)", "외국인등록증 또는 입국 스탬프", "현금 또는 외국 카드"].map((item) => (
        <div className="surface-card mb-3 flex items-center justify-between" key={item}>
          <span>{item}</span>
          <span className="text-app-muted">확인</span>
        </div>
      ))}
      <h2 className="section-title">단계별 절차</h2>
      {["구매처 선택", "유심 구매", "개통 신청", "번호 확인", "연락처 등록"].map((item, index) => (
        <div className="surface-card mb-3" key={item}>
          <strong className="mr-3 text-xl">{index + 1}</strong>
          <span>{item}</span>
          <p className="page-note ml-9">구매처 직원 안내에 따라 진행하세요.</p>
        </div>
      ))}
      <div className="surface-card mt-6">
        <h3 className="card-title">현장 팁</h3>
        <p className="page-note">
          대전역·인천공항 통신사 부스는 영어·중국어 응대가 가능합니다. 유효기간을 확인한 후 잔액을 충전하세요.
        </p>
      </div>
      <Link className="primary-action mt-6 w-full no-underline" to="/sim-official">
        공식 안내 보기
      </Link>
    </Page>
  );
}
export function SimOfficialPage() {
  return (
    <Page title="유심 공식 안내 링크">
      <h2 className="section-title">선불 유심 개통</h2>
      <p className="page-lede">임시 한국 번호를 확보하는 첫 단계입니다.</p>
      <h2 className="section-title">준비물</h2>
      {["여권", "외국인등록증", "신용카드 또는 현금"].map((item) => (
        <div className="surface-card mb-3" key={item}>
          <strong>{item}</strong>
          <p className="page-note">원본 또는 발급받은 서류가 필요합니다.</p>
        </div>
      ))}
      <h2 className="section-title">단계별 절차</h2>
      {[
        "대전 내 유심 판매점 방문",
        "여권 제시 및 선불 유심 구매",
        "휴대폰에 유심 장착",
        "개통 신청 및 번호 수령",
        "선불 요금 충전",
      ].map((item, index) => (
        <div className="surface-card mb-3" key={item}>
          <strong>
            {index + 1} {item}
          </strong>
        </div>
      ))}
      <a
        className="primary-action mt-6 block w-full text-center no-underline"
        href="https://www.tworld.co.kr"
        target="_blank"
        rel="noreferrer"
      >
        한국 이동통신사 선불 상품 안내 ↗
      </a>
    </Page>
  );
}

const branches = ["하나은행 대전둔산지점", "국민은행 대전중구지점", "신한은행 대전원신지점"];
export function BankRecommendationsPage() {
  return (
    <Page title="은행 지점 추천">
      <h2 className="section-title">내 조건에 맞는 은행 지점</h2>
      <div className="surface-card mb-4">
        <p className="page-note">추천 조건 요약</p>
        <span className="chip">E-7 비자</span> <span className="chip">대덕구 근무</span>{" "}
        <span className="chip">재직증명서 보유</span>
      </div>
      {branches.map((branch, index) => (
        <div className="surface-card mb-4" key={branch}>
          <p className="page-note">추천 {index + 1}</p>
          <h3 className="card-title">{branch}</h3>
          <p className="page-note">추천 근거</p>
          <p>외국인 계좌 개설 경험과 외국어 응대 가능 여부를 반영했습니다.</p>
          <p className="page-note">준비 서류 참고: 여권·외국인등록증·재직증명서</p>
          <Link
            className="primary-action mt-4 flex w-full items-center justify-center text-center no-underline"
            to="/branch-experience"
          >
            현장 경험 보기
          </Link>
        </div>
      ))}
      <div className="surface-card">
        <p className="page-note">추천 결과는 참고 정보입니다. 지점 운영 방침과 서류 요건은 방문 전 직접 확인하세요.</p>
      </div>
    </Page>
  );
}
export function BranchExperiencePage() {
  return (
    <Page title="지점 현장 경험 카드">
      <h2 className="section-title">지점 현장 경험</h2>
      <p className="page-lede">
        다른 외국인 직원의 실제 방문 경험입니다. 참고용 정보이며 계좌 개설을 보장하지 않습니다.
      </p>
      <div className="surface-card">
        <p className="page-note">공식 정보</p>
        <h3 className="card-title">하나은행 대전둔산지점</h3>
        <p>운영 시간: 평일 09:00 - 16:00</p>
        <p>외국인 창구: 전용 창구 운영</p>
        <p>위치: 대전 서구 둔산중로 89</p>
        <a className="font-semibold underline" href="https://www.kebhana.com" target="_blank" rel="noreferrer">
          은행 공식 안내 확인 ↗
        </a>
      </div>
      <div className="surface-card mt-4">
        <p className="page-note">현장 경험</p>
        <p>계좌 개설 성공 · 2025.04</p>
        <p>실제 요구 서류: 여권, 외국인등록증, 재직증명서</p>
        <p>외국인 창구 직원이 영어로 안내했으며 서류가 모두 있으면 당일 개설이 가능했습니다.</p>
      </div>
      <Link className="primary-action mt-6 w-full no-underline" to="/bank-share">
        내 경험 공유하기
      </Link>
    </Page>
  );
}
export function BankOfficialPage() {
  return (
    <Page title="은행 공식 안내 링크">
      <h2 className="section-title">계좌 개설 공식 안내</h2>
      <p className="page-lede">은행 공식 사이트에서 제공하는 정보입니다. 최신 내용을 반드시 확인하세요.</p>
      {["국민은행 (Kookmin Bank)", "우리은행 (Woori Bank)", "신한은행 (Shinhan Bank)"].map((bank) => (
        <div className="surface-card mb-4" key={bank}>
          <h3 className="card-title">{bank}</h3>
          <p className="page-note">공식 출처</p>
          <a className="underline" href="https://www.kbstar.com" target="_blank" rel="noreferrer">
            외국인계좌 안내 ↗
          </a>
          <p className="page-note">준비 서류 예시: 여권, 외국인등록증, 주소 증명 서류</p>
        </div>
      ))}
    </Page>
  );
}
export function BankSharePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    navigate(location.search ? "/submission-complete" : "/privacy-warning");
  };
  return (
    <Page title="은행 경험 공유">
      <form onSubmit={submit}>
        <h2 className="section-title">은행 방문 경험 공유</h2>
        <p className="page-lede">
          내 경험이 같은 지역 외국인 동료에게 도움이 됩니다. 계좌번호·외국인등록번호·연락처는 입력하지 마세요.
        </p>
        <TextField label="은행 및 지점 이름" />
        <TextField label="방문 날짜" />
        <TextField label="외국인 응대 경험" />
        <TextField label="방문 결과" />
        <label className="field-label">
          <span>현장에서 겪은 점</span>
          <textarea className="field-control min-h-32" defaultValue="현장에서 겪은 점을 자유롭게 작성해 주세요." />
        </label>
        <label className="field-label">
          <span>실제 안내받은 준비 서류</span>
          <textarea className="field-control min-h-32" defaultValue="서류 목록을 작성해 주세요." />
        </label>
        <label className="mt-6 flex gap-3">
          <input type="checkbox" required />
          <span>위 내용을 확인했으며, 개인·금융 정보를 포함하지 않았습니다.</span>
        </label>
        <FormButton>경험 제출하기</FormButton>
      </form>
    </Page>
  );
}
export function PrivacyWarningPage() {
  return (
    <Page title="개인정보 경고 화면">
      <h2 className="section-title">제출이 잠시 멈췄어요</h2>
      <p className="page-lede">
        작성하신 내용에 공유하면 안 되는 개인정보가 포함되어 있어요. 아래 안내를 확인하고 해당 부분을 삭제한 뒤 다시
        제출해 주세요.
      </p>
      <div className="surface-card">
        <h2 className="card-title">감지된 정보 유형</h2>
        <div className="surface-card">
          <strong>계좌번호</strong>
          <p className="page-note">은행 계좌번호는 타인에게 노출될 경우 금융 피해로 이어질 수 있어요.</p>
        </div>
        <div className="surface-card">
          <strong>연락처</strong>
          <p className="page-note">전화번호나 이메일은 스팸·사기에 이용될 수 있어요.</p>
        </div>
      </div>
      <div className="surface-card mt-4">
        <h2 className="card-title">수정 방법</h2>
        <p>1. 경험 공유 화면으로 돌아가세요.</p>
        <p>2. 감지된 정보에 해당하는 문장이나 숫자를 찾아 삭제하세요.</p>
        <p>3. 개인정보 없이 경험 내용만 남긴 뒤 다시 제출해 주세요.</p>
      </div>
      <Link className="primary-action mt-6 w-full no-underline" to="/bank-share?clean=1">
        수정하고 다시 제출하기
      </Link>
    </Page>
  );
}
export function SubmissionCompletePage() {
  return (
    <Page title="경험 제출 완료">
      <div className="result-panel">
        <div className="result-icon">✓</div>
        <h2>경험이 제출되었습니다</h2>
        <p>소중한 정보 감사합니다.</p>
      </div>
      <h2 className="section-title">다음 단계</h2>
      <ul className="page-lede">
        <li>제출한 경험은 검토 후 다른 직원의 은행 지점 추천에 반영됩니다.</li>
        <li>계좌번호, 등록번호, 연락처 등 민감 정보는 공유되지 않습니다.</li>
      </ul>
      <Link className="primary-action mt-6 w-full no-underline" to="/timeline">
        홈으로 돌아가기
      </Link>
    </Page>
  );
}
