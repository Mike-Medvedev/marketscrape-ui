import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Layout } from "../components/layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { SearchCriteria, MonitoringSettings, NotificationMethod } from "../types/search";

// Mock data store - in real app this would come from API/context
const mockSearches = [
  {
    id: "1",
    criteria: {
      query: "Fender Stratocaster",
      location: "San Francisco, CA",
      minPrice: "800",
      maxPrice: "2000",
      dateListed: "7d" as const,
    },
    settings: {
      frequency: "Every 2 hours",
      listingsPerCheck: 20,
      notifications: ["email"] as NotificationMethod[],
    },
  },
  {
    id: "2",
    criteria: {
      query: "Gibson Les Paul",
      location: "Los Angeles, CA",
      minPrice: "1500",
      maxPrice: "4000",
      dateListed: "24h" as const,
    },
    settings: {
      frequency: "Every hour",
      listingsPerCheck: 10,
      notifications: ["email", "sms"] as NotificationMethod[],
    },
  },
];

export function NewSearch() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [step, setStep] = useState(1);
  const [criteria, setCriteria] = useState<SearchCriteria>({
    query: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    dateListed: "7d",
  });
  const [settings, setSettings] = useState<MonitoringSettings>({
    frequency: "",
    listingsPerCheck: 10,
    notifications: [],
  });

  // Load existing search data when editing
  useEffect(() => {
    if (isEditing) {
      const existingSearch = mockSearches.find((s) => s.id === id);
      if (existingSearch) {
        setCriteria(existingSearch.criteria);
        setSettings(existingSearch.settings);
      }
    }
  }, [isEditing, id]);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      // Create or update search and navigate back
      if (isEditing) {
        console.log("Updating search:", id, { criteria, settings });
      } else {
        console.log("Creating search:", { criteria, settings });
      }
      navigate("/");
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate("/");
    }
  };

  const toggleNotification = (method: NotificationMethod) => {
    setSettings({
      ...settings,
      notifications: settings.notifications.includes(method)
        ? settings.notifications.filter((n) => n !== method)
        : [...settings.notifications, method],
    });
  };

  const canProceed =
    step === 1
      ? criteria.query && criteria.location
      : settings.frequency;

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                1
              </div>
              <span className="text-sm text-foreground">Search Criteria</span>
            </div>
            <div className="w-12 h-px bg-border" />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                2
              </div>
              <span className="text-sm text-foreground">Monitoring</span>
            </div>
          </div>
          <h1 className="text-3xl text-foreground">
            {step === 1 ? "Search Criteria" : "Monitoring Settings"}
          </h1>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <Label htmlFor="query" className="text-card-foreground">Search Query</Label>
                <Input
                  id="query"
                  placeholder="e.g., Fender Stratocaster"
                  value={criteria.query}
                  onChange={(e) =>
                    setCriteria({ ...criteria, query: e.target.value })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-card-foreground">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., San Francisco, CA"
                  value={criteria.location}
                  onChange={(e) =>
                    setCriteria({ ...criteria, location: e.target.value })
                  }
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minPrice" className="text-card-foreground">
                    Min Price <span className="text-muted-foreground text-xs">(optional)</span>
                  </Label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="No minimum"
                    value={criteria.minPrice}
                    onChange={(e) =>
                      setCriteria({ ...criteria, minPrice: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="maxPrice" className="text-card-foreground">
                    Max Price <span className="text-muted-foreground text-xs">(optional)</span>
                  </Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="No maximum"
                    value={criteria.maxPrice}
                    onChange={(e) =>
                      setCriteria({ ...criteria, maxPrice: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dateListed" className="text-card-foreground">Date Listed</Label>
                <Select
                  value={criteria.dateListed}
                  onValueChange={(value) =>
                    setCriteria({
                      ...criteria,
                      dateListed: value as "24h" | "7d" | "30d",
                    })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24 hours</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <Label htmlFor="frequency" className="text-card-foreground">Search Frequency</Label>
                <Select
                  value={settings.frequency}
                  onValueChange={(value) =>
                    setSettings({ ...settings, frequency: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Every 30 minutes">Every 30 minutes</SelectItem>
                    <SelectItem value="Every hour">Every hour</SelectItem>
                    <SelectItem value="Every 2 hours">Every 2 hours</SelectItem>
                    <SelectItem value="Every 6 hours">Every 6 hours</SelectItem>
                    <SelectItem value="Every 12 hours">Every 12 hours</SelectItem>
                    <SelectItem value="Daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="listingsPerCheck" className="text-card-foreground">Listings per Check</Label>
                <Input
                  id="listingsPerCheck"
                  type="number"
                  value={settings.listingsPerCheck}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      listingsPerCheck: parseInt(e.target.value) || 10,
                    })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-card-foreground">
                  Notifications <span className="text-muted-foreground text-xs">(optional)</span>
                </Label>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="email"
                      checked={settings.notifications.includes("email")}
                      onCheckedChange={() => toggleNotification("email")}
                    />
                    <Label htmlFor="email" className="cursor-pointer text-card-foreground">
                      Email
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="sms"
                      checked={settings.notifications.includes("sms")}
                      onCheckedChange={() => toggleNotification("sms")}
                    />
                    <Label htmlFor="sms" className="cursor-pointer text-card-foreground">
                      SMS
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="webhook"
                      checked={settings.notifications.includes("webhook")}
                      onCheckedChange={() => toggleNotification("webhook")}
                    />
                    <Label htmlFor="webhook" className="cursor-pointer text-card-foreground">
                      Webhook
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="gap-2 flex-1"
          >
            {step === 1 ? (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              isEditing ? "Update Search" : "Create Search"
            )}
          </Button>
        </div>
      </div>
    </Layout>
  );
}