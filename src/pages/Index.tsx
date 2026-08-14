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

const Index = () => (
  <div className="min-h-screen pb-16 md:pb-0">
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
  </div>
);

export default Index;
