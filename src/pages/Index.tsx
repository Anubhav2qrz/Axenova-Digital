import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import PortfolioSection from "@/components/PortfolioSection";
import PricingSection from "@/components/PricingSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import ReviewsSection from "@/components/ReviewsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <ServicesSection />
    <PortfolioSection />
    <PricingSection />
    <WhyChooseUsSection />
    <ReviewsSection />
    <ContactSection />
    <Footer />
    <WhatsAppButton />
  </div>
);

export default Index;
