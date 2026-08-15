import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CONTACT_INFO, getWhatsAppLink } from "@/config/contact";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ShieldCheck,
  Loader2,
  Copy,
  CheckCircle2,
  QrCode,
  MessageCircle,
  ArrowRight,
  ExternalLink,
  Smartphone,
  Mail,
  HelpCircle,
  Sparkles,
  ArrowLeft,
  Clock,
  Download,
  FileText,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { generateInvoiceNumber, sendAdminOrderAlert, sendInvoiceEmail, downloadInvoicePDF, openPrintableInvoice, type InvoiceData } from "@/lib/invoice";

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: { name: string; price: string; amount: number } | null;
}

const generateOrderId = () => {
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `AXN-${dateStr}-${rand}`;
};

const OrderDialog = ({ open, onOpenChange, plan }: OrderDialogProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<"form" | "payment" | "confirmed">("form");
  const [loading, setLoading] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string>("");
  const [currentInvoiceNo, setCurrentInvoiceNo] = useState<string>("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    requirements: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!form.name.trim() || form.name.trim().length > 100) return "Please enter your full name";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email address";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim())) return "Please enter a valid 10-digit phone number";
    if (form.requirements.length > 1000) return "Requirements must be under 1000 characters";
    return null;
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      toast({ title: error, variant: "destructive" });
      return;
    }
    if (!plan) return;

    setLoading(true);

    const friendlyOrderId = generateOrderId();
    const invoiceNo = generateInvoiceNumber(friendlyOrderId);
    setCurrentOrderId(friendlyOrderId);
    setCurrentInvoiceNo(invoiceNo);

    try {
      const orderEntry = {
        order_id: friendlyOrderId,
        plan: plan.name,
        amount: plan.amount,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        requirements: form.requirements.trim(),
        status: "pending_payment",
      };

      await supabase.from("orders").insert([orderEntry]);
    } catch (err) {
      console.warn("Initial order register:", err);
    } finally {
      setLoading(false);
      setStep("payment");
    }
  };

  const handleVerifyAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || cleanUtr.length < 8) {
      toast({
        title: "Please enter a valid UPI Reference / UTR Number",
        description: "Usually 12 digits (found on Google Pay, PhonePe, Paytm, BHIM receipt)",
        variant: "destructive",
      });
      return;
    }

    if (!plan) return;

    setLoading(true);

    try {
      const orderInvoiceData: InvoiceData = {
        invoiceNo: currentInvoiceNo || generateInvoiceNumber(currentOrderId),
        orderId: currentOrderId,
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        customerName: form.name.trim(),
        customerEmail: form.email.trim(),
        customerPhone: form.phone.trim(),
        planName: plan.name,
        amount: plan.amount,
        upiRef: cleanUtr,
        status: "payment_submitted",
        requirements: form.requirements.trim(),
      };

      const reqWithUtr = form.requirements.trim()
        ? `[UTR: ${cleanUtr}] ${form.requirements.trim()}`
        : `[UTR: ${cleanUtr}]`;

      // 1. Update order in Supabase with UTR & status
      const { data } = await supabase
        .from("orders")
        .update({
          razorpay_payment_id: cleanUtr,
          requirements: reqWithUtr,
          status: "payment_submitted",
        })
        .eq("order_id", currentOrderId)
        .select();

      // 2. If record was not in Supabase yet, insert immediately
      if (!data || data.length === 0) {
        await supabase.from("orders").insert([{
          order_id: currentOrderId,
          plan: plan.name,
          amount: plan.amount,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          requirements: reqWithUtr,
          razorpay_payment_id: cleanUtr,
          status: "payment_submitted",
        }]);
      }

      // 3. Dispatch instant confirmation email to Client and alert email to Admin
      sendInvoiceEmail(orderInvoiceData).catch((e) => console.error("Client invoice email error:", e));
      sendAdminOrderAlert(orderInvoiceData).catch((e) => console.error("Admin alert error:", e));

      toast({
        title: "Payment Reference Submitted! ⏳",
        description: `UTR ${cleanUtr} recorded. We will verify and email your official invoice to ${form.email}.`,
      });

      setStep("confirmed");
    } catch (err) {
      console.error("Error submitting payment reference:", err);
      setStep("confirmed");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(CONTACT_INFO.upi.id);
    setCopiedUpi(true);
    toast({ title: "UPI ID copied to clipboard!" });
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(currentOrderId);
    setCopiedId(true);
    toast({ title: "Order ID copied to clipboard!" });
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleClose = (val: boolean) => {
    if (!val) {
      setStep("form");
      setCopiedUpi(false);
      setCopiedId(false);
      setUtrNumber("");
    }
    onOpenChange(val);
  };

  // UPI intent link with exact amount, payee, and order note
  const upiIntentUrl = plan
    ? `upi://pay?pa=${CONTACT_INFO.upi.id}&pn=${encodeURIComponent(CONTACT_INFO.upi.name)}&am=${plan.amount}&tn=${encodeURIComponent(`Axenova Order ${currentOrderId}`)}&cu=INR`
    : "";

  // Dynamic QR code generated with exact amount and order reference
  const dynamicQrCodeUrl = upiIntentUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiIntentUrl)}&margin=8`
    : "";

  // WhatsApp confirmation text with UTR included
  const whatsappMessage = `Hi Axenova Digital! I have completed the UPI payment for the *${plan?.name} Plan* (${plan?.price}).

