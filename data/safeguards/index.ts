import { applicabilityQuestions } from './applicability';
import { generalQuestions } from './general';
import { publicQuestions } from './public-system';
import { riskQuestions } from './encryption-risk';
export { applicabilityQuestions, generalQuestions, publicQuestions, riskQuestions };
export const questions = [...generalQuestions, ...publicQuestions, ...riskQuestions];
export const sourceVersion = '2025-9호 / 안내서 2025.11 / 대응표 1.0 (2026-09-18)';
export const disclaimer = '이 도구는 개인정보 보호 실무자의 자가점검을 지원하기 위해 제작된 비공식 참고 도구입니다. 개별 사안의 법적 적합성 또는 개인정보 보호법 위반 여부를 확정하는 자료가 아닙니다.';
export const dateNotice = '2026-11-01 이전에는 일부 개정 문항을 준비평가로 구분합니다. 종전 의무는 별도로 존재하며 면제되지 않습니다. 이 대응표만으로 시행 전 법적 적합성을 완전히 자동 판정할 수 없으며 종전 조문 버전의 별도 확인이 필요합니다.';
