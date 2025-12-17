import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import PortfolioEnhanced from "@/components/PortfolioEnhanced";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen">
      <ThemeToggle />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <PortfolioEnhanced />
      <Blog />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
