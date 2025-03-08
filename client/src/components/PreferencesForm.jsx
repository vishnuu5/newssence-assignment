import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const PreferencesForm = () => {
  const [preferences, setPreferences] = useState({
    topics: [],
    sources: [],
    keywords: [],
  });
  const [newTopic, setNewTopic] = useState("");
  const [newSource, setNewSource] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://newssence-assignment-backend.onrender.com/api/preferences", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch preferences");
        }

        const data = await response.json();
        setPreferences(data);
      } catch (err) {
        console.error("Error fetching preferences:", err);
        toast({
          title: "Error",
          description: "Failed to load your preferences",
          variant: "destructive",
        });
      }
    };

    fetchPreferences();
  }, [toast]);

  const handleSavePreferences = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("https://newssence-assignment-backend.onrender.com/api/preferences", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error("Failed to update preferences");
      }

      toast({
        title: "Preferences updated",
        description: "Your news preferences have been saved",
      });
    } catch (err) {
      console.error("Error updating preferences:", err);
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addPreference = (type, value) => {
    if (value && !preferences[type].includes(value)) {
      setPreferences({
        ...preferences,
        [type]: [...preferences[type], value],
      });
    }
  };

  const removePreference = (type, value) => {
    setPreferences({
      ...preferences,
      [type]: preferences[type].filter((item) => item !== value),
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">News Preferences</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["topics", "sources", "keywords"].map((type) => (
          <Card key={type}>
            <CardHeader>
              <CardTitle>{type.charAt(0).toUpperCase() + type.slice(1)}</CardTitle>
              <CardDescription>
                {type === "topics"
                  ? "Select topics that interest you"
                  : type === "sources"
                  ? "Choose your preferred news sources"
                  : "Add keywords to filter articles"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    value={type === "topics" ? newTopic : type === "sources" ? newSource : newKeyword}
                    onChange={(e) =>
                      type === "topics"
                        ? setNewTopic(e.target.value)
                        : type === "sources"
                        ? setNewSource(e.target.value)
                        : setNewKeyword(e.target.value)
                    }
                    placeholder={`Add a ${type.slice(0, -1)}...`}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      addPreference(type, type === "topics" ? newTopic : type === "sources" ? newSource : newKeyword)
                    }
                  />
                  <Button
                    onClick={() =>
                      addPreference(type, type === "topics" ? newTopic : type === "sources" ? newSource : newKeyword)
                    }
                    type="button"
                  >
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {preferences[type].map((item) => (
                    <Badge key={item} className="py-1 px-2 flex items-center gap-1">
                      {item}
                      <button onClick={() => removePreference(type, item)} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {preferences[type].length === 0 && (
                    <span className="text-sm text-gray-500">No {type} added yet</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleSavePreferences} disabled={loading}>
          {loading ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
};

export default PreferencesForm;
