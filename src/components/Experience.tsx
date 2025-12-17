import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, Code2, TrendingUp } from "lucide-react";

const Experience = () => {
  const [isVisible, setIsVisible] = useState(false);
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

  const experiences = [
    {
      icon: Code2,
      title: "Full Stack Software Engineer",
      company: "Moringa School",
      period: "Current",
      description: "Building full-stack applications and contributing to tech education while developing scalable web solutions.",
      skills: ["React", "Node.js", "TypeScript", "Database Design", "API Development"]
    },
    {
      icon: TrendingUp,
      title: "Digital Marketer",
      company: "Media Crest College",
      period: "3 Months Experience",
      description: "Crafting digital marketing strategies, managing campaigns, and creating engaging content for diverse audiences.",
      skills: ["Social Media Marketing", "Content Strategy", "Campaign Management", "Analytics"]
    },
    {
      icon: Briefcase,
      title: "Journalist & Content Creator",
      company: "Freelance",
      period: "Ongoing",
      description: "Specializing in political, social, and cultural reporting with expertise in data visualization and digital storytelling.",
      skills: ["Adobe Photoshop", "Adobe Illustrator", "Infographic Design", "Data Visualization", "Ethical Journalism"]
    }
  ];

  return (
    <section 
      id="experience" 
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-muted/20 to-background"
    >
      <div className="container mx-auto px-4">
        <div className={`max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              Professional Experience
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A diverse journey across journalism, education, technology, and marketing
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary via-accent to-secondary"></div>

            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <div 
                  key={index}
                  className={`relative ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className={`md:grid md:grid-cols-2 gap-8 ${index % 2 === 0 ? '' : 'md:grid-flow-dense'}`}>
                    {/* Timeline dot */}
                    <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
                      <div className="w-4 h-4 bg-primary rounded-full border-4 border-background shadow-glow"></div>
                    </div>

                    {/* Content card */}
                    <Card className={`p-6 hover-lift ${index % 2 === 0 ? 'md:col-start-1' : 'md:col-start-2'}`}>
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
                          <exp.icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1">{exp.title}</h3>
                          <p className="text-primary font-medium">{exp.company}</p>
                          <p className="text-sm text-muted-foreground">{exp.period}</p>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{exp.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {exp.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </Card>

                    {/* Empty space for alternating layout */}
                    <div className={`hidden md:block ${index % 2 === 0 ? 'md:col-start-2' : 'md:col-start-1'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
