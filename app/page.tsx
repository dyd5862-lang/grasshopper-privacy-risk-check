"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CaseRecord, caseRecords, officialCaseSearchUrl } from "./cases-data";
import { publicDecisionCollectedAt, publicDecisionsByCase } from "./decision-data";
import { guidePages, guideTitle } from "./guide-pages";

type Screen = "intro" | "profile" | "check" | "result" | "cases";
type Answer = "yes" | "no" | "unknown" | "na";
type Filter = "all" | "institution" | "system" | "unanswered" | "attention";
type CasePeriod = "1" | "3" | "5" | "all";
type CaseYear = "all" | "2020" | "2021" | "2022" | "2023" | "2024" | "2025" | "2026";
type ReaderTheme = "light" | "dark";

type ReaderPreferences = {
  theme: ReaderTheme;
  fontSize: number;
  lineHeight: number;
};

const defaultReaderPreferences: ReaderPreferences = {
  theme: "light",
  fontSize: 17,
  lineHeight: 1.6,
};

const readerPreferencesKey = "grasshopper-reader-preferences-v1";

type Evidence = {
  title: string;
  note: string;
  owner: string;
  date: string;
};

type Profile = {
  organization: string;
  organizationType: string;
  systemName: string;
  purpose: string;
  fileName: string;
  dataSubjects: string;
  handlers: string;
  identifiers: string[];
  storage: "all" | "partial" | "none" | "unknown";
  sensitive: boolean;
  website: boolean;
  externalNetwork: boolean;
  outsourced: boolean;
};

type CheckItem = {
  id: number;
  scope: "institution" | "system";
  category: string;
  question: string;
  easy: string;
  page: string;
  standard: string;
  law: string;
  evidence: string[];
  action: string;
  priority: "즉시" | "단기" | "중장기";
};

const initialProfile: Profile = {
  organization: "",
  organizationType: "공공기관",
  systemName: "",
  purpose: "",
  fileName: "",
  dataSubjects: "",
  handlers: "",
  identifiers: [],
  storage: "unknown",
  sensitive: false,
  website: false,
  externalNetwork: true,
  outsourced: false,
};

