"use client";

import { useState } from "react";
import Image from "next/image";
import { TRAILER_CONFIG } from "../config/trailerConfig";

interface TrailerThumbnailProps {
  videoId?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function TrailerThumbnail({
  videoId = TRAILER_CONFIG.videoId,
  alt,
  className = "object-cover",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 1024px, 1280px",
  priority = false,
}: TrailerThumbnailProps) {
  const candidates = TRAILER_CONFIG.getThumbnailCandidates(videoId);
  const [candidateIndex, setCandidateIndex] = useState(0);

  const currentSrc = candidates[candidateIndex] || candidates[0];

  const handleError = () => {
    // If current thumbnail fails to load (e.g. 404), advance to next fallback candidate
    if (candidateIndex < candidates.length - 1) {
      setCandidateIndex((prev) => prev + 1);
    }
  };

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      priority={priority}
      onError={handleError}
    />
  );
}
