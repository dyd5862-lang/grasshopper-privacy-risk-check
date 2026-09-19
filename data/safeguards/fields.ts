export type Field = { key: string; label: string; options?: [string,string][]; number?: boolean };
export const triOptions: [string,string][] = [['UNKNOWN','추가 확인'],['YES','예'],['NO','아니요']];
export const fields: Record<string, Field[]> = {
 'F-01':[{key:'entity',label:'법적 지위',options:[['UNKNOWN','추가 확인'],['public','공공기관'],['large','대기업'],['mid','중견기업'],['sme','중소기업'],['small','소상공인(중소기업 포함)'],['individual','개인'],['group','단체']]}],
 'F-02':[{key:'count',label:'처리자 전체 정보주체 수 (미확인은 공란)',number:true}],
 'F-03':[],
 'F-04':[{key:'system',label:'개인정보처리시스템 운영'}],
 'F-05':[{key:'userInfo',label:'이용자 정보 처리'},{key:'nonUserInfo',label:'비이용자 정보 처리'}],
 'F-06':[{key:'password',label:'비밀번호 저장'},{key:'auth',label:'비밀번호 외 인증정보 저장'},{key:'rrn',label:'주민등록번호 처리'},{key:'otherUid',label:'여권·운전면허·외국인등록번호 처리'},{key:'sensitive',label:'민감정보 처리'},{key:'card',label:'신용카드번호 처리'},{key:'account',label:'계좌번호 처리'},{key:'bio',label:'생체인식정보 처리'}],
 'F-07':[{key:'internet',label:'인터넷망 저장'},{key:'dmz',label:'DMZ 저장'},{key:'internal',label:'내부망 저장'},{key:'pc',label:'PC 저장'},{key:'mobile',label:'모바일 저장'},{key:'media',label:'보조저장매체 저장'},{key:'transInternet',label:'개인정보 인터넷 송수신'},{key:'transAuth',label:'인증정보 송수신 (내부망 포함)'},{key:'encrypted',label:'암호화 개인정보 보관'}],
 'F-08':[{key:'millionUsers',label:'전년도 10~12월 저장·관리 이용자 일일평균 100만명 이상'}],
 'F-09':[{key:'adminRights',label:'접근 권한 설정 권한이 있는 단말 존재'},{key:'downloadRights',label:'다운로드·파기 권한이 있는 단말 존재'},{key:'specialRights',label:'민감정보 또는 제7조제1·2항 정보 다운로드·파기 권한 단말 존재'},{key:'cloud',label:'차단 의무 대상 단말의 클라우드 서비스 사용'},{key:'omitBlock',label:'제6조의2제1항제2호 단말에 인터넷망 차단 생략 경로 선택'}],
 'F-10':[{key:'system50k',label:'해당 시스템 정보주체 5만명 이상'},{key:'telco',label:'기간통신사업자 해당'}],
 'F-11':[{key:'designated',label:'지정 공고·통보로 공공시스템 지정 확인 (규모와 별개)'}],
 'F-12':[{key:'operator',label:'실질적인 운영기관 역할'},{key:'userAgency',label:'이용기관 역할'},{key:'directAccounts',label:'이용기관으로서 계정 직접 부여·관리'},{key:'developer',label:'별도 공공 개발·배포기관 역할'},{key:'userAgencies',label:'해당 시스템 이용기관 존재'}],
 'F-13':[{key:'external',label:'정당한 권한자의 외부접속 (정보주체 본인 제외)'},{key:'web',label:'홈페이지·앱·클라우드 저장소 운영'},{key:'sharing',label:'P2P·공유폴더·원격접속 기능 존재'},{key:'devices',label:'업무용 정보기기 사용'},{key:'physical',label:'별도 전산실·자료보관실 존재'},{key:'paper',label:'개인정보 서류 보유'},{key:'output',label:'출력·복사 업무 (화면표시·파일생성 포함)'},{key:'dispose',label:'파기 대상 개인정보·매체 존재'},{key:'outsourcing',label:'개인정보 처리위탁·외주인력 존재'},{key:'education',label:'보호책임자·취급자 교육 대상 존재'}],
 'F-14':[{key:'riskIntent',label:'암호화 미적용 위험도 분석 경로 선택'},{key:'riskSubject',label:'이번 암호화 판단 대상의 정보주체',options:[['UNKNOWN','추가 확인'],['nonuser','비이용자'],['user','이용자']]},{key:'riskType',label:'이번 암호화 판단 대상 정보',options:[['UNKNOWN','추가 확인'],['otherUid','여권·운전면허·외국인등록번호'],['rrn','주민등록번호'],['other','그 밖의 정보']]},{key:'riskLocation',label:'이번 암호화 판단 대상의 저장 위치',options:[['UNKNOWN','추가 확인'],['internal','내부망'],['internet','인터넷망'],['dmz','DMZ']]},{key:'dpia',label:'영향평가 대상 공공기관에 해당'}],
 'F-15':[]
};
