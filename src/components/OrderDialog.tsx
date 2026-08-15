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
} from "lucide-react";
import { supabase } from "@/lib/supabase";

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
  const [step, setStep] = useState<"form" | "payment">("form");
  const [loading, setLoading] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string>("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    requirements: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.name.trim() || form.name.trim().length > 100) return "Please enter your full name";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email address";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim())) return "Please enter a valid 10-digit phone number";
    if (form.requirements.length > 1000) return "Requirements must be under 1000 characters";
    return null;
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast({ title: error, variant: "destructive" });
      return;
    }
    if (!plan) return;

    setLoading(true);

    const friendlyOrderId = generateOrderId();
    setCurrentOrderId(friendlyOrderId);

    try {
      const orderEntry = {
        order_id: friendlyOrderId,
        plan: plan.name,
        amount: plan.amount,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        requirements: form.requirements.trim(),
        status: "received",
      };

      await supabase.from("orders").insert([orderEntry]);
    } catch (err) {
      console.error("Supabase insert error (fallback enabled):", err);
    } finally {
      setLoading(false);
      setStep("payment");
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

  // WhatsApp confirmation text
  const whatsappMessage = `Hi Axenova Digital! I have placed an order for the *${plan?.name} Plan* (${plan?.price}).

*Order Details:*
• Order ID: ${currentOrderId}
• Name: ${form.name.trim()}
• Phone: ${form.phone.trim()}
• Email: ${form.email.trim()}
${form.requirements.trim() ? `• Requirements: ${form.requirements.trim()}` : ""}

I have completed the UPI payment / Here is my payment screenshot:`;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass border-border sm:max-w-md max-h-[92vh] overflow-y-auto">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">
                Order {plan?.name} Plan
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {plan?.price} • Enter your details to generate your order & payment QR
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
                placeholder="Email Address"
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
                Instant UPI Payment • 100% Direct &amp; Secure
              </p>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center text-center py-1">
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
                className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                loading="eager"
              />
              <span className="text-[11px] font-semibold text-gray-700 mt-1.5 flex items-center gap-1">
                <QrCode size={13} className="text-blue-600" /> Scan with any UPI App (GPay, PhonePe, Paytm, BHIM)
              </span>
            </div>

            {/* UPI ID Copy Bar */}
            <div className="w-full flex items-center justify-between p-2.5 px-3 rounded-xl bg-secondary/60 border border-border/70 mb-3 text-xs">
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-muted-foreground">Or pay directly to UPI ID:</span>
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
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 text-xs font-bold mb-3 transition-colors active:scale-98"
            >
              <Smartphone size={15} />
              Tap to Pay ₹{plan?.amount} via UPI App
            </a>

            {/* WhatsApp Send Confirmation Button */}
            <a
              href={getWhatsAppLink(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold shadow-lg shadow-[#25D366]/20 active:scale-98 transition-all mb-3"
            >
              <MessageCircle size={17} />
              Send Screenshot on WhatsApp
              <ExternalLink size={14} className="opacity-80" />
            </a>

            {/* Note & Tracking instruction */}
            <div className="w-full p-2.5 rounded-xl bg-secondary/30 border border-border/40 text-[11px] text-muted-foreground text-left leading-relaxed mb-3">
              💡 <strong>Next steps:</strong> After payment, click the WhatsApp button above to share your screenshot. You can track your project status anytime using your Order ID <code className="text-primary font-mono">{currentOrderId}</code> or your Phone Number.
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-muted-foreground"
              onClick={() => handleClose(false)}
            >
              Done / Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
