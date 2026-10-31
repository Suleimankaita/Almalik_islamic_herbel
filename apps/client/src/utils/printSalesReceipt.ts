
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
    /* PT280: 58mm paper roll, approximately 48mm printable width. */
    @page {
      size: 58mm auto;
      margin: 0;
    }

    * {
      box-sizing: border-box;
    }

    html,
    body {
      width: 58mm;
      min-width: 0;
      margin: 0;
      padding: 0;
      background: #fff;
      color: #000;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10.5pt;
      line-height: 1.35;
      font-weight: 600;
      color: #000;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .receipt {
      width: 48mm;
      margin: 0 auto;
      padding: 2mm 0 4mm;
      text-align: left;
      overflow-wrap: break-word;
      word-break: normal;
    }

    .header {
      text-align: center;
      padding-bottom: 2.5mm;
      border-bottom: 0.25mm solid #000;
    }

    .logo {
      display: block;
      width: 26px;
      height: 26px;
      object-fit: contain;
      margin: 0 auto 2mm;
    }

    .store-name {
      margin: 0;
      font-size: 12pt;
      line-height: 1.25;
      font-weight: 700;
    }

    .tagline {
      margin: 1.5mm 0;
      font-size: 9pt;
      font-weight: 600;
    }

    .contact {
      margin: 1.5mm 0 0;
      font-size: 9.5pt;
      line-height: 1.4;
      overflow-wrap: anywhere;
    }

    .receipt-title {
      margin: 3mm 0;
      text-align: center;
      font-size: 12pt;
      font-weight: 700;
      letter-spacing: 0;
    }

    .details {
      width: 100%;
    }

    .detail-row,
    .item-line,
    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 2mm;
      width: 100%;
    }

    .detail-row {
      margin: 0 0 1.7mm;
      font-size: 10pt;
    }

    .detail-label {
      flex: 0 0 34%;
    }

    .detail-value {
      flex: 1 1 auto;
      min-width: 0;
      text-align: right;
      font-weight: 700;
      overflow-wrap: anywhere;
    }

    .divider {
      height: 0;
      border: 0;
      border-top: 0.25mm solid #000;
      margin: 2.5mm 0;
    }

    .section-title {
      margin: 0 0 1mm;
      font-size: 10pt;
      font-weight: 700;
    }

    .item {
      padding: 2mm 0;
      border-bottom: 0.2mm solid #999;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .item-name {
      font-size: 10pt;
      font-weight: 700;
      line-height: 1.35;
      overflow-wrap: anywhere;
    }

    .variant {
      margin-top: 1mm;
      font-size: 9.5pt;
      overflow-wrap: anywhere;
    }

    .item-line {
      margin-top: 1.5mm;
      font-size: 10pt;
    }

    .item-quantity {
      flex: 1 1 auto;
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .item-price {
      flex: 0 0 auto;
      max-width: 52%;
      text-align: right;
      font-size: 10pt;
      font-weight: 700;
      overflow-wrap: anywhere;
    }

    .totals {
      margin-top: 2mm;
    }

    .total-row {
      padding: 1.2mm 0;
      font-size: 10pt;
    }

    .total-value {
      text-align: right;
      overflow-wrap: anywhere;
    }

    .grand-total {
      margin-top: 1.5mm;
      padding: 2mm 0;
      border-top: 0.3mm solid #000;
      border-bottom: 0.3mm solid #000;
      font-size: 12pt;
      font-weight: 700;
    }

    .footer {
      margin-top: 3mm;
      padding-top: 2mm;
      border-top: 0.25mm solid #000;
      text-align: center;
    }

    .receipt-number {
      margin: 0 0 2mm;
      font-family: "Courier New", monospace;
      font-size: 9pt;
      font-weight: 700;
      overflow-wrap: anywhere;
    }

    .thank-you {
      margin: 2mm 0;
      font-size: 10pt;
      font-weight: 700;
    }

    .footer-note {
      margin: 1.5mm 0;
      font-size: 9.5pt;
      line-height: 1.4;
    }

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

      body {
        color: #000 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .receipt {
        width: 48mm !important;
        margin: 0 auto !important;
        padding: 2mm 0 4mm !important;
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

    printWindow.focus();
    printWindow.print();
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

    const printWhenReady = () => {
      // Give Chromium one frame to finish laying out the receipt.
      printWindow.setTimeout(startPrint, 350);
    };

    if (!logo || logo.complete) {
      printWhenReady();
      return;
    }

    logo.addEventListener('load', printWhenReady, { once: true });
    logo.addEventListener('error', printWhenReady, { once: true });

    // A broken or blocked image must not prevent printing.
    printWindow.setTimeout(printWhenReady, 2000);
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
