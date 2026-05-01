import React from 'react';
import { ExternalLink } from 'lucide-react';

interface CitationChipProps {
  source: string;
  page?: number;
}

export const CitationChip: React.FC<CitationChipProps> = ({ source, page }) => {
  return (
    <button
      className="inline-flex items-center gap-1.5 px-2 py-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium rounded-full transition-colors border border-border"
      onClick={() => {
        // Handle clicking source, e.g., open file or scroll to page
        console.log(`Opening source: ${source}, page: ${page}`);
      }}
    >
      <span className="truncate max-w-[120px]">{source}</span>
      {page && <span className="opacity-60 text-[10px]">p. {page}</span>}
      <ExternalLink size={10} className="opacity-60" />
    </button>
  );
};
