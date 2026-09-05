import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { transformWithOxc } from "vite";

const loadTypeScript = async (relativePath, replacements = []) => {
  const fileUrl = new URL(relativePath, import.meta.url);
  let source = fs.readFileSync(fileUrl, "utf8");
  for (const [from, to] of replacements) source = source.replace(from, to);
  const transformed = await transformWithOxc(source, fileUrl.pathname, {
    lang: "ts",
    module: "esm",
    target: "es2022",
  });
  return import(`data:text/javascript;base64,${Buffer.from(transformed.code).toString("base64")}`);
};

const historicalModule = await loadTypeScript("../app/historical-cases-data.ts");
const historicalCaseRecords = historicalModule.historicalCaseRecords;
const caseModule = await loadTypeScript("../app/cases-data.ts", [
  [
    'import { historicalCaseRecords } from "./historical-cases-data";',
    `const historicalCaseRecords = ${JSON.stringify(historicalCaseRecords)};`,
  ],
]);
const decisionModule = await loadTypeScript("../app/decision-data.ts");

const caseRecords = caseModule.caseRecords;
const publicDecisionsByCase = decisionModule.publicDecisionsByCase;
const existingCaseRecords = caseRecords.filter((record) => !record.id.startsWith("historic-"));
const pageSource = fs.readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");

const countByItem = (records) => Object.fromEntries(
  Array.from({ length: 26 }, (_, index) => {
    const itemId = index + 1;
    return [String(itemId), records.filter((record) => record.itemIds.includes(itemId)).length];
  }),
);

test("preserves 53 cases and merges exactly 56 historical cases", () => {
  assert.equal(existingCaseRecords.length, 53);
  assert.equal(historicalCaseRecords.length, 56);
  assert.equal(caseRecords.length, 109);
  assert.equal(new Set(caseRecords.map((record) => record.id)).size, 109);
  assert.deepEqual(
    Object.fromEntries(["2020", "2021", "2022", "2023"].map((year) => [
      year,
      historicalCaseRecords.filter((record) => record.date.startsWith(year)).length,
    ])),
    { 2020: 1, 2021: 8, 2022: 20, 2023: 27 },
  );
});

test("matches the verified 26-item mapping totals", () => {
  assert.deepEqual(countByItem(historicalCaseRecords), {
    1: 0, 2: 0, 3: 5, 4: 0, 5: 0, 6: 37, 7: 0, 8: 41, 9: 1,
    10: 3, 11: 3, 12: 2, 13: 0, 14: 42, 15: 10, 16: 0, 17: 9,
    18: 6, 19: 45, 20: 1, 21: 0, 22: 1, 23: 3, 24: 0, 25: 43, 26: 10,
  });
  assert.deepEqual(countByItem(caseRecords), {
    1: 7, 2: 11, 3: 13, 4: 0, 5: 1, 6: 64, 7: 1, 8: 77, 9: 6,
    10: 27, 11: 12, 12: 24, 13: 0, 14: 62, 15: 28, 16: 1, 17: 29,
    18: 8, 19: 81, 20: 9, 21: 0, 22: 2, 23: 11, 24: 16, 25: 75, 26: 21,
  });
});

test("always presents all 26 checklist items", () => {
  assert.doesNotMatch(pageSource, /checks\.filter\(\(item\) => !item\.webOnly/);
  assert.match(pageSource, /const applicableChecks = checks;/);
  assert.doesNotMatch(pageSource, /25: "na", 26: "na"/);
});

test("keeps every historical record complete and sorted", () => {
  for (const record of historicalCaseRecords) {
    assert.match(record.id, /^historic-20(20|21|22|23)-\d{2}$/);
    assert.match(record.date, /^20(20|21|22|23)-\d{2}-\d{2}$/);
    assert.ok(record.title && record.targets && record.summary && record.relation);
    assert.ok(record.problems.length && record.learning.length && record.laws.length);
    assert.ok(record.itemIds.every((itemId) => itemId >= 1 && itemId <= 26));
    assert.match(record.source, /^https:\/\/(?:www\.)?(?:korea\.kr|pipc\.go\.kr)\//);
    assert.doesNotMatch(record.source, /utm_|fbclid|gclid/i);
    assert.match(record.historicalNote ?? "", /처분 당시 적용 법령/);
  }
  assert.deepEqual(
    caseRecords.map((record) => record.date),
    caseRecords.map((record) => record.date).toSorted((a, b) => b.localeCompare(a)),
  );
});

test("retains 55 decisions and adds only the verified 17 documents", () => {
  const allDecisions = Object.values(publicDecisionsByCase).flat();
  const historicalDecisionKeys = Object.keys(publicDecisionsByCase).filter((id) => id.startsWith("historic-"));
  assert.equal(Object.keys(publicDecisionsByCase).length, 31);
  assert.equal(allDecisions.length, 72);
  assert.equal(new Set(allDecisions.map((decision) => decision.decisionNo)).size, 72);
  assert.deepEqual(historicalDecisionKeys.toSorted(), [
    "historic-2020-01",
    "historic-2022-02",
    "historic-2022-08",
    "historic-2023-17",
  ]);
  assert.equal(historicalDecisionKeys.reduce((sum, id) => sum + publicDecisionsByCase[id].length, 0), 17);
  assert.equal(publicDecisionsByCase["historic-2023-16"], undefined);
  assert.equal(publicDecisionsByCase["historic-2023-19"], undefined);
  assert.deepEqual(Object.keys(publicDecisionsByCase).filter((id) => !caseRecords.some((record) => record.id === id)), []);
});

test("allows only the one verified shared source for separate meeting items", () => {
  const sources = new Map();
  for (const record of historicalCaseRecords) {
    const ids = sources.get(record.source) ?? [];
    ids.push(record.id);
    sources.set(record.source, ids);
  }
  assert.deepEqual(
    [...sources.entries()].filter(([, ids]) => ids.length > 1),
    [[
      "https://www.korea.kr/news/policyNewsView.do?newsId=156434027",
      ["historic-2021-01", "historic-2021-02"],
    ]],
  );
});
