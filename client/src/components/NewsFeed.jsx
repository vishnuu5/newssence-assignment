import { useState, useEffect } from "react";
import NewsCard from "./NewsCard";
import { Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const NewsFeed = ({ onSaveArticle }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const [savedArticles, setSavedArticles] = useState([]);

  useEffect(() => {
    const savedItems = localStorage.getItem("savedArticles");
    if (savedItems) {
      const articles = JSON.parse(savedItems);
      setSavedArticles(articles.map((article) => article.id));
    }

    const fetchNews = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/news", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }

        const data = await response.json();
        setNews(data);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleSaveArticle = async (id) => {
    try {
      const article = news.find((item) => item.id === id);

      if (!article) return;

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

      onSaveArticle({
        id: article.id,
        title: article.title,
        summary: article.summary,
        source: article.source,
        publishedAt: article.publishedAt,
        sentiment: article.sentiment,
      });

      setSavedArticles([...savedArticles, id]);
    } catch (err) {
      console.error("Error saving article:", err);
      toast({
        title: "Error",
        description: "Failed to save article. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShareArticle = (id) => {
    navigator.clipboard.writeText(`http://localhost:5173/news/:${id}`);
    toast({
      title: "Link copied",
      description: "Article link has been copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading news...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[300px] text-red-500">
        <AlertCircle className="h-6 w-6 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">No news articles found. Try updating your preferences.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((item, index) => (
  <NewsCard
    key={item._id || index}
    id={item._id}
    title={item.title}
    summary={item.summary}
    source={item.source}
    publishedAt={item.publishedAt}
    sentiment={item.sentiment}
    onSave={handleSaveArticle}
    onShare={handleShareArticle}
    isSaved={savedArticles.includes(item.id)}
  />
))}

    </div>
  );
};

export default NewsFeed;
