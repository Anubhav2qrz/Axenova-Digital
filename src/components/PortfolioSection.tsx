import { ExternalLink, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useAdminData } from "@/context/AdminDataContext";

const PortfolioSection = () => {
  const ref = useScrollAnimation();
  const { projects } = useAdminData();

  return (
    <section id="portfolio" className="py-20 sm:py-24 relative overflow-hidden">
      {/* Liquid background refraction orbs */}
      <div className="absolute top-1/4 left-1/5 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-primary/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/5 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-accent/8 blur-[110px] pointer-events-none" />

      <div ref={ref} className="container relative z-10 px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16 opacity-0 animate-on-scroll">
          <span className="badge-pill mb-3">Our Work</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Featured Projects
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            A glimpse of what we've built for our clients. Click to view live projects.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {projects.map((project, i) => (
            <a
              key={project.id}
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group glass rounded-2xl overflow-hidden hover-lift card-glow opacity-0 animate-on-scroll block cursor-pointer border border-border/60 transition-all duration-300 active:scale-[0.99] shadow-lg hover:shadow-2xl"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="relative overflow-hidden aspect-video bg-secondary/40">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button variant="hero" size="sm" tabIndex={-1} className="pointer-events-none font-bold shadow-xl">
                    View Live Site <ExternalLink size={14} className="ml-1.5" />
                  </Button>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-background/80 backdrop-blur-md rounded-full px-2.5 py-1 text-xs font-semibold text-accent border border-white/20 shadow-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                  </span>
                  Live
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors">{project.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-primary font-semibold">
                    <span>Visit</span>
                    <ExternalLink size={14} />
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3.5 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/15 font-medium"
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
