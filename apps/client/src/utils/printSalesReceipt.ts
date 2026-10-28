
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

let receiptCounter = 0;

/** Use printer-friendly currency characters. */
export const formatCurrency = (amount: number): string =>
  `N${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const escapeHtml = (value: string | number): string =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const generateReceiptNo = (): string => {
  const now = new Date();
  receiptCounter += 1;

  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');

  return `AM-${date}-${String(receiptCounter).padStart(4, '0')}`;
};

const localDate = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const localTime = (date: Date): string =>
  date.toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

export function printSalesReceipt(
  items: PrintableSaleItem[],
  options: ReceiptOptions = {},
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

  const now = new Date();
  const receiptNo = options.receiptNo || generateReceiptNo();
  const date = options.date || localDate(now);
  const time = options.time || localTime(now);
  const payment = options.paymentMethod || 'Cash';
  const cashier = options.cashier || 'POS Terminal 1';

  const totalUnits = items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const itemHtml = items
    .map((item) => {
      const name = escapeHtml(item.name);
      const variant = item.variant
        ? `<div class="variant">Code: ${escapeHtml(item.variant)}</div>`
        : '';

      return `
        <div class="item">
          <div class="item-name">${name}</div>

          ${variant}

          <div class="item-line">
            <span class="item-quantity">
              ${item.quantity} x ${escapeHtml(formatCurrency(item.price))}
            </span>

            <span class="item-price">
              ${escapeHtml(formatCurrency(item.price * item.quantity))}
            </span>
          </div>
        </div>
      `;
    })
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Receipt ${escapeHtml(receiptNo)}</title>

  <style>
    /*
      58mm thermal receipt.
      Select the matching paper width in Windows printer settings.
    */

    @page {
      size: 58mm auto;
      margin: 0;
    }

    * {
      box-sizing: border-box;
    }

    html {
      width: 58mm;
      margin: 0;
      padding: 0;
      background: #fff;
    }

    body {
      width: 58mm;
      margin: 0;
      padding: 0;
      background: #fff;
      color: #000;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10px;
      line-height: 1.35;
      font-weight: 400;
    }

    .receipt {
      width: 48mm;
      margin: 0 auto;
      padding: 2mm 0 3mm;
      text-align: left;
      overflow-wrap: anywhere;
    }

    /* Store identity */

    .header {
      text-align: center;
      padding-bottom: 2mm;
      border-bottom: 1px dashed #000;
    }

    .logo {
      display: block;
      width: 30px;
      height: 30px;
      object-fit: contain;
      margin: 0 auto 2mm;
    }

    .store-name {
      margin: 0;
      font-size: 12px;
      line-height: 1.3;
      font-weight: 700;
    }

    .tagline {
      margin: 1mm 0;
      font-size: 9px;
      font-weight: 600;
    }

    .contact {
      margin: 1.5mm 0 0;
      font-size: 8px;
      line-height: 1.5;
      overflow-wrap: anywhere;
    }

    /* Receipt heading */

    .receipt-title {
      margin: 3mm 0;
      text-align: center;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    /* Transaction details */

    .details {
      width: 100%;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 2mm;
      margin: 0 0 1.5mm;
      font-size: 9px;
    }

    .detail-label {
      flex-shrink: 0;
    }

    .detail-value {
      min-width: 0;
      text-align: right;
      font-weight: 600;
      overflow-wrap: anywhere;
    }

    .divider {
      height: 0;
      border: 0;
      border-top: 1px dashed #000;
      margin: 2.5mm 0;
    }

    /* Purchased products */

    .section-title {
      margin: 0 0 1mm;
      font-size: 10px;
      font-weight: 700;
    }

    .item {
      padding: 2mm 0;
      border-bottom: 1px dashed #888;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .item-name {
      font-size: 10px;
      font-weight: 700;
      line-height: 1.4;
      overflow-wrap: anywhere;
    }

    .variant {
      margin-top: 1mm;
      font-size: 8px;
      overflow-wrap: anywhere;
    }

    .item-line {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1mm;
      margin-top: 1.5mm;
    }

    .item-quantity {
      flex: 1;
      min-width: 0;
      font-size: 8.5px;
      overflow-wrap: anywhere;
    }

    .item-price {
      flex-shrink: 0;
      max-width: 48%;
      text-align: right;
      font-size: 9px;
      font-weight: 700;
      overflow-wrap: anywhere;
    }

    /* Totals */

    .totals {
      margin-top: 2mm;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 2mm;
      padding: 1mm 0;
      font-size: 10px;
    }

    .total-value {
      text-align: right;
      overflow-wrap: anywhere;
    }

    .grand-total {
      margin-top: 1.5mm;
      padding: 2mm 0;
      border-top: 1px solid #000;
      border-bottom: 1px solid #000;
      font-size: 12px;
      font-weight: 700;
    }

    /* Footer */

    .footer {
      margin-top: 3mm;
      padding-top: 2mm;
      border-top: 1px dashed #000;
      text-align: center;
    }

    .receipt-number {
      margin: 0 0 2mm;
      font-family: monospace;
      font-size: 9px;
      font-weight: 700;
      overflow-wrap: anywhere;
    }

    .thank-you {
      margin: 2mm 0;
      font-size: 10px;
      font-weight: 700;
    }

    .footer-note {
      margin: 1mm 0;
      font-size: 8px;
      line-height: 1.4;
    }

    /*
      Do not force print colors, background images,
      shadows, or browser-specific scaling.
    */

    @media screen {
      body {
        margin: 10px auto;
        box-shadow: 0 0 6px #ccc;
      }

      .receipt {
        padding-top: 3mm;
      }
    }

    @media print {
      html,
      body {
        width: 58mm !important;
        min-width: 0 !important;
        max-width: 58mm !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
      }

      .receipt {
        width: 48mm !important;
        margin: 0 auto !important;
        padding: 2mm 0 3mm !important;
      }
    }
  </style>
</head>

<body>
  <main class="receipt">
    <header class="header">
      <img class="logo" src="${Logo}" alt="Store logo">

      <h1 class="store-name">${escapeHtml(STORE.name)}</h1>

      <p class="tagline">${escapeHtml(STORE.tagline)}</p>

      <p class="contact">
        ${escapeHtml(STORE.address)}<br>
        Tel: ${escapeHtml(STORE.phone)}<br>
        ${escapeHtml(STORE.email)}
      </p>
    </header>

    <h2 class="receipt-title">SALES RECEIPT</h2>

    <section class="details">
      <div class="detail-row">
        <span class="detail-label">Receipt No.</span>
        <span class="detail-value">${escapeHtml(receiptNo)}</span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Date</span>
        <span class="detail-value">${escapeHtml(date)}</span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Time</span>
        <span class="detail-value">${escapeHtml(time)}</span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Payment</span>
        <span class="detail-value">${escapeHtml(payment)}</span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Cashier</span>
        <span class="detail-value">${escapeHtml(cashier)}</span>
      </div>
    </section>

    <hr class="divider">

    <section>
      <h3 class="section-title">ITEMS PURCHASED</h3>
      ${itemHtml}
    </section>

    <section class="totals">
      <div class="total-row">
        <span>Total items</span>
        <span class="total-value">${escapeHtml(totalUnits)}</span>
      </div>

      <div class="total-row">
        <span>Subtotal</span>
        <span class="total-value">${escapeHtml(formatCurrency(total))}</span>
      </div>

      <div class="total-row grand-total">
        <span>TOTAL</span>
        <span class="total-value">${escapeHtml(formatCurrency(total))}</span>
      </div>
    </section>

    <footer class="footer">
      <p class="receipt-number">${escapeHtml(receiptNo)}</p>

      <p class="thank-you">Thank you for shopping with us!</p>

      <p class="footer-note">
        Please retain your receipt for your records.
      </p>

      <p class="footer-note">
        Halal &amp; Sunnah-Based Wellness
      </p>
    </footer>
  </main>
</body>
</html>`;

  // Open a separate document so application CSS cannot interfere.
  const printWindow = window.open(
    '',
    '_blank',
    'width=400,height=700',
  );

  if (!printWindow) {
    return false;
  }

  let started = false;

  const startPrint = () => {
    if (started || printWindow.closed) return;
    started = true;

    // Give the browser time to complete layout and paint.
    printWindow.requestAnimationFrame(() => {
      printWindow.requestAnimationFrame(() => {
        if (printWindow.closed) return;

        printWindow.focus();
        printWindow.print();
      });
    });
  };

  printWindow.onafterprint = () => {
    if (!printWindow.closed) {
      printWindow.close();
    }
  };

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  const waitForLogo = () => {
    if (printWindow.closed) return;

    const logo = printWindow.document.querySelector(
      '.logo',
    ) as HTMLImageElement | null;

    if (!logo || logo.complete) {
      startPrint();
      return;
    }

    logo.addEventListener('load', startPrint, { once: true });
    logo.addEventListener('error', startPrint, { once: true });

    // A broken or blocked image must not prevent printing.
    printWindow.setTimeout(startPrint, 2000);
  };

  if (printWindow.document.readyState === 'complete') {
    waitForLogo();
  } else {
    printWindow.addEventListener('load', waitForLogo, {
      once: true,
    });
  }

  return true;
}
