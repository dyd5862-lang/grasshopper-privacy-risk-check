"""Lossless extraction of the supplied mapping. Never paraphrases source cells."""
from pathlib import Path
import json, re

root = Path(__file__).resolve().parents[1]
section, pages = '', ''
groups = {'applicability': [], 'general': [], 'public-system': [], 'encryption-risk': []}
for line in (root / 'data/safeguards/source.md').read_text().splitlines():
    if line.startswith('## ') or line.startswith('### '):
        section = re.sub(r'^#+\s*(?:\d+(?:\.\d+)*\.?\s*)?', '', line)
    if line.startswith('근거 위치:'):
        pages = line.removeprefix('근거 위치:').strip()
    if not re.match(r'^\|[A-Z]-\d\d\|', line):
        continue
    c = line.strip('|').split('|')
    id, article, question, applicability, evidence = c[:5]
    fact = id.startswith('F-')
    risk = id.startswith('R-')
    public = id[0] in 'SHTG'
    group = 'applicability' if fact else 'encryption-risk' if risk else 'public-system' if public else 'general'
    criteria = '' if fact else c[5]
    split = criteria.split('미흡:', 1)
    scope = '기관' if id[0] in 'BMSG' else '단말·권한' if id[0] == 'I' else '장소·매체' if id[0] in 'PX' else '개인정보파일' if id[0] in 'ER' else '시스템'
    row = dict(id=id, sourceVersion='2025-9호 / 안내서 2025.11 / 대응표 1.0 (2026-09-18)',
               basisType='사전 확인' if fact else '조건부 기준' if risk else article.split(' · ')[-1].replace(' [유예]', ''),
               article=article, sourcePages='대응표 제2절 및 각 조문' if fact else pages,
               question=question, applicability=applicability,
               effectiveFrom='2026-11-01' if '[유예]' in article else None,
               evaluationMode='APPLICABILITY' if fact else 'CONDITIONAL' if risk else 'OBLIGATION',
               evidenceExamples=evidence, passCriteria=split[0].removeprefix('충족:').strip(),
               failCriteria=split[1].strip() if len(split)>1 else '', criteria=criteria,
               scopeKey=scope, section=section, group=group,
               sourceRow=line)
    groups[group].append(row)
for group, rows in groups.items():
    name = {'applicability':'applicabilityQuestions','general':'generalQuestions','public-system':'publicQuestions','encryption-risk':'riskQuestions'}[group]
    target = root / f'data/safeguards/{group}.ts'
    content = '// Generated from source.md by scripts/generate-safeguards.py.\nimport type { Question } from "../../lib/safeguards/types";\n'
    content += f'export const {name}: Question[] = ' + json.dumps(rows, ensure_ascii=False, indent=2) + ';\n'
    target.write_text(content)
    print(group, len(rows))
assert [len(x) for x in groups.values()] == [15,89,24,29]
