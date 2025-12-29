
import { CartItem } from "@/types";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

const HeaderCartButton = ({
  cartItems,
  onClick,
}: {
  cartItems: CartItem[];
  onClick: () => void;
}) => {
  const [animate, setAnimate] = useState(false);
  const count = cartItems.length;

  useEffect(() => {
    if (count === 0) return;

    setAnimate(true);
    const t = setTimeout(() => setAnimate(false), 200);

    return () => clearTimeout(t);
  }, [count]);

  return (
    <span className="relative" onClick={onClick}>
        <ShoppingCart className="text-gray-600 text-xl cursor-pointer transition-transform hover:scale-125" />

        {count > 0 && (
        <span
            className={`absolute left-[1.5px] top-[4px] rounded-full bg-black px-[6px] py-[2px] text-[0.6rem] font-bold text-white
            transition-transform duration-200
            ${animate ? "scale-125" : "scale-100"}`}
        >
            {count}
        </span>
        )}
    </span>
  );
};

export default HeaderCartButton;
