import assert from 'node:assert/strict';
import test from 'node:test';
import { casePeriodCutoff, localDateKey, CASE_DATA_VERIFIED_AT } from '../lib/privacy-risk/dates.ts';
test('relative periods use supplied current date, independently of verification metadata', () => {
  const now = new Date(2028,8,18);
  for(const years of ['1','3','5']) assert.equal(casePeriodCutoff(years,now),`${2028-Number(years)}-09-18`);
  assert.equal(casePeriodCutoff('all',now),null);
  assert.equal(CASE_DATA_VERIFIED_AT,'2026-09-02');
});
test('leap anniversary clamps to last day of February',()=>assert.equal(casePeriodCutoff('1',new Date(2028,1,29)),'2027-02-28'));
test('default clock uses current local date',()=>assert.equal(localDateKey(),localDateKey(new Date())));
