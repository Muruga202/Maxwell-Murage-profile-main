import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Skills = () => {
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

  const skillCategories = [
    {
      category: "Journalism & Media",
      skills: [
        { name: "Political Reporting", level: 90 },
        { name: "Social & Cultural Reporting", level: 85 },
        { name: "Data Visualization", level: 88 },
        { name: "Digital Storytelling", level: 92 }
      ]
    },
    {
      category: "Design & Creative",
      skills: [
        { name: "Adobe Photoshop", level: 85 },
        { name: "Adobe Illustrator", level: 82 },
        { name: "Infographic Design", level: 88 },
        { name: "Visual Content Creation", level: 90 }
      ]
    },
    {
      category: "Software Development",
      skills: [
        { name: "React & TypeScript", level: 85 },
        { name: "Full Stack Development", level: 80 },
        { name: "Database Management", level: 78 },
        { name: "API Development", level: 82 }
      ]
    },
    {
      category: "Digital Marketing",
      skills: [
        { name: "Content Strategy", level: 85 },
        { name: "Social Media Marketing", level: 82 },
        { name: "Campaign Management", level: 80 },
        { name: "Analytics & Reporting", level: 83 }
      ]
    }
  ];

  return (
    <section 
      id="skills" 
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-background to-muted/20"
    >
      <div className="container mx-auto px-4">
        <div className={`max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              Skills & Expertise
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive toolkit spanning multiple disciplines
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <Card 
                key={categoryIndex}
                className={`p-6 hover-lift transition-all duration-500 ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
                style={{ animationDelay: `${categoryIndex * 0.1}s` }}
              >
                <h3 className="text-2xl font-bold mb-6 text-gradient">
                  {category.category}
                </h3>
                <div className="space-y-6">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress 
                        value={isVisible ? skill.level : 0} 
                        className="h-2 transition-all duration-1000"
                        style={{ transitionDelay: `${(categoryIndex * 0.1) + (skillIndex * 0.05)}s` }}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <Card className="mt-12 p-8 gradient-border text-center">
            <h3 className="text-2xl font-bold mb-4">Core Values</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="font-semibold mb-2">Ethical Standards</h4>
                <p className="text-sm text-muted-foreground">
                  Committed to journalistic integrity and professional ethics
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">💡</div>
                <h4 className="font-semibold mb-2">Innovation</h4>
                <p className="text-sm text-muted-foreground">
                  Leveraging technology to create impactful narratives
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">🤝</div>
                <h4 className="font-semibold mb-2">Collaboration</h4>
                <p className="text-sm text-muted-foreground">
                  Fostering engagement and continuous learning
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Skills;
