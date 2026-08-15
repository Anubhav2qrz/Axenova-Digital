import React from "react";
import { Linkedin, Github, Mail, Globe, Sparkles, UserPlus, Code2, Palette, Zap, ShieldCheck } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useTilt } from "@/hooks/useTilt";
import { useMouseSpotlight } from "@/hooks/useMouseSpotlight";
import { TEAM_MEMBERS, TeamMember } from "@/config/team";
import { Button } from "@/components/ui/button";

const TeamMemberCard = ({ member, index }: { member: TeamMember; index: number }) => {
  const { onMouseMove: tiltMove, onMouseLeave: tiltLeave } = useTilt(5);
  const { onMouseMove: spotMove, onMouseLeave: spotLeave } = useMouseSpotlight();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    tiltMove(e);
    spotMove(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    tiltLeave(e);
    spotLeave(e);
  };

  return (
    <div
      className={`group glass rounded-2xl p-6 sm:p-7 card-glow spotlight-card tilt-card opacity-0 animate-on-scroll border transition-all duration-300 flex flex-col justify-between ${
        member.featured
          ? "border-primary/40 shadow-xl shadow-primary/5 bg-gradient-to-b from-primary/[0.07] via-card/80 to-card/60"
          : "border-border/50 hover:border-primary/30"
      }`}
      style={{ animationDelay: `${index * 0.12}s` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div>
        {/* Header with Avatar & Badge */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="relative">
            {member.avatar ? (
              <img
                src={member.avatar}
                alt={member.name}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-primary/30 shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div
                className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center font-extrabold text-lg sm:text-xl shadow-lg border-2 transition-transform duration-300 group-hover:scale-105 ${
                  member.featured
                    ? "bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10 text-primary border-primary/40 shadow-primary/10"
                    : "bg-secondary text-foreground border-border/70"
                }`}
              >
                {member.initials}
              </div>
            )}
            {/* Status indicator */}
            <span
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center"
              title="Active & Available"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </span>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {member.badge && (
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm ${
                  member.featured
                    ? "bg-primary/15 text-primary border-primary/30"
                    : "bg-accent/15 text-accent border-accent/30"
                }`}
              >
                {member.badge}
              </span>
            )}
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              {member.department}
            </span>
          </div>
        </div>

        {/* Name & Role */}
        <div className="mb-3">
          <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {member.name}
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-accent/90">{member.role}</p>
        </div>

        {/* Bio */}
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-5">{member.bio}</p>

        {/* Skills */}
        <div className="mb-6">
          <p className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider mb-2">
            Focus & Expertise
          </p>
          <div className="flex flex-wrap gap-1.5">
            {member.skills.map((skill) => (
              <span
                key={skill}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-secondary/80 text-foreground/90 border border-border/50 font-medium transition-colors hover:border-primary/40 hover:bg-primary/10"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Social Links & Contact */}
      <div className="pt-4 border-t border-border/40 flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground font-medium">Connect</span>
        <div className="flex items-center gap-1.5">
          {member.socials.github && (
            <a
              href={member.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg glass border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 hover:scale-110 transition-all"
              aria-label={`${member.name} GitHub`}
            >
              <Github size={14} />
            </a>
          )}
          {member.socials.linkedin && (
            <a
              href={member.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg glass border border-border/60 flex items-center justify-center text-muted-foreground hover:text-blue-500 hover:border-blue-500/40 hover:scale-110 transition-all"
              aria-label={`${member.name} LinkedIn`}
            >
              <Linkedin size={14} />
            </a>
          )}
          {member.socials.portfolio && (
            <a
              href={member.socials.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg glass border border-border/60 flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/40 hover:scale-110 transition-all"
              aria-label={`${member.name} Portfolio`}
            >
              <Globe size={14} />
            </a>
          )}
          {member.socials.email && (
            <a
              href={`mailto:${member.socials.email}?subject=Hello%20${encodeURIComponent(member.name)}`}
              className="w-8 h-8 rounded-lg glass border border-border/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:scale-110 transition-all"
              aria-label={`Email ${member.name}`}
            >
              <Mail size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const TeamSection = () => {
  const ref = useScrollAnimation();

  const handleOpenCareers = () => {
    window.dispatchEvent(new CustomEvent("open-careers"));
  };

  return (
    <section id="team" className="py-20 sm:py-24 relative overflow-hidden mesh-bg">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/5 blur-[140px] pointer-events-none" />

      <div ref={ref} className="container relative z-10 px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 opacity-0 animate-on-scroll">
          <span className="badge-pill mb-3">Meet The Team</span>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-3 text-foreground"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            The Minds Behind Axenova Digital
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            A dedicated collective of developers, designers, and digital craftsmen building premium web solutions that empower brands.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 sm:mb-16">
          {TEAM_MEMBERS.map((member, index) => (
            <TeamMemberCard key={member.id} member={member} index={index} />
          ))}
        </div>

        {/* Hiring & Career Banner Callout */}
        <div className="glass rounded-2xl p-6 sm:p-8 border border-accent/30 bg-gradient-to-r from-primary/10 via-card/80 to-accent/10 shadow-xl opacity-0 animate-on-scroll flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shrink-0">
              <UserPlus size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-base sm:text-lg font-bold text-foreground">Want to join our team?</h4>
                <span className="text-[10px] font-extrabold uppercase bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                  We're Hiring
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
                We're always looking for ambitious developers, UI/UX designers, and creative storytellers.
              </p>
            </div>
          </div>

          <Button
            variant="hero"
            size="default"
            onClick={handleOpenCareers}
            className="font-semibold shadow-lg shrink-0 gap-2 cursor-pointer w-full sm:w-auto"
          >
            <Sparkles size={16} />
            View Open Roles & Apply
          </Button>
        </div>

        {/* Team Highlights Bar */}
        <div className="mt-10 sm:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 opacity-0 animate-on-scroll">
          {[
            { icon: Code2, title: "100% In-House", desc: "No outsourcing, direct engineer contact", color: "text-blue-500" },
            { icon: Zap, title: "Agile Turnaround", desc: "Rapid 3–7 day delivery cycles", color: "text-amber-500" },
            { icon: Palette, title: "Custom Craft", desc: "Bespoke design for every brand", color: "text-violet-500" },
            { icon: ShieldCheck, title: "Code Ownership", desc: "100% full source code transfer", color: "text-emerald-500" },
          ].map((item) => (
            <div
              key={item.title}
              className="glass p-4 rounded-xl border border-border/50 text-center flex flex-col items-center justify-center"
            >
              <item.icon size={20} className={`${item.color} mb-2`} />
              <h5 className="text-xs sm:text-sm font-bold text-foreground mb-0.5">{item.title}</h5>
              <p className="text-[11px] text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
