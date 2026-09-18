import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateAssessment } from '../lib/privacy-risk/evaluation.ts';
const counts = (overrides = {}) => ({ yes: 0, no: 0, unknown: 0, na: 0, evidenceMissing: 0, ...overrides });
for (const [name, input, priority] of [
  ['26 unanswered', counts(), '보통'],
  ['one unanswered', counts({yes:25}), '보통'],
  ['all yes with evidence', counts({yes:26}), '낮음'],
  ['yes missing evidence', counts({yes:26,evidenceMissing:1}), '보통'],
  ['unknown', counts({yes:25,unknown:1}), '보통'],
  ['no takes precedence', counts({no:1,unknown:1}), '높음'],
  ['not applicable included', counts({yes:25,na:1}), '낮음'],
  ['all 26 answered not applicable', counts({na:26}), '낮음'],
]) test(name, () => assert.equal(evaluateAssessment(input,26).priority,priority));
test('any unanswered item prevents satisfied / low', () => {
  for(let completed=0;completed<26;completed++) {
    const result=evaluateAssessment(counts({yes:completed}),26);
    assert.equal(result.unanswered,26-completed);
    assert.notEqual(result.level,'low');
    assert.doesNotMatch(result.message,/충족되었습니다/);
  }
});
