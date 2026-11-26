const agenda = (idxId: string, page: string) =>
  `https://pipc.go.kr/np/default/agenda.do?fromDt=&idxId=${idxId}&insttDivCdNm=&insttNms=&isPre=&mCode=E030010000&mrtlCd=&op=view&page=${page}&processCdNm=&schStr=&toDt=`;

export const reviewedDecisions = {
  "2026-222-459": {
    id: "pipc-decision-2026-222-459",
    title: "개인정보보호 법규 위반행위에 대한 시정조치에 관한 건",
    organization: "㈜앵커노드",
    decisionNo: "제2026-222-459호",
    date: "2026-11-11",
    posted: "2026-11-23",
    url: agenda("2026-0896", ""),
    officialTextId: "11215",
    applicableLaw: "의결서 적용 법령 · 개인정보 보호법 제34조제1항·제3항",
  },
  "2026-220-441": {
    id: "pipc-decision-2026-220-441",
    title: "개인정보보호 법규 위반행위에 대한 시정조치에 관한 건",
    organization: "티씨소프트",
    decisionNo: "제2026-220-441호",
    date: "2026-10-14",
    posted: "2026-10-27",
    url: agenda("2026-0800", ""),
    officialTextId: "11083",
    applicableLaw: "의결서 적용 법령 · 개인정보 보호법 제34조제1항, 같은 법 시행령 제39조제1항",
  },
  "2026-217-384": {
    id: "pipc-decision-2026-217-384",
    title: "개인정보보호 법규 위반행위에 대한 시정조치에 관한 건",
    organization: "피지아이엠코리아 유한회사",
    decisionNo: "제2026-217-384호",
    date: "2026-09-18",
    posted: "2026-10-06",
    url: agenda("2026-0741", "7"),
    officialTextId: "11039",
    applicableLaw: "의결서 적용 법령 · 개인정보 보호법 제29조, 같은 법 시행령 제30조제1항제2호, 안전성 확보조치 기준(고시 제2023-6호) 제5조제1항·제5항 및 유출 통지 관련 법 제34조제1항",
  },
} as const;
