import assert from "node:assert/strict";
import test from "node:test";
import { loadTypeScript } from "./helpers/load-typescript.mjs";
const load = name => loadTypeScript("../lib/ai-hacking/" + name + ".ts", import.meta.url);
const { evaluate, summarize, improvements, formatRate } = await load("assessment");
const { initialState, parseAssessment, storageKey } = await load("storage");
const { questions } = await load("questions");
const excluded = state => evaluate(questions,state).filter(r => r.automatic).map(r => r.question.id);
const answer = (status, reason = "") => ({status, reason});

test("unknown technologies keep all questions applicable; each no excludes only its reviewed subset", () => {
  const sets = {
    java: ["C-01","C-02","C-03","G-02"], php: ["C-04","C-05","C-06","E-03","G-01"],
    db: ["E-01","E-02","E-03","E-04","F-01"], vendor: ["A-04","G-01","G-02","G-03"],
  };
  const state = initialState();
  const values = ["unknown","yes","no"];
  for (const java of values) for (const php of values) for (const db of values) for (const vendor of values) {
    Object.assign(state.profile, {java, php, db, vendor});
    const expected = new Set(Object.keys(sets).filter(t => state.profile[t] === "no").flatMap(t => sets[t]));
    assert.deepEqual(new Set(excluded(state)), expected);
  }
});

test("all five states are distinct in counts, priority list, reasons and applicable denominators", () => {
  const state = initialState();
  state.answers = {"A-01":answer("pass"), "B-01":answer("fail"), "C-03":answer("review"), "D-01":answer("na","외부 연계 없음")};
  const rows = evaluate(questions,state);
  assert.deepEqual(summarize(rows), {total:34,applicable:33,answered:3,pass:1,fail:1,review:1,na:1,pending:30,progress:9,compliance:3});
  assert.deepEqual(improvements(rows).map(r=>r.question.id), ["C-03","B-01"]);
  assert.equal(rows.find(r => r.question.id === "D-01").reason,"외부 연계 없음");
  state.answers = Object.fromEntries(questions.map(q => [q.id,answer("na")]));
  const empty = summarize(evaluate(questions,state));
  assert.equal(empty.compliance,null); assert.equal(empty.progress,null); assert.equal(formatRate(null),"산정 대상 없음");
  for (const status of ["pass","fail","review","pending"]) {
    state.answers = Object.fromEntries(questions.map(q => [q.id,answer(status)]));
    const c = summarize(evaluate(questions,state));
    assert.equal(c[status],34); assert.equal(c.compliance,status === "pass" ? 100 : 0);
    assert.equal(c.progress,status === "pending" ? 0 : 100);
  }
});

test("automatic exclusions are reversible and do not overwrite manual reasons or prior answers", () => {
  const s = initialState();
  s.answers["C-03"] = answer("fail"); s.answers["G-02"] = answer("na","수탁 범위에서 Java 미사용");
  s.profile.java = "no"; s.profile.vendor = "no";
  let r = evaluate(questions, s).find(r => r.question.id === "G-02");
  assert.equal(r.automatic,true); assert.match(r.reason,/Java 미사용/); assert.match(r.reason,/환경 없음/);
  assert.equal(improvements(evaluate(questions,s)).length,0);
  s.profile.java = "yes"; s.profile.vendor = "unknown";
  r = evaluate(questions,s).find(r => r.question.id === "G-02");
  assert.deepEqual([r.automatic,r.reason],[false,"수탁 범위에서 Java 미사용"]);
  assert.equal(improvements(evaluate(questions,s))[0].question.id,"C-03");
});

test("storage and downloadable report restore the same inputs, step and area; reject foreign or malformed inputs", () => {
  assert.ok(!["privacy-risk-self-check-v1","grasshopper-safeguards-check-v1","grasshopper-reader-preferences-v1"].includes(storageKey));
  const s = initialState("2026-11-22"); s.step="check"; s.area="D"; s.answers["D-02"]=answer("na","연계 없음");
  assert.deepEqual(parseAssessment(JSON.stringify({...s, summary:{pass:9000}})),s);
  for (const change of [{tool:"other"},{version:2},{area:"H"},{step:"no"},{answers:[]},
    {answers:{"Z-01":answer("pass")}},{answers:{"A-01":answer("guess")}},{answers:{"A-01":answer("na","가".repeat(201))}},
    {profile:{...s.profile,date:"2026-02-31"}},{profile:{...s.profile,java:"false"}}]) {
    assert.throws(() => parseAssessment(JSON.stringify({...s,...change})));
  }
  assert.throws(() => parseAssessment("{"));
});