const checks: CheckItem[] = [
  {
    id: 1,
    scope: "institution",
    category: "정책 기반",
    question: "개인정보 보호책임자를 지정하여 운영하고 있습니까?",
    easy: "형식적인 지정에 그치지 않고, 개인정보 처리에 관한 실질적 권한과 책임을 가진 보호책임자가 운영되고 있는지 확인합니다.",
    page: "안내서 p.170~171",
    standard: "안전성 확보조치 기준 제4조",
    law: "개인정보 보호법 제31조 · 시행령 제32조",
    evidence: ["개인정보 보호책임자 지정 문서", "조직도와 업무분장표", "내부 관리계획의 역할·책임 부분"],
    action: "보호책임자의 지정 근거, 권한, 역할을 문서화하고 최고경영층의 승인을 받으세요.",
    priority: "단기",
  },
  {
    id: 2,
    scope: "institution",
    category: "정책 기반",
    question: "개인정보 보호를 위한 정책 또는 관리계획(침해사고 대응계획 포함)을 수립･운영하고 있습니까?",
    easy: "개인정보보호 활동과 침해사고 대응 절차가 전사적인 계획과 내부 기준에 따라 운영되는지 확인합니다.",
    page: "안내서 p.171",
    standard: "안전성 확보조치 기준 제4조",
    law: "개인정보 보호법 제29조 · 시행령 제30조",
    evidence: ["내부 관리계획 최신본", "침해사고 대응계획", "연간 개인정보보호 추진계획"],
    action: "내부 관리계획에 책임체계, 접근통제, 사고 대응과 점검 절차를 포함하고 정기적으로 개정하세요.",
    priority: "즉시",
  },
  {
    id: 3,
    scope: "institution",
    category: "정책 기반",
    question: "외주인력 보안관리를 위해 보안서약서 집행, 비밀번호 노출 예방 등 조치를 하고 있습니까?",
    easy: "외부 개발자·유지보수 인력도 내부 직원과 같은 수준으로 계정과 보안수칙을 관리하는지 확인합니다.",
    page: "안내서 p.171~172",
    standard: "안전성 확보조치 기준 제4조",
    law: "개인정보 보호법 제26조·제29조",
    evidence: ["외주인력 보안서약서", "위탁인력 계정 발급·회수대장", "접근 및 작업 승인 기록"],
    action: "외주인력별 계정을 발급하고 계약 종료 시 즉시 회수하는 절차와 보안서약을 운영하세요.",
    priority: "즉시",
  },
  {
    id: 4,
    scope: "institution",
    category: "정책 기반",
    question: "데이터베이스 서버에 접속하는 장비(PC, 노트북 등)에서 불법 또는 비인가된 소프트웨어 사용을 방지하고 정품 소프트웨어만 사용하도록 하는 정책을 수립·운영하고 있습니까?",
    easy: "데이터베이스에 연결되는 단말에서 승인되지 않은 프로그램이 보안통제를 우회하지 못하도록 관리하는 항목입니다.",
    page: "안내서 p.172~173",
    standard: "안전성 확보조치 기준 제4조·제9조",
    law: "개인정보 보호법 제29조 · 시행령 제30조",
    evidence: ["소프트웨어 사용 정책", "승인 소프트웨어 목록", "단말 소프트웨어 점검 결과"],
    action: "허용 소프트웨어 목록과 설치 승인 절차를 만들고 정기 점검 결과를 남기세요.",
    priority: "단기",
  },
  {
    id: 5,
    scope: "institution",
    category: "정책 기반",
    question: "데이터베이스 서버에 접근 가능한 자(내부직원, 위탁인력, 개발자 등)를 대상으로 개인정보보호 관련 교육을 연 2회 이상 실시하고 있습니까?",
    easy: "실제 데이터베이스 접근자에게 업무별 위험과 보안수칙을 정기적으로 교육했는지 확인합니다.",
    page: "안내서 p.173~174",
    standard: "안전성 확보조치 기준 제4조",
    law: "개인정보 보호법 제29조 · 시행령 제30조",
    evidence: ["연간 교육계획", "교육자료와 참석자 명단", "교육결과 보고서"],
    action: "접근 가능한 내부·외부 인력을 빠짐없이 식별하고 연 2회 이상 교육 및 결과기록을 남기세요.",
    priority: "단기",
  },
  {
    id: 6,
    scope: "institution",
    category: "네트워크 기반",
    question: "상시적으로 비인가 인터넷 프로토콜(IP) 주소의 접근을 통제하고 있습니까?",
    easy: "허용된 IP만 개인정보처리시스템에 접근하도록 방화벽·IPS 등의 정책이 설정되어 있는지 확인합니다.",
    page: "안내서 p.174",
    standard: "안전성 확보조치 기준 제6조",
    law: "개인정보 보호법 제29조 · 시행령 제30조",
    evidence: ["방화벽 또는 IPS 정책 화면", "허용 IP 목록", "접근통제 정책 검토기록"],
    action: "업무상 필요한 IP만 허용하고 예외정책의 승인·만료·점검 절차를 운영하세요.",
    priority: "즉시",
  },
  {
    id: 7,
    scope: "institution",
    category: "네트워크 기반",
    question: "상시적으로 불필요한 서비스 포트 사용을 통제하고 있습니까?",
    easy: "서비스에 필요하지 않은 포트가 외부 침입 경로로 쓰이지 않도록 차단되어 있는지 확인합니다.",
    page: "안내서 p.174",
    standard: "안전성 확보조치 기준 제6조",
    law: "개인정보 보호법 제29조 · 시행령 제30조",
    evidence: ["포트 허용 목록", "방화벽 정책", "정기 포트 점검 결과"],
    action: "필요 포트의 근거와 책임자를 지정하고 나머지는 기본 차단하도록 정책을 정비하세요.",
    priority: "단기",
  },
  {
    id: 8,
    scope: "institution",
    category: "네트워크 기반",
    question: "상시적으로 불법적인 해킹시도를 방지하고, 이에 대해 모니터링을 실시하고 있습니까?",
    easy: "침입차단·탐지 장비가 단순 설치에 그치지 않고 경보를 지속적으로 확인·조치하는지 살핍니다.",
    page: "안내서 p.174~175",
    standard: "안전성 확보조치 기준 제6조",
    law: "개인정보 보호법 제29조 · 시행령 제30조",
    evidence: ["침입차단·탐지 운영현황", "보안관제 보고서", "경보 분석 및 조치이력"],
    action: "경보 모니터링 담당과 대응시간을 정하고 탐지·차단·사후조치 이력을 보관하세요.",
    priority: "즉시",
  },
  {
    id: 9,
    scope: "institution",
    category: "네트워크 기반",
    question: "상시적으로 바이러스, 웜 등의 네트워크 유입을 차단하고 있습니까?",
    easy: "네트워크로 들어오는 악성코드를 검사·차단·치료하는 보안프로그램이 최신 상태로 운영되는지 확인합니다.",
    page: "안내서 p.175",
    standard: "안전성 확보조치 기준 제9조",
    law: "개인정보 보호법 제29조 · 시행령 제30조",
    evidence: ["악성코드 차단 솔루션 운영화면", "패턴 업데이트 현황", "탐지·치료 보고서"],
    action: "네트워크와 단말의 악성코드 탐지 기능을 최신 상태로 유지하고 실패 단말을 별도 조치하세요.",
    priority: "즉시",
  },
  {
    id: 10,
    scope: "institution",
    category: "네트워크 기반",
    question: "주기적으로 네트워크 접속에 대한 로그를 기록 및 분석하고, 안전하게 보관하고 있습니까?",
    easy: "접속 로그를 남기는 것뿐 아니라 이상징후를 분석하고 로그 자체의 위·변조와 분실을 막는지 확인합니다.",
    page: "안내서 p.175",
    standard: "안전성 확보조치 기준 제8조",
    law: "개인정보 보호법 제29조 · 시행령 제30조",
    evidence: ["네트워크 로그 설정", "정기 분석 보고서", "로그 백업·접근통제 현황"],
    action: "로그 수집 범위, 보관기간, 점검주기와 이상징후 대응 절차를 정하고 실행 기록을 남기세요.",
    priority: "즉시",
  },
  {
    id: 11,
    scope: "institution",
    category: "네트워크 기반",
    question: "네트워크 장비 및 정보보호시스템의 보안패치 발생 시 정당한 사유가 없는 한 즉시 업데이트를 수행하고 있습니까?",
    easy: "네트워크 장비와 보안시스템의 소프트웨어·탐지패턴이 보안 공지에 맞춰 신속히 갱신되는지 확인합니다.",
    page: "안내서 p.175~176",
    standard: "안전성 확보조치 기준 제9조",
    law: "개인정보 보호법 제29조 · 시행령 제30조",
    evidence: ["장비별 패치 현황", "업데이트 작업 기록", "지연 사유 및 영향검토 기록"],
    action: "보안공지 수신부터 검토·테스트·적용까지의 기한과 예외 승인 절차를 정하세요.",
    priority: "단기",
  },
  {
    id: 12,
    scope: "system",
    category: "DB·애플리케이션",
    question: "상시적으로 네트워크를 통한 비인가자의 데이터베이스 접근을 통제하고 있습니까?",
    easy: "네트워크 방화벽과 별도로 DBMS 접속과 SQL 수행이 인가된 사용자·규칙에 따라 통제되는지 확인합니다.",
    page: "안내서 p.176",
    standard: "안전성 확보조치 기준 제6조",
    law: "개인정보 보호법 제29조 · 시행령 제30조",
    evidence: ["DB 접근제어 정책", "DBMS 접속 허용 목록", "차단·예외 승인 이력"],
    action: "DB 접근제어 정책을 계정·IP·업무별로 최소화하고 예외 접속을 승인·기록하세요.",
    priority: "즉시",
  },
  {
    id: 13,
    scope: "system",
    category: "DB·애플리케이션",
    question: "데이터베이스 서버 내에 불필요한 서비스 포트를 차단하고 있습니까?",
    easy: "DB 관리와 애플리케이션 연결에 꼭 필요한 포트 외에는 서버에서 차단되어 있는지 확인합니다.",
    page: "안내서 p.176~177",
    standard: "안전성 확보조치 기준 제6조",
    law: "개인정보 보호법 제29조 · 시행령 제30조",
    evidence: ["DB 서버 포트 현황", "호스트 방화벽 설정", "포트 취약점 점검결과"],
    action: "DB 서버의 실제 열림 포트를 정기 점검하고 업무 근거가 없는 포트는 차단하세요.",
    priority: "단기",
  },
  {
    id: 14,
    scope: "system",
    category: "DB·애플리케이션",
    question: "상시적으로 데이터베이스 접속자 및 개인정보취급자의 접속기록을 남기고 있습니까?",
    easy: "관리자 도구와 웹·응용프로그램을 통한 접속 모두에서 누가 언제 무엇을 했는지 추적할 수 있는지 확인합니다.",
    page: "안내서 p.177",
    standard: "안전성 확보조치 기준 제8조",
    law: "개인정보 보호법 제29조 · 시행령 제30조",
    evidence: ["DB 감사로그 설정", "애플리케이션 접속기록", "로그 항목·보관기간 기준"],
    action: "사용자, 일시, 접속지, 처리내용, 결과를 식별할 수 있도록 로그 범위를 보완하세요.",
    priority: "즉시",
  },
  {
    id: 15,
    scope: "system",
    category: "DB·애플리케이션",
    question: "데이터베이스 접속기록을 주기적으로 모니터링하여 통제하고 있습니까?",
    easy: "DB 접속기록을 최소 주 1회 등 정해진 주기로 분석해 비정상 조회·다운로드를 찾아내는지 확인합니다.",
    page: "안내서 p.177~178",
    standard: "안전성 확보조치 기준 제8조",
    law: "개인정보 보호법 제29조 · 시행령 제30조",
    evidence: ["주간 DB 로그 점검표", "이상행위 탐지 기준", "이상징후 조치결과"],
    action: "대량조회, 비업무시간 접속 등 이상기준을 정하고 정기 점검과 후속조치를 기록하세요.",
    priority: "즉시",
  },
  {
    id: 16,
    scope: "system",
    category: "DB·애플리케이션",
    question: "데이터베이스 서버에 접속하는 관리자 PC가 인터넷 접속되는 내부망의 네트워크와 분리되어 있습니까?",
    easy: "DB 관리자 PC가 인터넷 악성코드에 감염된 상태로 서버에 접속하지 못하도록 물리적·논리적으로 분리되었는지 확인합니다.",
    page: "안내서 p.178",
    standard: "안전성 확보조치 기준 제6조",
    law: "개인정보 보호법 제29조 · 시행령 제30조",
    evidence: ["관리자 PC 네트워크 구성도", "인터넷 차단 정책", "논리적 망분리 설정 화면"],
    action: "DB 관리자 단말의 인터넷 접속을 차단하고 전용 관리경로와 업무절차를 마련하세요.",
    priority: "즉시",
  },
  {
    id: 17,
    scope: "system",
    category: "DB·애플리케이션",
    question: "개인정보취급자의 역할에 따라 데이터베이스 접근 권한을 개인정보취급자에게만 업무 수행에 필요한 최소한의 범위로 차등 부여하고 있습니까?",
    easy: "업무에 필요하지 않은 개인정보까지 볼 수 있는 과도한 권한이 부여되어 있지 않은지 확인합니다.",
    page: "안내서 p.178~179",
    standard: "안전성 확보조치 기준 제5조",
    law: "개인정보 보호법 제29조 · 시행령 제30조",
    evidence: ["역할별 권한 기준표", "현재 계정·권한 목록", "권한 승인 및 검토기록"],
    action: "최소 업무단위로 조회·등록·수정·삭제 권한을 구분하고 정기 검토하세요.",
    priority: "즉시",
  },
  {
    id: 18,
    scope: "system",
    category: "DB·애플리케이션",
    question: "개인정보취급자 또는 개인정보취급자의 업무가 변경되었을 경우 지체 없이 데이터베이스 접근 권한을 변경하고 있습니까?",
    easy: "전보·휴직·퇴사·업무변경 시 불필요해진 계정과 권한이 즉시 변경·말소되는지 확인합니다.",
    page: "안내서 p.179",
    standard: "안전성 확보조치 기준 제5조",
    law: "개인정보 보호법 제29조 · 시행령 제30조",
    evidence: ["권한 변경·말소 절차", "인사변동 대비 계정 처리기록", "권한 부여·변경·말소 내역"],
    action: "인사시스템과 계정관리 절차를 연계하고 변경·말소 처리기한과 확인자를 정하세요.",
    priority: "즉시",
  },
  {
    id: 19,
    scope: "system",
    category: "DB·애플리케이션",
    question: "데이터베이스 접속자 및 개인정보취급자의 데이터베이스 로그인을 위한 인증수단을 안전하게 적용하고 관리하고 있습니까?",
    easy: "DB 접속자의 신원을 확실히 확인할 수 있도록 공유계정을 피하고 적절한 인증수단을 적용하는지 확인합니다.",
    page: "안내서 p.179~180",
    standard: "안전성 확보조치 기준 제5조",
    law: "개인정보 보호법 제29조 · 시행령 제30조",
    evidence: ["인증수단 관리정책", "개인별 계정 현황", "추가 인증 적용 화면"],
    action: "개인별 계정과 안전한 인증수단을 적용하고 공유·장기 미사용 계정을 정리하세요.",
    priority: "즉시",
  },
  {
    id: 20,
    scope: "system",
    category: "DB·애플리케이션",
    question: "데이터베이스 접속자 및 개인정보취급자가 일정 횟수 이상 인증에 실패한 경우 개인정보처리시스템에 대한 접근을 제한하고 있습니까?",
    easy: "반복적인 비밀번호 추측 공격을 막기 위해 일정 횟수 실패 시 계정이 잠기거나 접속이 제한되는지 확인합니다.",
    page: "안내서 p.180",
    standard: "안전성 확보조치 기준 제5조",
    law: "개인정보 보호법 제29조 · 시행령 제30조",
    evidence: ["인증실패 잠금 정책", "DBMS 설정 화면", "계정 잠금해제 절차"],
    action: "인증실패 횟수 제한과 안전한 잠금해제 절차를 DBMS와 애플리케이션에 적용하세요.",
    priority: "즉시",
  },
  {
    id: 21,
    scope: "system",
    category: "DB·애플리케이션",
    question: "데이터베이스 및 데이터베이스 접속 애플리케이션 서버에 대한 물리적 접근을 인가된 자로 한정하고 있습니까?",
    easy: "전산실과 서버의 실제 출입·접근이 승인된 사람에게만 허용되고 기록되는지 확인합니다.",
    page: "안내서 p.180~181",
    standard: "안전성 확보조치 기준 제10조",
    law: "개인정보 보호법 제29조 · 시행령 제30조",
    evidence: ["전산실 출입통제 절차", "출입권한 목록", "출입기록 또는 출입대장"],
    action: "출입 승인·회수 절차와 기록을 운영하고 별도 전산실이 없다면 잠금·통제선을 마련하세요.",
    priority: "단기",
  },
  {
    id: 22,
    scope: "system",
    category: "DB·애플리케이션",
    question: "데이터베이스 및 데이터베이스 접속 애플리케이션 서버에서 보조저장 매체(USB 등) 사용 시 관리자 승인 후 사용하고 있습니까?",
    easy: "서버에 USB 등을 연결할 때 악성코드 유입과 개인정보 반출을 막기 위한 사전 승인·검사가 이루어지는지 확인합니다.",
    page: "안내서 p.181~182",
    standard: "안전성 확보조치 기준 제12조",
    law: "개인정보 보호법 제29조 · 시행령 제30조",
    evidence: ["보조저장매체 사용정책", "사용 승인대장", "악성코드 검사·회수 기록"],
    action: "기본적으로 사용을 차단하고 불가피한 경우 관리자 승인, 검사, 회수 이력을 남기세요.",
    priority: "단기",
  },
  {
    id: 23,
    scope: "system",
    category: "DB·애플리케이션",
    question: "데이터베이스 서버 및 데이터베이스 접속 애플리케이션 서버에 접속하는 모든 개인정보취급자의 단말기(PC, 노트북 등)의 운영체제 보안패치를 제조사 공지 후 정당한 사유가 없는 한 즉시 수행하고 있습니까?",
    easy: "DB에 접속하는 모든 단말이 알려진 취약점에 노출되지 않도록 신속히 패치되는지 확인합니다.",
    page: "안내서 p.182",
    standard: "안전성 확보조치 기준 제9조",
    law: "개인정보 보호법 제29조 · 시행령 제30조",
    evidence: ["접속 단말 목록", "운영체제 패치 현황", "미적용 단말 및 지연 사유"],
    action: "접속 단말을 자산목록으로 관리하고 패치 미적용 단말의 DB 접속을 제한하세요.",
    priority: "단기",
  },
  {
    id: 24,
    scope: "system",
    category: "DB·애플리케이션",
    question: "하드디스크(HDD)등 데이터베이스 저장매체의 불용처리 시(폐기, 교체 등) 저장매체에 저장된 개인정보는 모두 파기하고 있습니까?",
    easy: "폐기·교체하는 저장매체에서 개인정보가 복원되지 않도록 파쇄, 소자, 덮어쓰기 등으로 완전 파기하는지 확인합니다.",
    page: "안내서 p.182~183",
    standard: "안전성 확보조치 기준 제13조",
    law: "개인정보 보호법 제21조·제29조",
    evidence: ["저장매체 불용처리 절차", "폐기·반출 승인서", "완전삭제 또는 파쇄 증명서"],
    action: "단순 삭제·포맷이 아닌 복구 불가능한 파기방법을 정하고 작업 증명을 보관하세요.",
    priority: "즉시",
  },
  {
    id: 25,
    scope: "system",
    category: "웹 기반",
    question: "신규 웹 취약점 및 알려진 주요 웹(Web) 취약점 진단·보완을 연 1회 이상 실시하거나, 상시적으로 비인가자에 의한 웹서버 접근, 홈페이지 위·변조 등을 자동으로 차단할 수 있는 안전조치를 하고 있습니까?",
    easy: "외부에 공개된 웹서비스의 취약점을 정기적으로 찾아 보완하거나 웹방화벽 등으로 공격을 상시 차단하는지 확인합니다.",
    page: "안내서 p.183~184",
    standard: "안전성 확보조치 기준 제6조·제9조",
    law: "개인정보 보호법 제29조 · 시행령 제30조",
    evidence: ["연 1회 이상 웹 취약점 진단결과", "취약점 보완 조치내역", "웹방화벽 운영현황"],
    action: "정기·긴급 취약점 점검과 조치기한을 정하고 웹방화벽 탐지·차단 현황을 관리하세요.",
    priority: "즉시",
  },
  {
    id: 26,
    scope: "system",
    category: "웹 기반",
    question: "웹서버 프로그램과 운영체제 보안패치를 제조사 공지 후 정당한 사유가 없는 한 즉시 수행하고 있습니까?",
    easy: "웹서버 프로그램과 운영체제의 알려진 취약점이 공격에 악용되기 전에 신속히 패치하는지 확인합니다.",
    page: "안내서 p.184~185",
    standard: "안전성 확보조치 기준 제9조",
    law: "개인정보 보호법 제29조 · 시행령 제30조",
    evidence: ["웹서버 자산·버전 목록", "보안패치 적용기록", "지연 사유 및 보완통제 기록"],
    action: "보안공지 수신, 영향검토, 테스트, 적용, 검증의 책임자와 기한을 운영하세요.",
    priority: "단기",
  },
];

