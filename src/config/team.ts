export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image?: string; // Place your image path here e.g. "/team/anubhav.jpg" or an external URL
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
    role: "Founder & Lead Developer",
    badge: "Founder",
    image: "", // Put your image URL or local path here (e.g. "/anubhav.png" or "/team/anubhav.jpg")
    initials: "AG",
    bio: "Full-stack developer and founder leading web engineering, architecture, and client digital experiences.",
    socials: {
      github: "https://github.com/Anubhav2qrz",
      email: "axenovadigital@gmail.com",
    },
  },
];
