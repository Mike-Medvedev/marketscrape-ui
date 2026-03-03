import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { Layout } from "../components/layout";
import { SearchCard } from "../components/search-card";
import { SessionAlert } from "../components/session-alert";
import { IdentityAbsorber } from "../components/identity-absorber";
import { NewSearchButton } from "../components/new-search-button";
import { ActiveSearch } from "../types/search";

const mockSearches: ActiveSearch[] = [
  {
    id: "1",
    status: "running",
    criteria: {
      query: "Fender Stratocaster",
      location: "San Francisco, CA",
      minPrice: "800",
      maxPrice: "2000",
      dateListed: "7d",
    },
    settings: {
      frequency: "Every 2 hours",
      listingsPerCheck: 20,
      notifications: ["email"],
    },
    lastRun: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: "2",
    status: "refresh",
    criteria: {
      query: "Gibson Les Paul",
      location: "Los Angeles, CA",
      minPrice: "1500",
      maxPrice: "4000",
      dateListed: "24h",
    },
    settings: {
      frequency: "Every hour",
      listingsPerCheck: 10,
      notifications: ["email", "sms"],
    },
    lastRun: new Date(Date.now() - 1000 * 60 * 120),
  },
  {
    id: "3",
    status: "error",
    criteria: {
      query: "Martin D-28",
      location: "Austin, TX",
      minPrice: "2000",
      maxPrice: "5000",
      dateListed: "7d",
    },
    settings: {
      frequency: "Every 6 hours",
      listingsPerCheck: 15,
      notifications: ["webhook"],
    },
    lastRun: new Date(Date.now() - 1000 * 60 * 360),
  },
];

export function Dashboard() {
  const navigate = useNavigate();
  const [searches, setSearches] = useState<ActiveSearch[]>(mockSearches);
  const [showIdentityModal, setShowIdentityModal] = useState(false);

  const hasExpiredSession = searches.some((s) => s.status === "refresh");

  const handleDelete = (id: string) => {
    setSearches(searches.filter((s) => s.id !== id));
  };

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const handleQuickSync = () => {
    setShowIdentityModal(true);
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <NewSearchButton onClick={() => navigate("/new")}>
            New Search
          </NewSearchButton>
        </div>

        {hasExpiredSession && (
          <div className="mb-6">
            <SessionAlert onQuickSync={handleQuickSync} onClose={() => {}} />
          </div>
        )}

        <IdentityAbsorber
          isOpen={showIdentityModal}
          onClose={() => setShowIdentityModal(false)}
          onQuickSync={handleQuickSync}
        />

        {searches.length > 0 ? (
          <div className="grid gap-6">
            {searches.map((search) => (
              <SearchCard
                key={search.id}
                search={search}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-6">
              <SearchIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg text-foreground mb-2">No active searches</h3>
            <p className="text-sm text-muted-foreground mb-6">Create your first search to start monitoring</p>
            <NewSearchButton onClick={() => navigate("/new")} size="large">
              Create Search
            </NewSearchButton>
          </div>
        )}
      </div>
    </Layout>
  );
}