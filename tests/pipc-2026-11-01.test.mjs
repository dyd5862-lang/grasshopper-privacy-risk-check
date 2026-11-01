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
  assert.ok(home.includes('개인정보보호위원회 공식 보도자료 일부 확인·반영:'));
  assert.ok(home.includes('공식자료 전체 전수 대조는 진행 중입니다.'));
  const modal = fs.readFileSync(new URL('../components/privacy-risk/CaseModal.tsx', import.meta.url), 'utf8');
  assert.ok(!modal.includes('문서가 없습니다'));
  assert.ok(modal.includes('record.verifiedAt ?? CASE_DATA_VERIFIED_AT'));
});

test('decision-only additions retain separate identities, historical rules and limited verification scope', () => {
  const ids = ['jenertec-2026-217-390', 'sbridge-2026-217-391'];
  const records = ids.map(id => caseRecords.find(r => r.id === id));
  assert.deepEqual(records.map(r => r.itemIds), [[6, 12], [8, 14, 25]]);
  assert.deepEqual(records.map(r => r.sourceType), ['개인정보위 공개용 의결서', '개인정보위 공개용 의결서']);
  assert.deepEqual(records.map(r => publicDecisionsByCase[r.id][0].decisionNo), ['제2026-217-390호', '제2026-217-391호']);
  assert.equal(records[0].source, records[1].source);
  assert.deepEqual(records.map(r => r.source), records.map(r => publicDecisionsByCase[r.id][0].agendaUrl));
  assert.ok(records.every(r => new URL(r.source).searchParams.get('idxId') === '2026-0710'));
  assert.ok(records.every(r => !r.dispositions.includes('공표명령')));
  assert.ok(!records[1].dispositions.includes('시정명령'));
  assert.match(records[0].laws.join(' '), /2023-6호/);
  assert.match(records[1].laws.join(' '), /2021-3호/);
  assert.ok(records.every(r => r.historicalNote.includes('이미지 표') && r.historicalNote.includes('작성일을 최초 공개일로 확정하지')));
  assert.equal(CASE_DATA_VERIFIED_AT, '2026-09-02');
});
