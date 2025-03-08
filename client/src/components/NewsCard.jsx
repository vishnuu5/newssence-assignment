import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark, BookmarkCheck, Share2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const getSentimentColor = (sentiment) => {
  switch (sentiment) {
    case "positive":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "negative":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
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



const NewsCard = ({ id, title, summary, source, publishedAt, sentiment, onSave, onShare, isSaved = false }) => {
  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const sentimentClass = getSentimentColor(sentiment);
  const sentimentText = getSentimentText(sentiment);

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <Badge variant="outline" className="text-xs text-gray-500">
            {source}
          </Badge>
          <Badge className={`text-xs ${sentimentClass}`}>
            {sentimentText}
          </Badge>
        </div>
        <CardTitle className="text-lg mt-2 line-clamp-2">{title}</CardTitle>
        <CardDescription className="text-xs text-gray-500">{formattedDate}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-3">{summary}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={() => onSave({ id, title, summary, source, publishedAt, sentiment })}>
            {isSaved ? (
              <>
                <BookmarkCheck className="h-4 w-4 mr-1 text-green-600" /> Saved
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4 mr-1" /> Save
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={() => onShare(id)}>
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>
        </div>
        <Link to={`/news/${id}`}>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-1" /> Read more
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
