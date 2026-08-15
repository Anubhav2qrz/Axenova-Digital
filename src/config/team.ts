export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  badge?: string;
  bio: string;
  avatar?: string;
  initials: string;
  skills: string[];
  socials: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    email?: string;
    portfolio?: string;
  };
  featured?: boolean;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "anubhav-goon",
    name: "Anubhav Goon",
    role: "Founder & Lead Developer",
    department: "Engineering & Strategy",
    badge: "Founder & Tech Lead",
    bio: "Full-stack architect & developer passionate about building high-converting, lightning-fast digital products. Leads product architecture, engineering standards, and client project delivery.",
    initials: "AG",
    skills: ["Full Stack Dev", "React & Next.js", "TypeScript", "UI/UX Systems", "Cloud & API Architecture"],
    socials: {
      github: "https://github.com/Anubhav2qrz",
      linkedin: "https://linkedin.com/company/axenova-digital",
      email: "axenovadigital@gmail.com",
    },
    featured: true,
  },
  {
    id: "ui-ux-lead",
    name: "Lead UI/UX & Brand Designer",
    role: "UI/UX & Visual Designer",
    department: "Design & Product",
    badge: "Creative Lead",
    bio: "Obsessed with creating trend-forward, intuitive design systems and visually stunning web interfaces that captivate users and elevate brand perception.",
    initials: "UX",
    skills: ["Figma", "Design Systems", "Wireframing", "Brand Identity", "Motion Design"],
    socials: {
      email: "axenovadigital@gmail.com",
    },
    featured: false,
  },
  {
    id: "frontend-specialist",
    name: "Frontend & Performance Engineer",
    role: "Senior Frontend Developer",
    department: "Web Development",
    badge: "Core Engineer",
    bio: "Specializes in building buttery-smooth, mobile-responsive interfaces with pixel-perfect precision, micro-animations, and 95+ Google PageSpeed scores.",
    initials: "FE",
    skills: ["Tailwind CSS", "JavaScript / TS", "Modern Web", "SEO Architecture", "Web Performance"],
    socials: {
      email: "axenovadigital@gmail.com",
    },
    featured: false,
  },
];
