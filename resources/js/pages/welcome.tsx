import { MinusCircle, PlusCircle } from 'lucide-react';
import debounce from 'lodash.debounce';
import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage,router } from '@inertiajs/react';
import React, { useRef, useState } from 'react';
import HeaderCartButton from '@/components/header/header-cart-button';
import toast from 'react-hot-toast';


export default function Welcome({
    canRegister = true,
    products
}: {
    products: any[];
    canRegister?: boolean;
}) {
    const { auth, cart, flash } = usePage<SharedData>().props;
    const [quantities, setQuantities] = useState<Record<number, number>>(
        Object.fromEntries(products.map((product) => [product.id, 1]))
    );
    const _isInit = useRef(true);
    
    const { data, setData } = useForm<{
        items: {
            id: number;
            quantity: number;
        }[];
        operation?: 'add' | 'remove';
    }>({
        items: [],
    });


    React.useEffect(() => {
        if (_isInit.current) return;

        let timer = setTimeout(() => {
            router.post('/cart', data, {
                preserveScroll: true,
                preserveState: true,
            });
        }, 200);

        return () => {
            clearTimeout(timer);
        }
    }, [data.items]);


    React.useEffect(() => {
        _isInit.current = false;
        if (flash?.error) toast.error(flash.error);
    }, [flash]);


    const updateQuantity = (productId: number, quantity: number) => {

      // Instant UI update
      setQuantities(q => ({
        ...q,
        [productId]: quantity,
      }));
    };

    const addToCart = (productId: number, qty: number) => {
        const product = products.find(p => p.id === productId);
        if (!product) return; // safety check

        setData(prev => {
            const updatedItems = [...prev.items];
            const existingItemIndex = updatedItems.findIndex(i => i.id === productId);

            if (existingItemIndex !== -1) {
                // Update quantity of existing item without exceeding stock
                const newQuantity = Math.min(
                    qty + updatedItems[existingItemIndex].quantity,
                    product.stock
                );

                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: newQuantity,
                };

                return {
                    ...prev,
                    items: updatedItems,
                    operation: 'add',
                };
            }

            // Add new item, respecting stock
            return {
                ...prev,
                items: [...prev.items, { id: productId, quantity: Math.min(qty, product.stock) }],
                operation: 'add',
            };
        });
    };




    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-4 text-[#1b1b18] lg:justify-center lg:py-8 px-4 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-6xl text-sm not-has-[nav]:hidden">
                    <nav className="flex items-center justify-end gap-4">
               
                        {auth.user ? (
                            <>
                                <Link href="/cart">
                                    <HeaderCartButton 
                                        noOfCartItems={cart?.count ?? 0} 
                                    />
                                </Link>
                                <Link
                                    href="/logout" method="post" as="button"
                                    className="cursor-pointer inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log out
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href="/register"
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Register
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </header>
        
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="flex-1 rounded-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-10 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <div  className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Let's Shop</h2>

                                <div className="mt-6 grid grid-cols-1 gap-x-3 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-5">
                                    {/* Product cards go here */}
                                    {products.map((product: any, i: number, list: any[]) => (
                                        <div key={product.id} className="group">
                                            <div className="aspect-h-1 aspect-w-1 relative w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-auto lg:h-80 group-hover:opacity-75">
                                                <span className={`${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'} absolute bottom-2 left-2 rounded-full text-xs text-white py-1 px-3`}>{product.stock} in stock</span>
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.id}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="mt-4 flex justify-between w-full px-2 flex-col gap-5 items-center">
                                                <div className='flex flex-row items-center justify-between w-full'>
                                                    <h3 className="w-1/2 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-700">
                                                        <a href='#'>
                                                            <span aria-hidden="true" className="absolute inset-0" />
                                                            {product.name}
                                                        </a>
                                                    </h3>
                                                    <p className="text-sm font-medium text-gray-900">${product.price}</p>
                                                </div>
                                                <div className='flex w-full flex-row gap-3 items-center'>
                                                    <MinusCircle       
                                                        onClick={() => {
                                                            updateQuantity(product.id, Math.max(1, quantities[product.id] - 1));
                                                            
                                                        }}
                                                        className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer" 
                                                    />
                                                    <input               
                                                        onBlur={(e) => {
                                                            const el = e.target;
                                                            el.classList.add("border-none");
                                                            el.classList.remove("shadow-md");
                                                        }}
                                                        onFocus={(e) => {
                                                            const el = e.currentTarget;
                                                            el.classList.remove("border-none");
                                                            el.classList.add("border");
                                                            el.classList.add("shadow-md");
                                                        }}
                                                        onChange={(e) => {
                                                            const value = Number(e.currentTarget.value);

                                                            if (Number.isNaN(value) || value < 1) return;

                                                            updateQuantity(
                                                                product.id,
                                                                Math.min(value, product.stock),
                                                            );
                                                        }} 
                                                        type='text'   
                                                        className=" bg-transparent w-16
                                                            text-lg font-sans text-gray-600 focus:outline-none text-center
                                                            px-2"
                                                        value={quantities[product.id]}
                                                    />
                                                    <PlusCircle 
                                                        onClick={() => {
                                                            updateQuantity(product.id, Math.min(product.stock, quantities[product.id] + 1)  );
                                                            
                                                        }}
                                                        className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer" 
                                                    />
                                                </div>
                                                <button
                                                    disabled={
                                                        product.stock === 0
                                                    }
                                                    onClick={() => {
                                                        const qty = quantities[product.id];

                                                        addToCart(product.id, qty);
                                                    }}  
                                                    className={`${
                                                        product.stock === 0
                                                        ? "cursor-not-allowed"
                                                        : "cursor-pointer"
                                                    } group-hover:bg-gray-500 py-2 w-full rounded-md text-white bg-gray-600 lg:text-sm font-sans text-xs`}
                                                    id="add-to-cart"
                                                    type='button'
                                                    >
                                                    <span className="md:inline-block hidden">Add&nbsp;</span>
                                                    <span className="md:inline-block hidden">To&nbsp;</span>
                                                    <span>Cart</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
      
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
