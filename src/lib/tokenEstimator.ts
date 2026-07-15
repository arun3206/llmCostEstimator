export type TokenEstimate = {
  characters: number;
  words: number;
  tokens: number;
  method: "estimated";
};

export function estimateTokens(text: string): TokenEstimate {
  const trimmed = text.trim();
  const characters = text.length;
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;

  if (!trimmed) {
    return { characters, words: 0, tokens: 0, method: "estimated" };
  }

  const punctuationCount = (text.match(/[.,;:!?()[\]{}"'`<>/=+\-*]/g) ?? []).length;
  const whitespaceCount = (text.match(/\s/g) ?? []).length;
  const nonLatinCount = (text.match(/[^\u0000-\u024F\s]/g) ?? []).length;
  const codeLikeSignals = (text.match(/[{}[\];=<>]|=>|function|const|let|var|class|import|export/g) ?? []).length;
  const jsonLikeSignals = (text.match(/"[^"]+"\s*:|^\s*[{[]/gm) ?? []).length;

  const proseEstimate = words * 1.33;
  const characterEstimate = characters / 4;
  const structurePenalty =
    punctuationCount * 0.18 +
    whitespaceCount * 0.04 +
    codeLikeSignals * 0.65 +
    jsonLikeSignals * 0.9 +
    nonLatinCount * 0.55;

  const tokens = Math.max(1, Math.round(Math.max(proseEstimate, characterEstimate) + structurePenalty));
  return { characters, words, tokens, method: "estimated" };
}
