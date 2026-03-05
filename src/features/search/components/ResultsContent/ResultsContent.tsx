import { useNavigate, useParams } from "react-router";
import { Container, Loader, Text, Title } from "@mantine/core";
import {
  IconArrowLeft,
  IconPlayerPlay,
  IconSearch,
} from "@tabler/icons-react";
import { ListingCard } from "@/features/search/components/ListingCard/ListingCard";
import {
  useSearch,
  useExecuteSearch,
} from "@/features/search/hooks/search.hook";
import "./ResultsContent.css";

export function ResultsContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: searchResponse, isLoading: searchLoading } = useSearch(id);
  const search = searchResponse?.data;
  const executeMutation = useExecuteSearch();

  const listings = executeMutation.data?.data.listings ?? [];

  const handleExecute = () => {
    if (!search) return;

    const minPrice = Number(search.criteria.minPrice);

    executeMutation.mutate({
      body: {
        query: search.criteria.query,
        locationId: search.criteria.location,
        ...(minPrice > 0 && { minPrice }),
        ...(search.settings.listingsPerCheck > 0 && {
          pageCount: search.settings.listingsPerCheck,
        }),
      },
    });
  };

  if (searchLoading) return null;

  return (
    <Container size="xl" className="results-container">
      <div className="results-header">
        <button
          className="results-back-button"
          onClick={() => navigate("/")}
        >
          <IconArrowLeft size={18} />
          <span>Back</span>
        </button>

        <div className="results-header-info">
          <Title order={2} className="results-title">
            {search?.criteria.query}
          </Title>
          <Text size="sm" className="results-subtitle">
            {search?.criteria.location}
            {(search?.criteria.minPrice || search?.criteria.maxPrice) && (
              <>
                {" \u2022 "}
                {search?.criteria.minPrice
                  ? `$${search.criteria.minPrice}`
                  : "Any"}
                {" - "}
                {search?.criteria.maxPrice
                  ? `$${search.criteria.maxPrice}`
                  : "Any"}
              </>
            )}
          </Text>
        </div>

        <button
          className="results-execute-button"
          onClick={handleExecute}
          disabled={executeMutation.isPending}
        >
          {executeMutation.isPending ? (
            <Loader size={16} color="dark" />
          ) : (
            <IconPlayerPlay size={16} />
          )}
          <span>{executeMutation.isPending ? "Searching..." : "Execute Search"}</span>
        </button>
      </div>

      {executeMutation.isPending && listings.length === 0 ? (
        <div className="results-loading">
          <div className="results-loading-spinner">
            <Loader size={32} color="yellow" />
          </div>
          <Title order={4} className="results-loading-title">
            Searching marketplace...
          </Title>
          <Text size="sm" c="dimmed">
            This may take a moment
          </Text>
        </div>
      ) : listings.length > 0 ? (
        <>
          <Text size="sm" c="dimmed" className="results-count">
            {listings.length} listing{listings.length !== 1 ? "s" : ""} found
          </Text>
          <div className="results-grid">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </>
      ) : (
        <div className="results-empty">
          <div className="results-empty-icon">
            <IconSearch size={32} color="var(--muted-foreground)" />
          </div>
          <Title order={3} className="results-empty-title">
            {executeMutation.isIdle ? "Ready to search" : "No listings found"}
          </Title>
          <Text size="sm" c="dimmed" className="results-empty-text">
            {executeMutation.isIdle
              ? "Hit execute to pull the latest marketplace listings"
              : "Try executing the search again or adjusting your criteria"}
          </Text>
          <button className="results-execute-button" onClick={handleExecute}>
            <IconPlayerPlay size={16} />
            <span>Execute Search</span>
          </button>
        </div>
      )}
    </Container>
  );
}
