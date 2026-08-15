import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  Check,
  Star,
  Globe,
  Briefcase,
  DollarSign,
  Package,
  Layers,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  User,
  Clock,
  CheckCircle,
  FileText,
  Download,
  Copy,
  CheckCircle2,
  Loader2,
  Send,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAdminData, type ProjectItem, type PlanItem, type ReviewItem, type OrderItem } from "@/context/AdminDataContext";
import { openPrintableInvoice, downloadInvoicePDF, generateInvoiceNumber, sendInvoiceEmail, type InvoiceData } from "@/lib/invoice";

const DEFAULT_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || "axenova2026";

const AdminPage = () => {
  const { toast } = useToast();
  const {
    projects,
    plans,
    reviews,
    orders,
    addProject,
    updateProject,
    deleteProject,
    updatePlan,
    deleteReview,
    addReview,
    syncAllToSupabase,
    updateOrderStatus,
    refreshAllData,
  } = useAdminData();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("axenova_admin_auth") === "true";
  });
  const [passcode, setPasscode] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"projects" | "reviews" | "pricing" | "orders">("projects");

  // Project Form Modal / State
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    liveUrl: "",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    tags: "web design, responsive",
  });
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Review Form State
  const [newReviewForm, setNewReviewForm] = useState({
    name: "",
    role: "",
    text: "",
    rating: 5,
  });

  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const handleVerifyAndSendInvoice = async (o: OrderItem) => {
    setVerifyingId(o.id);
    try {
      const invData: InvoiceData = {
        invoiceNo: o.invoice_no || generateInvoiceNumber(o.order_id || o.id),
        orderId: o.order_id || o.id,
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        customerName: o.name,
        customerEmail: o.email,
        customerPhone: o.phone,
        planName: o.plan,
        amount: o.amount,
        upiRef: o.upi_ref || "Verified UPI",
        status: "verified",
        requirements: o.requirements,
      };

      // 1. Dispatch official invoice email to client's email
      const emailSent = await sendInvoiceEmail(invData);

      // 2. Update status in database
      await updateOrderStatus(o.id, "verified");

      toast({
        title: "Order Verified & Tax Invoice Sent! 🎉",
        description: emailSent
          ? `Official Tax Invoice #${invData.invoiceNo} has been emailed to ${o.email}.`
          : `Order verified! Status updated to Verified & Paid.`,
      });
    } catch (err) {
      console.error("Failed to verify order:", err);
      toast({
        title: "Error verifying order",
        description: "Please check console for details",
        variant: "destructive",
      });
    } finally {
      setVerifyingId(null);
    }
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPasscode = import.meta.env.VITE_ADMIN_PASSCODE || DEFAULT_PASSCODE;
    if (passcode.trim() === targetPasscode || passcode.trim() === DEFAULT_PASSCODE) {
      setIsAuthenticated(true);
      sessionStorage.setItem("axenova_admin_auth", "true");
      setAuthError(false);
      toast({ title: "Welcome to Axenova Admin Control Center! 👋" });
    } else {
      setAuthError(true);
      toast({ title: "Incorrect Passcode", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("axenova_admin_auth");
    setPasscode("");
  };

  // Add Project handler
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim() || !newProject.description.trim() || !newProject.liveUrl.trim()) {
      toast({ title: "Please fill all required project fields", variant: "destructive" });
      return;
    }

    await addProject({
      name: newProject.name.trim(),
      description: newProject.description.trim(),
      liveUrl: newProject.liveUrl.trim(),
      image: newProject.image.trim() || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
      tags: newProject.tags.split(",").map((t) => t.trim()).filter(Boolean),
    });

    setNewProject({
      name: "",
      description: "",
      liveUrl: "",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
      tags: "web design, responsive",
    });

    toast({ title: "Project added and synced to cloud! 🎉" });
  };

  // Add Manual Review handler
  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewForm.name.trim() || !newReviewForm.text.trim()) {
      toast({ title: "Name and text are required", variant: "destructive" });
      return;
    }

    await addReview({
      name: newReviewForm.name.trim(),
      role: newReviewForm.role.trim() || "Client",
      text: newReviewForm.text.trim(),
      rating: newReviewForm.rating,
    });

    setNewReviewForm({ name: "", role: "", text: "", rating: 5 });
    toast({ title: "Review added and synced to cloud!" });
  };

  // ----------------------------------------------------
  // LOGIN SCREEN
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 mesh-bg relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />

        <div className="w-full max-w-md glass rounded-3xl p-8 border border-border/60 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Axenova Admin Portal
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your passcode to manage projects, reviews & pricing
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Admin Passcode
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter passcode…"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className={`pl-10 pr-10 bg-secondary/40 border-border/60 ${authError ? "border-destructive" : ""}`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {authError && (
                <p className="text-xs text-destructive mt-1.5">
                  Incorrect passcode.
                </p>
              )}
            </div>

            <Button variant="hero" className="w-full font-semibold gap-2 shadow-lg">
              <ShieldCheck size={18} />
              Unlock Admin Portal
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/40 text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1">
              <ArrowLeft size={13} /> Back to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // ADMIN DASHBOARD SCREEN
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Top Admin Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-40">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-md">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Axenova Control Center
              </h1>
              <p className="text-xs text-muted-foreground">Admin Portal · Logged in</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="hero"
              size="sm"
              onClick={async () => {
                const res = await syncAllToSupabase();
                if (res.projects > 0 || res.plans > 0 || res.reviews > 0) {
                  toast({
                    title: "Synced to Cloud! ☁️",
                    description: `Synced ${res.projects} projects, ${res.plans} plans, ${res.reviews} reviews to Supabase.`,
                  });
                } else if (res.errorMessage) {
                  toast({
                    title: "Supabase Setup Required ⚠️",
                    description: `Database error: ${res.errorMessage}. Please run the script in supabase_setup.sql in your Supabase SQL Editor.`,
                    variant: "destructive",
                  });
                } else {
                  toast({
                    title: "Everything Up to Date ☁️",
                    description: "All projects, plans, and reviews are synced to Supabase.",
                  });
                }
              }}
              className="gap-1.5 text-xs font-semibold shadow-md"
            >
              <RefreshCw size={14} /> Sync to Cloud
            </Button>
            <Link to="/" target="_blank">
              <Button variant="hero-outline" size="sm" className="gap-1.5 text-xs">
                <Globe size={14} /> Live Site
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 text-xs text-destructive hover:bg-destructive/10">
              <LogOut size={14} /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-2xl p-5 border border-border/50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Briefcase size={22} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Portfolio Works</p>
              <p className="text-2xl font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>{(projects || []).length}</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 border border-border/50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Star size={22} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Reviews</p>
              <p className="text-2xl font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>{(reviews || []).length}</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 border border-border/50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <Package size={22} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Pricing Plans</p>
              <p className="text-2xl font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>{(plans || []).length}</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 border border-border/50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <DollarSign size={22} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Orders / Leads</p>
              <p className="text-2xl font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>{(orders || []).length}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border/60 mb-8 overflow-x-auto gap-2">
          {[
            { id: "projects", label: "💼 Portfolio Works", count: (projects || []).length },
            { id: "reviews", label: "💬 Reviews Manager", count: (reviews || []).length },
            { id: "pricing", label: "🏷️ Pricing Plans", count: (plans || []).length },
            { id: "orders", label: "📦 Orders & Leads", count: (orders || []).length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/40 font-bold">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ============================================================ */}
        {/* TAB 1: PORTFOLIO WORKS MANAGER */}
        {/* ============================================================ */}
        {activeTab === "projects" && (
          <div className="space-y-8 animate-fade-in">
            {/* Add New Project Form */}
            <div className="glass rounded-2xl p-6 border border-border/50">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                <Plus size={18} className="text-primary" /> Add New Portfolio Work
              </h3>
              <form onSubmit={handleAddProject} className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Project Name *</label>
                  <Input
                    placeholder="e.g. Urban Cafe Website"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="bg-secondary/40 border-border/60"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Live Demo URL *</label>
                  <Input
                    placeholder="https://example.com"
                    value={newProject.liveUrl}
                    onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                    className="bg-secondary/40 border-border/60"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Description *</label>
                  <Textarea
                    placeholder="Brief description of the project and features delivered..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="bg-secondary/40 border-border/60 resize-none"
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Image URL</label>
                  <Input
                    placeholder="https://images.unsplash.com/..."
                    value={newProject.image}
                    onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                    className="bg-secondary/40 border-border/60"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Tags (comma separated)</label>
                  <Input
                    placeholder="E-commerce, UI/UX, React"
                    value={newProject.tags}
                    onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                    className="bg-secondary/40 border-border/60"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <Button variant="hero" size="sm" className="gap-2 font-semibold">
                    <Plus size={16} /> Publish Project
                  </Button>
                </div>
              </form>
            </div>

            {/* List of Existing Projects */}
            <div className="grid sm:grid-cols-2 gap-6">
              {projects.map((p) => (
                <div key={p.id} className="glass rounded-2xl overflow-hidden border border-border/50 flex flex-col group">
                  <div className="relative aspect-video bg-secondary/50 overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 rounded-full shadow-lg"
                        onClick={() => deleteProject(p.id)}
                        title="Delete project"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-base">{p.name}</h4>
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold">
                          View <Globe size={12} />
                        </a>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{p.description}</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {p.tags.map((t) => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: REVIEWS MANAGER */}
        {/* ============================================================ */}
        {activeTab === "reviews" && (
          <div className="space-y-8 animate-fade-in">
            {/* Sync Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass rounded-2xl p-4 border border-border/50">
              <div>
                <p className="font-bold text-sm">Sync Local Reviews to Supabase</p>
                <p className="text-xs text-muted-foreground">Push reviews added on this device to Supabase so they show on all phones & devices.</p>
              </div>
              <Button
                variant="hero-outline"
                size="sm"
                onClick={async () => {
                  const count = await syncReviewsToSupabase();
                  toast({ title: `Synced ${count} reviews to Supabase cloud! ☁️` });
                }}
                className="gap-2 text-xs font-semibold shrink-0"
              >
                <RefreshCw size={14} /> Push Reviews to Supabase
              </Button>
            </div>

            {/* Add Manual Review Form */}
            <div className="glass rounded-2xl p-6 border border-border/50">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                <Plus size={18} className="text-accent" /> Add Official Client Review
              </h3>
              <form onSubmit={handleAddReview} className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Client Name *</label>
                  <Input
                    placeholder="e.g. Vikram Malhotra"
                    value={newReviewForm.name}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, name: e.target.value })}
                    className="bg-secondary/40 border-border/60"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Role / Company</label>
                  <Input
                    placeholder="CEO, Startup Inc."
                    value={newReviewForm.role}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, role: e.target.value })}
                    className="bg-secondary/40 border-border/60"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Rating (1–5)</label>
                  <select
                    value={newReviewForm.rating}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, rating: Number(e.target.value) })}
                    className="w-full h-10 rounded-md bg-secondary/40 border border-border/60 px-3 text-sm"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{r} ⭐ Stars</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-3">
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Review Text *</label>
                  <Textarea
                    placeholder="What did the client say about Axenova Digital?"
                    value={newReviewForm.text}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, text: e.target.value })}
                    className="bg-secondary/40 border-border/60 resize-none"
                    rows={2}
                    required
                  />
                </div>

                <div className="md:col-span-3 flex justify-end">
                  <Button variant="hero" size="sm" className="gap-2 font-semibold">
                    <Plus size={16} /> Save Review
                  </Button>
                </div>
              </form>
            </div>

            {/* List of Reviews */}
            <div className="grid md:grid-cols-2 gap-4">
              {reviews.map((r) => (
                <div key={r.id} className="glass rounded-2xl p-5 border border-border/50 flex flex-col justify-between relative group">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: r.rating }).map((_, idx) => (
                          <Star key={idx} size={14} className="fill-amber-400" />
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => deleteReview(r.id)}
                        title="Delete review"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>

                    <p className="text-sm text-foreground italic mb-4 leading-relaxed">"{r.text}"</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/40">
                    <div>
                      <p className="font-bold text-xs">{r.name}</p>
                      <p className="text-[10px] text-muted-foreground">{r.role}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{r.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: PRICING PLANS MANAGER */}
        {/* ============================================================ */}
        {activeTab === "pricing" && (
          <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
            {plans.map((p) => (
              <div key={p.id} className="glass rounded-2xl p-6 border border-border/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">{p.name} Plan</h3>
                    {p.popular && (
                      <span className="text-[10px] font-bold text-white bg-primary px-2.5 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>

                  {/* Editable price */}
                  <div className="mb-4">
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Display Price</label>
                    <Input
                      value={p.price}
                      onChange={(e) => updatePlan(p.id, { price: e.target.value })}
                      className="font-bold text-lg bg-secondary/40 border-border/60"
                    />
                  </div>

                  {/* Editable delivery */}
                  <div className="mb-4">
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Delivery Time</label>
                    <Input
                      value={p.delivery}
                      onChange={(e) => updatePlan(p.id, { delivery: e.target.value })}
                      className="text-xs bg-secondary/40 border-border/60"
                    />
                  </div>

                  {/* Editable Description */}
                  <div className="mb-4">
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Description</label>
                    <Textarea
                      value={p.description}
                      onChange={(e) => updatePlan(p.id, { description: e.target.value })}
                      className="text-xs bg-secondary/40 border-border/60 resize-none"
                      rows={2}
                    />
                  </div>

                  {/* Features list */}
                  <div className="mb-4">
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Features (one per line)</label>
                    <Textarea
                      value={p.features.map((f) => f.text).join("\n")}
                      onChange={(e) =>
                        updatePlan(p.id, {
                          features: e.target.value
                            .split("\n")
                            .filter(Boolean)
                            .map((t) => ({ text: t })),
                        })
                      }
                      className="text-xs bg-secondary/40 border-border/60 resize-none font-mono"
                      rows={5}
                    />
                  </div>
                </div>

                <Button
                  variant="hero"
                  size="sm"
                  onClick={() => toast({ title: `${p.name} Plan updated successfully!` })}
                  className="w-full font-semibold gap-1.5"
                >
                  <Check size={14} /> Save {p.name} Plan
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: ORDERS & LEADS MANAGER */}
        {/* ============================================================ */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Showing all submitted client orders from Razorpay and lead forms
              </p>
              <Button variant="hero-outline" size="sm" onClick={refreshOrders} className="gap-1.5 text-xs">
                <RefreshCw size={13} /> Refresh List
              </Button>
            </div>

            {orders.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center border border-border/50">
                <Package size={40} className="mx-auto mb-3 text-muted-foreground/40" />
                <h3 className="font-bold text-lg mb-1">No Orders Received Yet</h3>
                <p className="text-xs text-muted-foreground">
                  Orders placed through your site will automatically appear here in real-time.
                </p>
              </div>
            ) : (
              <div className="glass rounded-2xl border border-border/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-secondary/60 text-muted-foreground uppercase tracking-wider font-semibold border-b border-border/50">
                      <tr>
                        <th className="p-4">Order &amp; UTR</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Plan &amp; Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-right">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {(orders || []).map((o) => {
                        const safeOrderId = o.order_id || String(o.id || "").slice(0, 8);
                        const safeAmount = Number(o.amount || 0);
                        const safeDateStr = o.created_at ? new Date(o.created_at).toLocaleDateString() : "-";
                        const safeInvoiceDate = o.created_at
                          ? new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                          : new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

                        return (
                          <tr key={o.id || Math.random()} className="hover:bg-secondary/30 transition-colors">
                            <td className="p-4">
                              <span className="font-mono font-bold text-primary block text-xs">
                                {safeOrderId}
                              </span>
                              {o.upi_ref ? (
                                <div className="flex items-center gap-1 mt-1">
                                  <span className="font-mono text-[11px] bg-secondary/80 px-1.5 py-0.5 rounded border border-border text-foreground">
                                    UTR: {o.upi_ref}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[10px] text-muted-foreground italic">No UTR submitted</span>
                              )}
                            </td>
                            <td className="p-4">
                              <p className="font-bold text-sm text-foreground">{o.name || "Anonymous"}</p>
                              <p className="text-muted-foreground">{o.email || "-"}</p>
                              <p className="text-[10px] text-accent">{o.phone || "-"}</p>
                              {o.requirements && (
                                <p className="text-[10px] text-muted-foreground mt-1 max-w-[200px] truncate" title={o.requirements}>
                                  📝 {o.requirements}
                                </p>
                              )}
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-foreground block">{o.plan || "Custom"} Plan</span>
                              <span className="text-primary font-semibold">₹{safeAmount.toLocaleString("en-IN")}</span>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1.5">
                                {o.status === "verified" || o.status === "paid" ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                    <CheckCircle2 size={12} /> Verified &amp; Paid
                                  </span>
                                ) : o.status === "payment_submitted" ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full animate-pulse">
                                    <Clock size={12} /> Verification Pending
                                  </span>
                                ) : o.status === "cancelled" ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-full">
                                    <XCircle size={12} /> Cancelled / Fake
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                                    ⏳ Draft / Pending
                                  </span>
                                )}

                                <select
                                  value={o.status || "pending_payment"}
                                  onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                  className="h-7 w-full rounded-md bg-secondary/80 border border-border/60 px-1.5 text-[11px] font-medium text-muted-foreground block"
                                >
                                  <option value="pending_payment">Draft / Pending</option>
                                  <option value="payment_submitted">Payment Submitted</option>
                                  <option value="verified">✅ Verified &amp; Paid</option>
                                  <option value="in_progress">🚧 In Progress</option>
                                  <option value="completed">🎉 Completed</option>
                                  <option value="cancelled">❌ Cancelled / Fake</option>
                                </select>
                              </div>
                            </td>
                            <td className="p-4 text-muted-foreground whitespace-nowrap">
                              {safeDateStr}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {o.status !== "verified" && o.status !== "paid" ? (
                                  <>
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={() => handleVerifyAndSendInvoice(o)}
                                      disabled={verifyingId === o.id}
                                      className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white gap-1 shadow-sm"
                                    >
                                      {verifyingId === o.id ? (
                                        <>
                                          <Loader2 size={12} className="animate-spin" /> Verifying...
                                        </>
                                      ) : (
                                        <>
                                          <Send size={12} /> Verify &amp; Send Invoice
                                        </>
                                      )}
                                    </Button>

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => updateOrderStatus(o.id, "cancelled")}
                                      className="h-8 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-2"
                                      title="Mark as Fake / Cancelled"
                                    >
                                      <XCircle size={14} />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const invData: InvoiceData = {
                                          invoiceNo: o.invoice_no || generateInvoiceNumber(o.order_id || o.id),
                                          orderId: o.order_id || o.id,
                                          date: safeInvoiceDate,
                                          customerName: o.name,
                                          customerEmail: o.email,
                                          customerPhone: o.phone,
                                          planName: o.plan,
                                          amount: safeAmount,
                                          upiRef: o.upi_ref,
                                          status: o.status,
                                          requirements: o.requirements,
                                        };
                                        downloadInvoicePDF(invData);
                                        toast({
                                          title: "Official Invoice Downloaded",
                                          description: `Saved as Axenova_Invoice_${o.order_id || o.id}.pdf`,
                                        });
                                      }}
                                      className="h-8 text-xs font-semibold gap-1"
                                      title="Download Verified PDF Invoice"
                                    >
                                      <Download size={13} /> PDF
                                    </Button>

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const invData: InvoiceData = {
                                          invoiceNo: o.invoice_no || generateInvoiceNumber(o.order_id || o.id),
                                          orderId: o.order_id || o.id,
                                          date: safeInvoiceDate,
                                          customerName: o.name,
                                          customerEmail: o.email,
                                          customerPhone: o.phone,
                                          planName: o.plan,
                                          amount: safeAmount,
                                          upiRef: o.upi_ref,
                                          status: o.status,
                                          requirements: o.requirements,
                                        };
                                        openPrintableInvoice(invData);
                                      }}
                                      className="h-8 text-xs font-semibold gap-1 text-muted-foreground hover:text-foreground"
                                      title="View & Print Invoice"
                                    >
                                      <FileText size={13} /> View
                                    </Button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
