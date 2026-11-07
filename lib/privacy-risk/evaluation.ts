import type { Profile, Answer } from "./types";
export type AssessmentCounts = {
  yes: number;
  no: number;
  unknown: number;
  na: number;
  evidenceMissing: number;
};

export function evaluateAssessment(counts: AssessmentCounts, total: number) {
  const unanswered = Math.max(0, total - counts.yes - counts.no - counts.unknown - counts.na);
  if (counts.no > 0) {
    return { unanswered, level: "high", priority: "높음", symbol: "!", message: "보완이 필요한 보호조치가 있습니다" } as const;
  }
  if (counts.unknown > 0 || counts.evidenceMissing > 0 || unanswered > 0) {
    return { unanswered, level: "medium", priority: "보통", symbol: "△", message: "추가 확인과 증적 보완이 필요합니다" } as const;
  }
  return { unanswered, level: "low", priority: "낮음", symbol: "✓", message: "입력 기준 보호조치가 충족되었습니다" } as const;
}

// Scope for the guide appendix, separate from the existing improvement priority.
export function encryptionConclusion(profile: Profile, answers: Record<number, Answer>): string {
 if(!profile.assessmentDate || !/^\d{4}-\d{2}-\d{2}$/.test(profile.assessmentDate) || Number.isNaN(Date.parse(profile.assessmentDate)) || new Date(profile.assessmentDate).toISOString().slice(0,10)!==profile.assessmentDate)return '유효한 점검 기준일을 확인해야 암호화 적용 여부를 판단할 수 있습니다.';
 const resident = profile.identifiers.includes('주민등록번호');
 const prefix = resident ? '주민등록번호는 이 분석과 관계없이 별도로 암호화하여야 합니다. ' : '';
 const other = profile.identifiers.some(id=>['여권번호','운전면허번호','외국인등록번호'].includes(id));
 if(!other)return prefix+'주민등록번호 외 대상 고유식별정보가 확인되지 않았습니다. 암호화 예외를 판단하지 않습니다.';
 if(profile.subjectType==='user' || ['internet','dmz'].includes(profile.storageLocation??''))return prefix+'이용자 정보 또는 인터넷망·DMZ 저장 정보에는 이 부록을 통한 암호화 예외를 적용할 수 없습니다. 해당 암호화 의무를 확인하세요.';
 if(profile.organizationType==='공공기관' && profile.dpia==='yes')return prefix+'개인정보 영향평가 대상 공공기관은 해당 영향평가 결과에 따라 암호화 적용 여부·범위를 확인해야 합니다.';
 if(profile.subjectType!=='nonuser'||profile.storageLocation!=='internal'||(profile.organizationType==='공공기관'&&profile.dpia!=='no')||profile.storage==='unknown')return prefix+'적용대상 추가 확인: 비이용자 여부, 내부망 저장, 암호화 현황 및 영향평가 대상 여부를 확인하기 전에는 암호화 미적용 결론을 내릴 수 없습니다.';
 if(profile.storage==='all')return prefix+'현재 대상 정보를 모두 암호화하여 저장 중입니다. 암호화 방식과 키 관리도 확인하세요.';
 if(Array.from({length:26},(_,i)=>answers[i+1]).includes('no'))return prefix+'26개 항목 중 하나라도 ‘아니요’이면 해당 개인정보파일을 암호화하여야 합니다(안내서 170쪽). 보완 후 재분석할 수 있으나 미흡이 남은 상태에서는 암호화 예외를 인정하지 않습니다.';
 if(Array.from({length:26},(_,i)=>answers[i+1]).some(a=>!a||a==='unknown'))return prefix+'점검 미완료: 미답변·추가 확인 항목을 해소해야 합니다.';
 return prefix+'26개 항목에 ‘아니요’는 없습니다. 근거가 확인된 ‘해당 없음’은 ‘예’로 적용합니다. 파일별 증적·적용범위·보호책임자 또는 부서장 승인 후 결과를 보관하고 운영환경 변경 시 재분석하세요. 영구적 암호화 면제를 의미하지 않습니다.';
}
