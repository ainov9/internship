import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

export async function parsePdf(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: buffer }).promise;
  let text = '';

  for (let index = 1; index <= pdf.numPages; index += 1) {
    const page = await pdf.getPage(index);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(' ') + '\n';
  }

  return {
    rows: [{ preview: text.slice(0, 500) }],
    fields: ['preview'],
  };
}
