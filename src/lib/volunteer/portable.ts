import "server-only";
import { randomUUID } from "node:crypto";

export const newKey = () => randomUUID().replace(/-/g, "").slice(0, 12);

interface Span { _type: "span"; _key: string; text: string; marks: string[] }
interface LinkDef { _type: "link"; _key: string; href: string }
export interface Block {
  _type: "block";
  _key: string;
  style: string;
  children: Span[];
  markDefs: LinkDef[];
  listItem?: "bullet" | "number";
  level?: number;
}

const span = (text: string, marks: string[] = []): Span => ({ _type: "span", _key: newKey(), text, marks });

/** Turns "text with [a link](https://x.com)" into spans + link annotations. */
function inline(text: string) {
  const markDefs: LinkDef[] = [];
  const children: Span[] = [];
  const re = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) children.push(span(text.slice(last, m.index)));
    const key = newKey();
    markDefs.push({ _type: "link", _key: key, href: m[2] });
    children.push(span(m[1], [key]));
    last = m.index + m[0].length;
  }
  if (last < text.length) children.push(span(text.slice(last)));
  if (!children.length) children.push(span(""));
  return { children, markDefs };
}

function block(style: string, text: string, listItem?: "bullet" | "number"): Block {
  const { children, markDefs } = inline(text);
  return { _type: "block", _key: newKey(), style, children, markDefs, ...(listItem ? { listItem, level: 1 } : {}) };
}

/**
 * Plain text -> Sanity Portable Text, using only styles your schemas allow.
 *   blank line = new paragraph      ## Heading 2      ### Heading 3
 *   > quote     - bullet            1. numbered       [text](https://link)
 */
export function textToBlocks(input: string): Block[] {
  const blocks: Block[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) blocks.push(block("normal", para.join(" ")));
    para = [];
  };

  for (const raw of input.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trim();
    let m: RegExpMatchArray | null;
    if (!line) flush();
    else if ((m = line.match(/^###\s+(.+)$/))) { flush(); blocks.push(block("h3", m[1])); }
    else if ((m = line.match(/^##\s+(.+)$/))) { flush(); blocks.push(block("h2", m[1])); }
    else if ((m = line.match(/^>\s?(.+)$/))) { flush(); blocks.push(block("blockquote", m[1])); }
    else if ((m = line.match(/^[-*\u2022]\s+(.+)$/))) { flush(); blocks.push(block("normal", m[1], "bullet")); }
    else if ((m = line.match(/^\d+[.)]\s+(.+)$/))) { flush(); blocks.push(block("normal", m[1], "number")); }
    else para.push(line);
  }
  flush();
  return blocks;
}
