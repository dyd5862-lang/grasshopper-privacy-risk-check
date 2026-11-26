import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { loadTypeScript } from "./helpers/load-typescript.mjs";

const load = name => loadTypeScript("../lib/ai-hacking/" + name + ".ts", import.meta.url);
const { questions } = await load("questions");
const { sources, passages, advisories } = await load("sources");
const { areaKeys, priorities, techKeys } = await load("model");
const reviewed = {
  A: ["S1","S1","S1","S1 S2 S3"], B: ["S1","S1","S1","S1 S2"],
  C: ["S3","S3","S1 S3","S2","S2","S2"], D: ["S1","S1 S3","S1 S3","S3","S1","S1","S3"],
  E: ["S2 S3","S3","S2","S2 S3"], F: ["S2 S3","S2 S3","S2 S3","S2 S3"],
  G: ["S2","S3","S3","S1","S3"],
};

// Short anchor fragments in the three supplied MDs, separate from the editable paraphrases.
const sourceIndex = {
  S1: { prefix: "[261019", date: "2026. 10. 19.", board: "12586", hash: "bfc0df886673f9832751c9d6d3ee41d9ac7b511fa6aca4547bf2e3cf99cbbc98",
    anchors: {assets:"자산별 이름, 용도",unused:"임시·시험용 시스템",apiInventory:"외부 연계 응용프로그램",apiAccess:"대량·반복 요청",apiKeys:"키·토큰 등 인증정보는 즉시 회수",response:"유출사고에 대비한 대응절차와 담당체계"} },
  S2: { prefix: "[261022", date: "2026. 10. 22.", board: "12588", hash: "0db24cfe6596b43ef1cae589fdf22524c1ed7383be7c1eb5c8866ed77aa5ce7d",
    anchors: {phpPatch:"PHP 사용 시스템의 버전",phpDb:"DB 관리도구의 인터넷 직접",phpLogs:"이상 행위 탐지·차단",phpVendors:"수탁업체 및 호스팅환경"} },
  S3: { prefix: "[261118", date: "2026. 11. 18.", board: "12660", hash: "307e980d27074907c55bcf7bf101d33ed53cdc2c2c67ab38083cb5f53c133a0d",
    anchors: {javaInventory:"컨테이너(Docker 등)에 내장된 Java",javaApi:"정책에 유효하지 않은 API 요청",javaDb:"전체 조회권한을",javaLogs:"수탁업체에서 운영하는 시스템까지 포함",scenario:"인증·권한 체계가 우회된 상황"} },
};

test("all 34 distinct questions retain their reviewed area, required detail and source mapping", () => {
  assert.equal(questions.length, 34);
  assert.equal(new Set(questions.map(q => q.id)).size, 34);
  for (const area of areaKeys) {
    const group = questions.filter(q => q.area === area);
    assert.equal(group.length, reviewed[area].length);
    group.forEach((q, index) => {
      assert.equal(q.id, area + "-" + String(index+1).padStart(2, "0"));
      for (const field of ["title","risk","method","criterion","evidence","action","target","na"]) assert.ok(q[field]?.trim(), q.id + " " + field);
      assert.ok(priorities.includes(q.priority));
      assert.ok(q.requires.every(key => techKeys.includes(key)));
      const ids = [...new Set(q.refs.map(ref => passages[ref].source))].sort();
      assert.equal(ids.join(" "), reviewed[area][index], q.id);
      for (const ref of q.refs) assert.ok(sourceIndex[passages[ref].source].anchors[ref], ref);
      for (const key of q.notices ?? []) assert.ok(advisories[key].url.startsWith("https://"));
    });
  }
  assert.match(questions.find(q => q.id === "G-02").extension, /실무 권고/);
  assert.match(questions.find(q => q.id === "C-03").method, /Java4Shell\(CVE-2026-114938 등\)/);
  assert.match(questions.find(q => q.id === "C-04").method, /PHP2Shell/);
});

test("source titles, dates, official article identifiers and passage locations match the attachment index", () => {
  for (const [id, file] of Object.entries(sourceIndex)) {
    assert.equal(sources[id].date, file.date);
    const url = new URL(sources[id].url);
    assert.equal(url.hostname, "pipc.go.kr");
    assert.equal(url.searchParams.get("nttId"), file.board);
    for (const ref of Object.keys(file.anchors)) {
      assert.equal(passages[ref].source, id);
      assert.match(passages[ref].location, /쪽/);
      assert.ok(passages[ref].summary);
    }
  }
});

// Attachments stay outside the repository. In their presence verify the original bytes and each passage.
const directory = process.env.AI_HACKING_SOURCE_DIR;
if (directory) test("all three supplied originals match their fingerprints, titles and fifteen passage anchors", () => {
  const compact = text => text.replaceAll("#", "").replace(/\s/g, "");
  for (const [id, meta] of Object.entries(sourceIndex)) {
    const name = fs.readdirSync(directory).find(name => name.startsWith(meta.prefix) && name.endsWith(".md"));
    assert.ok(name, id);
    const bytes = fs.readFileSync(path.join(directory, name));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), meta.hash, id);
    const body = compact(bytes.toString("utf8"));
    assert.ok(body.includes(compact(sources[id].title)), id);
    for (const [ref, anchor] of Object.entries(meta.anchors)) assert.ok(body.includes(compact(anchor)), id + " " + ref);
  }
});

test("every reviewed case points to a distinct real question and an identified official document", async () => {
  const { materialLinks, relatedMaterials } = await load("related-materials");
  const items = new Set(questions.map(q => q.id));
  const pairs = new Set();
  const linked = new Set();
  for (const link of materialLinks) {
    const source = relatedMaterials[link.source];
    assert.ok(source.title && /^https:\/\/(www\.)?pipc\.go\.kr\//.test(source.url));
    assert.ok(["직접 관련", "실질 관련"].includes(link.relevance));
    assert.ok(link.reason && link.location && link.questionIds.length);
    if (source.kind === "공개용 의결서") assert.match(source.label, /^제\d{4}-\d{3}-\d{3}호$/);
    for (const id of link.questionIds) {
      assert.ok(items.has(id), id);
      const pair = id + "/" + source.id;
      assert.ok(!pairs.has(pair), pair);
      pairs.add(pair);
    }
    linked.add(link.source);
  }
  assert.equal(linked.size, Object.keys(relatedMaterials).length);
});
