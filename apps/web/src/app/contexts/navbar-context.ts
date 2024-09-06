import React, { createContext } from 'react';

export interface NavbarContextType {
    links: { name: string ; path: string }[];
    setLinks: React.Dispatch<React.SetStateAction<{ name: string ; path: string }[]>>;
}

const NavbarContext = createContext<NavbarContextType | null>(null);

export default NavbarContext;