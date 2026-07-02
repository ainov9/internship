export function parseText(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  return {
    rows: lines.map((line) => ({ preview: line })),
    fields: ['preview'],
  };
}
