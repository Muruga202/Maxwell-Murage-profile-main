import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Newspaper, Palette, Code, TrendingUp, Search, Grid3x3, List } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type ViewMode = "grid" | "list";
type ProjectCategory = "all" | "journalism" | "design" | "development" | "marketing";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string | null;
  project_url: string | null;
  tags: Array<{ name: string }>;
}

const PortfolioEnhanced = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [projects, setProjects] = useState<Project[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchProjects();
    fetchTags();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select(`
        *,
        portfolio_project_tags!inner(
          tags(name)
        )
      `)
      .eq('published', true);

    if (!error && data) {
      const formattedProjects = data.map(project => ({
        ...project,
        tags: project.portfolio_project_tags?.map((pt: any) => pt.tags) || []
      }));
      setProjects(formattedProjects);
    }
    setLoading(false);
  };

  const fetchTags = async () => {
    const { data } = await supabase
      .from('tags')
      .select('name')
      .order('name');
    
    if (data) {
      setTags(data.map(t => t.name));
    }
  };

  const categories = [
    { id: "all" as ProjectCategory, name: "All Projects", icon: null },
    { id: "journalism" as ProjectCategory, name: "Journalism", icon: Newspaper },
    { id: "design" as ProjectCategory, name: "Design", icon: Palette },
    { id: "development" as ProjectCategory, name: "Development", icon: Code },
    { id: "marketing" as ProjectCategory, name: "Marketing", icon: TrendingUp },
  ];

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === "all" || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       project.tags.some(tag => selectedTags.includes(tag.name));
    
    return matchesCategory && matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading projects...</div>
        </div>
      </section>
    );
  }

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

          {/* Search and View Controls */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                maxLength={100}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
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

          {/* Tags Cloud */}
          {tags.length > 0 && (
            <div className="mb-12 p-6 bg-card rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Filter by Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "secondary"}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Projects Display */}
          <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-8" : "space-y-6"}>
            {filteredProjects.map((project, index) => (
              <Card 
                key={project.id}
                className={`overflow-hidden hover-lift transition-all duration-500 ${
                  viewMode === "list" ? "flex flex-col md:flex-row" : ""
                } ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {project.image_url && (
                  <div className={`relative overflow-hidden group ${
                    viewMode === "list" ? "md:w-1/3" : ""
                  }`}>
                    <img 
                      src={project.image_url} 
                      alt={project.title}
                      className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                        viewMode === "list" ? "h-full" : "h-64"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      {project.project_url && (
                        <Button 
                          variant="secondary"
                          size="sm"
                          asChild
                          className="bg-primary text-primary-foreground hover:bg-primary-glow"
                        >
                          <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Project
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
                
                <div className={`p-6 ${viewMode === "list" ? "md:w-2/3 flex flex-col justify-center" : ""}`}>
                  <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <Badge 
                        key={tagIndex} 
                        variant="secondary"
                        className="bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No projects found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PortfolioEnhanced;
