// CartContext.tsx
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext<{
    count: number;
    setCount: React.Dispatch<React.SetStateAction<number>>
}>({ count: 0, setCount: ()=> {} });

export const CartProvider = ({ children }: any) => {
    const [count, setCount] = useState(0);
    return <CartContext.Provider value={{ count, setCount }}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
