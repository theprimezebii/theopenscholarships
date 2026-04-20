export function slugify(text: string): string {
  // 移除年份和冗余描述词
  const cleaned = text
    .replace(/\b(20\d{2}|202[5-9]|2030)\b/gi, '') // 移除年份
    .replace(/\b(fully[- ]?funded|scholarship|program|opportunity|for international students)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  const base = cleaned || text; // 如果清理后为空，则使用原始标题

  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60); // 限制长度
}
