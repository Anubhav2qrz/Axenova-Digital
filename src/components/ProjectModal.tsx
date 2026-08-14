import { ExternalLink, Check, Zap, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export interface ProjectData {
  image: string;
  name: string;
  category: string;
  description: string;
  liveUrl: string;
  tags: string[];
  challenge?: string;
  solution?: string;
  speedScore?: number;
  features?: string[];
}

interface ProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectData | null;
}

const ProjectModal = ({ open, onOpenChange, project }: ProjectModalProps) => {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border/60 max-w-2xl overflow-y-auto max-h-[90vh] p-0">
        <div className="relative aspect-video w-full overflow-hidden bg-black/40">
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-accent border border-accent/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Live Preview
          </div>
        </div>

        <div className="p-6 space-y-6">
          <DialogHeader className="p-0">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  {project.category}
                </span>
                <DialogTitle className="text-2xl font-bold mt-1">
                  {project.name}
                </DialogTitle>
              </div>

              {project.speedScore && (
                <div className="glass px-3 py-1.5 rounded-xl text-center border-accent/30 shrink-0">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Zap size={12} className="text-amber-400" /> Speed
                  </div>
                  <div className="text-sm font-bold text-accent">{project.speedScore}/100</div>
                </div>
              )}
            </div>

            <DialogDescription className="text-sm text-muted-foreground mt-2">
              {project.description}
            </DialogDescription>
          </DialogHeader>

          {/* Highlights & Features */}
          <div className="space-y-4">
            {project.challenge && (
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/40">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1 flex items-center gap-1.5">
                  <Sparkles size={14} /> Client Objective & Challenge
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{project.challenge}</p>
              </div>
            )}

            {project.features && project.features.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2.5">
                  Key Delivered Features
                </h4>
                <div className="grid sm:grid-cols-2 gap-2">
                  {project.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check size={14} className="text-accent shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                Tech Stack & Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button variant="hero" asChild className="gap-2">
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <Globe size={16} /> Open Live Site <ExternalLink size={14} />
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
