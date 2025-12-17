import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, ArrowLeft, Share2, Twitter, Linkedin, Facebook } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const commentSchema = z.object({
  content: z.string().trim().min(1, "Comment cannot be empty").max(1000, "Comment must be less than 1000 characters")
});

interface BlogPostData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  read_time: string;
  cover_image: string | null;
  published_at: string;
  author: {
    full_name: string;
    email: string;
  } | null;
  tags: Array<{ name: string }>;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostData[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchPost();
      fetchComments();
    }
  }, [slug]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        profiles:author_id(full_name, email),
        blog_post_tags(
          tags(name)
        )
      `)
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (!error && data) {
      const formattedPost = {
        ...data,
        author: data.profiles,
        tags: data.blog_post_tags?.map((pt: any) => pt.tags) || []
      };
      setPost(formattedPost);
      fetchRelatedPosts(data.category);
    }
    setLoading(false);
  };

  const fetchRelatedPosts = async (category: string) => {
    const { data } = await supabase
      .from('blog_posts')
      .select(`
        *,
        profiles:author_id(full_name, email),
        blog_post_tags(
          tags(name)
        )
      `)
      .eq('category', category)
      .eq('published', true)
      .neq('slug', slug)
      .limit(3);

    if (data) {
      const formatted = data.map(p => ({
        ...p,
        author: p.profiles,
        tags: p.blog_post_tags?.map((pt: any) => pt.tags) || []
      }));
      setRelatedPosts(formatted);
    }
  };

  const fetchComments = async () => {
    const { data: postData } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single();

    if (postData) {
      const { data } = await supabase
        .from('comments')
        .select('*, profiles(full_name, email)')
        .eq('blog_post_id', postData.id)
        .order('created_at', { ascending: false });

      if (data) {
        setComments(data);
      }
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to leave a comment.",
        variant: "destructive"
      });
      return;
    }

    try {
      commentSchema.parse({ content: newComment });
      
      const { error } = await supabase
        .from('comments')
        .insert({
          blog_post_id: post?.id,
          user_id: user.id,
          content: newComment
        });

      if (error) throw error;

      toast({ title: "Comment posted successfully!" });
      setNewComment("");
      fetchComments();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.issues[0].message,
          variant: "destructive"
        });
      }
    }
  };

  const sharePost = (platform: string) => {
    const url = window.location.href;
    const text = encodeURIComponent(post?.title || "");
    
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <Link to="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {post.cover_image && (
          <img 
            src={post.cover_image} 
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}

        <Badge className="mb-4">{post.category}</Badge>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date(post.published_at).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {post.read_time}
          </span>
          {post.author && <span>By {post.author.full_name}</span>}
        </div>

        <div className="flex gap-2 mb-8">
          {post.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">{tag.name}</Badge>
          ))}
        </div>

        <Card className="p-8 mb-8">
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        </Card>

        <Card className="p-6 mb-12">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share this post
          </h3>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => sharePost('twitter')}>
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>
            <Button variant="outline" size="sm" onClick={() => sharePost('linkedin')}>
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </Button>
            <Button variant="outline" size="sm" onClick={() => sharePost('facebook')}>
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </Button>
          </div>
        </Card>

        {relatedPosts.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Related Posts</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link key={related.id} to={`/blog/${related.slug}`}>
                  <Card className="hover-lift h-full p-4">
                    <h4 className="font-semibold mb-2 line-clamp-2">{related.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{related.excerpt}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Card className="p-8">
          <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>
          
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="mb-4"
                rows={4}
                maxLength={1000}
              />
              <Button type="submit">Post Comment</Button>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-muted rounded-lg">
              <p className="text-center">
                <Link to="/auth" className="text-primary hover:underline">
                  Sign in
                </Link>
                {" "}to leave a comment
              </p>
            </div>
          )}

          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <Avatar>
                  <AvatarFallback>
                    {comment.profiles.full_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{comment.profiles.full_name}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-foreground">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BlogPost;
