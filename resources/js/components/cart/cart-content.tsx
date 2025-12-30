import { useState, useMemo, useEffect, useRef } from "react";

import "./cart.css";
import { router, useForm } from "@inertiajs/react";
import { debounce, set } from "lodash-es";
import { CartItem, OrderItem } from "@/types";
import { Trash2Icon } from "lucide-react";
import { route } from "ziggy-js";
import { home } from "@/routes";

export default function CartComponent({ total, cartItems }: { total: number, cartItems: CartItem[] }) {
    const [totalAmount, setTotalAmount] = useState(total);
    const [loader, setLoader] = useState(false);
    const _isInit = useRef(true);

    const { data, setData } = useForm<{
        cartItems: CartItem[];
        orderItems: OrderItem[];
        operation?: 'add' | 'deduct' | 'remove';
    }>({
        cartItems,
        orderItems: [],
    });

    
    const [quantities, setQuantities] = useState<Record<number, number>>(
      Object.fromEntries(cartItems.map((item) => [item.id, item.quantity]))
    );

    const [itemTotalAmounts, setItemTotalAmounts] = useState<Record<number, number>>(
      Object.fromEntries(cartItems.map(
        (item) => [item.id, item.quantity * item.price]
      ))
    );


    useEffect(() => {
      if (_isInit.current) return;

      let timer = setTimeout(() => {
        router.post('/cart', data,{
            preserveScroll: true,
            preserveState: true,
            onStart: () => setLoader(true),
            onFinish: () => setLoader(false),
          });
      }, 200);
      
      
      // Cleanup debounce on unmount
      return () => {
          clearTimeout(timer);
      };
    }, [data.cartItems]);

    useEffect(() => {
      if (_isInit.current) return;

      router.post('/checkout', {
        items: data.orderItems,
        total: totalAmount
      }, {
        preserveScroll: true,
        preserveState: true,
        onStart: () => setLoader(true),
        onFinish: () => setLoader(false),
      });
    }, [data.orderItems]);
    

    useEffect(() => {
         //change initial ref after first render
      _isInit.current = false;
    }, []);


    const syncQuantity = (productId: number, quantity: number, operation: 'add' | 'deduct' | 'remove') => {
      setData(prev => ({
          ...prev,
          cartItems: prev.cartItems.map(i =>
              i.id === productId ? { ...i, quantity } : i
          ),
          operation
      }));

    };


    const updateQuantity = (product: CartItem, operation: 'add' | 'deduct' | 'remove', nextQty: number) => {

      // Instant UI update
      setQuantities(q => {
        if(operation === 'remove'){
          
          const { [product.id]: _, ...rest } = q;

          return rest;
        }

        return{
        ...q,
        [product.id]: nextQty,
        };
      });

      setItemTotalAmounts(t => {
        if(operation === 'remove'){
          const {[product.id]: _, ...rest} = t;

          return rest;
        }

        return {
          ...t,
          [product.id]: nextQty * product.price,
        };
      });

      let updatedItemTotalAmounts: Record<number, number> = {};

      if(operation === 'remove'){
        const {[product.id]: _, ...rest} = itemTotalAmounts;

        updatedItemTotalAmounts = rest;
      }else{

        updatedItemTotalAmounts = {
          ...itemTotalAmounts,
          [product.id]: nextQty * product.price,
        };
      }

      
      setTotalAmount(Object.values(
        updatedItemTotalAmounts
      ).reduce((acc, val) => acc + val, 0));

      // Debounced form sync
      syncQuantity(product.id, nextQty, operation);
    };

    const handleCheckout =  () => {
        setData(prev => ({
          ...prev,
          orderItems: prev.cartItems.map(i => ({
            id: i.id,
            quantity: quantities[i.id],
            price: i.price,
          })),
        }));  
    
    }         



    return (
    <>
      {totalAmount === 0 ? (
        <main className="min-h-screen w-full container mx-auto pl-2 pr-3 lg:pl-0 lg:pr-6 md:pt-12 pt-5 flex flex-col gap-y-5 justify-center items-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
          <i className="fa-solid cursor-pointer fa-bag-shopping text-gray-600 text-3xl"></i>
          <h1 className="font-sans text-2xl italic">Cart is Empty!</h1>
          <button onClick={() => router.visit(home())} className="cursor-pointer bg-gray-700 text-[1rem] font-sans text-white px-7 py-3 hover:ring-2 ring-gray-700 border-0">
            Start shopping
          </button>
        </main>
      ) : (
        <main className="min-h-screen w-full container mx-auto md:pl-16 px-8 md:pt-12 pt-5 pb-9 flex flex-col gap-y-9 opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
          <header className="flex md:flex-row flex-col gap-y-5 justify-between items-start md:items-center pt-6 w-full">
            <h1 className="font-sans md:text-4xl text-2xl text-gray-600">
              Your Cart
            </h1>
          </header>
          <section className="w-full">
            <header
              className="w-full flex flex-row justify-between items-center font-sans text-xs text-gray-400 font-extralight
                    border-[0.7px] border-gray-300 border-l-0 border-r-0 border-t-0 py-5"
            >
              <h2 className="tracking-widest md:w-[65%] w-[90%]">PRODUCT</h2>
              <div className="inline-flex flex-row justify-between items-center md:gap-x-32 gap-x-8 md:w-[35%] w-[10%]">
                <h2 className="tracking-widest md:inline-block hidden">
                  QUANTITY
                </h2>
                <h2 className="tracking-widest">TOTAL</h2>
              </div>
            </header>
            {loader && (
              <div className="relative w-full h-[3px] overflow-hidden bg-transparent">
                <div className="absolute h-full bg-gray-300 dark:bg-gray-600 animate-trailing"></div>
              </div>

            )}
            {data.cartItems.map(
              (item: CartItem, i: number) =>
                quantities[item.id] > 0 && (
                  <section
                    key={i}
                    className="border-[0.7px] border-gray-300 border-l-0 border-r-0 border-t-0 w-full py-7"
                  >
                    <section className="flex md:flex-row flex-col justify-between md:items-center items-start w-full gap-y-4">
                      <article
                        className="md:w-[62%] w-full flex-row flex justify-between items-start cursor-pointer"
                      >
                        <div className="flex flex-row md:gap-x-7 gap-x-3 items-start">
                          <img
                            src={
                              item.imageUrl
                            }
                            width={100}
                            height={175}
                            alt={`cart-item${i + 1}`}
                          />
                          <div className="font-sans inline-block">
                            <h2 className="text-[1rem] font-normal">
                              {item.name}
                            </h2>
                            <p className="text-sm font-extralight">
                              &#8358;{item.price}
                            </p>
                          </div>
                        </div>
                        <h1 className="text-lg font-sans font-extralight md:hidden">
                          &#8358;
                          {parseFloat(
                            itemTotalAmounts[item.id].toFixed(2)
                          ).toLocaleString("en-US")}
                        </h1>
                      </article>
                      <section className="inline-flex flex-row md:justify-between justify-end items-center md:gap-x-32 gap-x-8 md:w-[38%] w-full">
                        <div className="flex flex-row gap-x-6 items-center">
                          <div
                            className={`flex flex-col items-start gap-y-2 relative`}
                          >
                            <div className="flex flex-row gap-x-7 text-gray-600 border border-gray-600 px-5 py-2 w-36 h-12 items-center">
                              <button
                                onClick={() => {
                                  const qnt = quantities[item.id] - 1;

                                  if(qnt > 0){
                                    updateQuantity(item, 'deduct', qnt);
                                  }
                                }}
                                className={`text-lg font-sans text-gray-600 font-semibold ${
                                  loader
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                                disabled={loader}
                              >
                                -
                              </button>
                              <div className="w-14"></div>
                              <button
                                className={`text-lg font-sans text-gray-600 font-semibold ${
                                  loader
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                                disabled={loader}
                                onClick={() => {
                                  const qnt = quantities[item.id] + 1;
                                  if(qnt < item.stock){
                                    updateQuantity(item, 'add', qnt);
                                  }
                                }}
                              >
                                +
                              </button>
                            </div>
                            <input
                              onBlur={(e) => {
                                const el = e.currentTarget;
                                el.classList.add("border-none");
                                el.style.setProperty("height", "48px");
                                el.classList.remove("shadow-4xl");
                                el.style.setProperty("left", "42px");
                                el.style.setProperty("bottom", "0");
                                el.style.setProperty(
                                  "background-color",
                                  "transparent"
                                );

                                const v = Number(e.currentTarget.value);
                                if (!Number.isInteger(v) || v < 1) return;
                                const operation = v > quantities[item.id] ? 'add' : 'deduct';
                                updateQuantity(item, operation, Math.min(v, item.stock));
                              }}
                              disabled={loader}
                              onFocus={(e) => {
                                const el = e.currentTarget;
                                el.classList.remove("border-none");
                                el.style.setProperty("height", "58px");
                                el.classList.add("shadow-4xl");
                                el.classList.add("border-2");
                                el.classList.add("border-[#665d5d]");
                                el.style.setProperty("left", "42px");
                                el.style.setProperty("bottom", "-5px");
                                el.style.setProperty(
                                  "background-color",
                                  "white"
                                );
                              }}
                              onInput={(e) => {
                                const v = Number(e.currentTarget.value);
                                if (!Number.isInteger(v) || v < 1) return;

                                const operation = v > quantities[item.id] ? 'add' : 'deduct';
                                updateQuantity(item, operation, Math.min(v, item.stock));
                              }}
                              className="bg-transparent w-14 absolute left-[42px] bottom-0 border-none h-12
                                            text-sm font-sans text-gray-600 focus:outline-none text-center z-10
                                            p-2"
                              value={quantities[item.id]}
                            />
                          </div>
                          <Trash2Icon
                            className={`w-5 h-5 ${
                              loader ? "cursor-not-allowed" : " cursor-pointer"
                            } text-gray-600`}
                            onClick={() => {
                              if (!loader) {
                                //updating cart data in backend
                                updateQuantity(item, 'remove', quantities[item.id]);

                              }
                            }}
                          />
                        </div>
                        <h1 className="text-lg font-sans font-extralight hidden md:inline-block text-start">
                          &#8358;
                          {parseFloat(
                            itemTotalAmounts[item.id].toFixed(2)
                          ).toLocaleString("en-US")}
                        </h1>
                      </section>
                    </section>
                  </section>
                )
            )}
          </section>
          <footer className="w-full flex md:items-end flex-col font-sans gap-y-5 items-stretch">
            <div className="inline-flex flex-col md:items-end items-center">
              <p className="md:text-[1rem] text-xs font-extralight">
                SUBTOTAL&nbsp;&nbsp;&nbsp;
                <span className="md:text-2xl text-xl font-normal">
                  &#8358;{totalAmount.toLocaleString("en-US")}
                </span>
              </p>
              <p className="italic md:text-[1rem] text-xs font-light underline underline-offset-1 cursor-pointer">
                Shipping &#38; taxes calculated at checkout
              </p>
            </div>
            <button
              onClick={handleCheckout}
              type="button"
              disabled={loader}
              className={` text-white text-sm px-24 py-3 flex flex-row justify-center items-center ${
                loader ? "md:w-[256px]" : ""
              } ${
                loader
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-gray-700 hover:ring-gray-700 cursor-pointer hover:ring-2"
              }`}
            >
              {loader ? (
                <div className="border-2 border-transparent rounded-full border-t-white border-r-white w-[15px] h-[15px] spin"></div>
              ) : (
                "CHECKOUT"
              )}
            </button>
          </footer>
        </main>
      )}
    </>
  );
}