const answerLabel: Record<Answer, string> = {
  yes: "예",
  no: "아니요",
  unknown: "잘 모르겠음",
  na: "해당 없음",
};

const serviceName = "메뚜기가 만든 개인정보 위험도 분석 자가 점검 도구";
const privacyLawReaderBase = "https://privacy-law-reader.vercel.app/";
const privacyNoticeUrl = `${privacyLawReaderBase}?document=privacy-notice&article=notice-73493`;

const privacyNoticeArticleLinks = (reference: string) => {
  const articles = Array.from(reference.matchAll(/제(\d+)조(?:의(\d+))?/g));
  return articles.map((match) => {
    const section = `${match[1]}${match[2] ? `-${match[2]}` : ""}`;
    const params = new URLSearchParams({
      document: "privacy-notice",
      article: "notice-73493",
      section,
    });
    return {
      label: `안전성 확보조치 기준 제${match[1]}조${match[2] ? `의${match[2]}` : ""}`,
      url: `${privacyLawReaderBase}?${params.toString()}`,
    };
  });
};

const privacyLawReaderUrl = (document: "privacy-law" | "privacy-decree", reference: string) => {
  const pattern = document === "privacy-law"
    ? /개인정보 보호법 제(\d+)조(?:의(\d+))?/
    : /시행령 제(\d+)조(?:의(\d+))?/;
  const match = reference.match(pattern);
  const prefix = document === "privacy-law" ? "law" : "decree";
  const article = match ? `${prefix}-${match[1]}${match[2] ? `-${match[2]}` : ""}` : null;
  const params = new URLSearchParams({ document });
  if (article) params.set("article", article);
  return `${privacyLawReaderBase}?${params.toString()}`;
};

const privacyLawReaderArticleLinks = (document: "privacy-law" | "privacy-decree", reference: string) => {
  const decreeIndex = reference.indexOf("시행령");
  const source = document === "privacy-law"
    ? reference.slice(0, decreeIndex >= 0 ? decreeIndex : undefined)
    : decreeIndex >= 0 ? reference.slice(decreeIndex) : "";
  const prefix = document === "privacy-law" ? "law" : "decree";
  const label = document === "privacy-law" ? "개인정보 보호법" : "개인정보 보호법 시행령";
  return Array.from(source.matchAll(/제(\d+)조(?:의(\d+))?/g)).map((match) => {
    const articleNumber = `${match[1]}${match[2] ? `-${match[2]}` : ""}`;
    const params = new URLSearchParams({ document, article: `${prefix}-${articleNumber}` });
    return {
      label: `${label} 제${match[1]}조${match[2] ? `의${match[2]}` : ""}`,
      url: `${privacyLawReaderBase}?${params.toString()}`,
    };
  });
};

const answerOptions: Array<{ value: Answer; icon: string; title: string; description: string }> = [
  { value: "yes", icon: "✓", title: "예", description: "현재 조치를 이행하고 있음" },
  { value: "no", icon: "×", title: "아니요", description: "이행하지 않거나 충분하지 않음" },
  { value: "unknown", icon: "?", title: "잘 모르겠음", description: "자료와 설정을 추가 확인해야 함" },
  { value: "na", icon: "—", title: "해당 없음", description: "현재 점검대상에 적용되지 않음" },
];

const getProgressMessage = (progress: number) => {
  if (progress === 100) return "점검이 완료되었습니다.";
  if (progress >= 76) return "거의 다 왔습니다.";
  if (progress >= 51) return "중요한 항목을 계속 확인하고 있습니다.";
  if (progress >= 26) return "절반을 향해 가고 있습니다.";
  return "점검을 시작했습니다.";
};

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span className="brand-grasshopper">🦗</span>
    </span>
  );
}

function MiniIcon({ name }: { name: "check" | "arrow" | "book" | "file" | "scale" | "clip" | "close" | "case" | "news" | "search" }) {
  const glyph = { check: "✓", arrow: "→", book: "▤", file: "▱", scale: "§", clip: "+", close: "×", case: "▦", news: "▤", search: "⌕" }[name];
  return <span className={`mini-icon mini-icon-${name}`} aria-hidden="true">{glyph}</span>;
}

const relevanceFor = (record: CaseRecord, itemId?: number) => {
  if (!itemId) return "직접 관련";
  return record.itemIds.includes(itemId) ? "직접 관련" : "유사 사례";
};

const guidePageNumbers = (reference: string) => {
  const numbers = Array.from(reference.matchAll(/\d+/g), (match) => Number(match[0]));
  if (numbers.length < 2 || numbers[1] <= numbers[0]) return numbers.slice(0, 1);
  return Array.from({ length: numbers[1] - numbers[0] + 1 }, (_, index) => numbers[0] + index);
};

type GuideBlock = { kind: "heading" | "question" | "bullet" | "note" | "body"; text: string };

const guideBlocks = (lines: string[]) => {
  const blocks: GuideBlock[] = [];
  let marker = "";
  lines.forEach((sourceLine) => {
    if (sourceLine === "∙" || sourceLine === "▶") {
      marker = sourceLine;
      return;
    }
    const line = sourceLine.replace(/\s+/g, " ").trim();
    const kind: GuideBlock["kind"] = marker === "∙" || line.startsWith("∙") || line.startsWith("-")
      ? "bullet"
      : marker === "▶" || line.startsWith("※") || line.startsWith("▶")
        ? "note"
        : /^(?:[➀-➈]|[①-⑳]|[IVX]+\.|\d+-\d+\.)/.test(line)
          ? "heading"
          : /^\d+\.\s/.test(line)
            ? "question"
            : "body";
    marker = "";
    if (kind === "body") {
      const previous = blocks.at(-1);
      if (previous && previous.kind !== "heading") {
        previous.text += ` ${line}`;
        return;
      }
    }
    blocks.push({ kind, text: line.replace(/^[∙▶]\s*/, "") });
  });
  return blocks;
};

