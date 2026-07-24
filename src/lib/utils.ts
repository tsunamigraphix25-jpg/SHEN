export function formatDate(date: Date | string | null): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function categoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    article: "Article",
    research: "Research",
    news: "News",
    event: "Event",
    gallery: "Gallery",
    safety_report: "Safety Report",
    training_material: "Training Material",
  };
  return labels[cat] || cat;
}

export function categoryColor(cat: string): string {
  const colors: Record<string, string> = {
    article: "bg-emerald-100 text-emerald-800",
    research: "bg-lime-100 text-lime-800",
    news: "bg-green-100 text-green-800",
    event: "bg-teal-100 text-teal-800",
    gallery: "bg-cyan-100 text-cyan-800",
    safety_report: "bg-amber-100 text-amber-800",
    training_material: "bg-yellow-100 text-yellow-800",
  };
  return colors[cat] || "bg-gray-100 text-gray-800";
}

export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: "Draft",
    pending: "Pending Review",
    under_editing: "Under Editing",
    approved: "Approved",
    published: "Published",
  };
  return labels[status] || status;
}

export function statusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    pending: "bg-yellow-100 text-yellow-800",
    under_editing: "bg-blue-100 text-blue-800",
    approved: "bg-lime-100 text-lime-800",
    published: "bg-emerald-100 text-emerald-800",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
}

export function renderMarkdown(content: string): string {
  let html = content;
  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // Lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>');
  // Wrap consecutive li tags in ul
  html = html.replace(/((<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');
  // Paragraphs - wrap lines that aren't already wrapped
  const lines = html.split('\n');
  const result: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      result.push('');
    } else if (
      trimmed.startsWith('<h') ||
      trimmed.startsWith('<ul') ||
      trimmed.startsWith('<li') ||
      trimmed.startsWith('</ul') ||
      trimmed.startsWith('<blockquote')
    ) {
      result.push(trimmed);
    } else {
      result.push(`<p>${trimmed}</p>`);
    }
  }
  return result.join('\n');
}
