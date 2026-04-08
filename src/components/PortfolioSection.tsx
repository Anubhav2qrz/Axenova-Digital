import { ExternalLink, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import portfolio1 from "@/assets/portfolio-1.png";
import portfolio2 from "@/assets/portfolio-2.png";
import portfolio3 from "@/assets/portfolio-3.png";
import portfolio4 from "@/assets/portfolio-4.png";

const projects = [
  {
    image: portfolio1,
    name: "Nex Agency Mentors",
    description: "NexAgency is a modern digital agency delivering creative web solutions.",
    liveUrl: "https://nexagency.netlify.app/",
    tags: ["digital agency", "UI/UX design", "responsive design"],
  },
  {
    image: portfolio2,
    name: "Zego Portfolio",
    description: "Zego Portfolio showcases projects, skills, and modern web development work.",
    liveUrl: "https://zego-portfolio.netlify.app/",
    tags: ["Portfolio", "Gallery", "Editing"],
  },
  {
    image: portfolio3,
    name: "NexusModel AI",
    description: "NexusModel AI delivers powerful AI tools for smarter digital solutions.",
    liveUrl: "https://nexusmodel-ai.netlify.app/",
    tags: ["AI tools", "API integration", "Smart solutions"],
  },
  {
    image: portfolio4,
    name: "The Brew Haven Cafe",
    description: "The Brew Haven Cafe is a modern cafe website with online ordering and reservation system.",
    liveUrl: "https://thebrewhavencafe.netlify.app/",
    tags: ["Cafe website", "Online ordering", "Reservations"],
  },
];

const PortfolioSection = () => {
  const ref = useScrollAnimation();

  return (
    <section id="portfolio" className="py-24 relative">
      <div ref={ref} className="container">
        <div className="text-center mb-16 opacity-0 animate-on-scroll">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Our Work</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">Featured Projects</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A glimpse of what we've built for our clients. Click to view live projects.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <a
              key={project.name}
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group glass rounded-xl overflow-hidden hover-lift opacity-0 animate-on-scroll block cursor-pointer"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button variant="hero" size="sm" tabIndex={-1} className="pointer-events-none">
                    View Live Site <ExternalLink size={14} className="ml-1" />
                  </Button>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium text-accent border border-accent/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                  </span>
                  Live
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  <Globe size={16} className="text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary/80 border border-primary/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
