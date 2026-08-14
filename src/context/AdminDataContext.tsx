import React, { createContext, useContext, useState, useEffect } from "react";
import portfolio1 from "@/assets/portfolio-1.png";
import portfolio2 from "@/assets/portfolio-2.png";
import portfolio3 from "@/assets/portfolio-3.png";
import portfolio4 from "@/assets/portfolio-4.png";
import { supabase } from "@/lib/supabase";

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  liveUrl: string;
  image: string;
  tags: string[];
}

export interface PlanItem {
  id: string;
  name: string;
  price: string;
  amount: number;
  description: string;
  popular: boolean;
  delivery: string;
  badge: string | null;
  features: { text: string; tip?: string }[];
}

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  date: string;
  helpful: number;
}

export interface OrderItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  amount: number;
  requirements?: string;
  status: string;
  created_at: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
}

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    image: portfolio1,
    name: "Nex Agency Mentors",
    description: "NexAgency is a modern digital agency delivering creative web solutions.",
    liveUrl: "https://nexagency.netlify.app/",
    tags: ["digital agency", "UI/UX design", "responsive design"],
  },
  {
    id: "proj-2",
    image: portfolio2,
    name: "Zego Portfolio",
    description: "Zego Portfolio showcases projects, skills, and modern web development work.",
    liveUrl: "https://zego-portfolio.netlify.app/",
    tags: ["Portfolio", "Gallery", "Editing"],
  },
  {
    id: "proj-3",
    image: portfolio3,
    name: "NexusModel AI",
    description: "NexusModel AI delivers powerful AI tools for smarter digital solutions.",
    liveUrl: "https://nexusmodel-ai.netlify.app/",
    tags: ["AI tools", "API integration", "Smart solutions"],
  },
  {
    id: "proj-4",
    image: portfolio4,
    name: "The Brew Haven Cafe",
    description: "The Brew Haven Cafe is a modern cafe website with online ordering and reservation system.",
    liveUrl: "https://thebrewhavencafe.netlify.app/",
    tags: ["Cafe website", "Online ordering", "Reservations"],
  },
];

const DEFAULT_PLANS: PlanItem[] = [
  {
    id: "plan-basic",
    name: "Basic",
    price: "₹999",
    amount: 999,
    description: "Perfect for personal or starter websites",
    popular: false,
    delivery: "3–5 Days",
    badge: null,
    features: [
      { text: "1–3 Page Website" },
      { text: "Mobile Responsive" },
      { text: "Contact Form" },
      { text: "Basic SEO Setup" },
      { text: "1 Revision Round" },
      { text: "Delivery in 3–5 Days" },
    ],
  },
  {
    id: "plan-standard",
    name: "Standard",
    price: "₹2,999",
    amount: 2999,
    description: "Great for growing businesses",
    popular: true,
    delivery: "5–7 Days",
    badge: "Most Popular",
    features: [
      { text: "5–8 Page Website" },
      { text: "Custom Design" },
      { text: "SEO Optimized" },
      { text: "WhatsApp Integration" },
      { text: "Social Media Links" },
      { text: "3 Revision Rounds" },
      { text: "Delivery in 5–7 Days" },
    ],
  },
  {
    id: "plan-premium",
    name: "Premium",
    price: "₹9,999",
    amount: 9999,
    description: "Full-scale custom web solutions",
    popular: false,
    delivery: "10–14 Days",
    badge: "Best Value",
    features: [
      { text: "Unlimited Pages" },
      { text: "E-commerce / Web App" },
      { text: "Admin Dashboard" },
      { text: "Payment Integration" },
      { text: "Advanced SEO & Analytics" },
      { text: "Priority Support" },
      { text: "Delivery in 10–14 Days" },
    ],
  },
];

interface SyncResult {
  projects: number;
  plans: number;
  reviews: number;
  errorMessage?: string;
}

