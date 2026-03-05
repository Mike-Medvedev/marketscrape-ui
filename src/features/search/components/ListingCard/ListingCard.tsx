import { IconMapPin, IconExternalLink } from "@tabler/icons-react";
import type { Listing } from "@/features/search/search.types";
import "./ListingCard.css";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <a
      href={listing.url}
      target="_blank"
      rel="noopener noreferrer"
      className="listing-card"
    >
      <div className="listing-card-image-wrapper">
        <img
          src={listing.primaryPhotoUri}
          alt={listing.title}
          className="listing-card-image"
          loading="lazy"
        />
        <div className="listing-card-external">
          <IconExternalLink size={14} />
        </div>
      </div>
      <div className="listing-card-body">
        <p className="listing-card-price">{listing.price}</p>
        <p className="listing-card-title">{listing.title}</p>
        <div className="listing-card-location">
          <IconMapPin size={12} />
          <span>
            {typeof listing.location === 'string'
              ? listing.location
              : [listing.location.city, listing.location.state].filter(Boolean).join(', ') || '—'}
          </span>
        </div>
      </div>
    </a>
  );
}
