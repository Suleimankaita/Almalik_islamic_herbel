import Logo from '../assets/Logo.png';

export interface PrintableSaleItem {
  id: string;
  name: string;
  variant?: string;
  price: number;
  quantity: number;
}

interface ReceiptOptions {
  paymentMethod?: string;
  receiptNo?: string;
  date?: string;
  time?: string;
  cashier?: string;
}

const STORE = {
  name: 'Al Malik Islamic Medicine',
  tagline: 'Halal & Sunnah-based Wellness Store',
  address: 'Shop N7 Ummi Plaza, Northwest Road, Kabuga, Nigeria',
  phone: '+234 815 059 4632',
  email: 'ALmalik_Islamic_Medicine@gmail.com',
};

/**
 * HOW THIS WORKS
 * The receipt is drawn onto a canvas that is exactly as wide as the printer
 * (384 dots = 48mm at 203 dpi), converted to pure black/white, and printed as
 * one image. The browser and driver then have nothing to re-render or rescale,
 * so text comes out exactly as drawn.
 *
 * Tuning (all in printer dots, 8 dots = 1mm):
 */
const DOTS_WIDTH = 384; // 58mm printers: 384. (80mm printers: 576)
const PAPER_MM = 58;
const PRINTABLE_MM = 48; // DOTS_WIDTH / 8
const SIDE_PAD = 6; // keeps text away from unreliable edge dots
const FEED_BOTTOM = 56; // blank space at the end so the tear bar doesn't cut text
const THRESHOLD = 170; // higher = bolder/blacker, lower = thinner
const FONT = 'Arial, Helvetica, sans-serif';
const MONO = '"Courier New", Courier, monospace';

const SIZE = { small: 20, body: 22, title: 26, store: 30, total: 28 };

const COUNTER_KEY = 'al-malik:receipt-counter';

