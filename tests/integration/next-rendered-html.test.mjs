import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
const html = name => fs.readFileSync(new URL(`../../.next/server/app/${name}.html`, import.meta.url), 'utf8');
test('common landing page presents both tools and the shared disclosure', () => {
 const root = html('index');
 for (const text of ['메뚜기가 만든 개인정보 보호 자가 점검 도구','위험도 분석 시작하기','안전성 확보조치 점검 시작하기','비공식 참고 도구','실제 개인정보를 입력하지 마십시오','href="/risk"','href="/safeguards"','id="tools"','id="usage"']) assert.ok(root.includes(text), text);
 assert.doesNotMatch(root, /name="codex-preview"/);
});
test('both tools retain their own titles and navigation back to the common home', () => {
 const risk = html('risk'), safeguards = html('safeguards');
 for (const text of ['메뚜기가 만든 개인정보 위험도 분석 자가 점검 도구','대상 확인','자가점검','결과','조사·처분 사례','id="about-risk"','href="/"']) assert.ok(risk.includes(text),text);
 for (const text of ['개인정보 안전성 확보조치','실제 개인정보를 입력하지 마십시오','href="/"','href="/risk"']) assert.ok(safeguards.includes(text),text);
});
