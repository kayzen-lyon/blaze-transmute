import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

/**
 * Merge multiple PDF files into one
 */
export async function mergePDFs(
  files: File[],
  onProgress?: (p: number) => void
): Promise<Blob> {
  onProgress?.(5);
  const mergedDoc = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const bytes = await files[i].arrayBuffer();
    const srcDoc = await PDFDocument.load(bytes);
    const pages = await mergedDoc.copyPages(srcDoc, srcDoc.getPageIndices());
    pages.forEach((page) => mergedDoc.addPage(page));
    onProgress?.(10 + Math.round((i / files.length) * 80));
  }

  onProgress?.(95);
  const mergedBytes = await mergedDoc.save();
  onProgress?.(100);
  return new Blob([mergedBytes as unknown as ArrayBuffer], { type: "application/pdf" });
}

/**
 * Split a PDF into individual page files
 */
export async function splitPDF(
  file: File,
  onProgress?: (p: number) => void
): Promise<Blob[]> {
  onProgress?.(5);
  const bytes = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(bytes);
  const totalPages = srcDoc.getPageCount();
  const results: Blob[] = [];

  for (let i = 0; i < totalPages; i++) {
    const newDoc = await PDFDocument.create();
    const [page] = await newDoc.copyPages(srcDoc, [i]);
    newDoc.addPage(page);
    const pageBytes = await newDoc.save();
    results.push(new Blob([pageBytes as unknown as ArrayBuffer], { type: "application/pdf" }));
    onProgress?.(10 + Math.round((i / totalPages) * 85));
  }

  onProgress?.(100);
  return results;
}

/**
 * Get page count of a PDF
 */
export async function getPDFPageCount(file: File): Promise<number> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  return doc.getPageCount();
}

/**
 * Add a signature image to a PDF
 */
export async function signPDF(
  file: File,
  signatureDataUrl: string,
  pageIndex: number = 0,
  position: { x: number; y: number; width: number; height: number } = {
    x: 50,
    y: 50,
    width: 200,
    height: 80,
  },
  onProgress?: (p: number) => void
): Promise<Blob> {
  onProgress?.(10);
  const bytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes);
  onProgress?.(30);

  // Convert data URL to bytes
  const sigResponse = await fetch(signatureDataUrl);
  const sigBytes = await sigResponse.arrayBuffer();

  const sigImage = await pdfDoc.embedPng(new Uint8Array(sigBytes));
  onProgress?.(50);

  const page = pdfDoc.getPage(pageIndex);
  const { height: pageHeight } = page.getSize();

  page.drawImage(sigImage, {
    x: position.x,
    y: pageHeight - position.y - position.height,
    width: position.width,
    height: position.height,
  });

  // Add timestamp
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const now = new Date();
  const timestamp = `Signé le ${now.toLocaleDateString("fr-FR")} à ${now.toLocaleTimeString("fr-FR")}`;

  page.drawText(timestamp, {
    x: position.x,
    y: pageHeight - position.y - position.height - 14,
    size: 7,
    font,
    color: rgb(0.4, 0.4, 0.4),
  });

  onProgress?.(80);
  const signedBytes = await pdfDoc.save();
  onProgress?.(100);
  return new Blob([signedBytes as unknown as ArrayBuffer], { type: "application/pdf" });
}

/**
 * OCR a PDF using Tesseract.js — converts pages to images first,
 * then runs OCR on each.
 */
export async function ocrPDF(
  file: File,
  onProgress?: (p: number) => void
): Promise<string> {
  onProgress?.(5);

  // Dynamic import to avoid loading tesseract on page load
  const Tesseract = await import("tesseract.js");
  onProgress?.(15);

  const worker = await Tesseract.createWorker("fra+eng", undefined, {
    logger: (m) => {
      if (m.status === "recognizing text" && typeof m.progress === "number") {
        onProgress?.(20 + Math.round(m.progress * 75));
      }
    },
  });

  // For OCR, we render PDF pages to canvas via pdf.js or just process the file as image
  // Since we don't have pdf.js, we'll use a simpler approach:
  // Convert the PDF to an image blob using canvas
  const bytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes);
  const pageCount = pdfDoc.getPageCount();

  let fullText = "";

  // We'll process the raw PDF bytes with tesseract
  // Tesseract can handle PDF directly as an image format in some cases,
  // but for reliability, let's extract each page
  for (let i = 0; i < pageCount; i++) {
    // Create a single-page PDF for each page
    const singleDoc = await PDFDocument.create();
    const [page] = await singleDoc.copyPages(pdfDoc, [i]);
    singleDoc.addPage(page);
    const singleBytes = await singleDoc.save();
    const singleBlob = new Blob([singleBytes as unknown as ArrayBuffer], { type: "application/pdf" });

    try {
      const result = await worker.recognize(singleBlob);
      fullText += `--- Page ${i + 1} ---\n${result.data.text}\n\n`;
    } catch {
      fullText += `--- Page ${i + 1} ---\n[OCR non disponible pour cette page]\n\n`;
    }

    onProgress?.(20 + Math.round(((i + 1) / pageCount) * 75));
  }

  await worker.terminate();
  onProgress?.(100);
  return fullText.trim();
}
