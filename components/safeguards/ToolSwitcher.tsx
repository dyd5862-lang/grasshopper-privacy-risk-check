import Link from 'next/link';
import styles from './safeguards.module.css';
export function ToolSwitcher({active}:{active:'risk'|'safeguards'}) {
 return <nav className={`${styles.switcher} no-print`} aria-label="점검도구 선택">
  <Link href="/" aria-current={active==='risk'?'page':undefined}><span>01</span><span>개인정보 위험도 분석 자가 점검 도구<small>메뚜기가 만든 · 기존 26개 점검항목 · 조사·처분 사례</small></span></Link>
  <Link href="/safeguards" aria-current={active==='safeguards'?'page':undefined}><span>02</span><span>개인정보 안전성 확보조치 자가 점검 도구<small>메뚜기가 만든 · 적용대상 확인 · 조문별 보호조치</small></span></Link>
 </nav>;
}
