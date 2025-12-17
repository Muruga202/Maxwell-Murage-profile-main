import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, Newspaper, Code, GraduationCap, TrendingUp } from "lucide-react";

type BlogCategory = "all" | "journalism" | "technology" | "education" | "marketing";

const Blog = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>("all");
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
    { id: "all" as BlogCategory, name: "All Posts", icon: null },
    { id: "journalism" as BlogCategory, name: "Journalism", icon: Newspaper },
    { id: "technology" as BlogCategory, name: "Technology", icon: Code },
    { id: "education" as BlogCategory, name: "Education", icon: GraduationCap },
    { id: "marketing" as BlogCategory, name: "Marketing", icon: TrendingUp },
  ];

  const blogPosts = [
    {
      id: 1,
      category: "journalism",
      featured: true,
      title: "The Evolution of Digital Journalism in East Africa",
      excerpt: "Exploring how digital platforms are transforming news reporting and consumption patterns across the region, with a focus on mobile-first journalism.",
      date: "2025-11-10",
      readTime: "8 min read",
      tags: ["Digital Media", "Regional Analysis"]
    },
    {
      id: 2,
      category: "journalism",
      featured: false,
      title: "Data Journalism: Making Numbers Tell Stories",
      excerpt: "A practical guide to using data visualization tools to enhance storytelling and make complex information accessible to diverse audiences.",
      date: "2025-11-05",
      readTime: "6 min read",
      tags: ["Data Viz", "Storytelling"]
    },
    {
      id: 3,
      category: "technology",
      featured: true,
      title: "Building Full-Stack Applications with Modern Tools",
      excerpt: "Insights from teaching and building real-world applications using React, TypeScript, and cloud-based backend solutions.",
      date: "2025-11-08",
      readTime: "10 min read",
      tags: ["React", "TypeScript", "Full Stack"]
    },
    {
      id: 4,
      category: "technology",
      featured: false,
      title: "The Intersection of Journalism and Code",
      excerpt: "How programming skills empower journalists to create interactive stories, analyze data, and build custom tools for newsrooms.",
      date: "2025-11-01",
      readTime: "7 min read",
      tags: ["Tech Journalism", "Innovation"]
    },
    {
      id: 5,
      category: "education",
      featured: true,
      title: "Innovative Teaching Methods for Media Studies",
      excerpt: "Strategies for engaging students in the digital age, combining traditional journalism principles with modern technological approaches.",
      date: "2025-11-12",
      readTime: "9 min read",
      tags: ["Teaching", "Pedagogy", "Media Studies"]
    },
    {
      id: 6,
      category: "education",
      featured: false,
      title: "Preparing Students for the Modern Newsroom",
      excerpt: "Essential skills and competencies needed for journalism graduates to thrive in today's multimedia, technology-driven news environment.",
      date: "2025-10-28",
      readTime: "6 min read",
      tags: ["Career Development", "Skills"]
    },
    {
      id: 7,
      category: "marketing",
      featured: false,
      title: "Digital Marketing Strategies for Educational Institutions",
      excerpt: "Effective approaches to building online presence, engaging prospective students, and creating authentic institutional brands.",
      date: "2025-11-06",
      readTime: "8 min read",
      tags: ["Digital Strategy", "Education Marketing"]
    },
    {
      id: 8,
      category: "marketing",
      featured: false,
      title: "Content Marketing in the Age of Social Media",
      excerpt: "Leveraging multiple platforms to create cohesive campaigns that resonate with target audiences and drive meaningful engagement.",
      date: "2025-10-30",
      readTime: "7 min read",
      tags: ["Social Media", "Content Strategy"]
    }
  ];

  const filteredPosts = selectedCategory === "all" 
    ? blogPosts 
    : blogPosts.filter(p => p.category === selectedCategory);

  const featuredPosts = filteredPosts.filter(p => p.featured);
  const regularPosts = filteredPosts.filter(p => !p.featured);

  return (
    <section 
      id="blog" 
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-muted/20 to-background"
    >
      <div className="container mx-auto px-4">
        <div className={`max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              Latest Insights
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Thoughts on journalism, technology, education, and digital marketing
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

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-gradient">Featured Posts</span>
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPosts.map((post, index) => (
                  <Card 
                    key={post.id}
                    className={`p-6 hover-lift gradient-border transition-all duration-500 ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Badge className="mb-4 bg-gradient-to-r from-secondary to-accent text-secondary-foreground">
                      Featured
                    </Badge>
                    <h4 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h4>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, tagIndex) => (
                        <Badge 
                          key={tagIndex} 
                          variant="secondary"
                          className="bg-primary/10 text-primary"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button variant="link" className="p-0 h-auto text-primary">
                      Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Regular Posts */}
          {regularPosts.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-6">All Posts</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {regularPosts.map((post, index) => (
                  <Card 
                    key={post.id}
                    className={`p-6 hover-lift transition-all duration-500 ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
                    style={{ animationDelay: `${(featuredPosts.length + index) * 0.1}s` }}
                  >
                    <h4 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h4>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, tagIndex) => (
                        <Badge 
                          key={tagIndex} 
                          variant="secondary"
                          className="bg-muted"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button variant="link" className="p-0 h-auto text-primary">
                      Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Blog;
