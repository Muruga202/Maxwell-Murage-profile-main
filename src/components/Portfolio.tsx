import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Newspaper, Palette, Code, TrendingUp } from "lucide-react";
import journalismImg from "@/assets/journalism-project.jpg";
import designImg from "@/assets/design-project.jpg";
import developmentImg from "@/assets/development-project.jpg";
import marketingImg from "@/assets/marketing-project.jpg";

type ProjectCategory = "all" | "journalism" | "design" | "development" | "marketing";

const Portfolio = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>("all");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const categories = [
    { id: "all" as ProjectCategory, name: "All Projects", icon: null },
    { id: "journalism" as ProjectCategory, name: "Journalism", icon: Newspaper },
    { id: "design" as ProjectCategory, name: "Design", icon: Palette },
    { id: "development" as ProjectCategory, name: "Development", icon: Code },
    { id: "marketing" as ProjectCategory, name: "Marketing", icon: TrendingUp },
  ];

  const projects = [
    {
      id: 1,
      category: "journalism",
      title: "Political Analysis Series",
      description: "In-depth reporting on national policy reforms and their impact on local communities. Features data visualization and investigative journalism.",
      image: journalismImg,
      tags: ["Political Reporting", "Data Viz", "Investigation"],
      link: "#"
    },
    {
      id: 2,
      category: "journalism",
      title: "Cultural Documentation Project",
      description: "Multimedia storytelling project documenting indigenous cultural practices and their preservation in modern society.",
      image: journalismImg,
      tags: ["Cultural Reporting", "Multimedia", "Documentation"],
      link: "#"
    },
    {
      id: 3,
      category: "design",
      title: "Infographic Design Series",
      description: "Created compelling infographics for major news outlets, transforming complex data into accessible visual narratives.",
      image: designImg,
      tags: ["Illustrator", "Data Visualization", "Editorial Design"],
      link: "#"
    },
    {
      id: 4,
      category: "design",
      title: "Educational Visual Content",
      description: "Developed visual content library for NIBS College, including course materials, presentations, and promotional designs.",
      image: designImg,
      tags: ["Photoshop", "Educational Design", "Branding"],
      link: "#"
    },
    {
      id: 5,
      category: "development",
      title: "News Aggregator Platform",
      description: "Full-stack web application aggregating news from multiple sources with custom filtering and personalization features.",
      image: developmentImg,
      tags: ["React", "TypeScript", "API Integration"],
      link: "#"
    },
    {
      id: 6,
      category: "development",
      title: "Student Portal System",
      description: "Comprehensive student management system for educational institutions with attendance tracking and performance analytics.",
      image: developmentImg,
      tags: ["Full Stack", "Database Design", "Authentication"],
      link: "#"
    },
    {
      id: 7,
      category: "marketing",
      title: "Social Media Campaign",
      description: "Multi-platform digital marketing campaign for Media Crest College, achieving 300% increase in engagement.",
      image: marketingImg,
      tags: ["Social Media", "Content Strategy", "Analytics"],
      link: "#"
    },
    {
      id: 8,
      category: "marketing",
      title: "Brand Awareness Initiative",
      description: "Developed comprehensive brand awareness strategy combining content marketing, SEO, and social media outreach.",
      image: marketingImg,
      tags: ["Brand Strategy", "SEO", "Campaign Management"],
      link: "#"
    }
  ];

  const filteredProjects = selectedCategory === "all" 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  return (
    <section 
      id="portfolio" 
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-background to-muted/20"
    >
      <div className="container mx-auto px-4">
        <div className={`max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              Portfolio & Projects
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A showcase of my work across journalism, design, development, and marketing
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.id)}
                className={`transition-all duration-300 ${
                  selectedCategory === cat.id 
                    ? 'bg-gradient-to-r from-primary to-primary-glow shadow-glow' 
                    : 'hover:border-primary'
                }`}
              >
                {cat.icon && <cat.icon className="w-4 h-4 mr-2" />}
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => (
              <Card 
                key={project.id}
                className={`overflow-hidden hover-lift transition-all duration-500 ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden group">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <Button 
                      variant="secondary"
                      size="sm"
                      asChild
                      className="bg-primary text-primary-foreground hover:bg-primary-glow"
                    >
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Project
                      </a>
                    </Button>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <Badge 
                        key={tagIndex} 
                        variant="secondary"
                        className="bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
