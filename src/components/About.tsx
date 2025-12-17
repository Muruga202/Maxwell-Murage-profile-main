import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { BookOpen, Users, Code, TrendingUp } from "lucide-react";

const About = () => {
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

  const highlights = [
    {
      icon: BookOpen,
      title: "Journalism Excellence",
      description: "Diploma in Journalism & Mass Communication from NIBS, specializing in political, social, and cultural reporting."
    },
    {
      icon: Code,
      title: "Tech Innovation",
      description: "Full Stack Software Engineer at Moringa School, building digital solutions that matter."
    },
    {
      icon: TrendingUp,
      title: "Digital Marketing",
      description: "Digital marketer at Media Crest College, crafting impactful campaigns and strategies."
    }
  ];

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-background to-muted/20"
    >
      <div className="container mx-auto px-4">
        <div className={`max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              About Me
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A multidisciplinary professional passionate about storytelling, education, and technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {highlights.map((item, index) => (
              <Card 
                key={index}
                className={`p-6 hover-lift transition-all duration-500 ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
                    <item.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-8 gradient-border">
            <div className="prose prose-lg max-w-none">
              <p className="text-foreground mb-4">
                With a <strong>Diploma in Journalism and Mass Communication</strong> from Nairobi Institute of Business Studies, 
                I bring expertise in political, social, and cultural reporting, alongside skills in data visualization, 
                infographic design, and digital storytelling.
              </p>
              <p className="text-foreground mb-4">
                Proficiency in tools like <strong>Adobe Photoshop and Illustrator</strong> enables me to craft impactful narratives 
                that resonate with diverse audiences while adhering to journalistic ethics and standards.
              </p>
              <p className="text-foreground">
                As a <strong>Full Stack Software Engineer at Moringa School</strong> and <strong>Digital Marketer at 
                Media Crest College</strong>, I leverage collaborative techniques and a commitment to continuous learning to empower 
                learners and drive impactful stories that inform and inspire.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;
