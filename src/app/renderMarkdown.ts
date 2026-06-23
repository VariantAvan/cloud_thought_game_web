function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Minimal markdown: headings, bullet lists, paragraphs. Skips HTML comments. */
export function renderMarkdown(md: string): string {
  const withoutComments = md.replace(/<!--[\s\S]*?-->/g, '').trim();
  const blocks = withoutComments.split(/\n\n+/);
  const parts: string[] = [];

  for (const block of blocks) {
    const lines = block.split('\n');
    const first = lines[0];

    if (first.startsWith('# ')) {
      parts.push(`<h1>${escapeHtml(first.slice(2))}</h1>`);
      continue;
    }

    if (first.startsWith('## ')) {
      parts.push(`<h2>${escapeHtml(first.slice(3))}</h2>`);
      continue;
    }

    if (lines.every((line) => line.startsWith('- '))) {
      const items = lines
        .map((line) => `<li>${escapeHtml(line.slice(2))}</li>`)
        .join('');
      parts.push(`<ul>${items}</ul>`);
      continue;
    }

    const paragraph = lines.map((line) => escapeHtml(line)).join('<br>');
    parts.push(`<p>${paragraph}</p>`);
  }

  return parts.join('\n');
}
