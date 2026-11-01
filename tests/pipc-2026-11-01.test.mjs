import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {loadTypeScript} from './helpers/load-typescript.mjs';
const load = path => loadTypeScript(path, import.meta.url);
const {caseRecords} = await load('../app/cases-data.ts');
const {caseLinks, caseReviews} = await load('../data/safeguards/case-links.ts');
const {publicDecisionsByCase} = await load('../app/decision-data.ts');
const {CASE_DATA_VERIFIED_AT} = await load('../lib/privacy-risk/dates.ts');

test('separate organizations retain their own sanctions and precise checklist scope', () => {
  const daekyo = caseRecords.find(r => r.id === 'daekyo-2026-10');
  const medical = caseRecords.find(r => r.id === 'younghoon-medical-2026-10');
  assert.deepEqual(daekyo.itemIds, [2, 8, 12]);
  assert.deepEqual(medical.itemIds, [8, 25]);
  assert.ok(daekyo.dispositions.includes('공표명령'));
  assert.ok(!medical.dispositions.includes('공표명령'));
  assert.deepEqual(caseLinks.filter(l => l.caseId === daekyo.id).map(l => l.questionId), ['M-24', 'N-01', 'N-02']);
  assert.deepEqual(caseLinks.filter(l => l.caseId === medical.id).map(l => l.questionId), ['E-01', 'M-26', 'N-05']);
});

test('individual HTML review never upgrades full collection or missing decision status', () => {
  assert.equal(CASE_DATA_VERIFIED_AT, '2026-09-02');
  for (const id of ['daekyo-2026-10', 'younghoon-medical-2026-10']) {
    const record = caseRecords.find(r => r.id === id);
    assert.equal(record.verifiedAt, '2026-11-01');
    assert.equal(new URL(record.source).searchParams.get('nttId'), '12600');
    assert.equal(publicDecisionsByCase[id], undefined);
    assert.match(record.historicalNote, /公開|공개 여부/);
    assert.match(caseReviews[id].sourceLocator, /HTML/);
  }
  const home = fs.readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
  assert.ok(!home.includes('개인정보보호위원회 공식자료 확인 기준일: 2026. 11. 1.'));
  const modal = fs.readFileSync(new URL('../components/privacy-risk/CaseModal.tsx', import.meta.url), 'utf8');
  assert.ok(!modal.includes('문서가 없습니다'));
  assert.ok(modal.includes('record.verifiedAt ?? CASE_DATA_VERIFIED_AT'));
});
