'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
    id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
    variant?: string;
    stock: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string, variant?: string) => void;
    updateQuantity: (id: string, quantity: number, variant?: string) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('shopping-cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Error loading cart:', error);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('shopping-cart', JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addToCart = (newItem: CartItem) => {
        setItems((currentItems) => {
            const existingIndex = currentItems.findIndex(
                (item) => item.id === newItem.id && item.variant === newItem.variant
            );

            if (existingIndex > -1) {
                // Item already exists, update quantity
                const updated = [...currentItems];
                const newQuantity = updated[existingIndex].quantity + newItem.quantity;
                updated[existingIndex].quantity = Math.min(newQuantity, newItem.stock);
                return updated;
            } else {
                // New item
                return [...currentItems, newItem];
            }
        });
    };

    const removeFromCart = (id: string, variant?: string) => {
        setItems((currentItems) =>
            currentItems.filter((item) => !(item.id === id && item.variant === variant))
        );
    };

    const updateQuantity = (id: string, quantity: number, variant?: string) => {
        if (quantity <= 0) {
            removeFromCart(id, variant);
            return;
        }

        setItems((currentItems) =>
            currentItems.map((item) =>
                item.id === id && item.variant === variant
                    ? { ...item, quantity: Math.min(quantity, item.stock) }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