*Order Details:*
• Order ID: ${currentOrderId}
• Name: ${form.name.trim()}
• Phone: ${form.phone.trim()}
• Email: ${form.email.trim()}
• UPI UTR / Ref No: ${utrNumber.trim()}
${form.requirements.trim() ? `• Requirements: ${form.requirements.trim()}` : ""}

Here is my payment confirmation screenshot. Please verify and send my tax invoice.`;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass border-border sm:max-w-md max-h-[92vh] overflow-y-auto">
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">
                Order {plan?.name} Plan
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {plan?.price} • Enter your details to generate your order &amp; payment QR
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleProceedToPayment} className="space-y-3.5 mt-2">
              <Input
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                maxLength={100}
                className="bg-secondary/50 border-border text-base sm:text-sm h-11"
                required
              />
              <Input
                type="email"
                placeholder="Email Address (Official invoice will be sent here)"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                maxLength={255}
                className="bg-secondary/50 border-border text-base sm:text-sm h-11"
                required
              />
              <Input
                type="tel"
                placeholder="Phone Number (10 digits)"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="bg-secondary/50 border-border text-base sm:text-sm h-11"
                required
              />
              <Textarea
                placeholder="Project Requirements / Any specific notes (optional)"
                value={form.requirements}
                onChange={(e) => handleChange("requirements", e.target.value)}
                maxLength={1000}
                rows={3}
                className="bg-secondary/50 border-border resize-none text-base sm:text-sm"
              />

              <Button variant="hero" className="w-full h-11 font-bold shadow-lg" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" /> Generating Order...
                  </>
                ) : (
                  <>
                    Proceed to Payment <ArrowRight size={16} className="ml-1.5" />
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1 pt-1">
                <ShieldCheck size={14} className="text-accent" />
                Direct UPI Transfer • Verified Official Tax Invoice
              </p>
            </form>
          </>
        )}

        {step === "payment" && (
          <div className="flex flex-col items-center text-center py-1 animate-fade-in">
            {/* Header / Order ID */}
            <div className="w-full pb-3 border-b border-border/50 mb-3 flex items-center justify-between text-left">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Your Order ID</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-sm text-primary">{currentOrderId}</span>
                  <button
                    type="button"
                    onClick={handleCopyOrderId}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1"
                    title="Copy Order ID"
                  >
                    {copiedId ? <CheckCircle2 size={13} className="text-accent" /> : <Copy size={13} />}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Amount to Pay</span>
                <div className="font-extrabold text-base text-foreground font-outfit">{plan?.price}</div>
              </div>
            </div>

            {/* Dynamic QR Code Card */}
            <div className="relative p-3 bg-white rounded-2xl border shadow-md flex flex-col items-center mb-3">
              <img
                src={dynamicQrCodeUrl}
                alt="UPI Payment QR Code"
                className="w-44 h-44 sm:w-48 sm:h-48 object-contain"
                loading="eager"
              />
              <span className="text-[11px] font-semibold text-gray-700 mt-1.5 flex items-center gap-1">
                <QrCode size={13} className="text-blue-600" /> Scan with GPay, PhonePe, Paytm, BHIM
              </span>
            </div>

            {/* UPI ID Copy Bar */}
            <div className="w-full flex items-center justify-between p-2.5 px-3 rounded-xl bg-secondary/60 border border-border/70 mb-2.5 text-xs">
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-muted-foreground">UPI ID:</span>
                <span className="font-mono font-bold text-foreground select-all">{CONTACT_INFO.upi.id}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyUpi}
                className="h-8 text-xs font-semibold shrink-0 gap-1"
              >
                {copiedUpi ? (
                  <>
                    <CheckCircle2 size={13} className="text-accent" /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={13} /> Copy ID
                  </>
                )}
              </Button>
            </div>

            {/* Mobile direct UPI App launcher */}
            <a
              href={upiIntentUrl}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 text-xs font-bold mb-3.5 transition-colors active:scale-98"
            >
              <Smartphone size={15} />
              Tap to Pay ₹{plan?.amount} via UPI App
            </a>

            {/* UTR / UPI Reference Submission Form */}
            <form onSubmit={handleVerifyAndSubmit} className="w-full space-y-2.5 p-3.5 rounded-2xl bg-secondary/40 border border-border/70 text-left mb-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles size={14} className="text-primary" />
                  Enter 12-Digit UPI Reference (UTR)
                </label>
                <span className="text-[10px] text-accent font-semibold flex items-center gap-0.5">
                  <ShieldCheck size={12} /> Secure Verification
                </span>
              </div>

              <Input
                type="text"
                placeholder="e.g. 423984719283 (12-digit UTR)"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20))}
                className="bg-background border-border text-sm font-mono tracking-wider h-10"
                required
              />

              <p className="text-[11px] text-muted-foreground flex items-start gap-1">
                <HelpCircle size={13} className="shrink-0 mt-0.5 text-primary" />
                <span>
                  Found in your UPI app transaction receipt as <strong>UPI Ref No. / UTR / Txn ID</strong>.
                </span>
              </p>

              <Button
                type="submit"
                variant="hero"
                className="w-full h-10 font-bold shadow-md gap-1.5 text-xs"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Submitting Payment Reference...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={15} /> Submit for Verification
                  </>
                )}
              </Button>
            </form>

            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <ArrowLeft size={13} /> Edit Details
              </button>
              <button
                type="button"
                onClick={() => handleClose(false)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {step === "confirmed" && (
          <div className="flex flex-col items-center text-center py-3 animate-fade-in space-y-4">
            {/* Clock / In-Progress Icon */}
            <div className="w-16 h-16 rounded-full bg-amber-500/15 border-2 border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
              <Clock size={36} />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-foreground font-outfit">
                Payment Under Verification ⏳
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                Thank you, <strong>{form.name}</strong>! Your payment reference for the <strong>{plan?.name} Plan</strong> has been received.
              </p>
            </div>

            {/* Order Summary Box */}
            <div className="w-full p-3.5 rounded-2xl bg-secondary/50 border border-border/70 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-mono font-bold text-primary">{currentOrderId}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-bold text-foreground">{plan?.price}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <span className="text-muted-foreground">Submitted UTR:</span>
                <span className="font-mono font-bold text-foreground">{utrNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 text-[11px]">
                  ● Verification in Progress
                </span>
              </div>
            </div>

            {/* Invoice Delivery Information Note */}
            <div className="w-full p-3 rounded-xl bg-primary/10 border border-primary/20 text-[11px] text-primary flex items-start gap-2 text-left leading-relaxed">
              <Mail size={16} className="shrink-0 mt-0.5" />
              <span>
                Our team is matching your UTR (<strong>{utrNumber}</strong>) with our bank records. Your official <strong>Tax Invoice PDF</strong> and project onboarding details will be emailed to <strong className="underline">{form.email}</strong> right after verification.
              </span>
            </div>

            {/* Actions */}
            <div className="w-full space-y-2 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="hero"
                  size="sm"
                  className="w-full text-xs font-bold gap-1.5 shadow-md"
                  onClick={() => {
                    if (!plan) return;
                    const invData: InvoiceData = {
                      invoiceNo: currentInvoiceNo || generateInvoiceNumber(currentOrderId),
                      orderId: currentOrderId,
                      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
                      customerName: form.name.trim(),
                      customerEmail: form.email.trim(),
                      customerPhone: form.phone.trim(),
                      planName: plan.name,
                      amount: plan.amount,
                      upiRef: utrNumber,
                      status: "payment_submitted",
                      requirements: form.requirements.trim(),
                    };
                    downloadInvoicePDF(invData);
                    toast({
                      title: "Invoice Downloaded! 📄",
                      description: `Saved as Axenova_Invoice_${currentOrderId}.pdf`,
                    });
                  }}
                >
                  <Download size={14} /> Download PDF
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-semibold gap-1.5 border-border/80"
                  onClick={() => {
                    if (!plan) return;
                    const invData: InvoiceData = {
                      invoiceNo: currentInvoiceNo || generateInvoiceNumber(currentOrderId),
                      orderId: currentOrderId,
                      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
                      customerName: form.name.trim(),
                      customerEmail: form.email.trim(),
                      customerPhone: form.phone.trim(),
                      planName: plan.name,
                      amount: plan.amount,
                      upiRef: utrNumber,
                      status: "payment_submitted",
                      requirements: form.requirements.trim(),
                    };
                    openPrintableInvoice(invData);
                  }}
                >
                  <FileText size={14} /> View Invoice
                </Button>
              </div>

              <a
                href={getWhatsAppLink(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-md shadow-[#25D366]/20 transition-all active:scale-98"
              >
                <MessageCircle size={16} />
                Send Confirmation on WhatsApp
                <ExternalLink size={13} className="opacity-80" />
              </a>

              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-muted-foreground hover:text-foreground"
                onClick={() => handleClose(false)}
              >
                Done / Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
