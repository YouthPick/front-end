import React from "react";

interface ChatMessageContentProps {
  text: string;
  role: "user" | "bot";
}

type InlineSegment =
  | { kind: "text"; text: string; key: string }
  | { kind: "bold"; text: string; key: string }
  | { kind: "link"; label: string; href: string; key: string };

type ParsedBlock =
  | { kind: "paragraph"; text: string; key: string }
  | { kind: "ordered"; number: string; text: string; key: string }
  | { kind: "bullet"; text: string; key: string };

const ORDERED_ITEM_PATTERN = /^(\d+)\.\s+(.+)$/;
const BULLET_ITEM_PATTERN = /^[-•]\s+(.+)$/;
const LINK_OR_BOLD_PATTERN = /(\[[^\]]+\]\([^\s)]+\)|\*\*[^*]+\*\*)/g;
const MARKDOWN_LINK_PATTERN = /^\[([^\]]+)\]\(([^\s)]+)\)$/;
const BOLD_PATTERN = /^\*\*([^*]+)\*\*$/;

export function ChatMessageContent({ text, role }: ChatMessageContentProps) {
  const blocks = parseBlocks(text);
  const textColor = role === "user" ? "text-white" : "text-slate-700";

  return (
    <div className={`min-w-0 max-w-full space-y-2 whitespace-normal break-words ${textColor}`}>
      {blocks.map((block) => renderBlock(block, role))}
    </div>
  );
}

function parseBlocks(text: string): ParsedBlock[] {
  const blocks: ParsedBlock[] = [];
  const paragraphLines: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return;
    const paragraphText = paragraphLines.join("\n").trim();
    if (paragraphText) {
      blocks.push({
        kind: "paragraph",
        text: paragraphText,
        key: blockKey("p", blocks.length, paragraphText),
      });
    }
    paragraphLines.length = 0;
  };

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      continue;
    }

    const orderedMatch = ORDERED_ITEM_PATTERN.exec(line);
    if (orderedMatch) {
      flushParagraph();
      blocks.push({
        kind: "ordered",
        number: orderedMatch[1],
        text: orderedMatch[2],
        key: blockKey("ol", blocks.length, line),
      });
      continue;
    }

    const bulletMatch = BULLET_ITEM_PATTERN.exec(line);
    if (bulletMatch) {
      flushParagraph();
      blocks.push({
        kind: "bullet",
        text: bulletMatch[1],
        key: blockKey("li", blocks.length, line),
      });
      continue;
    }

    paragraphLines.push(line);
  }

  flushParagraph();
  return blocks;
}

function renderBlock(block: ParsedBlock, role: "user" | "bot") {
  const paragraphTextClass = role === "user" ? "text-white" : "text-slate-700";
  const strongTextClass = role === "user" ? "text-white" : "text-slate-800";
  const markerClass = role === "user" ? "bg-white/20 text-white" : "bg-primary/10 text-primary";
  const bulletClass = role === "user" ? "bg-white/70" : "bg-slate-300";

  switch (block.kind) {
    case "ordered":
      return (
        <div key={block.key} className="mt-3 flex min-w-0 items-start gap-2 first:mt-0">
          <span
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${markerClass}`}
          >
            {block.number}
          </span>
          <p className={`min-w-0 flex-1 break-words font-bold ${strongTextClass}`}>
            {renderInline(block.text, role)}
          </p>
        </div>
      );
    case "bullet":
      return (
        <div key={block.key} className="flex min-w-0 items-start gap-2 pl-1">
          <span className={`mt-[0.58em] h-1.5 w-1.5 shrink-0 rounded-full ${bulletClass}`} />
          <p className={`min-w-0 flex-1 break-words ${paragraphTextClass}`}>
            {renderInline(block.text, role)}
          </p>
        </div>
      );
    case "paragraph":
      return (
        <p
          key={block.key}
          className={`min-w-0 break-words whitespace-pre-wrap ${paragraphTextClass}`}
        >
          {renderInline(block.text, role)}
        </p>
      );
  }
}

function renderInline(text: string, role: "user" | "bot"): React.ReactNode[] {
  return parseInline(text).map((segment) => {
    switch (segment.kind) {
      case "bold":
        return (
          <strong
            key={segment.key}
            className={role === "user" ? "font-bold text-white" : "font-bold text-primary"}
          >
            {segment.text}
          </strong>
        );
      case "link":
        return (
          <a
            key={segment.key}
            href={segment.href}
            target="_blank"
            rel="noopener noreferrer"
            className={
              role === "user"
                ? "break-all font-bold underline decoration-white/70 underline-offset-2"
                : "break-all font-bold text-primary underline underline-offset-2"
            }
          >
            {segment.label}
          </a>
        );
      case "text":
        return <React.Fragment key={segment.key}>{segment.text}</React.Fragment>;
    }
  });
}

function parseInline(text: string): InlineSegment[] {
  const segments: InlineSegment[] = [];
  let cursor = 0;
  for (const match of text.matchAll(LINK_OR_BOLD_PATTERN)) {
    const token = match[0];
    const index = match.index ?? 0;
    if (index > cursor) {
      const plain = text.slice(cursor, index);
      segments.push({ kind: "text", text: plain, key: inlineKey("txt", index, plain) });
    }

    const linkMatch = MARKDOWN_LINK_PATTERN.exec(token);
    if (linkMatch) {
      segments.push({
        kind: "link",
        label: linkMatch[1],
        href: linkMatch[2],
        key: inlineKey("link", index, token),
      });
    } else {
      const boldMatch = BOLD_PATTERN.exec(token);
      if (boldMatch) {
        segments.push({
          kind: "bold",
          text: boldMatch[1],
          key: inlineKey("bold", index, token),
        });
      } else {
        segments.push({ kind: "text", text: token, key: inlineKey("txt", index, token) });
      }
    }
    cursor = index + token.length;
  }

  if (cursor < text.length) {
    const plain = text.slice(cursor);
    segments.push({ kind: "text", text: plain, key: inlineKey("txt", cursor, plain) });
  }

  return segments.length > 0 ? segments : [{ kind: "text", text, key: inlineKey("txt", 0, text) }];
}

function blockKey(prefix: string, index: number, value: string): string {
  return `${prefix}-${index}-${hashString(value)}`;
}

function inlineKey(prefix: string, index: number, value: string): string {
  return `${prefix}-${index}-${hashString(value)}`;
}

function hashString(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36);
}
