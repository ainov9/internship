export function parseJson(text) {
  const parsed = JSON.parse(text);
  const rows = Array.isArray(parsed) ? parsed : [parsed];
  return {
    rows,
    fields: rows.length ? Object.keys(rows[0]) : [],
  };
}
