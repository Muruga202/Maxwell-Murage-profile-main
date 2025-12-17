import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  image_url: string | null;
  project_url: string | null;
  featured: boolean;
  published: boolean;
}

const PortfolioManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProjects(data);
  };

  const handleSave = async () => {
    if (!editingProject?.title || !editingProject?.slug || !editingProject?.description) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const projectData = {
      ...editingProject,
      updated_at: new Date().toISOString()
    };

    if (isCreating) {
      const { error } = await supabase.from('portfolio_projects').insert([projectData as any]);
      if (error) {
        toast({ title: "Error creating project", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Project created successfully!" });
    } else {
      const { error } = await supabase
        .from('portfolio_projects')
        .update(projectData)
        .eq('id', editingProject.id);
      
      if (error) {
        toast({ title: "Error updating project", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Project updated successfully!" });
    }

    setEditingProject(null);
    setIsCreating(false);
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const { error } = await supabase.from('portfolio_projects').delete().eq('id', id);
    
    if (error) {
      toast({ title: "Error deleting project", description: error.message, variant: "destructive" });
      return;
    }
    
    toast({ title: "Project deleted successfully" });
    fetchProjects();
  };

  const startCreate = () => {
    setEditingProject({
      title: '',
      slug: '',
      description: '',
      category: 'journalism',
      image_url: null,
      project_url: null,
      featured: false,
      published: false
    });
    setIsCreating(true);
  };

  if (editingProject) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {isCreating ? 'Create New Project' : 'Edit Project'}
          </h2>
          <div className="flex gap-2">
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={() => {
              setEditingProject(null);
              setIsCreating(false);
            }}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={editingProject.title || ''}
                onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={editingProject.slug || ''}
                onChange={(e) => setEditingProject({...editingProject, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                maxLength={200}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={editingProject.description || ''}
              onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
              rows={5}
              maxLength={1000}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={editingProject.category}
                onValueChange={(value) => setEditingProject({...editingProject, category: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="journalism">Journalism</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={editingProject.image_url || ''}
                onChange={(e) => setEditingProject({...editingProject, image_url: e.target.value})}
                placeholder="https://..."
                maxLength={500}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectUrl">Project URL</Label>
              <Input
                id="projectUrl"
                value={editingProject.project_url || ''}
                onChange={(e) => setEditingProject({...editingProject, project_url: e.target.value})}
                placeholder="https://..."
                maxLength={500}
              />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={editingProject.featured || false}
                onCheckedChange={(checked) => setEditingProject({...editingProject, featured: checked})}
              />
              <Label htmlFor="featured">Featured</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={editingProject.published || false}
                onCheckedChange={(checked) => setEditingProject({...editingProject, published: checked})}
              />
              <Label htmlFor="published">Published</Label>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Portfolio Projects</h2>
        <Button onClick={startCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  {project.featured && <Badge variant="secondary">Featured</Badge>}
                  {project.published ? (
                    <Badge>Published</Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-2">{project.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="capitalize">{project.category}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingProject(project)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PortfolioManager;
