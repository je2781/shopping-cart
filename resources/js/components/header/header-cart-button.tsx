
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

const HeaderCartButton = ({
  noOfCartItems,
}: {
  noOfCartItems: number;
}) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (noOfCartItems === 0) return;

    setAnimate(true);
    const t = setTimeout(() => setAnimate(false), 200);

    return () => clearTimeout(t);
  }, [noOfCartItems]);

  return (
    <span className="relative">
        <ShoppingCart className="text-gray-600 text-xl cursor-pointer transition-transform hover:scale-125" />

        {noOfCartItems > 0 && (
        <span
            className={`absolute -right-1 -top-1 rounded-full bg-black px-[6px] py-[2px] text-[0.6rem] font-bold text-white
            transition-transform duration-200
            ${animate ? "scale-125" : "scale-100"}`}
        >
            {noOfCartItems}
        </span>
        )}
    </span>
  );
};

export default HeaderCartButton;