interface AdminDataContextType {
  projects: ProjectItem[];
  plans: PlanItem[];
  reviews: ReviewItem[];
  orders: OrderItem[];
  addProject: (p: Omit<ProjectItem, "id">) => Promise<void>;
  updateProject: (id: string, p: Partial<ProjectItem>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updatePlan: (id: string, p: Partial<PlanItem>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  addReview: (r: Omit<ReviewItem, "id" | "date" | "helpful">) => Promise<void>;
  syncAllToSupabase: () => Promise<SyncResult>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  refreshAllData: () => Promise<void>;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem("axenova_admin_projects");
      return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
    } catch {
      return DEFAULT_PROJECTS;
    }
  });

  const [plans, setPlans] = useState<PlanItem[]>(() => {
    try {
      const saved = localStorage.getItem("axenova_admin_plans");
      return saved ? JSON.parse(saved) : DEFAULT_PLANS;
    } catch {
      return DEFAULT_PLANS;
    }
  });

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);

  // Local storage persistence
  useEffect(() => {
    localStorage.setItem("axenova_admin_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("axenova_admin_plans", JSON.stringify(plans));
  }, [plans]);

  // Fetch all data from Supabase
  const refreshAllData = async () => {
    // 1. Projects
    try {
      const { data, error } = await supabase.from("projects").select("*");
      if (data && data.length > 0 && !error) {
        const formatted: ProjectItem[] = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          description: d.description,
          liveUrl: d.live_url || d.liveUrl,
          image: d.image,
          tags: Array.isArray(d.tags) ? d.tags : [],
        }));
        setProjects(formatted);
      }
    } catch (e) {
      console.warn("Projects Supabase fetch notice:", e);
    }

    // 2. Plans
    try {
      const { data, error } = await supabase.from("plans").select("*");
      if (data && data.length > 0 && !error) {
        const formatted: PlanItem[] = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          price: d.price,
          amount: Number(d.amount) || 0,
          description: d.description,
          popular: Boolean(d.popular),
          delivery: d.delivery,
          badge: d.badge || null,
          features: Array.isArray(d.features) ? d.features : [],
        }));
        setPlans(formatted);
      }
    } catch (e) {
      console.warn("Plans Supabase fetch notice:", e);
    }

    // 3. Reviews
    let dbReviews: ReviewItem[] = [];
    try {
      const { data } = await supabase.from("reviews").select("*").order("date", { ascending: false });
      if (data) dbReviews = data;
    } catch {}

    let localReviews: ReviewItem[] = [];
    try {
      const saved = localStorage.getItem("axenova_custom_reviews");
      if (saved) localReviews = JSON.parse(saved);
    } catch {}

    const revMap = new Map<string, ReviewItem>();
    localReviews.forEach((r) => revMap.set(r.id, r));
    dbReviews.forEach((r) => revMap.set(r.id, r));
    setReviews(Array.from(revMap.values()));

    // 4. Orders
    try {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (data) setOrders(data);
    } catch {}
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Project Actions
  const addProject = async (p: Omit<ProjectItem, "id">) => {
    const id = `proj-${Date.now()}`;
    const newProj: ProjectItem = { ...p, id };
    setProjects((prev) => [newProj, ...prev]);

    try {
      await supabase.from("projects").insert([{
        id,
        name: p.name,
        description: p.description,
        live_url: p.liveUrl,
        image: p.image,
        tags: p.tags,
      }]);
    } catch (e) {
      console.warn("Supabase project insert notice:", e);
    }
  };

  const updateProject = async (id: string, updated: Partial<ProjectItem>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));

    try {
      const dbPayload: any = {};
      if (updated.name) dbPayload.name = updated.name;
      if (updated.description) dbPayload.description = updated.description;
      if (updated.liveUrl) dbPayload.live_url = updated.liveUrl;
      if (updated.image) dbPayload.image = updated.image;
      if (updated.tags) dbPayload.tags = updated.tags;

      await supabase.from("projects").update(dbPayload).eq("id", id);
    } catch {}
  };

  const deleteProject = async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    try {
      await supabase.from("projects").delete().eq("id", id);
    } catch {}
  };

  // Plan Actions
  const updatePlan = async (id: string, updated: Partial<PlanItem>) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));

    try {
      await supabase.from("plans").upsert({
        id,
        name: updated.name,
        price: updated.price,
        amount: updated.amount,
        description: updated.description,
        popular: updated.popular,
        delivery: updated.delivery,
        badge: updated.badge,
        features: updated.features,
      });
    } catch {}
  };

  // Review Actions
  const deleteReview = async (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));

    try {
      const saved = localStorage.getItem("axenova_custom_reviews");
      if (saved) {
        const list: ReviewItem[] = JSON.parse(saved);
        const filtered = list.filter((r) => r.id !== id);
        localStorage.setItem("axenova_custom_reviews", JSON.stringify(filtered));
      }
    } catch {}

    try {
      await supabase.from("reviews").delete().eq("id", id);
    } catch {}
  };

  const addReview = async (r: Omit<ReviewItem, "id" | "date" | "helpful">) => {
    const id = `rev-${Date.now()}`;
    const newRev: ReviewItem = {
      ...r,
      id,
      date: new Date().toISOString().split("T")[0],
      helpful: 0,
    };
    setReviews((prev) => [newRev, ...prev]);

    try {
      const saved = localStorage.getItem("axenova_custom_reviews");
      const list = saved ? JSON.parse(saved) : [];
      localStorage.setItem("axenova_custom_reviews", JSON.stringify([newRev, ...list]));
    } catch {}

    try {
      await supabase.from("reviews").insert([{
        name: newRev.name,
        role: newRev.role,
        text: newRev.text,
        rating: newRev.rating,
        date: newRev.date,
        helpful: 0,
      }]);
    } catch {}
  };

  // Sync All Data to Supabase
  const syncAllToSupabase = async (): Promise<SyncResult> => {
    let syncedProjects = 0;
    let syncedPlans = 0;
    let syncedReviews = 0;
    let lastError: string | undefined;

    // 1. Projects
    for (const p of projects) {
      try {
        const { error } = await supabase.from("projects").upsert({
          id: p.id,
          name: p.name,
          description: p.description,
          live_url: p.liveUrl,
          image: p.image,
          tags: p.tags,
        });
        if (!error) syncedProjects++;
        else lastError = error.message;
      } catch (e: any) {
        lastError = e.message;
      }
    }

    // 2. Plans
    for (const pl of plans) {
      try {
        const { error } = await supabase.from("plans").upsert({
          id: pl.id,
          name: pl.name,
          price: pl.price,
          amount: pl.amount,
          description: pl.description,
          popular: pl.popular,
          delivery: pl.delivery,
          badge: pl.badge,
          features: pl.features,
        });
        if (!error) syncedPlans++;
        else lastError = error.message;
      } catch (e: any) {
        lastError = e.message;
      }
    }

    // 3. Reviews
    try {
      const saved = localStorage.getItem("axenova_custom_reviews");
      if (saved) {
        const localReviews: ReviewItem[] = JSON.parse(saved);
        for (const rev of localReviews) {
          const { error } = await supabase.from("reviews").insert([{
            name: rev.name,
            role: rev.role,
            text: rev.text,
            rating: rev.rating,
            date: rev.date,
            helpful: rev.helpful || 0,
          }]);
          if (!error) syncedReviews++;
          else lastError = error.message;
        }
      }
    } catch (e: any) {
      lastError = e.message;
    }

    await refreshAllData();
    return {
      projects: syncedProjects,
      plans: syncedPlans,
      reviews: syncedReviews,
      errorMessage: lastError,
    };
  };

  const updateOrderStatus = async (id: string, status: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      await supabase.from("orders").update({ status }).eq("id", id);
    } catch {}
  };

  return (
    <AdminDataContext.Provider
      value={{
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
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error("useAdminData must be used within AdminDataProvider");
  }
  return context;
};
