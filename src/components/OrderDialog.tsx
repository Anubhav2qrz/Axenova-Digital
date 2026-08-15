import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { RAZORPAY_KEY_ID, ORDER_API_URL } from "@/config/razorpay";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ShieldCheck, Loader2, Copy, CheckCircle2, PartyPopper, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

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
  const [loading, setLoading] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const [successName, setSuccessName] = useState("");
  const [copied, setCopied] = useState(false);
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
    if (!form.name.trim() || form.name.trim().length > 100) return "Please enter a valid name (max 100 chars)";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim())) return "Please enter a valid 10-digit phone number";
    if (form.requirements.length > 1000) return "Requirements must be under 1000 characters";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast({ title: error, variant: "destructive" });
      return;
    }
    if (!plan) return;

    setLoading(true);

    try {
      const friendlyOrderId = generateOrderId();

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

      let internalOrderId = null;
      try {
        const { data: dbData } = await supabase.from("orders").insert([orderEntry]).select();
        if (dbData && dbData.length > 0) {
          internalOrderId = dbData[0].id;
        }
      } catch (err) {
        console.error("Failed to insert into Supabase", err);
      }

      const res = await fetch(ORDER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: plan.amount * 100,
          currency: "INR",
          plan: plan.name,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          requirements: form.requirements.trim(),
        }),
      });

      let data;
      if (res.ok) {
        data = await res.json();
      } else {
        console.warn("Backend for Razorpay not available, falling back to dummy order ID");
        data = { order_id: `pay_${Date.now()}`, amount: plan.amount * 100, currency: "INR" };
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: data.amount || plan.amount * 100,
        currency: data.currency || "INR",
        name: "Axenova Digital",
        description: `${plan.name} Plan - Website Development`,
        order_id: data.order_id,
        prefill: {
          name: form.name.trim(),
          email: form.email.trim(),
          contact: form.phone.trim(),
        },
        theme: { color: "#2196F3" },
        handler: async function (response: Record<string, string>) {
          if (internalOrderId) {
            await supabase.from("orders").update({
              status: "paid",
              razorpay_payment_id: response.razorpay_payment_id,
            }).eq("id", internalOrderId);
          }
          setSuccessOrderId(friendlyOrderId);
          setSuccessName(form.name.trim().split(" ")[0]);
          setForm({ name: "", email: "", phone: "", requirements: "" });
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast({
        title: "Could not initiate payment",
        description: "Please ensure the backend is configured or try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (successOrderId) {
      navigator.clipboard.writeText(successOrderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = (val: boolean) => {
    if (!val) {
      setSuccessOrderId(null);
      setCopied(false);
    }
    onOpenChange(val);
  };

  // ── Success Screen ──
  if (successOrderId) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="glass border-border sm:max-w-md">
          <div className="flex flex-col items-center py-2 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mb-4 ring-4 ring-accent/20">
              <PartyPopper size={32} className="text-accent" />
            </div>
            <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Congrats{successName ? `, ${successName}` : ""}! 🎉
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Your order is confirmed. Use your <strong>Order ID</strong> to track your project progress anytime.
            </p>

            {/* Order ID Card */}
            <div className="w-full glass rounded-2xl p-5 mb-4 border border-primary/20">
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-2 font-semibold">Your Order ID</p>
              <p className="text-2xl sm:text-3xl font-extrabold gradient-text mb-3 select-all" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {successOrderId}
              </p>
              <Button
                variant="hero-outline"
                className="w-full h-9 text-sm font-semibold"
                onClick={handleCopy}
              >
                {copied ? (
                  <><CheckCircle2 size={15} className="mr-1.5 text-accent" /> Copied to clipboard!</>
                ) : (
                  <><Copy size={15} className="mr-1.5" /> Copy Order ID</>
                )}
              </Button>
            </div>

            {/* How to track */}
            <div className="w-full glass rounded-xl p-4 text-left space-y-2.5 mb-5 border border-border/40">
              <p className="text-xs font-bold text-foreground uppercase tracking-wider">How to Track Your Order</p>
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Search size={13} className="text-primary mt-0.5 shrink-0" />
                <span>Click <strong className="text-foreground">"Track Order"</strong> from the bottom dock or navigation bar</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <CheckCircle2 size={13} className="text-accent mt-0.5 shrink-0" />
                <span>Enter your <strong className="text-foreground">Order ID</strong> <code className="text-primary bg-primary/10 px-1 py-0.5 rounded">{successOrderId}</code> or your <strong className="text-foreground">10-digit phone number</strong></span>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground flex items-center gap-1 mb-5">
              <ShieldCheck size={12} className="text-accent" />
              Save this ID — you'll need it to track your project
            </p>

            <Button variant="hero" className="w-full h-11 font-bold" onClick={() => handleClose(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Order {plan?.name} Plan
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {plan?.price} • Fill in your details to proceed to payment
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
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
            placeholder="Project Requirements (optional)"
            value={form.requirements}
            onChange={(e) => handleChange("requirements", e.target.value)}
            maxLength={1000}
            rows={3}
            className="bg-secondary/50 border-border resize-none text-base sm:text-sm"
          />

          <Button variant="hero" className="w-full h-11 font-bold shadow-lg" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" /> Processing...
              </>
            ) : (
              <>Pay &amp; Place Order</>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1 pt-1">
            <ShieldCheck size={14} className="text-accent" />
            Secured by Razorpay • 100% Safe Payment
          </p>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowFallback(!showFallback)}
              className="text-xs sm:text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline transition-colors"
            >
              Having trouble with Razorpay? Use Alternative Payment
            </button>
          </div>

          {showFallback && (
            <div className="mt-4 p-4 border border-border rounded-xl bg-secondary/30 text-center animate-in fade-in slide-in-from-top-4">
              <p className="text-sm font-semibold mb-1">Alternative Payment Options</p>
              <p className="text-xs text-muted-foreground mb-3">
                You can directly pay via UPI using the QR code or UPI ID below.
              </p>

              <div className="bg-white p-2 w-32 h-32 mx-auto mb-3 rounded-lg flex items-center justify-center border text-center text-xs text-black relative shadow-sm">
                <img src="/qr-code.png" alt="Payment QR Code" className="w-full h-full object-contain" />
              </div>

              <div className="bg-secondary/60 p-2 rounded-lg border border-border mt-3 mb-2">
                <p className="font-bold select-all text-xs sm:text-sm text-foreground">axenova@ybl</p>
              </div>

              <p className="text-[11px] text-muted-foreground mt-2 leading-tight">
                After successful payment, please take a screenshot and contact us on WhatsApp with your payment proof.
              </p>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
