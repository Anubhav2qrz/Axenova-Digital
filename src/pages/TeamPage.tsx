import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Github, Linkedin, Mail, Twitter, Sparkles, UserPlus, Image as ImageIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileStickyBar from "@/components/MobileStickyBar";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import AIAdvisorWidget from "@/components/AIAdvisorWidget";
import CareersDialog from "@/components/CareersDialog";
import { TEAM_MEMBERS, TeamMember } from "@/config/team";
import { Button } from "@/components/ui/button";

const TeamCard = ({ member }: { member: TeamMember }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group glass rounded-3xl p-5 sm:p-6 border border-border/60 hover:border-primary/40 transition-all duration-300 card-glow flex flex-col justify-between max-w-sm w-full mx-auto shadow-xl hover:-translate-y-1">
      <div>
        {/* Dedicated Image Space */}
        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-5 bg-gradient-to-br from-secondary/60 via-secondary/30 to-background border border-border/60 flex items-center justify-center group-hover:border-primary/40 transition-colors">
          {member.image && !imageError ? (
            <img
              src={member.image}
              alt={member.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-primary/25 via-accent/15 to-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary font-extrabold text-2xl sm:text-3xl shadow-lg mb-3 group-hover:scale-105 transition-transform">
                {member.initials}
              </div>
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1 opacity-70">
                <ImageIcon size={12} /> Photo Space
              </span>
            </div>
          )}

          {/* Active Status Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border/60 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-foreground">Active</span>
          </div>

          {member.badge && (
            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-primary/90 backdrop-blur-md text-primary-foreground text-xs font-bold shadow-md">
              {member.badge}
            </div>
          )}
        </div>

        {/* Name & Role Section at bottom of image */}
        <div className="text-center mb-3">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
            {member.name}
          </h3>
          <p className="text-sm sm:text-base font-semibold text-accent mt-0.5">
            {member.role}
          </p>
        </div>

        {/* Bio if available */}
        {member.bio && (
          <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed mb-4 px-2">
            {member.bio}
          </p>
        )}
      </div>

      {/* Social Links at Bottom */}
      {member.socials && (
        <div className="pt-4 border-t border-border/40 flex items-center justify-center gap-2">
          {member.socials.github && (
            <a
              href={member.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl glass border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 hover:scale-110 transition-all"
              aria-label={`${member.name} GitHub`}
            >
              <Github size={15} />
            </a>
          )}
          {member.socials.linkedin && (
            <a
              href={member.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl glass border border-border/60 flex items-center justify-center text-muted-foreground hover:text-blue-500 hover:border-blue-500/40 hover:scale-110 transition-all"
              aria-label={`${member.name} LinkedIn`}
            >
              <Linkedin size={15} />
            </a>
          )}
          {member.socials.twitter && (
            <a
              href={member.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl glass border border-border/60 flex items-center justify-center text-muted-foreground hover:text-sky-400 hover:border-sky-400/40 hover:scale-110 transition-all"
              aria-label={`${member.name} Twitter`}
            >
              <Twitter size={15} />
            </a>
          )}
          {member.socials.email && (
            <a
              href={`mailto:${member.socials.email}?subject=Hello%20${encodeURIComponent(member.name)}`}
              className="w-9 h-9 rounded-xl glass border border-border/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:scale-110 transition-all"
              aria-label={`Email ${member.name}`}
            >
              <Mail size={15} />
            </a>
          )}
        </div>
      )}
    </div>
  );
};

const TeamPage = () => {
  const [careersOpen, setCareersOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleOpenCareers = () => {
    setCareersOpen(true);
  };

  return (
    <div className="min-h-screen pb-24 md:pb-0 overflow-x-hidden w-full bg-background text-foreground flex flex-col justify-between">
      <ScrollProgressBar />
      <Navbar />

      <main className="pt-28 sm:pt-36 pb-20 container px-4 sm:px-6 relative z-10 max-w-6xl mx-auto flex-1">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-primary transition-colors glass px-3.5 py-1.5 rounded-full border border-border/60"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </div>

        {/* Page Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="badge-pill mb-3">Company Leadership & Team</span>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mt-3 mb-4 text-foreground"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Meet Our Team
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            The people driving engineering, modern design, and digital growth at Axenova Digital.
          </p>
        </div>

        {/* Team Members Grid */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          {TEAM_MEMBERS.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>

        {/* Careers Callout Card */}
        <div className="glass rounded-3xl p-8 sm:p-10 border border-accent/30 bg-gradient-to-r from-primary/10 via-card/90 to-accent/10 shadow-2xl max-w-3xl mx-auto text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent mx-auto">
            <UserPlus size={28} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 bg-accent/15 text-accent border border-accent/30 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full mb-2">
              We're Hiring
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Want to join Axenova Digital?</h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mt-1.5">
              We are constantly looking for talented web developers, designers, and creators to work on modern client websites.
            </p>
          </div>

          <Button
            variant="hero"
            size="lg"
            onClick={handleOpenCareers}
            className="font-semibold shadow-lg gap-2 cursor-pointer mt-2"
          >
            <Sparkles size={16} />
            Apply & Submit Resume
          </Button>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
      <MobileStickyBar />
      <AIAdvisorWidget />
      <CareersDialog open={careersOpen} onOpenChange={setCareersOpen} />
    </div>
  );
};

export default TeamPage;
