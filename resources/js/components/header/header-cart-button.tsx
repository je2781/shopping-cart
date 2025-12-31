
import { useCart } from "@/store/cart-context";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

const HeaderCartButton = ({
  onClick
}: {
  onClick: () => void
}) => {
  const [animate, setAnimate] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    if (count === 0) return;

    setAnimate(true);
    const t = setTimeout(() => setAnimate(false), 200);

    return () => clearTimeout(t);
  }, [count]);

  return (
    <button type="button" className="relative pointer-events-auto z-50 cursor-pointer" onClick={onClick}>
        <ShoppingCart className="text-gray-600 text-xl pointer-events-none" />

        {count > 0 && (
        <span
            className={`absolute -right-1 -top-1 rounded-full bg-black px-[6px] py-[2px] text-[0.6rem] font-bold text-white
            transition-transform duration-200
            ${animate ? "scale-125" : "scale-100"}`}
        >
            {count}
        </span>
        )}
    </button>
  );
};

export default HeaderCartButton;
