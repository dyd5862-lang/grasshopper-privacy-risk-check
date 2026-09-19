import type { Metadata } from 'next';
import SafeguardsApp from '../../components/safeguards/SafeguardsApp';
export const metadata: Metadata = {
 title:'메뚜기가 만든 개인정보 안전성 확보조치 자가 점검 도구',
 description:'개인정보의 안전성 확보조치 기준에 따른 적용대상 확인 및 조문별 보호조치 자가점검. 일반·공공시스템·암호화 위험도 분석·개정 준비평가를 구분합니다.'
};
export default function Page(){return <SafeguardsApp/>;}
