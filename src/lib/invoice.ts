import { CONTACT_INFO } from "@/config/contact";
import { jsPDF } from "jspdf";

export interface InvoiceData {
  invoiceNo: string;
  orderId: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  planName: string;
  amount: number;
  upiRef?: string;
  status: string;
  requirements?: string;
}

export const generateInvoiceNumber = (orderId: string): string => {
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const suffix = orderId ? orderId.split("-").pop() || "0001" : "0001";
  return `INV-${dateStr}-${suffix}`;
};

/**
 * Generates and directly downloads an official PDF invoice file to the client's device
 */
export const downloadInvoicePDF = (invoice: InvoiceData) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 18;
  let y = 20;

  // Header background accent bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 42, "F");

  // Top accent line
  doc.setFillColor(168, 85, 247); // purple-500
  doc.rect(0, 0, pageWidth, 2.5, "F");

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("AXENOVA DIGITAL", margin, 18);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text("Premium Web Development & Digital Solutions", margin, 24);
  doc.text(`Email: ${CONTACT_INFO.email}  |  WhatsApp: ${CONTACT_INFO.whatsapp.display}`, margin, 30);

  // Invoice Title on Right Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(248, 250, 252);
  doc.text("TAX INVOICE", pageWidth - margin, 18, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(168, 85, 247); // purple accent
  doc.text(`Invoice #: ${invoice.invoiceNo}`, pageWidth - margin, 25, { align: "right" });
  doc.setTextColor(148, 163, 184);
  doc.text(`Date: ${invoice.date}`, pageWidth - margin, 31, { align: "right" });

  // Body content starts
  y = 52;

  // 2-Column Info Boxes (Billed To & Payment Details)
  const colWidth = (pageWidth - margin * 2 - 8) / 2;

  // Box 1: Billed To
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, y, colWidth, 38, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text("BILLED TO", margin + 5, y + 7);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(invoice.customerName || "Valued Client", margin + 5, y + 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Email: ${invoice.customerEmail}`, margin + 5, y + 21);
  doc.text(`Phone: ${invoice.customerPhone}`, margin + 5, y + 27);
  if (invoice.orderId) {
    doc.text(`Order ID: ${invoice.orderId}`, margin + 5, y + 33);
  }

  // Box 2: Payment Details
  const col2X = margin + colWidth + 8;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(col2X, y, colWidth, 38, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("PAYMENT DETAILS", col2X + 5, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text("Method: Direct UPI Transfer", col2X + 5, y + 15);
  doc.text(`UPI Ref / UTR: ${invoice.upiRef || "Pending Verification"}`, col2X + 5, y + 21);

  const isVerified = invoice.status === "verified" || invoice.status === "paid";
  doc.setFont("helvetica", "bold");
  if (isVerified) {
    doc.setTextColor(22, 163, 74); // green-600
    doc.text("Status: Verified & Confirmed [PAID]", col2X + 5, y + 29);
  } else {
    doc.setTextColor(202, 138, 4); // yellow-600
    doc.text("Status: Payment Submitted (Verifying)", col2X + 5, y + 29);
  }

  // Items Table
  y += 48;

  // Table Header
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, pageWidth - margin * 2, 9, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text("#", margin + 4, y + 6);
  doc.text("ITEM & DESCRIPTION", margin + 16, y + 6);
  doc.text("QTY", pageWidth - margin - 45, y + 6, { align: "center" });
  doc.text("AMOUNT (INR)", pageWidth - margin - 5, y + 6, { align: "right" });

  // Table Row 1
  y += 9;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, pageWidth - margin * 2, 20, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("01", margin + 4, y + 7);

  doc.setFont("helvetica", "bold");
  doc.text(`${invoice.planName} Plan Web Development Package`, margin + 16, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Custom UI/UX Design, High Performance, Mobile Responsive, SEO & Live Deployment", margin + 16, y + 13);

  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("1", pageWidth - margin - 45, y + 9, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.text(`INR ${Number(invoice.amount || 0).toLocaleString("en-IN")}`, pageWidth - margin - 5, y + 9, { align: "right" });

  // Requirements note if present
  if (invoice.requirements) {
    y += 24;
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 14, 1.5, 1.5, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text("Project Notes / Requirements:", margin + 4, y + 5);
    doc.setFont("helvetica", "normal");
    doc.text(invoice.requirements.slice(0, 120), margin + 4, y + 10);
    y += 18;
  } else {
    y += 24;
  }

  // Summary / Calculation Box
  const summaryWidth = 75;
  const summaryX = pageWidth - margin - summaryWidth;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(summaryX, y, summaryWidth, 30, 2, 2, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Subtotal:", summaryX + 5, y + 7);
  doc.setTextColor(15, 23, 42);
  doc.text(`INR ${Number(invoice.amount || 0).toLocaleString("en-IN")}`, pageWidth - margin - 5, y + 7, { align: "right" });

  doc.setTextColor(100, 116, 139);
  doc.text("Taxes & GST:", summaryX + 5, y + 14);
  doc.setTextColor(15, 23, 42);
  doc.text("INR 0.00", pageWidth - margin - 5, y + 14, { align: "right" });

  // Divider inside summary
  doc.setDrawColor(203, 213, 225);
  doc.line(summaryX + 5, y + 18, pageWidth - margin - 5, y + 18);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Total Paid:", summaryX + 5, y + 25);
  doc.setTextColor(126, 34, 206); // purple-700
  doc.text(`INR ${Number(invoice.amount || 0).toLocaleString("en-IN")}`, pageWidth - margin - 5, y + 25, { align: "right" });

  // Notice Box
  y += 38;
  doc.setFillColor(238, 242, 255); // indigo-50
  doc.setDrawColor(199, 210, 254); // indigo-200
  doc.roundedRect(margin, y, pageWidth - margin * 2, 18, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(67, 56, 202); // indigo-700
  doc.text("OFFICIAL RECEIPT & ORDER ACKNOWLEDGEMENT", margin + 4, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.8);
  doc.setTextColor(51, 65, 85);
  doc.text(
    "This document certifies that your project order has been registered with Axenova Digital. Project work commences upon UPI UTR verification. Track live project milestones anytime using your Order ID on our website.",
    margin + 4,
    y + 11,
    { maxWidth: pageWidth - margin * 2 - 8 }
  );

  // Footer at bottom of page
  const footerY = 280;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Thank you for choosing Axenova Digital!", pageWidth / 2, footerY + 6, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `For queries or updates, reach out on WhatsApp: ${CONTACT_INFO.whatsapp.display} or Email: ${CONTACT_INFO.email}`,
    pageWidth / 2,
    footerY + 11,
    { align: "center" }
  );

  // Save the PDF file directly to client's browser downloads
  const filename = `Axenova_Invoice_${invoice.orderId || invoice.invoiceNo}.pdf`;
  doc.save(filename);
};

/**
 * Dispatches an automated invoice receipt email to the client using EmailJS
 */
export const sendInvoiceEmail = async (invoice: InvoiceData): Promise<boolean> => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_INVOICE_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn("EmailJS credentials not fully configured in .env. Invoice email simulated.");
    return false;
  }

  try {
    const emailjs = (await import("@emailjs/browser")).default;
    await emailjs.send(
      serviceId,
      templateId,
      {
        to_name: invoice.customerName,
        to_email: invoice.customerEmail,
        customer_name: invoice.customerName,
        customer_email: invoice.customerEmail,
        customer_phone: invoice.customerPhone,
        order_id: invoice.orderId,
        invoice_number: invoice.invoiceNo,
        plan_name: invoice.planName,
        amount: `₹${Number(invoice.amount || 0).toLocaleString("en-IN")}`,
        upi_ref: invoice.upiRef || "Direct UPI",
        date: invoice.date,
        status: invoice.status === "verified" || invoice.status === "paid" ? "Payment Verified & Confirmed" : "Payment Submitted (Pending Verification)",
        message: `Thank you for choosing Axenova Digital! Your order for the ${invoice.planName} Plan has been received. Your invoice number is ${invoice.invoiceNo} and UPI Reference is ${invoice.upiRef || "N/A"}. You can also download your official PDF tax invoice from our website anytime.`,
        company_name: "Axenova Digital",
        company_email: CONTACT_INFO.email,
        company_phone: CONTACT_INFO.whatsapp.display,
      },
      publicKey
    );
    return true;
  } catch (error) {
    console.error("Failed to send invoice email via EmailJS:", error);
    return false;
  }
};

/**
 * Sends an instant Admin Alert Email to the agency owner whenever a new order & UTR is placed
 */
export const sendAdminOrderAlert = async (invoice: InvoiceData): Promise<boolean> => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) return false;

  try {
    const emailjs = (await import("@emailjs/browser")).default;
    await emailjs.send(
      serviceId,
      templateId,
      {
        from_name: `${invoice.customerName} (New Order)`,
        from_email: invoice.customerEmail,
        name: invoice.customerName,
        email: invoice.customerEmail,
        phone: invoice.customerPhone,
        to_email: CONTACT_INFO.email,
        message: `🚨 NEW ORDER RECEIVED!\n\n• Order ID: ${invoice.orderId}\n• Plan: ${invoice.planName} (₹${invoice.amount})\n• Customer: ${invoice.customerName} (${invoice.customerPhone}, ${invoice.customerEmail})\n• Submitted UTR: ${invoice.upiRef || "None"}\n• Requirements: ${invoice.requirements || "None"}\n\nPlease verify this UTR in your bank app and approve the order in the Admin Portal.`,
      },
      publicKey
    );
    return true;
  } catch (err) {
    console.error("Failed to send admin order notification:", err);
    return false;
  }
};

/**
 * Opens a clean, branded, print-ready HTML Invoice window that can also be saved as PDF or printed.
 */
export const openPrintableInvoice = (invoice: InvoiceData) => {
  const printWindow = window.open("", "_blank", "width=850,height=950");
  if (!printWindow) {
    alert("Please allow popups to view and download your invoice.");
    return;
  }

  const invoiceHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice - ${invoice.invoiceNo} | Axenova Digital</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #0d1117;
      color: #e6edf3;
      padding: 40px 20px;
      line-height: 1.5;
    }
    .invoice-card {
      max-width: 780px;
      margin: 0 auto;
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 16px;
      padding: 48px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid #30363d;
      padding-bottom: 28px;
      margin-bottom: 28px;
    }
    .brand-logo {
      font-family: 'Outfit', sans-serif;
      font-size: 26px;
      font-weight: 800;
      background: linear-gradient(135deg, #a855f7, #6366f1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.5px;
    }
    .brand-sub {
      font-size: 12px;
      color: #8b949e;
      margin-top: 4px;
    }
    .invoice-meta {
      text-align: right;
    }
    .invoice-title {
      font-family: 'Outfit', sans-serif;
      font-size: 28px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: 0.5px;
    }
    .meta-row {
      font-size: 13px;
      color: #8b949e;
      margin-top: 4px;
    }
    .meta-value {
      font-weight: 600;
      color: #f0f6fc;
      font-family: 'JetBrains Mono', monospace;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
    }
    .info-box {
      background: #0d1117;
      border: 1px solid #21262d;
      border-radius: 12px;
      padding: 18px 20px;
    }
    .info-box-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #8b949e;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .info-box-content p {
      font-size: 13px;
      color: #c9d1d9;
      margin-bottom: 3px;
    }
    .info-box-content strong {
      color: #ffffff;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-success {
      background: rgba(34, 197, 94, 0.15);
      color: #4ade80;
      border: 1px solid rgba(34, 197, 94, 0.3);
    }
    .badge-pending {
      background: rgba(234, 179, 8, 0.15);
      color: #facc15;
      border: 1px solid rgba(234, 179, 8, 0.3);
    }
    .table-container {
      margin-bottom: 32px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    th {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #8b949e;
      padding: 12px 16px;
      background: #0d1117;
      border-top: 1px solid #30363d;
      border-bottom: 1px solid #30363d;
    }
    td {
      padding: 16px;
      border-bottom: 1px solid #21262d;
      font-size: 14px;
      color: #c9d1d9;
    }
    .item-desc {
      font-size: 12px;
      color: #8b949e;
      margin-top: 4px;
    }
    .amount-column {
      text-align: right;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
    }
    .summary-section {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 32px;
    }
    .summary-box {
      width: 280px;
      background: #0d1117;
      border: 1px solid #21262d;
      border-radius: 12px;
      padding: 16px 20px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #8b949e;
      margin-bottom: 8px;
    }
    .summary-row.total {
      border-top: 1px solid #30363d;
      padding-top: 10px;
      margin-top: 10px;
      margin-bottom: 0;
      color: #ffffff;
      font-size: 16px;
      font-weight: 800;
    }
    .summary-total-val {
      color: #a855f7;
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
    }
    .payment-notes {
      background: rgba(99, 102, 241, 0.08);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 32px;
    }
    .payment-notes h4 {
      font-size: 12px;
      color: #818cf8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .payment-notes p {
      font-size: 12px;
      color: #c9d1d9;
    }
    .footer {
      border-top: 1px solid #30363d;
      padding-top: 24px;
      text-align: center;
      font-size: 12px;
      color: #8b949e;
    }
    .action-bar {
      max-width: 780px;
      margin: 0 auto 20px auto;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .btn {
      padding: 10px 20px;
      font-size: 13px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
      font-family: inherit;
    }
    .btn-primary {
      background: linear-gradient(135deg, #a855f7, #6366f1);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
    }
    .btn-primary:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: #21262d;
      color: #c9d1d9;
      border: 1px solid #30363d;
    }
    .btn-secondary:hover {
      background: #30363d;
    }

    @media print {
      body {
        background: #ffffff;
        color: #000000;
        padding: 0;
      }
      .action-bar {
        display: none !important;
      }
      .invoice-card {
        border: none;
        box-shadow: none;
        background: #ffffff;
        color: #000000;
        padding: 20px;
        max-width: 100%;
      }
      .brand-logo {
        background: none;
        -webkit-text-fill-color: #000000;
        color: #000000;
      }
      .invoice-title {
        color: #000000;
      }
      .info-box, .summary-box, .payment-notes {
        background: #f8fafc !important;
        border-color: #e2e8f0 !important;
        color: #000000 !important;
      }
      th {
        background: #f1f5f9 !important;
        color: #334155 !important;
        border-color: #cbd5e1 !important;
      }
      td {
        color: #0f172a !important;
        border-color: #e2e8f0 !important;
      }
      .meta-value, .info-box-content p, .info-box-content strong, .payment-notes p {
        color: #0f172a !important;
      }
      .badge-success {
        background: #dcfce7 !important;
        color: #15803d !important;
        border-color: #86efac !important;
      }
      .badge-pending {
        background: #fef9c3 !important;
        color: #a16207 !important;
        border-color: #fde047 !important;
      }
      .summary-total-val {
        color: #6366f1 !important;
      }
    }
  </style>
</head>
<body>
  <div class="action-bar">
    <button class="btn btn-secondary" onclick="window.close()">Close</button>
    <button class="btn btn-primary" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>

  <div class="invoice-card">
    <div class="header">
      <div>
        <div class="brand-logo">AXENOVA DIGITAL</div>
        <div class="brand-sub">Premium Web Development &amp; Digital Solutions</div>
        <div class="brand-sub">Email: ${CONTACT_INFO.email} | WhatsApp: ${CONTACT_INFO.whatsapp.display}</div>
      </div>
      <div class="invoice-meta">
        <div class="invoice-title">TAX INVOICE</div>
        <div class="meta-row">Invoice No: <span class="meta-value">${invoice.invoiceNo}</span></div>
        <div class="meta-row">Order ID: <span class="meta-value">${invoice.orderId}</span></div>
        <div class="meta-row">Date: <span class="meta-value">${invoice.date}</span></div>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-box">
        <div class="info-box-title">Billed To</div>
        <div class="info-box-content">
          <p><strong>${invoice.customerName}</strong></p>
          <p>Email: ${invoice.customerEmail}</p>
          <p>Phone: ${invoice.customerPhone}</p>
          ${invoice.requirements ? `<p style="margin-top: 6px; font-size: 11px; color: #8b949e;"><strong>Notes:</strong> ${invoice.requirements}</p>` : ""}
        </div>
      </div>

      <div class="info-box">
        <div class="info-box-title">Payment &amp; Status</div>
        <div class="info-box-content">
          <p>Payment Method: <strong>Direct UPI Transfer</strong></p>
          <p>UPI Ref / UTR: <span class="meta-value">${invoice.upiRef || "Pending Verification"}</span></p>
          <p style="margin-top: 8px;">
            <span class="badge ${invoice.status === "verified" || invoice.status === "paid" ? "badge-success" : "badge-pending"}">
              ${invoice.status === "verified" || invoice.status === "paid" ? "● Payment Verified" : "● Payment Submitted (Verifying)"}
            </span>
          </p>
        </div>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th style="width: 60px;">#</th>
            <th>Item &amp; Description</th>
            <th style="width: 100px; text-align: center;">Qty</th>
            <th style="width: 140px;" class="amount-column">Amount (INR)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>01</td>
            <td>
              <strong>${invoice.planName} Plan Web Development Package</strong>
              <div class="item-desc">Includes UI/UX Design, High-Performance Development, Mobile Responsiveness, SEO Setup, &amp; Deployment.</div>
            </td>
            <td style="text-align: center;">1</td>
            <td class="amount-column">₹${Number(invoice.amount || 0).toLocaleString("en-IN")}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="summary-section">
      <div class="summary-box">
        <div class="summary-row">
          <span>Subtotal</span>
          <span class="meta-value">₹${Number(invoice.amount || 0).toLocaleString("en-IN")}</span>
        </div>
        <div class="summary-row">
          <span>Tax / GST</span>
          <span class="meta-value">₹0.00</span>
        </div>
        <div class="summary-row total">
          <span>Total Amount</span>
          <span class="summary-total-val">₹${Number(invoice.amount || 0).toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>

    <div class="payment-notes">
      <h4>Official Payment Receipt Notice</h4>
      <p>This invoice serves as the official transaction record for your project order with Axenova Digital. Project work commences upon UPI transaction verification. You can track project milestones live on our website anytime using your Order ID.</p>
    </div>

    <div class="footer">
      <p>Thank you for partnering with <strong>Axenova Digital</strong>.</p>
      <p style="font-size: 11px; margin-top: 4px;">For billing queries or support, reach out via WhatsApp at ${CONTACT_INFO.whatsapp.display} or email ${CONTACT_INFO.email}.</p>
    </div>
  </div>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(invoiceHtml);
  printWindow.document.close();
};
