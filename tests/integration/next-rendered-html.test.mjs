import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
test('Next.js production HTML preserves service title, disclosure and all main navigation',()=>{
 const html=fs.readFileSync(new URL('../../.next/server/app/index.html',import.meta.url),'utf8');
 for(const text of ['메뚜기가 만든 개인정보 위험도 분석 자가 점검 도구','대상 확인','자가점검','결과','조사·처분 사례','비공식 참고 도구'])assert.ok(html.includes(text),text);
 assert.doesNotMatch(html,/name="codex-preview"/);
});
