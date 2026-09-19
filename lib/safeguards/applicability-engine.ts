import type { Tri, State, Conditions, Question } from './types';
export const and = (...v: Tri[]): Tri => v.includes('NO') ? 'NO' : v.includes('UNKNOWN') ? 'UNKNOWN' : 'YES';
export const or = (...v: Tri[]): Tri => v.includes('YES') ? 'YES' : v.includes('UNKNOWN') ? 'UNKNOWN' : 'NO';
export const not = (v: Tri): Tri => v === 'UNKNOWN' ? v : v === 'YES' ? 'NO' : 'YES';
export const fact = (s: State, key: string): Tri => s.facts[key] === 'YES' ? 'YES' : s.facts[key] === 'NO' ? 'NO' : 'UNKNOWN';
const equals = (s: State, key: string, value: string): Tri => !s.facts[key] || s.facts[key] === 'UNKNOWN' ? 'UNKNOWN' : s.facts[key] === value ? 'YES' : 'NO';
export function conditions(s: State): Conditions {
 const entity = s.facts.entity;
 const entityLabel: Record<string,string> = {public:'공공기관',large:'대기업',mid:'중견기업',sme:'중소기업',small:'소상공인(중소기업 포함)',individual:'개인',group:'단체'};
 const n = s.facts.count?.trim() ? Number(s.facts.count) : NaN;
 const valid = Number.isSafeInteger(n) && n >= 0;
 const small: Tri = !entity || entity === 'UNKNOWN' ? 'UNKNOWN' : ['small','individual','group'].includes(entity) ? 'YES' : 'NO';
 const below: Tri = valid ? n < 10000 ? 'YES' : 'NO' : 'UNKNOWN';
 const M = not(and(small, below));
 let G: Tri = 'UNKNOWN';
 if (entity && entity !== 'UNKNOWN' && valid) {
   G = ['public','large','mid'].includes(entity) ? n >= 100000 ? 'YES':'NO' : ['sme','small','group'].includes(entity) ? n >= 1000000 ? 'YES':'NO' : 'NO';
 }
 const designation = fact(s,'designated') === 'YES' && !s.factNotes['F-11']?.trim() ? 'UNKNOWN' : fact(s,'designated');
 const P = and(designation, fact(s,'operator'));
 const U = and(designation, fact(s,'userAgency'), fact(s,'directAccounts'));
 const R = and(fact(s,'riskIntent'),equals(s,'riskSubject','nonuser'), equals(s,'riskType','otherUid'), equals(s,'riskLocation','internal'), fact(s,'nonUserInfo'),fact(s,'otherUid'),fact(s,'internal'),not(fact(s,'dpia')));
 return {
  M:{value:M,reason:`F-01·F-02: 유형=${entityLabel[entity] || '추가 확인'}, 처리자 전체=${valid ? n+'명' : '추가 확인'}. 1만명 미만이며 소상공인·개인·단체인 경우만 계획 생략 대상.`},
  G:{value:G,reason:'F-01~F-03: 공공기관·대기업·중견기업 10만명 이상, 중소기업·단체 100만명 이상. 처리자 전체 기준.'},
  I:{value:fact(s,'millionUsers'),reason:'F-08: 전년도 10~12월 저장·관리 이용자 일일평균 100만명 이상 여부. 로그인 수가 아님.'},
  P:{value:P,reason:'F-11 지정 공고·통보 확인근거 + F-12 실질 운영기관 역할. 규모만으로 지정 판정하지 않음.'},
  U:{value:U,reason:'F-11 지정 공고·통보 확인근거 + F-12 이용기관 역할 및 계정 직접 부여·관리.'},
  R:{value:R,reason:'F-05~F-07·F-14: 비이용자 + 주민등록번호 외 고유식별정보 + 내부망 저장 + 위험도 분석 경로 선택 + 영향평가 대상 아님. 주민등록번호·이용자·인터넷망·DMZ에는 적용하지 않음.'}
 };
}
export function contextKey(s: State): string {
 return JSON.stringify([s.profile.date, Object.entries(s.facts).sort(([a],[b])=>a.localeCompare(b)), s.factNotes['F-11'] || '']);
}
// All gates are tied to named preconditions; remaining asset/event scope is confirmed per row.
export function gate(q: Question, s: State): { value: Tri; needsScope: boolean; reason: string } {
 const c = conditions(s), f=(key:string)=>fact(s,key), id=q.id;
 const system=f('system'), device=or(system,f('devices'),f('pc'),f('mobile'));
 const uid=or(f('rrn'),f('otherUid')), portable=or(f('pc'),f('mobile'),f('media'));
 const encryption=or(f('password'),f('auth'),uid,f('card'),f('account'),f('bio'),f('transInternet'),f('transAuth'),and(f('userInfo'),portable));
 const L2=or(f('system50k'),uid,f('sensitive'),f('telco'));
 let value: Tri='UNKNOWN', needsScope=false;
 const direct: Record<string,Tri>={
 'B-01':'YES', 'M-20':f('education'),'M-21':f('education'),'M-24':'YES','M-25':'YES','M-27':f('outsourcing'),
 'A-01':system,'A-02':system,'A-03':system,'A-04':system,'A-05':system,'A-06':device,'A-07':system,
 'N-01':system,'N-02':system,'N-03':and(system,f('external'),f('userInfo')),'N-04':and(system,f('external'),f('nonUserInfo')),
 'N-05':f('web'),'N-06':f('sharing'),'N-07':system,'N-08':or(f('mobile'),f('devices')),
 'I-01':and(c.I.value,f('adminRights')),'I-02':and(c.I.value,f('downloadRights')),'I-03':and(c.I.value,f('cloud'),or(f('adminRights'),f('downloadRights'))),
 'I-04':and(c.I.value,f('downloadRights'),f('omitBlock')),'I-05':and(c.I.value,f('specialRights')),'I-06':and(c.I.value,f('downloadRights'),f('omitBlock')),
 'E-01':f('password'),'E-02':f('auth'),'E-03':f('transAuth'),'E-04':and(f('userInfo'),uid),'E-05':and(f('userInfo'),or(f('card'),f('account'))),'E-06':and(f('userInfo'),f('bio')),
 'E-07':and(f('nonUserInfo'),uid,or(f('internet'),f('dmz'))),'E-08':and(f('internal'),f('rrn')),'E-09':and(f('nonUserInfo'),f('otherUid'),f('internal')),
 'E-10':f('transInternet'),'E-11':and(f('userInfo'),portable),'E-12':and(f('nonUserInfo'),or(uid,f('bio')),portable),
 'E-13':and(c.G.value,f('encrypted')),'E-14':and(c.G.value,f('encrypted')),
 'L-01':system,'L-02':system,'L-03':and(system,not(L2)),'L-04':and(system,L2),'L-05':system,'L-06':system,'L-07':system,'L-08':system,
 'V-01':device,'V-02':device,'V-03':device,'V-04':device,
 'P-01':f('physical'),'P-02':f('physical'),'P-03':or(f('paper'),f('media')),'P-04':f('media'),
 'D-01':and(c.G.value,system),'D-02':and(c.G.value,system),'D-03':and(c.G.value,system),
 'O-01':and(system,f('output')),'O-02':and(system,f('output')),'O-03':f('output'),
 'X-01':f('dispose'),'X-02':f('dispose'),'X-03':and(f('dispose'),f('paper')),'X-04':f('dispose'),
 'H-01':c.P.value,'H-02':or(c.P.value,c.U.value),'H-03':or(c.P.value,c.U.value),'H-04':or(c.P.value,c.U.value),'H-05':or(c.P.value,c.U.value),'H-06':or(c.P.value,c.U.value),
 'T-01':c.P.value,'T-02':c.P.value,'T-03':and(c.P.value,f('userAgencies')),
 'G-01':and(c.P.value,f('userAgencies')),'G-02':or(c.P.value,and(f('designated') === 'YES' && !s.factNotes['F-11']?.trim() ? 'UNKNOWN':f('designated'),f('developer'))),
 'G-03':c.P.value,'G-04':c.P.value,'G-05':and(f('designated') === 'YES' && !s.factNotes['F-11']?.trim() ? 'UNKNOWN':f('designated'),or(f('operator'),f('userAgency')))
 };
 if(id.startsWith('M-') && !(id in direct)) {
   value=c.M.value;
   const extra: Record<string,Tri>={'M-06':system,'M-07':device,'M-08':encryption,'M-09':system,'M-10':device,'M-12':or(f('physical'),f('paper'),f('media')),'M-13':f('output'),'M-17':f('outsourcing'),'M-26':device};
   if(id in extra)value=and(value,extra[id]);
 } else if(id.startsWith('S-')) value=c.P.value;
 else if(id.startsWith('R-')) {
   value=c.R.value;
   if(id==='R-03')value=and(value,f('outsourcing'));
   if(['R-25','R-26'].includes(id))value=and(value,f('web'));
 } else value=direct[id]??'UNKNOWN';
 const residual=['M-19','M-22','M-23','M-24','M-25','A-02','A-03','A-04','A-05','A-06','A-07','N-01','N-02','N-08','I-06','E-04','E-05','E-06','E-07','E-08','E-09','E-11','E-12','P-04','O-03','X-02','X-03','X-04','H-03','H-04','H-05','T-02','G-03','G-04','G-05','R-04','R-05','R-16','R-24','R-29'];
 needsScope=residual.includes(id);
 const core=value;
 if(needsScope && value !== 'NO') {
   const scope=s.scopes[id];
   const confirmed=scope?.context === contextKey(s) ? scope.value : 'UNKNOWN';
   // A manual exclusion needs a reason AND internal reference. It cannot override an unknown core gate.
   const scopeValue=confirmed==='NO' && (!scope?.reason.trim() || !scope?.evidenceRef.trim()) ? 'UNKNOWN' : confirmed;
   value=and(value,scopeValue);
 }
 return {value,needsScope,reason:`${q.applicability} / 사전조건: ${core === 'YES'?'해당':core === 'NO'?'비적용':'추가 확인'}${needsScope ? ' / 문항별 대상·예외·업무 범위를 추가 확인' : ''}`};
}
