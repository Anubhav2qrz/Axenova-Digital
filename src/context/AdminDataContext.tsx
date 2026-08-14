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

interface AdminDataContextType {
  projects: ProjectItem[];
  plans: PlanItem[];
  reviews: ReviewItem[];
  orders: OrderItem[];
  addProject: (p: Omit<ProjectItem, "id">) => void;
  updateProject: (id: string, p: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;
  updatePlan: (id: string, p: Partial<PlanItem>) => void;
  deleteReview: (id: string) => void;
  addReview: (r: Omit<ReviewItem, "id" | "date" | "helpful">) => void;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Projects State
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem("axenova_admin_projects");
      return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
    } catch {
      return DEFAULT_PROJECTS;
    }
  });

  // 2. Plans State
  const [plans, setPlans] = useState<PlanItem[]>(() => {
    try {
      const saved = localStorage.getItem("axenova_admin_plans");
      return saved ? JSON.parse(saved) : DEFAULT_PLANS;
    } catch {
      return DEFAULT_PLANS;
    }
  });

  // 3. Reviews State
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  // 4. Orders State
  const [orders, setOrders] = useState<OrderItem[]>([]);

  // Save projects to localStorage
  useEffect(() => {
    localStorage.setItem("axenova_admin_projects", JSON.stringify(projects));
  }, [projects]);

  // Save plans to localStorage
  useEffect(() => {
    localStorage.setItem("axenova_admin_plans", JSON.stringify(plans));
  }, [plans]);

  // Fetch reviews from Supabase & LocalStorage
  const fetchReviews = async () => {
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

    const map = new Map<string, ReviewItem>();
    localReviews.forEach((r) => map.set(r.id, r));
    dbReviews.forEach((r) => map.set(r.id, r));
    setReviews(Array.from(map.values()));
  };

  // Fetch orders from Supabase
  const refreshOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (data && !error) {
        setOrders(data);
      }
    } catch (err) {
      console.warn("Notice: orders table query", err);
    }
  };

  useEffect(() => {
    fetchReviews();
    refreshOrders();
  }, []);

  // Actions
  const addProject = (p: Omit<ProjectItem, "id">) => {
    const newProj: ProjectItem = { ...p, id: `proj-${Date.now()}` };
    setProjects((prev) => [newProj, ...prev]);
  };

  const updateProject = (id: string, updated: Partial<ProjectItem>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePlan = (id: string, updated: Partial<PlanItem>) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteReview = async (id: string) => {
    // 1. Remove from React state
    setReviews((prev) => prev.filter((r) => r.id !== id));

    // 2. Remove from LocalStorage
    try {
      const saved = localStorage.getItem("axenova_custom_reviews");
      if (saved) {
        const list: ReviewItem[] = JSON.parse(saved);
        const filtered = list.filter((r) => r.id !== id);
        localStorage.setItem("axenova_custom_reviews", JSON.stringify(filtered));
      }
    } catch {}

    // 3. Remove from Supabase
    try {
      await supabase.from("reviews").delete().eq("id", id);
    } catch {}
  };

  const addReview = async (r: Omit<ReviewItem, "id" | "date" | "helpful">) => {
    const newRev: ReviewItem = {
      ...r,
      id: `rev-${Date.now()}`,
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
        updateOrderStatus,
        refreshOrders,
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
