
export const privacyLawReaderBase = "https://privacy-law-reader.vercel.app/";

export const privacyNoticeUrl = `${privacyLawReaderBase}?document=privacy-notice&article=notice-73493`;

export const privacyNoticeArticleLinks = (reference: string) => {
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

export const privacyLawReaderUrl = (document: "privacy-law" | "privacy-decree", reference: string) => {
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

export const privacyLawReaderArticleLinks = (document: "privacy-law" | "privacy-decree", reference: string) => {
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