/** Use printer-friendly currency characters. */
export const formatCurrency = (amount: number): string =>
  `N${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const openReceiptWindow = (): Window | null =>
  window.open('', '_blank', 'width=400,height=700');

const localDate = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const localTime = (date: Date): string =>
  date.toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

/** Counter survives page reloads (resets each day) so receipt numbers don't repeat. */
const generateReceiptNo = (): string => {
  const now = new Date();
  const day = localDate(now);
  let n = 1;

  try {
    const saved = JSON.parse(localStorage.getItem(COUNTER_KEY) || 'null');
    if (saved && saved.day === day && Number.isFinite(saved.n)) {
      n = saved.n + 1;
    }
    localStorage.setItem(COUNTER_KEY, JSON.stringify({ day, n }));
  } catch {
    n = Math.floor(now.getTime() / 1000) % 10000;
  }

  return `AM-${day.replace(/-/g, '')}-${String(n).padStart(4, '0')}`;
};

interface ReceiptData {
  items: PrintableSaleItem[];
  receiptNo: string;
  date: string;
  time: string;
  payment: string;
  cashier: string;
  totalUnits: number;
  total: number;
}

const loadImage = (src: string): Promise<HTMLImageElement | null> =>
  new Promise((resolve) => {
    const img = new Image();
    const timer = window.setTimeout(() => resolve(null), 2000);
    img.onload = () => {
      window.clearTimeout(timer);
      resolve(img);
    };
    img.onerror = () => {
      window.clearTimeout(timer);
      resolve(null);
    };
    img.src = src;
  });

/** Break text into lines that fit maxWidth (also splits very long words). */
const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] => {
  const lines: string[] = [];

  for (const paragraph of String(text).split('\n')) {
    let line = '';

    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const test = line ? `${line} ${word}` : word;

      if (ctx.measureText(test).width <= maxWidth) {
        line = test;
        continue;
      }

      if (line) lines.push(line);
      line = '';

      // Word longer than a full line: split by characters.
      let chunk = '';
      for (const ch of word) {
        if (ctx.measureText(chunk + ch).width > maxWidth && chunk) {
          lines.push(chunk);
          chunk = ch;
        } else {
          chunk += ch;
        }
      }
      line = chunk;
    }

    lines.push(line);
  }

  return lines;
};

/**
 * Lay out (draw=false) or paint (draw=true) the whole receipt.
 * Returns the total height used. Run once to measure, once to paint.
 */
const layoutReceipt = (
  ctx: CanvasRenderingContext2D,
  data: ReceiptData,
  logo: HTMLImageElement | null,
  draw: boolean,
): number => {
  const W = DOTS_WIDTH;
  const left = SIDE_PAD;
  const right = W - SIDE_PAD;
  const contentW = right - left;
  let y = 8;

  ctx.textBaseline = 'top';
  ctx.fillStyle = '#000';

  const setFont = (size: number, family = FONT) => {
    ctx.font = `bold ${size}px ${family}`;
  };

  const gap = (px: number) => {
    y += px;
  };

  const rule = (thickness: number, dashed = false) => {
    if (draw) {
      if (!dashed) {
        ctx.fillRect(left, y, contentW, thickness);
      } else {
        for (let x = left; x < right; x += 8) {
          ctx.fillRect(x, y, Math.min(4, right - x), thickness);
        }
      }
    }
    y += thickness;
  };

  const text = (
    value: string,
    size: number,
    align: 'left' | 'center' = 'left',
    family = FONT,
  ) => {
    setFont(size, family);
    const lineH = Math.round(size * 1.25);

    for (const line of wrapText(ctx, value, contentW)) {
      if (draw) {
        if (align === 'center') {
          ctx.fillText(line, Math.round(W / 2 - ctx.measureText(line).width / 2), y);
        } else {
          ctx.fillText(line, left, y);
        }
      }
      y += lineH;
    }
  };

  /** Left text and right-aligned amount on the same line. */
  const row = (leftText: string, rightText: string, size: number) => {
    setFont(size);
    const lineH = Math.round(size * 1.25);
    const rightW = Math.ceil(ctx.measureText(rightText).width);
    const lines = wrapText(ctx, leftText, Math.max(40, contentW - rightW - 10));

    lines.forEach((line, i) => {
      if (draw) {
        ctx.fillText(line, left, y);
        if (i === 0) ctx.fillText(rightText, right - rightW, y);
      }
      y += lineH;
    });
  };

  // ---- Header ----
  if (logo && logo.naturalWidth > 0) {
    const logoW = 150;
    const logoH = Math.round((logo.naturalHeight / logo.naturalWidth) * logoW);
    if (draw) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(Math.round((W - logoW) / 2), y, logoW, logoH);
      ctx.drawImage(logo, Math.round((W - logoW) / 2), y, logoW, logoH);
      ctx.fillStyle = '#000';
    }
    y += logoH + 8;
  }

  text(STORE.name, SIZE.store, 'center');
  gap(2);
  text(STORE.tagline, SIZE.small, 'center');
  gap(4);
  text(STORE.address, SIZE.small, 'center');
  text(`Tel: ${STORE.phone}`, SIZE.small, 'center');
  text(STORE.email, SIZE.small, 'center');

  gap(8);
  rule(3);
  gap(8);
  text('SALES RECEIPT', SIZE.title, 'center');
  gap(8);

  // ---- Details ----
  row('Receipt No.', data.receiptNo, SIZE.body);
  gap(4);
  row('Date', data.date, SIZE.body);
  gap(4);
  row('Time', data.time, SIZE.body);
  gap(4);
  row('Payment', data.payment, SIZE.body);
  gap(4);
  row('Cashier', data.cashier, SIZE.body);

  gap(8);
  rule(3);
  gap(8);

  // ---- Items ----
  text('ITEMS PURCHASED', SIZE.body);
  gap(6);

  for (const item of data.items) {
    text(item.name, SIZE.body);
    if (item.variant) text(`Code: ${item.variant}`, SIZE.small);
    gap(2);
    row(
      `${item.quantity} x ${formatCurrency(item.price)}`,
      formatCurrency(item.price * item.quantity),
      SIZE.body,
    );
    gap(6);
    rule(1, true);
    gap(6);
  }

  // ---- Totals ----
  gap(4);
  row('Total items', String(data.totalUnits), SIZE.body);
  gap(4);
  row('Subtotal', formatCurrency(data.total), SIZE.body);
  gap(8);
  rule(3);
  gap(6);
  row('TOTAL', formatCurrency(data.total), SIZE.total);
  gap(6);
  rule(3);

  // ---- Footer ----
  gap(12);
  text(data.receiptNo, SIZE.small, 'center', MONO);
  gap(6);
  text('Thank you for shopping with us!', SIZE.body, 'center');
  gap(4);
  text('Please retain your receipt for your records.', SIZE.small, 'center');
  gap(2);
  text('Halal & Sunnah-Based Wellness', SIZE.small, 'center');

  return y;
};

/** Convert anti-aliased greys to pure black/white so nothing gets dithered. */
const toBlackAndWhite = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const image = ctx.getImageData(0, 0, w, h);
  const px = image.data;

  for (let i = 0; i < px.length; i += 4) {
    const lum = px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114;
    const v = lum < THRESHOLD ? 0 : 255;
    px[i] = px[i + 1] = px[i + 2] = v;
    px[i + 3] = 255;
  }

  ctx.putImageData(image, 0, 0);
};

const renderReceiptBitmap = async (data: ReceiptData): Promise<string> => {
  const logo = await loadImage(Logo);

  // Pass 1: measure the height.
  const scratch = document.createElement('canvas');
  scratch.width = DOTS_WIDTH;
  scratch.height = 10;
  const measureCtx = scratch.getContext('2d');
  if (!measureCtx) throw new Error('Canvas not supported');
  const height = layoutReceipt(measureCtx, data, logo, false) + FEED_BOTTOM;

  // Pass 2: paint.
  const canvas = document.createElement('canvas');
  canvas.width = DOTS_WIDTH;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas not supported');

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, DOTS_WIDTH, height);
  ctx.fillStyle = '#000';
  layoutReceipt(ctx, data, logo, true);
  toBlackAndWhite(ctx, DOTS_WIDTH, height);

  return canvas.toDataURL('image/png');
};

export function printSalesReceipt(
  items: PrintableSaleItem[],
  options: ReceiptOptions = {},
  reservedWindow?: Window | null,
): boolean {
  if (!items.length) return false;

  // Reject invalid sale data.
  for (const item of items) {
    if (
      !Number.isFinite(item.price) ||
      !Number.isFinite(item.quantity) ||
      item.price < 0 ||
      item.quantity <= 0
    ) {
      return false;
    }
  }

  // Open synchronously inside the click, or reuse a window reserved there.
  const printWindow = reservedWindow === undefined ? openReceiptWindow() : reservedWindow;
  if (!printWindow || printWindow.closed) return false;

  const now = new Date();

  const data: ReceiptData = {
    items,
    receiptNo: options.receiptNo || generateReceiptNo(),
    date: options.date || localDate(now),
    time: options.time || localTime(now),
    payment: options.paymentMethod || 'Cash',
    cashier: options.cashier || 'POS Terminal 1',
    totalUnits: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };

  renderReceiptBitmap(data)
    .then((dataUrl) => {
      if (printWindow.closed) return;

      printWindow.document.open();
      printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Receipt ${data.receiptNo.replace(/[<>&"]/g, '')}</title>
  <style>
    @page { size: ${PAPER_MM}mm auto; margin: 0; }
    html, body { margin: 0; padding: 0; background: #fff; width: ${PAPER_MM}mm; }
    img {
      display: block;
      width: ${PRINTABLE_MM}mm;
      height: auto;
      margin: 0 auto;
      image-rendering: pixelated;
    }
    @media screen { body { margin: 10px auto; outline: 1px solid #ccc; } }
  </style>
</head>
<body><img id="receipt" alt="Receipt" src="${dataUrl}"></body>
</html>`);
      printWindow.document.close();

      // Set after document.open(), which clears earlier handlers.
      printWindow.onafterprint = () => {
        if (!printWindow.closed) printWindow.close();
      };

      const img = printWindow.document.getElementById(
        'receipt',
      ) as HTMLImageElement | null;

      const go = () =>
        printWindow.setTimeout(() => {
          if (printWindow.closed) return;
          printWindow.focus();
          printWindow.print();
        }, 250);

      if (!img || img.complete) go();
      else {
        img.addEventListener('load', go, { once: true });
        img.addEventListener('error', go, { once: true });
      }
    })
    .catch((error) => {
      console.error('Receipt render failed:', error);
      if (!printWindow.closed) printWindow.close();
    });

  return true;
}