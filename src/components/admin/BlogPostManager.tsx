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
import { useAuth } from "@/hooks/useAuth";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  featured: boolean;
  published: boolean;
  read_time: string;
  cover_image: string | null;
}

const BlogPostManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setPosts(data);
  };

  const handleSave = async () => {
    if (!editingPost?.title || !editingPost?.slug || !editingPost?.content) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const postData = {
      ...editingPost,
      author_id: user?.id,
      updated_at: new Date().toISOString(),
      published_at: editingPost.published ? new Date().toISOString() : null
    };

    if (isCreating) {
      const { error } = await supabase.from('blog_posts').insert([postData as any]);
      if (error) {
        toast({ title: "Error creating post", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Post created successfully!" });
    } else {
      const { error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', editingPost.id);
      
      if (error) {
        toast({ title: "Error updating post", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Post updated successfully!" });
    }

    setEditingPost(null);
    setIsCreating(false);
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    
    if (error) {
      toast({ title: "Error deleting post", description: error.message, variant: "destructive" });
      return;
    }
    
    toast({ title: "Post deleted successfully" });
    fetchPosts();
  };

  const startCreate = () => {
    setEditingPost({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'journalism',
      featured: false,
      published: false,
      read_time: '5 min read',
      cover_image: null
    });
    setIsCreating(true);
  };

  if (editingPost) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {isCreating ? 'Create New Post' : 'Edit Post'}
          </h2>
          <div className="flex gap-2">
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={() => {
              setEditingPost(null);
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
                value={editingPost.title || ''}
                onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={editingPost.slug || ''}
                onChange={(e) => setEditingPost({...editingPost, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                maxLength={200}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={editingPost.excerpt || ''}
              onChange={(e) => setEditingPost({...editingPost, excerpt: e.target.value})}
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={editingPost.content || ''}
              onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
              rows={15}
              maxLength={10000}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={editingPost.category}
                onValueChange={(value) => setEditingPost({...editingPost, category: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="journalism">Journalism</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="readTime">Read Time</Label>
              <Input
                id="readTime"
                value={editingPost.read_time || ''}
                onChange={(e) => setEditingPost({...editingPost, read_time: e.target.value})}
                placeholder="5 min read"
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input
                id="coverImage"
                value={editingPost.cover_image || ''}
                onChange={(e) => setEditingPost({...editingPost, cover_image: e.target.value})}
                placeholder="https://..."
                maxLength={500}
              />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={editingPost.featured || false}
                onCheckedChange={(checked) => setEditingPost({...editingPost, featured: checked})}
              />
              <Label htmlFor="featured">Featured</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={editingPost.published || false}
                onCheckedChange={(checked) => setEditingPost({...editingPost, published: checked})}
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
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <Button onClick={startCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold">{post.title}</h3>
                  {post.featured && <Badge variant="secondary">Featured</Badge>}
                  {post.published ? (
                    <Badge>Published</Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-2">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="capitalize">{post.category}</span>
                  <span>{post.read_time}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingPost(post)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
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

export default BlogPostManager;
