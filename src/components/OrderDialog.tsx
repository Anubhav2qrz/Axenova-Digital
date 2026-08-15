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
import { ShieldCheck, Loader2 } from "lucide-react";
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

const OrderDialog = ({ open, onOpenChange, plan }: OrderDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
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

      const orderEntry = {
        plan: plan.name,
        amount: plan.amount,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        requirements: form.requirements.trim(),
        status: 'pending_payment'
      };
      
      let internalOrderId = null;
      try {
        const { data: dbData } = await supabase.from('orders').insert([orderEntry]).select();
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

            await supabase.from('orders').update({
              status: 'paid',
              razorpay_payment_id: response.razorpay_payment_id
            }).eq('id', internalOrderId);
          }
          
          toast({
            title: "Payment Successful! 🎉",
            description: `Payment ID: ${response.razorpay_payment_id}. We'll contact you shortly.`,
          });
          onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              <>Pay & Place Order</>
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
