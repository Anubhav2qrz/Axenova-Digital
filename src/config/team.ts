export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image?: string; // Place your image path here e.g. "/team/anubhav-goon.jpg" or an external URL
  initials: string;
  bio?: string;
  badge?: string;
  socials?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    email?: string;
  };
}

// To add new team members in the future, simply add a new object to this array:
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "anubhav-goon",
    name: "Anubhav Goon",
    role: "Founder & CEO",
    badge: "Founder & CEO",
    image: "/team/anubhav-goon.jpg",
    initials: "AG",
    bio: "Leading full-stack engineering, web architecture, and digital growth at Axenova Digital to build cutting-edge web experiences for businesses.",
    socials: {
      github: "https://github.com/Anubhav2qrz",
      linkedin: "https://linkedin.com/company/axenova-digital",
      email: "axenovadigital@gmail.com",
    },
  },
];
