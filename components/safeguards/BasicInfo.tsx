import type { State } from '../../lib/safeguards/types';
import styles from './safeguards.module.css';
export function BasicInfo({state,update}:{state:State;update:(profile:State['profile'])=>void}) {
 return <section className={styles.panel}><h2>기본정보</h2><p className={styles.muted}>기관명·시스템명·파일명은 비워 두어도 점검을 진행할 수 있습니다.</p>
  <div className={styles.grid}>{([['organization','기관 또는 사업자명'],['systemName','개인정보처리시스템명'],['fileName','개인정보파일명'],['date','점검일']] as const).map(([key,label])=><label className={styles.field} key={key}>{label}<input type={key==='date'?'date':'text'} value={state.profile[key]} onChange={e=>update({...state.profile,[key]:e.target.value})} maxLength={200}/></label>)}</div>
 </section>;
}
