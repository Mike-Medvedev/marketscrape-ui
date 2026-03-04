import { Container, Skeleton } from "@mantine/core";
import "@/features/search/components/ResultsSkeleton.css";

export function ResultsSkeleton() {
  return (
    <Container size="xl" className="results-skeleton-container">
      <div className="results-skeleton-header">
        <Skeleton height={36} width={80} radius="md" />
        <div className="results-skeleton-header-info">
          <Skeleton height={28} width={250} />
          <Skeleton height={16} width={180} />
        </div>
        <Skeleton height={40} width={160} radius="md" />
      </div>
      <Skeleton height={16} width={100} mb="md" />
      <div className="results-skeleton-grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="results-skeleton-card">
            <Skeleton height={0} className="results-skeleton-image" />
            <div className="results-skeleton-body">
              <Skeleton height={18} width="50%" />
              <Skeleton height={14} width="80%" />
              <Skeleton height={12} width="60%" />
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
