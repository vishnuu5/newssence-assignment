import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bookmark, Share2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const getSentimentColor = (sentiment) => {
  switch (sentiment) {
    case "positive":
      return "bg-green-100 text-green-800";
    case "negative":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getSentimentText = (sentiment) => {
  switch (sentiment) {
    case "positive":
      return "Positive";
    case "negative":
      return "Negative";
    default:
      return "Neutral";
  }
};

const NewsDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/news/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch article");
        }

        const data = await response.json();
        setArticle(data);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Failed to load article. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  const handleSaveArticle = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/news/${id}/save`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to save article");
      }

      toast({
        title: "Article saved",
        description: "The article has been added to your saved items",
      });
    } catch (err) {
      console.error("Error saving article:", err);
      toast({
        title: "Error",
        description: "Failed to save article. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShareArticle = () => {
    navigator.clipboard.writeText(`http://localhost:5173/news/:${id}`);
    toast({
      title: "Link copied",
      description: "Article link has been copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-10 text-red-500">
          <AlertCircle className="h-10 w-10 mx-auto mb-4" />
          <p>{error || "Article not found"}</p>
          <Button onClick={() => navigate(-1)} variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <Button onClick={() => navigate(-1)} variant="outline" className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to News
      </Button>
      
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="outline">{article.source}</Badge>
            <Badge className={getSentimentColor(article.sentiment)}>{getSentimentText(article.sentiment)}</Badge>
            {article.topics.map((topic) => (
              <Badge key={topic} variant="secondary">{topic}</Badge>
            ))}
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold">{article.title}</CardTitle>
          <CardDescription>{formattedDate}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="text-lg font-medium mb-6">{article.summary}</div>
          <div className="prose max-w-none">
            {article.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-6 border-t">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleSaveArticle}>
              <Bookmark className="h-4 w-4 mr-2" />
              Save Article
            </Button>
            <Button variant="outline" onClick={handleShareArticle}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
          <Button variant="ghost" onClick={() => window.open(article.url, "_blank")}>
            Read Original
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NewsDetail;
