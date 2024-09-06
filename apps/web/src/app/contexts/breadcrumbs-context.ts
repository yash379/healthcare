import React, { createContext } from 'react';

export interface BreadcrumbsContextType {
    breadcrumbs: { to?: string | undefined; label: string }[];
    setBreadcrumbs: React.Dispatch<React.SetStateAction<{ to?: string | undefined; label: string }[]>>;
  }

const BreadcrumbsContext = createContext<BreadcrumbsContextType | null>(null);

export default BreadcrumbsContext;