export default function Home() {
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
      const saved = localStorage.getItem("privacy-risk-self-check-v1");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const savedProfile = parsed.profile ?? {};
          setProfile({
            ...initialProfile,
            ...savedProfile,
            organization: typeof savedProfile.organization === "string" ? savedProfile.organization : "",
            systemName: typeof savedProfile.systemName === "string" ? savedProfile.systemName : "",
            fileName: typeof savedProfile.fileName === "string" ? savedProfile.fileName : "",
          });
          setAnswers(parsed.answers ?? {});
          setEvidence(parsed.evidence ?? {});
          setScreen(parsed.screen === "intro" ? "intro" : parsed.screen ?? "intro");
        } catch {
          localStorage.removeItem("privacy-risk-self-check-v1");
        }
      }
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      "privacy-risk-self-check-v1",
      JSON.stringify({ profile, answers, evidence, screen })
    );
  }, [profile, answers, evidence, screen, hydrated]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const savedPreferences = localStorage.getItem(readerPreferencesKey);
      if (savedPreferences) {
        try {
          const parsed = JSON.parse(savedPreferences);
          setReaderPreferences({
            theme: parsed.theme === "dark" ? "dark" : "light",
            fontSize: Math.min(22, Math.max(14, Number(parsed.fontSize) || 17)),
            lineHeight: Math.min(2, Math.max(1.4, Number(parsed.lineHeight) || 1.6)),
          });
        } catch {
          localStorage.removeItem(readerPreferencesKey);
        }
      }
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
    if (readerReady) localStorage.setItem(readerPreferencesKey, JSON.stringify(readerPreferences));
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

  const attentionItems = useMemo(
    () =>
      applicableChecks.filter((item) => {
        const answer = answers[item.id];
        return answer === "no" || answer === "unknown" || (answer === "yes" && !evidence[item.id]?.length);
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
    const now = new Date("2026-09-02T00:00:00+09:00");
    const cutoff = casePeriod === "all" ? null : new Date(now.getFullYear() - Number(casePeriod), now.getMonth(), now.getDate());
    return caseRecords
      .filter((record) => !cutoff || new Date(`${record.date}T00:00:00+09:00`) >= cutoff)
      .filter((record) => caseTopic === "전체" || record.topics.includes(caseTopic))
      .filter((record) => caseInstitution === "전체" || record.institution === caseInstitution)
      .filter((record) => caseDisposition === "전체" || record.dispositions.includes(caseDisposition))
      .filter((record) => caseYear === "all" || record.date.startsWith(caseYear))
      .filter((record) => `${record.title} ${record.targets} ${record.topics.join(" ")} ${record.problems.join(" ")}`.toLowerCase().includes(caseQuery.toLowerCase()))
      .sort((a, b) => b.date.localeCompare(a.date));
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
    localStorage.removeItem("privacy-risk-self-check-v1");
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
    const data = {
      title: `${serviceName} 결과`,
      createdAt: new Date().toISOString(),
      profile,
      results: applicableChecks.map((item) => ({
        number: item.id,
        question: item.question,
        answer: answers[item.id] ? answerLabel[answers[item.id]] : "미답변",
        evidence: evidence[item.id] ?? [],
        guide: item.page,
        legalReference: `${item.law} / ${item.standard}`,
      })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `메뚜기-개인정보-위험도-자가점검-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const activeDetail = detailFor ? checks.find((item) => item.id === detailFor) : null;
  const activeGuideItem = guideFor ? checks.find((item) => item.id === guideFor) : null;
  const activeCaseListItem = caseListFor ? checks.find((item) => item.id === caseListFor) : null;

  return (
    <main className="reader-shell">
      <div className="reader-toolbar no-print" aria-label="화면 보기 설정">
        <div className="reader-controls">
          <div className="theme-buttons" role="group" aria-label="색상 테마">
            <button className={readerPreferences.theme === "light" ? "active" : ""} aria-pressed={readerPreferences.theme === "light"} onClick={() => updateReaderPreference("theme", "light")}><span aria-hidden="true">☼</span> Light</button>
            <button className={readerPreferences.theme === "dark" ? "active" : ""} aria-pressed={readerPreferences.theme === "dark"} onClick={() => updateReaderPreference("theme", "dark")}><span aria-hidden="true">◐</span> Dark</button>
          </div>
          <button className="toolbar-button" onClick={toggleFullscreen} aria-pressed={isFullscreen}>{isFullscreen ? "전체 화면 종료" : "전체 화면"}</button>
          <label className="range-control"><span>글자</span><input type="range" min="14" max="22" step="1" value={readerPreferences.fontSize} onChange={(event) => updateReaderPreference("fontSize", Number(event.target.value))} aria-label="글자 크기" /><output>{readerPreferences.fontSize}px</output></label>
          <label className="range-control"><span>행간</span><input type="range" min="1.4" max="2" step="0.1" value={readerPreferences.lineHeight} onChange={(event) => updateReaderPreference("lineHeight", Number(event.target.value))} aria-label="행간" /><output>{readerPreferences.lineHeight.toFixed(1)}</output></label>
          <button className="toolbar-button" onClick={resetReaderPreferences}>초기화</button>
        </div>
        <div className="feedback-link" role="note">
          <span>오류제보 및 기능개선 요청 :</span>
          <a href="mailto:lyh87@korea.kr">lyh87@korea.kr</a>
        </div>
      </div>
      <header className="site-header no-print">
        <button className="brand" onClick={() => setScreen("intro")} aria-label="첫 화면으로 이동">
          <BrandMark />
          <span><b>메뚜기 프로젝트</b><small>Grasshopper Project</small></span>
        </button>
        <nav aria-label="주요 메뉴">
          <button className={screen === "intro" ? "active" : ""} onClick={() => setScreen("intro")}>서비스 안내</button>
          <button className={screen === "profile" ? "active" : ""} onClick={() => setScreen("profile")}>대상 확인</button>
          <button className={screen === "check" ? "active" : ""} onClick={() => setScreen("check")}>자가점검</button>
          <button className={screen === "result" ? "active" : ""} onClick={() => setScreen("result")}>결과</button>
          <button className={screen === "cases" ? "active" : ""} onClick={() => openCases()}>조사·처분 사례</button>
        </nav>
        <div className="header-actions">
          {completed > 0 && <span className="saved-pill"><span /> 자동 저장됨</span>}
          <button className="icon-button" onClick={resetAll} aria-label="점검 초기화" title="점검 초기화">↺</button>
        </div>
      </header>

      {screen === "intro" && (
        <>
          <section className="hero">
            <div className="hero-copy">
              <div className="eyebrow"><span /> 개인정보보호위원회 안내서 기반</div>
              <span className="hero-maker">메뚜기가 만든</span>
              <h1>
                <span className="hero-title-line">개인정보 위험도 분석</span>
                <em className="hero-title-line">자가 점검 도구</em>
              </h1>
              <p>
                <b>
                  <span className="hero-text-line">개인정보 보호조치가 제대로 이루어지고 있는지 26개</span>{" "}
                  <span className="hero-text-line">점검항목을 통해 직접 확인해 보세요.</span>
                </b><br />
                <span className="hero-text-line">법적 근거, 개인정보보호위원회 안내서, 실제 조사·처분 사례와</span>{" "}
                <span className="hero-text-line">개선방법까지 함께 확인할 수 있습니다.</span>
              </p>
              <div className="hero-actions">
                <button className="primary-button" onClick={startCheck}>자가점검 시작하기 <MiniIcon name="arrow" /></button>
                <a className="secondary-button" href="#about-risk">위험도 분석 알아보기</a>
                <button className="secondary-button" onClick={() => openCases()}><MiniIcon name="case" /> 조사·처분 사례 찾기</button>
              </div>
              <div className="trust-line">
                <span><MiniIcon name="check" /> 입력정보 기기 내 저장</span>
                <span><MiniIcon name="check" /> 공식 법령·사례 연계</span>
                <span><MiniIcon name="check" /> 결과보고서 제공</span>
              </div>
            </div>
            <div className="hero-panel mascot-hero" aria-label="체크리스트를 점검하는 메뚜기 안내자">
              <div className="mascot-orbit" />
              <Image src="/images/grasshopper-hero.webp" alt="체크리스트와 돋보기를 든 전문적인 메뚜기 안내자" width={1254} height={1254} priority />
              <div className="mascot-caption"><span>🦗 메뚜기 도움말</span><b>어려운 보호조치도 한 항목씩<br />근거와 함께 확인해 드립니다.</b></div>
              <span className="floating-note note-one"><b>26개 점검항목</b><small>기관 11 · 시스템 15</small></span>
              <span className="floating-note note-two"><b>공식자료 연계</b><small>법령 · 안내서 · 처분사례</small></span>
            </div>
          </section>

          <section className="hero-capabilities" aria-label="이 도구로 확인할 수 있는 내용">
            <div><span className="section-kicker">이 도구로 확인할 수 있습니다</span><h2>판단 근거부터 개선방법까지 한곳에서</h2></div>
            <div className="capability-grid">
              {["⚖️|관련 개인정보 보호법", "📘|안전성 확보조치 기준", "📖|개인정보위 안내서", "📎|필요한 증적자료", "📋|실제 조사·처분 사례", "📰|개인정보위 보도자료", "🛠|미흡사항 개선방법"].map((item) => { const [icon, label] = item.split("|"); return <article key={label}><span>{icon}</span><b>{label}</b></article>; })}
            </div>
          </section>

          <section className="process-section" id="about-risk">
            <div className="section-heading">
              <span className="section-kicker">점검 흐름</span>
              <h2>체크리스트를 넘어,<br />개선계획까지 이어집니다</h2>
              <p>안내서의 점검표 원문과 해설을 실무자가 바로 사용할 수 있는 순서로 구성했습니다.</p>
            </div>
            <div className="process-grid">
              {[
                ["01", "대상 확인", "고유식별정보, 저장 위치와 암호화 현황을 먼저 확인합니다."],
                ["02", "보호조치 점검", "기관 11개, 시스템 15개 원문 항목에 답하고 증적을 기록합니다."],
                ["03", "자동 판정", "미흡, 확인 필요, 증적 미확인을 서로 다르게 분류합니다."],
                ["04", "결과보고서", "법적 근거와 개선 우선순위를 포함한 보고서를 인쇄합니다."],
              ].map(([number, title, body]) => (
                <article key={number} className="process-card"><span>{number}</span><h3>{title}</h3><p>{body}</p></article>
              ))}
            </div>
          </section>

          <section className="coverage-section">
            <div className="coverage-copy">
              <span className="section-kicker light">점검 범위</span>
              <h2>보호조치의 핵심을<br />빠짐없이 살펴봅니다</h2>
              <p>기관 정책부터 실제 데이터베이스와 웹서버 운영까지, 안내서 부록의 26개 항목을 그대로 담았습니다.</p>
              <button className="text-button" onClick={startCheck}>내 시스템 점검하기 <MiniIcon name="arrow" /></button>
            </div>
            <div className="coverage-list">
              {["개인정보 보호책임자·내부 관리계획", "외주인력·교육·소프트웨어 정책", "네트워크 접근통제·보안패치", "DB 접근권한·인증·접속기록", "물리적 통제·보조저장매체·파기", "웹 취약점 점검·웹서버 보호"].map((item, index) => (
                <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b><MiniIcon name="arrow" /></div>
              ))}
            </div>
          </section>

          <section className="disclaimer-band">
            <div><MiniIcon name="scale" /></div>
            <p><b>자가점검 결과는 공식적인 법 위반 판단이 아닙니다.</b><br />위험도 표시는 개선 우선순위를 정하기 위한 보조지표입니다. 실제 의무와 제재는 구체적 사실관계와 점검일 현재의 현행 법령을 확인해야 합니다.</p>
            <a href={`${privacyLawReaderBase}?document=privacy-law`} target="_blank" rel="noreferrer">보-편에서 현행 법령 보기 <MiniIcon name="arrow" /></a>
          </section>
        </>
      )}

      {screen === "profile" && (
        <section className="workspace profile-workspace">
          <div className="workspace-heading">
            <button className="back-link" onClick={() => setScreen("intro")}>← 서비스 안내</button>
            <span className="step-label">1 / 3 · 사전 대상 확인</span>
            <h1>먼저 점검 대상을 알려주세요</h1>
            <p>위험도 분석 적용 여부와 점검 범위를 정하는 데 필요한 최소 정보입니다.<br />이 도구에는 실제 개인정보를 입력하지 마십시오.</p>
          </div>

          <div className="profile-layout">
            <div className="form-card">
              <div className="form-section">
                <div className="form-section-title"><span>01</span><div><h2>기본정보</h2><p>점검 결과보고서의 기본정보로 사용됩니다.</p></div></div>
                <div className="form-grid">
                  <label>기관명 또는 사업자명<input value={profile.organization} onChange={(e) => setProfile({ ...profile, organization: e.target.value })} placeholder="예: ○○기관" /></label>
                  <label>기관 유형<select value={profile.organizationType} onChange={(e) => setProfile({ ...profile, organizationType: e.target.value })}>{["공공기관", "대기업", "중견기업", "중소기업", "소상공인", "개인", "단체", "기타"].map((item) => <option key={item}>{item}</option>)}</select></label>
                  <label>개인정보처리시스템명<input value={profile.systemName} onChange={(e) => setProfile({ ...profile, systemName: e.target.value })} placeholder="예: 민원관리시스템" /></label>
                  <label>개인정보파일명<input value={profile.fileName} onChange={(e) => setProfile({ ...profile, fileName: e.target.value })} placeholder="예: 민원처리기록" /></label>
                  <label className="full-field">처리 목적<textarea value={profile.purpose} onChange={(e) => setProfile({ ...profile, purpose: e.target.value })} placeholder="개인정보를 처리하는 주요 목적을 입력하세요." /></label>
                  <label>정보주체 수<input type="number" min="0" value={profile.dataSubjects} onChange={(e) => setProfile({ ...profile, dataSubjects: e.target.value })} placeholder="명" /></label>
                  <label>개인정보취급자 수<input type="number" min="0" value={profile.handlers} onChange={(e) => setProfile({ ...profile, handlers: e.target.value })} placeholder="명" /></label>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-title"><span>02</span><div><h2>고유식별정보와 저장 방식</h2><p>해당하는 정보를 모두 선택하세요.</p></div></div>
                <div className="choice-grid">
                  {["주민등록번호", "여권번호", "운전면허번호", "외국인등록번호"].map((identifier) => (
                    <button key={identifier} className={profile.identifiers.includes(identifier) ? "selected" : ""} onClick={() => updateIdentifier(identifier)}><span>{profile.identifiers.includes(identifier) ? "✓" : ""}</span>{identifier}</button>
                  ))}
                </div>
                <label className="field-label">선택한 고유식별정보의 저장 방식</label>
                <div className="radio-cards">
                  {[
                    ["all", "모두 암호화", "대상 정보를 모두 암호화하여 저장"],
                    ["partial", "일부 암호화", "일부 항목만 암호화하여 저장"],
                    ["none", "암호화하지 않음", "대상 정보를 평문으로 저장"],
                    ["unknown", "확인 필요", "현재 저장 방식을 알 수 없음"],
                  ].map(([value, title, body]) => (
                    <button key={value} className={profile.storage === value ? "selected" : ""} onClick={() => setProfile({ ...profile, storage: value as Profile["storage"] })}><span className="radio-dot" /><div><b>{title}</b><small>{body}</small></div></button>
                  ))}
                </div>
              </div>

              <div className="form-section last">
                <div className="form-section-title"><span>03</span><div><h2>시스템 환경</h2><p>추가 위험요소와 적용 문항을 확인합니다.</p></div></div>
                <div className="toggle-list">
                  {[
                    ["sensitive", "민감정보를 처리합니다", "건강, 사상·신념 등 법에서 정한 민감정보"],
                    ["website", "인터넷 홈페이지를 운영합니다", "웹 기반 점검항목 25~26번 적용"],
                    ["externalNetwork", "외부망과 연결되어 있습니다", "인터넷 또는 외부 구간과 연결"],
                    ["outsourced", "외부 위탁인력이 접근합니다", "개발·유지보수 등 외부인력 포함"],
                  ].map(([key, title, body]) => (
                    <label className="toggle-row" key={key}><div><b>{title}</b><small>{body}</small></div><input type="checkbox" checked={profile[key as keyof Profile] as boolean} onChange={(e) => setProfile({ ...profile, [key]: e.target.checked })} /><span className="toggle" /></label>
                  ))}
                </div>
              </div>
            </div>

            <aside className={`target-card ${targetStatus.tone}`}>
              <span className="target-kicker">대상 여부 안내</span>
              <div className="target-symbol">{targetStatus.tone === "success" ? "✓" : targetStatus.tone === "danger" ? "!" : targetStatus.tone === "warning" ? "↗" : "i"}</div>
              <h2>{targetStatus.title}</h2>
              <p>{targetStatus.body}</p>
              <div className="target-note"><b>꼭 확인하세요</b><p>위험도 분석은 개인정보파일 단위로 실시합니다. ‘예’ 답변에는 해당 조치를 입증하는 증적자료가 필요합니다.</p></div>
              <button className="primary-button full" onClick={beginQuestions}>26개 보호조치 점검 <MiniIcon name="arrow" /></button>
              <small className="privacy-note">입력 내용은 현재 브라우저 기기에만 저장됩니다.</small>
            </aside>
          </div>
        </section>
      )}

      {screen === "check" && (
        <section className="workspace check-workspace">
          <div className="check-topbar">
            <div>
              <button className="back-link" onClick={() => setScreen("profile")}>← 대상 정보 수정</button>
              <span className="step-label">2 / 3 · 보호조치 점검</span>
              <h1>{profile.systemName || "개인정보처리시스템"}</h1>
              <p>{profile.organization || "기관명 미입력"} · {profile.fileName || "개인정보파일명 미입력"}</p>
            </div>
            <div className="progress-card">
              <div className="progress-copy"><span>전체 진행률</span><b>{completed}<small> / {applicableChecks.length}</small></b></div>
              <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
              <div className="progress-helper"><span aria-hidden="true">🦗</span><small><b>{getProgressMessage(progress)}</b><br />{progress}% 완료 · 답변은 자동으로 저장됩니다.</small></div>
            </div>
          </div>

          <div className="notice-strip"><span>i</span><p><b>‘예’는 증적이 있어야 최종 충족으로 표시됩니다.</b> 증적이 없으면 ‘충족 주장 / 증적 미확인’으로 구분됩니다.</p><button onClick={() => setDetailFor(17)}>증적 예시 보기</button></div>

          <div className="check-toolbar no-print">
            <div className="filter-tabs">
              {[
                ["all", "전체", applicableChecks.length],
                ["institution", "기관 기준", 11],
                ["system", "시스템 기준", applicableChecks.length - 11],
                ["unanswered", "미답변", applicableChecks.length - completed],
                ["attention", "확인 필요", attentionItems.length],
              ].map(([value, label, count]) => <button key={String(value)} className={filter === value ? "active" : ""} onClick={() => setFilter(value as Filter)}>{label}<span>{count}</span></button>)}
            </div>
            <label className="search-box"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="항목 검색" aria-label="점검항목 검색" /></label>
          </div>

          <div className="assessment-layout">
            <aside className={`assessment-index ${showItemIndex ? "open" : ""}`}>
              <button className="assessment-panel-toggle" onClick={() => setShowItemIndex((current) => !current)} aria-expanded={showItemIndex}><span>점검 진행 목록</span><b>{activeCheck?.id ?? "-"} / {applicableChecks.length}</b></button>
              <div className="assessment-index-body">
                <div className="assessment-index-head"><span>점검 진행 목록</span><b>{completed}/{applicableChecks.length}</b></div>
                <div className="assessment-index-list">
                  {filteredChecks.map((indexItem) => {
                    const savedAnswer = answers[indexItem.id];
                    const savedEvidence = evidence[indexItem.id] ?? [];
                    const status = !savedAnswer ? "미답변" : savedAnswer === "yes" && savedEvidence.length ? "충족" : savedAnswer === "yes" ? "증적" : savedAnswer === "no" ? "미흡" : savedAnswer === "unknown" ? "확인" : "제외";
                    return <button key={indexItem.id} className={activeCheck?.id === indexItem.id ? "active" : ""} onClick={() => { setExpanded(indexItem.id); setShowItemIndex(false); }}><span>{String(indexItem.id).padStart(2, "0")}</span><div><b>{indexItem.question}</b><small>{indexItem.category}</small></div><em className={`index-status status-${savedAnswer ?? "empty"}`}>{status}</em></button>;
                  })}
                </div>
              </div>
            </aside>

            <div className="question-list focus-list">
              {filteredChecks.length > 0 && activeCheck && [activeCheck].map((item) => {
                const answer = answers[item.id];
                const itemEvidence = evidence[item.id] ?? [];
                const itemCases = casesForItem(item.id);
                const judgment = !answer ? "미답변" : answer === "yes" && itemEvidence.length ? "충족" : answer === "yes" ? "증적 미확인" : answer === "no" ? "미흡" : answer === "unknown" ? "추가 확인" : "해당 없음";
                return (
                  <article className={`question-card focus-question-panel expanded answer-${answer ?? "empty"}`} key={item.id}>
                    <div className="question-summary">
                      <span className="question-number">{String(item.id).padStart(2, "0")}</span>
                      <div className="question-copy"><span className="category-label">{item.scope === "institution" ? "기관 기준" : "시스템 기준"} · {item.category}</span><h2>{item.question}</h2></div>
                      <span className={`judgment judgment-${answer ?? "empty"}`}>{judgment}</span>
                    </div>
                    <div className="question-body">
                      <div className="grasshopper-tip"><span aria-hidden="true">🦗</span><p><b>메뚜기 도움말</b>{item.easy}</p></div>
                      <fieldset className="answer-fieldset"><legend>현재 상태를 선택하세요</legend><div className="answer-buttons answer-card-buttons">
                        {answerOptions.map((option) => <button type="button" key={option.value} className={answer === option.value ? `selected ${option.value}` : ""} onClick={() => setAnswer(item.id, option.value)}><span>{option.icon}</span><div><b>{option.title}</b><small>{option.description}</small></div></button>)}
                      </div></fieldset>
                      {answer === "yes" && itemEvidence.length === 0 && <div className="answer-hint warning"><span>!</span><p><b>충족 주장 / 증적 미확인</b><br />현재 답변상 충족이지만 이를 입증할 증적자료가 등록되지 않았습니다.</p></div>}
                      {answer === "no" && <><div className="answer-hint danger"><span>!</span><p><b>{item.priority} 개선 권고</b><br />{item.action}</p></div>{itemCases.length > 0 && <button className="case-alert" onClick={() => setCaseListFor(item.id)}><MiniIcon name="case" /><span><b>유사한 조치 미흡이 개인정보위 처분사례 {itemCases.length}건에서 확인됐습니다.</b><small>해당 항목에 연결된 사례를 모두 확인할 수 있습니다.</small></span><MiniIcon name="arrow" /></button>}</>}
                      {answer === "unknown" && <div className="answer-hint neutral"><span>?</span><p><b>이 자료를 확인해 보세요</b><br />{item.evidence.slice(0, 2).join(" · ")}</p></div>}
                      <div className="question-actions">
                        <button onClick={() => setDetailFor(item.id)}><MiniIcon name="book" /> 해설·근거 보기</button>
                        <button onClick={() => setEvidenceFor(item.id)}><MiniIcon name="clip" /> 증적 추가 {itemEvidence.length > 0 && <b>{itemEvidence.length}</b>}</button>
                        <button className="case-button" onClick={() => itemCases.length ? setCaseListFor(item.id) : openCases(item.id)}><MiniIcon name="case" /> 실제 사례 {itemCases.length > 0 && <b>{itemCases.length}</b>}</button>
                      </div>
                      {itemEvidence.length > 0 && <div className="evidence-chips">{itemEvidence.map((entry, index) => <span key={`${entry.title}-${index}`}><MiniIcon name="check" /> {entry.title}</span>)}</div>}
                      {answer && <div className={`answer-outcome outcome-${answer}`}><div className="answer-outcome-grid"><div><span>판정</span><b>{judgment}</b></div><div><span>증적 필요</span><b>{answer === "na" ? "적용 근거 기록" : answer === "yes" && itemEvidence.length ? "등록됨" : "확인·등록 필요"}</b></div><div><span>법적 근거</span><b>{item.law}</b></div><div><span>개선 필요</span><b>{answer === "no" ? `${item.priority} 조치` : answer === "unknown" ? "확인 후 결정" : answer === "yes" && !itemEvidence.length ? "증적 보완" : "현재 입력상 없음"}</b></div></div><button className="primary-button" onClick={() => goNextItem(item.id)}>{item.id === applicableChecks.at(-1)?.id ? "결과 확인" : "다음 항목"} <MiniIcon name="arrow" /></button></div>}
                    </div>
                  </article>
                );
              })}
              {filteredChecks.length === 0 && <div className="empty-state"><span>⌕</span><h2>조건에 맞는 항목이 없습니다</h2><p>검색어 또는 필터를 바꿔 보세요.</p></div>}
            </div>

            {activeCheck && <aside className={`reference-panel ${showReferences ? "open" : ""}`}>
              <button className="assessment-panel-toggle" onClick={() => setShowReferences((current) => !current)} aria-expanded={showReferences}><span>관련 정보</span><b>법령·안내서·사례</b></button>
              <div className="reference-panel-body">
                <div className="reference-head"><span aria-hidden="true">🦗</span><div><b>관련 정보 패널</b><small>{activeCheck.id}번 항목의 확인 근거</small></div></div>
                <section className="reference-legal-section"><span>⚖️ 법적 근거</span><div className="reference-provision-links">{privacyLawReaderArticleLinks("privacy-law", activeCheck.law).map((reference) => <a key={reference.url} href={reference.url} target="_blank" rel="noreferrer"><b>{reference.label}</b><MiniIcon name="arrow" /></a>)}{privacyLawReaderArticleLinks("privacy-decree", activeCheck.law).map((reference) => <a key={reference.url} href={reference.url} target="_blank" rel="noreferrer"><b>{reference.label}</b><MiniIcon name="arrow" /></a>)}{privacyNoticeArticleLinks(activeCheck.standard).map((reference) => <a key={reference.url} href={reference.url} target="_blank" rel="noreferrer"><b>{reference.label}</b><MiniIcon name="arrow" /></a>)}</div></section>
                <section><span>📖 안내서</span><b>안전성 확보조치 기준 안내서</b><small>2025.11 개정본</small><button onClick={() => setGuideFor(activeCheck.id)}>{activeCheck.page} 바로 보기 <MiniIcon name="arrow" /></button></section>
                <section><span>📎 필요한 증적자료</span><ul>{activeCheck.evidence.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul></section>
                <section><span>📋 조사·처분 사례</span><b>{casesForItem(activeCheck.id).length > 0 ? `${casesForItem(activeCheck.id).length}건 직접 연결` : "직접 연결 사례 없음"}</b><button onClick={() => casesForItem(activeCheck.id).length ? setCaseListFor(activeCheck.id) : openCases(activeCheck.id)}>전체 사례 확인 <MiniIcon name="arrow" /></button></section>
                <section><span>📰 개인정보위 보도자료</span><a href={officialCaseSearchUrl(activeCheck.category)} target="_blank" rel="noreferrer">공식자료 최신 검색 <MiniIcon name="arrow" /></a></section>
                <button className="secondary-button full" onClick={() => setDetailFor(activeCheck.id)}>해설과 근거 전체 보기</button>
              </div>
            </aside>}
          </div>

          <div className="check-footer no-print">
            <div><b>{completed}개 답변 완료</b><span>{applicableChecks.length - completed}개 항목이 남았습니다.</span></div>
            <button className="primary-button" onClick={goResult}>현재 결과 확인 <MiniIcon name="arrow" /></button>
          </div>
        </section>
      )}

      {screen === "cases" && (
        <section className="workspace cases-workspace">
          <div className="cases-heading">
            <div>
              <button className="back-link" onClick={() => setScreen(completed ? "check" : "intro")}>← {completed ? "자가점검으로 돌아가기" : "서비스 안내"}</button>
              <span className="step-label">개인정보위 공식자료 연계</span>
              <h1>조사·처분 사례 찾아보기</h1>
              <p>보도자료 본문에서 실제 위반사실이 확인된 사례만 연결했습니다. 제목의 키워드만으로 관련성을 판단하지 않습니다.</p>
            </div>
            <div className="verified-card"><span>공식자료 확인일</span><b>2026.09.02.</b><small>개인정보보호위원회 보도자료 기준</small></div>
          </div>

          <div className="case-principle">
            <MiniIcon name="case" />
            <div><b>사례는 처벌정보가 아니라 사고 예방을 위한 참고자료입니다.</b><p>사례 당시 법령과 현재 규정이 다를 수 있으며, 동일한 미흡사항이 있다는 이유만으로 같은 처분이 내려지는 것은 아닙니다.</p></div>
            <a href="https://www.pipc.go.kr/np/cop/bbs/selectBoardList.do?bbsId=BS074&mCode=C020010000" target="_blank" rel="noreferrer">개인정보위 최신 보도자료 <MiniIcon name="arrow" /></a>
          </div>

          <div className="case-filter-card">
            <label className="case-search"><MiniIcon name="search" /><input value={caseQuery} onChange={(event) => setCaseQuery(event.target.value)} placeholder="사건명, 기관명, 위반내용 검색" aria-label="조사·처분 사례 검색" /></label>
            <label><span>보호조치 유형</span><select value={caseTopic} onChange={(event) => setCaseTopic(event.target.value)}>{["전체", "개인정보 보호책임자", "내부 관리계획", "수탁자 관리·감독", "접근권한", "접근통제", "인증", "접속기록", "악성프로그램", "보안패치", "취약점 점검", "파기", "암호화", "웹 보안", "모니터링"].map((topic) => <option key={topic}>{topic}</option>)}</select></label>
            <label><span>기관 유형</span><select value={caseInstitution} onChange={(event) => setCaseInstitution(event.target.value)}>{["전체", "공공기관", "민간기업"].map((value) => <option key={value}>{value}</option>)}</select></label>
            <label><span>처분 유형</span><select value={caseDisposition} onChange={(event) => setCaseDisposition(event.target.value)}>{["전체", "과징금", "과태료", "시정명령", "시정권고", "개선권고", "징계권고", "공표명령"].map((value) => <option key={value}>{value}</option>)}</select></label>
            <label><span>연도</span><select value={caseYear} onChange={(event) => setCaseYear(event.target.value as CaseYear)}>{["all", "2026", "2025", "2024", "2023", "2022", "2021", "2020"].map((value) => <option key={value} value={value}>{value === "all" ? "전체 연도" : `${value}년`}</option>)}</select></label>
            <label><span>기간</span><select value={casePeriod} onChange={(event) => setCasePeriod(event.target.value as CasePeriod)}><option value="1">최근 1년</option><option value="3">최근 3년</option><option value="5">최근 5년</option><option value="all">전체 기간</option></select></label>
          </div>

          <div className="case-results-heading"><div><b>공식 조사·처분 사례</b><span>{filteredCases.length}건</span></div><button onClick={() => { setCaseTopic("전체"); setCaseInstitution("전체"); setCaseDisposition("전체"); setCaseYear("all"); setCasePeriod("all"); setCaseQuery(""); }}>필터 초기화</button></div>
          <div className="case-list">
            {filteredCases.map((record) => {
              const decisionCount = publicDecisionsByCase[record.id]?.length ?? 0;
              return <article className="case-list-card" key={record.id}>
                <div className="case-date"><b>{record.date.slice(0, 4)}</b><span>{record.date.slice(5).replace("-", ".")}</span></div>
                <div className="case-list-copy">
                  <div className="case-badges"><span className="direct-badge">{relevanceFor(record)}</span><span>{record.institution}</span>{decisionCount > 0 && <span className="decision-badge">공개용 의결서 {decisionCount}건</span>}{record.topics.slice(0, 3).map((topic) => <span key={topic}>{topic}</span>)}</div>
                  <h2>{record.title}</h2>
                  <p className="case-targets">처분 대상 · {record.targets}</p>
                  <p>{record.summary}</p>
                  <div className="case-dispositions">{record.dispositions.map((value) => <span key={value}>{value}</span>)}</div>
                </div>
                <div className="case-card-actions"><button onClick={() => setSelectedCase(record)}>{decisionCount > 0 ? `사례·의결서 ${decisionCount}건` : "사례 자세히 보기"} <MiniIcon name="arrow" /></button><a href={record.source} target="_blank" rel="noreferrer"><MiniIcon name="news" /> 공식 원문</a></div>
              </article>;
            })}
            {filteredCases.length === 0 && <div className="empty-state case-empty"><MiniIcon name="search" /><h2>직접 관련된 공개 사례를 찾지 못했습니다</h2><p>필터를 넓혀 유사 사례를 확인하거나 개인정보위 공식 보도자료에서 최신 자료를 검색하세요.</p><a className="primary-button" href={officialCaseSearchUrl(caseQuery || caseTopic)} target="_blank" rel="noreferrer">개인정보위에서 다시 검색 <MiniIcon name="arrow" /></a></div>}
          </div>

          <div className="case-search-footer"><div><MiniIcon name="news" /><p><b>더 최신 자료가 필요하신가요?</b><br />공식 보도자료 검색화면에서 현재 검색어로 다시 확인할 수 있습니다.</p></div><a className="secondary-button" href={officialCaseSearchUrl(caseQuery || (caseTopic === "전체" ? "안전조치" : caseTopic))} target="_blank" rel="noreferrer">공식자료 최신 검색 <MiniIcon name="arrow" /></a></div>
        </section>
      )}

      {screen === "result" && (
        <section className="workspace result-workspace">
          <div className="result-heading no-print">
            <div><button className="back-link" onClick={() => setScreen("check")}>← 점검항목 돌아가기</button><span className="step-label">3 / 3 · 결과 및 개선계획</span><h1>메뚜기 개인정보 위험도 분석 결과</h1><p>{profile.organization || "기관명 미입력"} · {profile.systemName || "시스템명 미입력"} · {new Date().toLocaleDateString("ko-KR")}</p></div>
            <div className="result-actions"><button className="secondary-button" onClick={exportData}>결과 데이터 저장</button><button className="primary-button" onClick={() => window.print()}><MiniIcon name="file" /> 결과보고서 인쇄</button></div>
          </div>

          <div className={`overall-card ${counts.no > 0 ? "high" : counts.unknown > 0 || counts.evidenceMissing > 0 ? "medium" : "low"}`}>
            <div className="overall-mascot"><Image src="/images/grasshopper-success.webp" alt="점검 완료 문서와 방패를 든 메뚜기 안내자" width={1254} height={1254} /><span>{counts.no > 0 ? "!" : counts.unknown > 0 || counts.evidenceMissing > 0 ? "△" : "✓"}</span></div>
            <div className="overall-copy"><span className="target-kicker">종합 판정</span><h2>{counts.no > 0 ? "보완이 필요한 보호조치가 있습니다" : counts.unknown > 0 || counts.evidenceMissing > 0 ? "추가 확인과 증적 보완이 필요합니다" : "입력 기준 보호조치가 충족되었습니다"}</h2><p>{counts.no > 0 ? "안내서상 점검항목 중 하나라도 ‘아니요’이면 암호화에 상응하는 충분한 안전조치가 있다고 보기 어렵습니다. 해당 개인정보파일을 암호화하거나 미흡 조치를 보완해야 합니다." : "현재 답변을 기준으로 한 자가점검 결과입니다. 실제 설정과 증적, 최신 현행 법령을 최종 확인하세요."}</p></div>
            <div className="overall-level"><small>우선순위</small><b>{counts.no > 0 ? "높음" : counts.unknown > 0 || counts.evidenceMissing > 0 ? "보통" : "낮음"}</b><span>자가점검 보조지표</span></div>
          </div>

          <div className="metric-grid">
            <article><span className="metric-dot green" /><div><small>충족</small><b>{counts.yes - counts.evidenceMissing}</b></div><p>답변과 증적 확인</p></article>
            <article><span className="metric-dot yellow" /><div><small>증적 미확인</small><b>{counts.evidenceMissing}</b></div><p>‘예’이나 증적 없음</p></article>
            <article><span className="metric-dot red" /><div><small>미흡</small><b>{counts.no}</b></div><p>개선조치 필요</p></article>
            <article><span className="metric-dot gray" /><div><small>확인 필요</small><b>{counts.unknown + (applicableChecks.length - completed)}</b></div><p>미답변 포함</p></article>
          </div>

          <div className="result-grid">
            <article className="result-panel priorities-panel">
              <div className="panel-heading"><div><span className="section-kicker">개선 우선순위</span><h2>먼저 조치할 항목</h2></div><span>{attentionItems.length}건</span></div>
              <div className="priority-list">
                {attentionItems.length === 0 ? <div className="complete-state"><span>✓</span><h3>확인할 항목이 없습니다</h3><p>현재 입력한 답변과 증적 기준입니다.</p></div> : attentionItems.sort((a, b) => (a.priority === "즉시" ? -1 : b.priority === "즉시" ? 1 : a.id - b.id)).slice(0, 8).map((item) => {
                  const answer = answers[item.id];
                  const reason = answer === "no" ? "미흡" : answer === "unknown" || !answer ? "추가 확인" : "증적 미확인";
                  return <button key={item.id} onClick={() => { setScreen("check"); setExpanded(item.id); setTimeout(() => document.querySelector(`.question-card:nth-child(${item.id})`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 100); }}><span className={`priority-badge ${item.priority === "즉시" ? "urgent" : "short"}`}>{item.priority}</span><div><b>{item.id}. {item.question}</b><small>{reason} · {item.action}</small></div><MiniIcon name="arrow" /></button>;
                })}
              </div>
            </article>

            <aside className="result-panel status-panel">
              <div className="panel-heading"><div><span className="section-kicker">항목 구성</span><h2>점검 상태</h2></div></div>
              <div className="donut-wrap"><div className="donut" style={{ background: `conic-gradient(#158467 0 ${((counts.yes - counts.evidenceMissing) / applicableChecks.length) * 100}%, #e4ad3a 0 ${((counts.yes) / applicableChecks.length) * 100}%, #c54b49 0 ${((counts.yes + counts.no) / applicableChecks.length) * 100}%, #d9dfe3 0)` }}><span><b>{completed}</b><small>/{applicableChecks.length}</small></span></div></div>
              <ul className="legend"><li><span className="metric-dot green" />충족<b>{counts.yes - counts.evidenceMissing}</b></li><li><span className="metric-dot yellow" />증적 미확인<b>{counts.evidenceMissing}</b></li><li><span className="metric-dot red" />미흡<b>{counts.no}</b></li><li><span className="metric-dot gray" />확인·미답변<b>{counts.unknown + applicableChecks.length - completed}</b></li></ul>
              <button className="secondary-button full" onClick={() => setScreen("check")}>점검 내용 보완하기</button>
            </aside>
          </div>

          <section className="result-cases no-print">
            <div className="panel-heading"><div><span className="section-kicker">실제 조사·처분 사례</span><h2>현재 미흡사항과 관련된 공식 사례</h2></div><button onClick={() => openCases()}>전체 사례 검색 <MiniIcon name="arrow" /></button></div>
            <div className="result-case-grid">
              {Array.from(new Map(attentionItems.flatMap((item) => casesForItem(item.id)).map((record) => [record.id, record])).values()).map((record) => {
                const related = attentionItems.filter((item) => record.itemIds.includes(item.id));
                return <button key={record.id} onClick={() => setSelectedCase(record)}><div className="case-badges"><span className="direct-badge">직접 관련</span><span>{record.date}</span></div><h3>{record.title}</h3><p>{related.slice(0, 2).map((item) => `${item.id}번 ${item.category}`).join(" · ") || record.topics.slice(0, 2).join(" · ")}</p><span className="result-case-more">사례 보기 <MiniIcon name="arrow" /></span></button>;
              })}
              {attentionItems.length === 0 && <div className="result-case-empty"><MiniIcon name="case" /><p><b>현재 미흡사항과 직접 연결된 추천사례가 없습니다.</b><br />전체 사례검색에서는 보호조치가 왜 중요한지 확인할 수 있습니다.</p><button onClick={() => openCases()}>사례 찾아보기</button></div>}
            </div>
          </section>

          <div className="legal-note"><MiniIcon name="scale" /><div><b>법적 판단과 구분해 주세요</b><p>위험도와 우선순위는 자가점검을 위한 보조지표이며 개인정보보호위원회의 공식 평가등급이나 법 위반 판단을 의미하지 않습니다. 관련 법령·사례 확인일: 2026.09.02.</p></div><a href={privacyNoticeUrl} target="_blank" rel="noreferrer">보-편에서 현행 기준 확인 <MiniIcon name="arrow" /></a></div>

          <section className="print-report">
            <header><BrandMark /><div><span>개인정보 보호조치 자가점검 및 위험도 분석 지원 서비스</span><h1>{serviceName} 결과보고서</h1></div><p>작성일 {new Date().toLocaleDateString("ko-KR")}</p></header>
            <h2>Ⅰ. 위험도 분석 개요</h2>
            <table><tbody><tr><th>기관명</th><td>{profile.organization || "-"}</td><th>기관 유형</th><td>{profile.organizationType}</td></tr><tr><th>대상 시스템</th><td>{profile.systemName || "-"}</td><th>개인정보파일</th><td>{profile.fileName || "-"}</td></tr><tr><th>처리 목적</th><td colSpan={3}>{profile.purpose || "-"}</td></tr><tr><th>정보주체 수</th><td>{profile.dataSubjects ? `${Number(profile.dataSubjects).toLocaleString()}명` : "-"}</td><th>취급자 수</th><td>{profile.handlers ? `${Number(profile.handlers).toLocaleString()}명` : "-"}</td></tr></tbody></table>
            <h2>Ⅱ. 개인정보파일 현황</h2>
            <table><tbody><tr><th>고유식별정보</th><td>{profile.identifiers.join(", ") || "해당 없음"}</td><th>저장 방식</th><td>{{ all: "모두 암호화", partial: "일부 암호화", none: "암호화하지 않음", unknown: "확인 필요" }[profile.storage]}</td></tr><tr><th>민감정보</th><td>{profile.sensitive ? "처리" : "미처리"}</td><th>홈페이지</th><td>{profile.website ? "운영" : "미운영"}</td></tr></tbody></table>
            <h2>Ⅲ. 점검 결과</h2>
            <div className="report-summary"><span>충족 <b>{counts.yes - counts.evidenceMissing}</b></span><span>증적 미확인 <b>{counts.evidenceMissing}</b></span><span>미흡 <b>{counts.no}</b></span><span>확인 필요 <b>{counts.unknown + applicableChecks.length - completed}</b></span></div>
            <table className="report-table"><thead><tr><th>번호</th><th>점검항목</th><th>결과</th><th>증적</th><th>안내서</th></tr></thead><tbody>{applicableChecks.map((item) => <tr key={item.id}><td>{item.id}</td><td>{item.question}</td><td>{answers[item.id] ? answerLabel[answers[item.id]] : "미답변"}</td><td>{(evidence[item.id] ?? []).map((entry) => entry.title).join(", ") || "-"}</td><td>{item.page}</td></tr>)}</tbody></table>
            <h2>Ⅳ. 주요 미흡사항 및 개선계획</h2>
            {attentionItems.length ? attentionItems.map((item) => { const relatedCases = casesForItem(item.id); return <div className="report-action" key={item.id}><h3>{item.id}. {item.question}</h3><p><b>현재 상태</b> {answers[item.id] === "no" ? "미흡" : answers[item.id] === "yes" ? "증적 미확인" : "추가 확인 필요"}</p><p><b>개선 우선순위</b> {item.priority}</p><p><b>권고 조치</b> {item.action}</p><p><b>관련 근거</b> {item.law} / {item.standard} / {item.page}</p>{relatedCases.length > 0 && <div><b>참고 조사·처분 사례 ({relatedCases.length}건)</b><ul>{relatedCases.map((record) => <li key={record.id}>{record.title} ({record.date}, {record.sourceType}) — {record.relation}</li>)}</ul></div>}</div>; }) : <p>현재 입력 기준 주요 미흡사항 없음.</p>}
            <h2>Ⅴ. 위험도 분석 결과</h2>
            <p>{counts.no > 0 ? "위험도 분석 점검항목에 ‘아니요’가 존재합니다. 안내서에 따라 암호화에 상응하는 충분한 안전조치가 이루어졌다고 보기 어려우므로 미흡조치를 이행하거나 해당 개인정보파일을 암호화해야 합니다." : "현재 입력 기준 ‘아니요’ 항목은 없습니다. 다만 증적의 적정성과 실제 보호조치 이행 여부를 개인정보 보호책임자 또는 해당 부서장이 최종 확인해야 합니다."}</p>
            <footer>본 결과는 개인정보처리자의 개인정보 보호조치 이행 현황을 스스로 확인하기 위한 자가점검 결과입니다. 행정기관의 공식적인 법 위반 판단 또는 처분 결과를 의미하지 않습니다. 법령은 점검일 현재 시행 중인 규정을 기준으로 확인하여야 합니다.</footer>
          </section>
        </section>
      )}

      {evidenceFor && (
        <EvidenceModal item={checks.find((item) => item.id === evidenceFor)!} onClose={() => setEvidenceFor(null)} onSave={(entry) => addEvidence(evidenceFor, entry)} />
      )}

      {activeDetail && (
        <DetailModal item={activeDetail} cases={casesForItem(activeDetail.id)} onClose={() => setDetailFor(null)} onEvidence={() => { setDetailFor(null); setEvidenceFor(activeDetail.id); }} onGuidePage={() => { setDetailFor(null); setGuideFor(activeDetail.id); }} onCase={(record) => { setDetailFor(null); setSelectedCase(record); }} />
      )}

      {activeGuideItem && <GuidePageModal item={activeGuideItem} onClose={() => setGuideFor(null)} />}

      {activeCaseListItem && (
        <RelatedCasesModal item={activeCaseListItem} cases={casesForItem(activeCaseListItem.id)} onClose={() => setCaseListFor(null)} onCase={(record) => { setCaseListFor(null); setSelectedCase(record); }} />
      )}

      {selectedCase && <CaseModal record={selectedCase} onClose={() => setSelectedCase(null)} onOpenItem={(itemId) => { setSelectedCase(null); setScreen("check"); setExpanded(itemId); }} />}

      <footer className="site-footer no-print"><div><BrandMark /><p><b>{serviceName}</b><br />개인정보 보호조치 자가점검 및 위험도 분석 지원 서비스</p></div><p>「개인정보의 안전성 확보조치 기준 안내서」 2025.11 기반<br />본 서비스 결과는 공식적인 법률 자문이나 행정처분 판단이 아닙니다.</p></footer>
    </main>
  );
}

function EvidenceModal({ item, onClose, onSave }: { item: CheckItem; onClose: () => void; onSave: (entry: Evidence) => void }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [owner, setOwner] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const submit = (event: FormEvent) => { event.preventDefault(); if (title.trim()) onSave({ title: title.trim(), note: note.trim(), owner: owner.trim(), date }); };
  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><form className="modal-card evidence-modal" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="evidence-title"><button className="modal-close" type="button" onClick={onClose} aria-label="닫기"><MiniIcon name="close" /></button><span className="modal-kicker">{item.id}번 항목</span><h2 id="evidence-title">증적자료 기록</h2><p>파일 자체가 아닌 확인한 자료의 명칭과 위치를 기록합니다. 입력 내용은 이 기기에만 저장됩니다.</p><div className="suggested-evidence"><b>안내서의 증적 예시</b>{item.evidence.map((text) => <button type="button" key={text} onClick={() => setTitle(text)}>{text}<span>+</span></button>)}</div><label>증적명<input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 2026년 개인정보보호 교육결과 보고" /></label><label>문서·화면 설명<textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="문서 위치, 시스템 메뉴, 확인한 설정 등을 입력하세요." /></label><div className="form-grid"><label>담당부서<input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="예: 정보보호팀" /></label><label>확인일자<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>취소</button><button className="primary-button" disabled={!title.trim()}>증적 기록하기</button></div></form></div>;
}

function DetailModal({ item, cases, onClose, onEvidence, onGuidePage, onCase }: { item: CheckItem; cases: CaseRecord[]; onClose: () => void; onEvidence: () => void; onGuidePage: () => void; onCase: (record: CaseRecord) => void }) {
  const lawUrl = privacyLawReaderUrl("privacy-law", item.law);
  const decreeUrl = privacyLawReaderUrl("privacy-decree", item.law);
  const lawLabel = item.law.split("·").filter((part) => !part.includes("시행령")).join(" · ").trim();
  const noticeLinks = privacyNoticeArticleLinks(item.standard);
  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><article className="modal-card detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title"><button className="modal-close" onClick={onClose} aria-label="닫기"><MiniIcon name="close" /></button><span className="modal-kicker">{item.id}번 · {item.category}</span><h2 id="detail-title">{item.question}</h2><section><h3><MiniIcon name="book" /> 안내서 해설</h3><p>{item.easy}</p><button type="button" className="source-chip source-chip-button" onClick={onGuidePage}><span>출처</span><b>개인정보의 안전성 확보조치 기준 안내서(2025.11)</b><em>{item.page} 열기 <MiniIcon name="arrow" /></em></button></section><section><h3><MiniIcon name="clip" /> 확인해야 할 증적자료</h3><ul>{item.evidence.map((text) => <li key={text}><MiniIcon name="check" /> {text}</li>)}</ul></section><section><h3><MiniIcon name="scale" /> 관련 법적 근거</h3><div className="legal-links"><a href={lawUrl} target="_blank" rel="noreferrer"><span>보-편 · 법률</span><b>{lawLabel}</b><MiniIcon name="arrow" /></a>{item.law.includes("시행령") && <a href={decreeUrl} target="_blank" rel="noreferrer"><span>보-편 · 시행령</span><b>{item.law.split("·").find((part) => part.includes("시행령"))?.trim()}</b><MiniIcon name="arrow" /></a>}{noticeLinks.map((notice) => <a key={notice.url} href={notice.url} target="_blank" rel="noreferrer"><span>보-편 · 개인정보보호위원회 고시</span><b>{notice.label}</b><MiniIcon name="arrow" /></a>)}</div><small className="legal-date">법령 연결: 보-편(보호법 편히보기) · 링크에서 조문 전문과 시행일을 다시 확인하세요.</small></section><section className="linked-case-section"><h3><MiniIcon name="case" /> 실제 조사·처분 사례 {cases.length > 0 && <span className="linked-case-count">{cases.length}건 전체</span>}</h3>{cases.length > 0 ? cases.map((record) => <button key={record.id} onClick={() => onCase(record)}><div><span>직접 관련 · {record.date}</span><b>{record.title}</b><small>{record.targets}</small></div><MiniIcon name="arrow" /></button>) : <p>현재 확인된 개인정보위 공식자료에서 이 항목과 직접 연결되는 공개 처분사례를 찾지 못했습니다.</p>}</section><div className="modal-actions"><button className="secondary-button" onClick={onClose}>닫기</button><button className="primary-button" onClick={onEvidence}>증적 추가 <MiniIcon name="arrow" /></button></div></article></div>;
}

function GuidePageModal({ item, onClose }: { item: CheckItem; onClose: () => void }) {
  const availablePages = guidePageNumbers(item.page).filter((page) => guidePages[page]);
  const [selectedPage, setSelectedPage] = useState(availablePages[0] ?? 170);
  const blocks = guideBlocks(guidePages[selectedPage] ?? []);
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><article className="modal-card guide-page-modal" role="dialog" aria-modal="true" aria-labelledby="guide-page-title"><button className="modal-close" onClick={onClose} aria-label="닫기"><MiniIcon name="close" /></button><span className="modal-kicker">{item.id}번 점검항목 · 안내서 원문</span><h2 id="guide-page-title">{guideTitle}</h2><p>{item.question}</p>{availablePages.length > 1 && <div className="guide-page-tabs" role="tablist" aria-label="안내서 페이지 선택">{availablePages.map((page) => <button key={page} role="tab" aria-selected={selectedPage === page} className={selectedPage === page ? "active" : ""} onClick={() => setSelectedPage(page)}>p.{page}</button>)}</div>}<section className="guide-page-sheet" aria-label={`안내서 ${selectedPage}페이지`}><header><span>개인정보보호위원회</span><b>{selectedPage}</b></header><div className="guide-page-copy">{blocks.map((block, index) => <p key={`${block.kind}-${index}`} className={`guide-${block.kind}`}>{block.kind === "bullet" && <span aria-hidden="true">•</span>}{block.text}</p>)}</div><footer>출처: 개인정보보호위원회, 「개인정보의 안전성 확보조치 기준 안내서」, 2025.11.</footer></section><div className="modal-actions"><button className="secondary-button" onClick={onClose}>닫기</button></div></article></div>;
}

function RelatedCasesModal({ item, cases, onClose, onCase }: { item: CheckItem; cases: CaseRecord[]; onClose: () => void; onCase: (record: CaseRecord) => void }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><article className="modal-card related-cases-modal" role="dialog" aria-modal="true" aria-labelledby="related-cases-title"><button className="modal-close" onClick={onClose} aria-label="닫기"><MiniIcon name="close" /></button><span className="modal-kicker">{item.id}번 · {item.category}</span><h2 id="related-cases-title">연결된 조사·처분 사례 {cases.length}건</h2><p>현재 사이트에 수록된 개인정보보호위원회 공식자료 중 이 점검항목과 직접 관련된 사례를 모두 표시합니다.</p><section className="linked-case-section related-case-list">{cases.map((record) => <button key={record.id} onClick={() => onCase(record)}><div><span>직접 관련 · {record.date} · {record.sourceType}</span><b>{record.title}</b><small>{record.targets}</small></div><MiniIcon name="arrow" /></button>)}</section><div className="modal-actions"><button className="secondary-button" onClick={onClose}>닫기</button></div></article></div>;
}

function CaseModal({ record, onClose, onOpenItem }: { record: CaseRecord; onClose: () => void; onOpenItem: (itemId: number) => void }) {
  const relatedItems = checks.filter((item) => record.itemIds.includes(item.id));
  const decisions = publicDecisionsByCase[record.id] ?? [];
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><article className="modal-card case-modal" role="dialog" aria-modal="true" aria-labelledby="case-title"><button className="modal-close" onClick={onClose} aria-label="닫기"><MiniIcon name="close" /></button><div className="case-modal-head"><div className="case-badges"><span className="direct-badge">직접 관련 사례</span><span>{record.sourceType}</span>{decisions.length > 0 && <span className="decision-badge">공개용 의결서 {decisions.length}건</span>}</div><span className="case-modal-date">{record.date}</span></div><h2 id="case-title">{record.title}</h2><p className="case-modal-target"><b>처분 대상</b> {record.targets}</p><section><h3>사건 개요와 확인된 문제점</h3><p>{record.summary}</p><ul className="problem-list">{record.problems.map((problem) => <li key={problem}><span>!</span>{problem}</li>)}</ul></section><section><h3>처분 결과</h3><div className="case-sanctions">{record.dispositions.map((value) => <span key={value}>{value}</span>)}</div><p>{record.dispositionSummary}</p><div className="case-caution"><span>i</span><p>여러 위반행위를 합하여 처분한 사건은 특정 점검항목 하나에 전체 과징금·과태료가 부과된 것으로 해석해서는 안 됩니다.</p></div></section><section><h3>현재 점검항목과의 관계</h3><p>{record.relation}</p><div className="related-item-list">{relatedItems.slice(0, 6).map((item) => <button key={item.id} onClick={() => onOpenItem(item.id)}><span>{String(item.id).padStart(2, "0")}</span><b>{item.question}</b><MiniIcon name="arrow" /></button>)}</div>{relatedItems.length > 6 && <small className="more-items">그 밖에 {relatedItems.length - 6}개 관련 항목이 있습니다.</small>}</section><section><h3>이 사례에서 확인할 점</h3><ul className="learning-list">{record.learning.map((text) => <li key={text}><MiniIcon name="check" /> {text}</li>)}</ul></section><section><h3>적용 법령</h3><div className="case-laws">{record.laws.map((law) => <span key={law}>{law}</span>)}</div>{record.historicalNote && <div className="past-law-note"><b>과거 법령 적용 사례</b><p>{record.historicalNote}</p></div>}</section><section className="public-decision-section"><div className="public-decision-head"><h3>공개용 의결서</h3>{decisions.length > 0 && <span>{decisions.length}건</span>}</div><p>보도자료의 처분 대상과 사실관계를 대조해 정확히 일치하는 개인정보보호위원회 공개용 의결서만 연결했습니다.</p>{decisions.length > 0 ? <div className="public-decision-list">{decisions.map((decision) => { const isAgenda = decision.linkType === "agenda"; return <article key={decision.decisionNo} className="public-decision-card"><a className="decision-download" href={decision.url} target="_blank" rel="noreferrer" aria-label={`${decision.organization} ${decision.decisionNo} ${isAgenda ? "공식 의결서 페이지" : "공개용 의결서 PDF"} 보기`}><span className="pdf-chip">{isAgenda ? "공식" : "PDF"}</span><span><b>{decision.organization}</b><small>{decision.decisionNo} · {isAgenda ? "첨부파일 제공 페이지" : "공개용 PDF"}</small></span><MiniIcon name="arrow" /></a></article>; })}</div> : <div className="public-decision-empty"><b>정확히 일치하는 공개용 의결서가 확인되지 않았습니다.</b><p>수집일 현재 공개된 첨부 문서 중 이 사례와 동일한 기관·사실관계의 문서가 없습니다. 보도자료 원문에서 처분 내용을 확인해 주세요.</p></div>}<small className="public-decision-note">개인정보보호위원회 공개자료 · 수집일 {publicDecisionCollectedAt} · 새 창에서 PDF 또는 공식 첨부페이지 보기</small></section><div className="source-verification"><MiniIcon name="news" /><div><b>공식자료에서 직접 확인하세요</b><p>출처: 개인정보보호위원회 보도자료 · {record.date} · 사이트 확인일 2026.09.02.</p></div><a href={record.source} target="_blank" rel="noreferrer">보도자료 원문 <MiniIcon name="arrow" /></a></div><div className="modal-actions"><button className="secondary-button" onClick={onClose}>닫기</button><a className="primary-button" href={record.source} target="_blank" rel="noreferrer">보도자료 원문 보기 <MiniIcon name="arrow" /></a></div></article></div>;
}
