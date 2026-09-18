"use client";

import { useEffect,useMemo,useState } from "react";
import type { CaseRecord } from "../../app/cases-data";
import { caseRecords } from "../../app/cases-data";
import { checks } from "../../lib/privacy-risk/checks";
import { defaultReaderPreferences,initialProfile } from "../../lib/privacy-risk/constants";
import { localDateKey } from "../../lib/privacy-risk/dates";
import { evaluateAssessment } from "../../lib/privacy-risk/evaluation";
import type { Answer,CasePeriod,CaseYear,Evidence,Filter,Profile,ReaderPreferences,Screen } from "../../lib/privacy-risk/types";

import { clearAssessment,loadAssessment,loadReaderPreferences,saveAssessment,saveReaderPreferences } from "../../lib/privacy-risk/storage";

import { createResultData } from "../../lib/privacy-risk/report";

import { filterCases } from "../../lib/privacy-risk/case-search";

export function useAssessment() {

  const [screen, setScreen] = useState<Screen>("intro");
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [evidence, setEvidence] = useState<Record<number, Evidence[]>>({});
  const [expanded, setExpanded] = useState<number | null>(null);
  const [evidenceFor, setEvidenceFor] = useState<number | null>(null);
  const [detailFor, setDetailFor] = useState<number | null>(null);
  const [guideFor, setGuideFor] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selectedCase, setSelectedCase] = useState<CaseRecord | null>(null);
  const [caseListFor, setCaseListFor] = useState<number | null>(null);
  const [caseTopic, setCaseTopic] = useState("전체");
  const [caseInstitution, setCaseInstitution] = useState("전체");
  const [caseDisposition, setCaseDisposition] = useState("전체");
  const [casePeriod, setCasePeriod] = useState<CasePeriod>("all");
  const [caseYear, setCaseYear] = useState<CaseYear>("all");
  const [caseQuery, setCaseQuery] = useState("");
  const [showItemIndex, setShowItemIndex] = useState(false);
  const [showReferences, setShowReferences] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [readerPreferences, setReaderPreferences] = useState<ReaderPreferences>(defaultReaderPreferences);
  const [readerReady, setReaderReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const saved = loadAssessment(localStorage);
      if (saved) {
        setProfile(saved.profile);
        setAnswers(saved.answers);
        setEvidence(saved.evidence);
        setScreen(saved.screen);
      }
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveAssessment(localStorage, { profile, answers, evidence, screen });
  }, [profile, answers, evidence, screen, hydrated]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setReaderPreferences(loadReaderPreferences(localStorage));
      setReaderReady(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = readerPreferences.theme;
    document.documentElement.style.setProperty("--reader-text-delta", `${readerPreferences.fontSize - 17}px`);
    document.documentElement.style.setProperty("--reader-line-height", String(readerPreferences.lineHeight));
    if (readerReady) saveReaderPreferences(localStorage, readerPreferences);
  }, [readerPreferences, readerReady]);

  useEffect(() => {
    const handleFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreen);
    return () => document.removeEventListener("fullscreenchange", handleFullscreen);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDetailFor(null);
        setEvidenceFor(null);
        setSelectedCase(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // 안내서의 점검표는 기관 기준 11개와 시스템 기준 15개로 구성됩니다.
  // 홈페이지 운영 여부는 기본정보로만 기록하고, 전체 26개 항목은 항상
  // 표시하여 사용자가 각 항목에서 직접 "해당 없음"을 판단하도록 합니다.
  const applicableChecks = checks;

  const completed = applicableChecks.filter((item) => answers[item.id]).length;
  const progress = applicableChecks.length ? Math.round((completed / applicableChecks.length) * 100) : 0;
  const targetStatus = useMemo(() => {
    const hasResident = profile.identifiers.includes("주민등록번호");
    const hasRiskId = profile.identifiers.some((id) => id !== "주민등록번호");
    if (hasResident) {
      return {
        tone: "danger",
        title: "주민등록번호는 별도 암호화 의무 대상입니다",
        body: "주민등록번호는 위험도 분석 결과와 관계없이 암호화하여 안전하게 보관해야 합니다. 다른 고유식별정보가 있다면 그 정보에 대한 위험도 분석은 별도로 계속할 수 있습니다.",
      };
    }
    if (!hasRiskId) {
      return {
        tone: "neutral",
        title: "위험도 분석 대상 고유식별정보가 확인되지 않았습니다",
        body: "여권번호·운전면허번호·외국인등록번호를 내부망에 저장하지 않는다면 이 안내서의 암호화 미적용 위험도 분석 대상은 아닙니다. 일반 안전조치 점검은 계속할 수 있습니다.",
      };
    }
    if (profile.storage === "all") {
      return {
        tone: "success",
        title: "모든 대상 정보를 암호화해 저장하고 있습니다",
        body: "안내서상 암호화 적용 여부를 정하기 위한 위험도 분석 필요성은 낮습니다. 다만 암호 알고리즘과 키 관리의 적정성은 별도로 확인해야 합니다.",
      };
    }
    return {
      tone: "warning",
      title: "위험도 분석 진행이 필요합니다",
      body: "내부망에 주민등록번호 외 고유식별정보를 일부 또는 전부 암호화하지 않고 저장하는 경우입니다. 26개 보호조치와 증적을 확인하세요.",
    };
  }, [profile.identifiers, profile.storage]);

  const counts = useMemo(() => {
    const base = { yes: 0, no: 0, unknown: 0, na: 0, evidenceMissing: 0 };
    applicableChecks.forEach((item) => {
      const answer = answers[item.id];
      if (answer) base[answer] += 1;
      if (answer === "yes" && !(evidence[item.id]?.length > 0)) base.evidenceMissing += 1;
    });
    return base;
  }, [answers, evidence, applicableChecks]);

  const evaluation = evaluateAssessment(counts, applicableChecks.length);

  const attentionItems = useMemo(
    () =>
      applicableChecks.filter((item) => {
        const answer = answers[item.id];
        return !answer || answer === "no" || answer === "unknown" || (answer === "yes" && !evidence[item.id]?.length);
      }),
    [answers, evidence, applicableChecks]
  );

  const filteredChecks = useMemo(() => {
    return applicableChecks.filter((item) => {
      const matchesQuery = `${item.id} ${item.category} ${item.question}`.toLowerCase().includes(query.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "institution" && item.scope === "institution") ||
        (filter === "system" && item.scope === "system") ||
        (filter === "unanswered" && !answers[item.id]) ||
        (filter === "attention" && attentionItems.some((target) => target.id === item.id));
      return matchesQuery && matchesFilter;
    });
  }, [filter, query, applicableChecks, answers, attentionItems]);

  const activeCheck = filteredChecks.find((item) => item.id === expanded) ?? filteredChecks[0] ?? applicableChecks[0];

  const filteredCases = useMemo(() => {
    return filterCases(caseRecords, { caseTopic, caseInstitution, caseDisposition, casePeriod, caseQuery, caseYear });
  }, [caseTopic, caseInstitution, caseDisposition, casePeriod, caseQuery, caseYear]);

  const casesForItem = (itemId: number) => caseRecords.filter((record) => record.itemIds.includes(itemId));

  const openCases = (itemId?: number) => {
    if (itemId) {
      const item = checks.find((check) => check.id === itemId);
      setCaseTopic(item?.id === 1 ? "개인정보 보호책임자" : item?.id === 3 ? "수탁자 관리·감독" : item?.category === "웹 기반" ? "웹 보안" : item?.standard.includes("제8조") ? "접속기록" : item?.standard.includes("제5조") ? "접근권한" : item?.standard.includes("제9조") ? "보안패치" : "접근통제");
    } else {
      setCaseTopic("전체");
    }
    setScreen("cases");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startCheck = () => {
    setScreen("profile");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateIdentifier = (identifier: string) => {
    setProfile((current) => ({
      ...current,
      identifiers: current.identifiers.includes(identifier)
        ? current.identifiers.filter((item) => item !== identifier)
        : [...current.identifiers, identifier],
    }));
  };

  const beginQuestions = () => {
    setExpanded(applicableChecks.find((item) => !answers[item.id])?.id ?? applicableChecks[0]?.id ?? null);
    setScreen("check");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setAnswer = (id: number, answer: Answer) => {
    setAnswers((current) => ({ ...current, [id]: answer }));
  };

  const goNextItem = (id: number) => {
    const currentIndex = applicableChecks.findIndex((item) => item.id === id);
    const next = applicableChecks[currentIndex + 1];
    if (next) {
      setFilter("all");
      setQuery("");
      setExpanded(next.id);
      window.scrollTo({ top: 180, behavior: "smooth" });
    } else {
      goResult();
    }
  };

  const addEvidence = (id: number, entry: Evidence) => {
    setEvidence((current) => ({ ...current, [id]: [...(current[id] ?? []), entry] }));
    setEvidenceFor(null);
  };

  const resetAll = () => {
    if (!window.confirm("입력한 기본정보, 답변과 증적 기록을 모두 지울까요?")) return;
    clearAssessment(localStorage);
    setProfile(initialProfile);
    setAnswers({});
    setEvidence({});
    setScreen("intro");
    setExpanded(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateReaderPreference = <Key extends keyof ReaderPreferences>(key: Key, value: ReaderPreferences[Key]) => {
    setReaderPreferences((current) => ({ ...current, [key]: value }));
  };

  const resetReaderPreferences = () => setReaderPreferences(defaultReaderPreferences);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
  };

  const goResult = () => {
    setScreen("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const exportData = () => {
    const data = createResultData(profile, answers, evidence, applicableChecks);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `메뚜기-개인정보-위험도-자가점검-${localDateKey()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const activeDetail = detailFor ? checks.find((item) => item.id === detailFor) : null;
  const activeGuideItem = guideFor ? checks.find((item) => item.id === guideFor) : null;
  const activeCaseListItem = caseListFor ? checks.find((item) => item.id === caseListFor) : null;

  return { screen, setScreen, profile, setProfile, answers, setAnswers, evidence, setEvidence, expanded, setExpanded, evidenceFor, setEvidenceFor, detailFor, setDetailFor, guideFor, setGuideFor, filter, setFilter, query, setQuery, selectedCase, setSelectedCase, caseListFor, setCaseListFor, caseTopic, setCaseTopic, caseInstitution, setCaseInstitution, caseDisposition, setCaseDisposition, casePeriod, setCasePeriod, caseYear, setCaseYear, caseQuery, setCaseQuery, showItemIndex, setShowItemIndex, showReferences, setShowReferences, hydrated, setHydrated, readerPreferences, setReaderPreferences, readerReady, setReaderReady, isFullscreen, setIsFullscreen, applicableChecks, completed, progress, targetStatus, counts, evaluation, attentionItems, filteredChecks, activeCheck, filteredCases, casesForItem, openCases, startCheck, updateIdentifier, beginQuestions, setAnswer, goNextItem, addEvidence, resetAll, updateReaderPreference, resetReaderPreferences, toggleFullscreen, goResult, exportData, activeDetail, activeGuideItem, activeCaseListItem };
}
export type AssessmentController = ReturnType<typeof useAssessment>;
