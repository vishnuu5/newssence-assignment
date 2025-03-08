import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewsFeed from "@/components/NewsFeed";
import { Calendar, BookmarkIcon, TrendingUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import NewsCard from "@/components/NewsCard";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("feed");
  const [savedArticles, setSavedArticles] = useState([]);
  const [dailyDigest, setDailyDigest] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedItems = localStorage.getItem("savedArticles");
    if (savedItems) {
      setSavedArticles(JSON.parse(savedItems));
    }
    generateDailyDigest();
  }, []);

  useEffect(() => {
    localStorage.setItem("savedArticles", JSON.stringify(savedArticles));
  }, [savedArticles]);

  const handleSaveArticle = (article) => {
    const isAlreadySaved = savedArticles.some((item) => item.id === article.id);
    if (!isAlreadySaved) {
      const updatedArticles = [...savedArticles, article];
      setSavedArticles(updatedArticles);
      localStorage.setItem("savedArticles", JSON.stringify(updatedArticles)); // Ensure localStorage is updated
      toast({ title: "Article saved", description: "The article has been added to your saved items" });
    } else {
      toast({ title: "Already saved", description: "This article is already in your saved items" });
    }
  };
  

  const handleRemoveSaved = (id) => {
    setSavedArticles(savedArticles.filter(article => article.id !== id));
    toast({ title: "Article removed", description: "The article has been removed from your saved items" });
  };

  const handleShareArticle = (id) => {
    navigator.clipboard.writeText(`http://localhost:5173/news/${id}`);
    toast({ title: "Link copied", description: "Article link has been copied to clipboard" });
  };

  const generateDailyDigest = () => {
    const mockDigest = [
      { id: "digest-1", title: "Top Story: Global Markets Rally", summary: "Markets see gains after Fed announcement.", source: "Financial Times", publishedAt: new Date().toISOString(), sentiment: "positive" },
      { id: "digest-2", title: "Tech Earnings Exceed Expectations", summary: "Major tech firms report strong earnings.", source: "Tech Insider", publishedAt: new Date().toISOString(), sentiment: "positive" },
      { id: "digest-3", title: "Climate Report: New Policies Needed", summary: "Report calls for more aggressive action.", source: "Science Daily", publishedAt: new Date().toISOString(), sentiment: "neutral" }
    ];
    setDailyDigest(mockDigest);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Personalized News Feed</h1>
      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="feed" onClick={() => setActiveTab("feed")}><TrendingUp className="h-4 w-4 mr-2" />News Feed</TabsTrigger>
          <TabsTrigger value="saved" onClick={() => setActiveTab("saved")}><BookmarkIcon className="h-4 w-4 mr-2" />Saved Articles</TabsTrigger>
          <TabsTrigger value="daily" onClick={() => setActiveTab("daily")}><Calendar className="h-4 w-4 mr-2" />Daily Digest</TabsTrigger>
        </TabsList>
        <TabsContent value="feed" className="space-y-6">
          <NewsFeed onSaveArticle={handleSaveArticle} />
        </TabsContent>
        <TabsContent value="saved" className="space-y-6">
          {savedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedArticles.map(article => (
                <NewsCard key={article.id} {...article} onSave={() => handleRemoveSaved(article.id)} onShare={() => handleShareArticle(article.id)} isSaved />
              ))}
            </div>
          ) : <p className="text-gray-600 text-center py-10">No saved articles yet.</p>}
        </TabsContent>
        <TabsContent value="daily" className="space-y-6">
          {dailyDigest.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Today's Top Stories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dailyDigest.map(article => (
                  <NewsCard 
                  key={article.id} 
                  {...article} 
                  onSave={() => handleSaveArticle(article)} 
                  onShare={() => handleShareArticle(article.id)} 
                  isSaved={savedArticles.some(item => item.id === article.id)} 
                />
                
                ))}
              </div>
            </div>
          ) : <p className="text-gray-600 text-center py-10">Daily digest loading...</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
