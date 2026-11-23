"use client";

import { useEffect, useRef, useState } from "react";
import type { Assessment } from "../../lib/ai-hacking/model";
import { initialState, parseAssessment, storageKey } from "../../lib/ai-hacking/storage";

export function useLocalAssessment() {
  const [state, setState] = useState(() => initialState(""));
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("저장한 점검 확인 중");
  const previous = useRef<string | null>(null);
  const invalid = useRef(false);

  useEffect(() => {
    let active = true;
    function read(messageIfSaved: string) {
      try {
        const raw = window.localStorage.getItem(storageKey);
        previous.current = raw;
        const next = raw === null ? initialState() : parseAssessment(raw);
        invalid.current = false;
        setState(next);
        setMessage(raw === null ? "이 브라우저에 자동 저장" : messageIfSaved);
      } catch {
        invalid.current = true;
        setMessage("저장값을 읽을 수 없습니다. 현재 작업은 파일로 저장하거나 정상 파일을 복원할 수 있습니다.");
      }
    }
    queueMicrotask(() => {
      if (!active) return;
      read("마지막 점검 위치와 응답을 복원했습니다.");
      setReady(true);
    });
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) read("다른 탭에서 변경한 점검을 반영했습니다.");
    };
    window.addEventListener("storage", onStorage);
    return () => { active = false; window.removeEventListener("storage", onStorage); };
  }, []);

  function save(next: Assessment, replace = false) {
    if (!ready) return;
    if (invalid.current && !replace) {
      setState(next);
      setMessage("기존 저장값은 보관 중입니다. 이번 입력은 ‘결과 파일 저장’으로 보관하세요.");
      return;
    }
    try {
      const current = window.localStorage.getItem(storageKey);
      if (!replace && current !== previous.current) {
        previous.current = current;
        try {
          setState(current === null ? initialState() : parseAssessment(current));
          setMessage("다른 탭의 최신 점검을 불러왔습니다. 방금 변경한 항목을 다시 선택하세요.");
        } catch {
          invalid.current = true;
          setMessage("다른 탭의 저장값을 읽을 수 없어 기존 내용을 보존했습니다.");
        }
        return;
      }
      const raw = JSON.stringify(next);
      window.localStorage.setItem(storageKey, raw);
      previous.current = raw;
      invalid.current = false;
      setMessage(replace ? "파일에서 점검을 복원하고 저장했습니다." : "이 브라우저에 자동 저장됨");
    } catch {
      setMessage("자동 저장에 실패했습니다. 이번 입력은 결과 파일로 보관하세요.");
    }
    setState(next);
  }

  function clear() {
    if (!window.confirm("AI 해킹 관련 점검의 기본정보와 응답을 초기화할까요?")) return false;
    try {
      window.localStorage.removeItem(storageKey);
      previous.current = null;
      invalid.current = false;
      setState(initialState());
      setMessage("점검을 초기화했습니다.");
      return true;
    } catch {
      setMessage("브라우저에서 저장값을 삭제하지 못했습니다. 현재 응답을 유지합니다.");
      return false;
    }
  }
  return { state, ready, message, save, clear, setMessage };
}
