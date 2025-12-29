import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}


export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

// types/cart.ts (or inline)
export type CartItem = {
    id: number;
    name: string;
    quantity: number;
    price: number;
    stock: number;
    imageUrl: string;
    
};
export type OrderItem = {
    id: number;
    quantity: number;
    price: number;
};

export type Cart = {
    items: CartItem[];
    count: number;
    total: number;
};

export type Order = {
    id: number;
    total: number;
    items: OrderItem[];
};

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    cart: Cart | null;
    order: Order | null;
    [key: string]: unknown;
}