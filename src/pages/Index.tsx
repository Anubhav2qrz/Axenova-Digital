import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import PortfolioSection from "@/components/PortfolioSection";
import PricingSection from "@/components/PricingSection";
import CostEstimatorSection from "@/components/CostEstimatorSection";
import ComparisonSection from "@/components/ComparisonSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import ReviewsSection from "@/components/ReviewsSection";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileStickyBar from "@/components/MobileStickyBar";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import AIAdvisorWidget from "@/components/AIAdvisorWidget";
import CareersDialog from "@/components/CareersDialog";

interface IndexProps {
  scrollTo?: string;
}

const Index = ({ scrollTo }: IndexProps) => {
  const [careersOpen, setCareersOpen] = useState(false);

  useEffect(() => {
    const handleOpenCareers = () => setCareersOpen(true);
    window.addEventListener("open-careers", handleOpenCareers);
    return () => window.removeEventListener("open-careers", handleOpenCareers);
  }, []);

  useEffect(() => {
    const targetId = scrollTo || (window.location.hash ? window.location.hash.replace("#", "") : null);
    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    }
  }, [scrollTo]);

  return (
    <div className="min-h-screen pb-24 md:pb-0 overflow-x-hidden w-full">
      <ScrollProgressBar />
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
      <PortfolioSection />
      <PricingSection />
      <CostEstimatorSection />
      <ComparisonSection />
      <WhyChooseUsSection />
      <ReviewsSection />
      <FaqSection />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
      <MobileStickyBar />
      <AIAdvisorWidget />
      <CareersDialog open={careersOpen} onOpenChange={setCareersOpen} />
    </div>
  );
};

export default Index;
