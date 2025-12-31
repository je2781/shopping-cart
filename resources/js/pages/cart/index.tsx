import CartContent from "@/components/cart-content/content";
import HeaderCartButton from "@/components/header/header-cart-button";
import { login, logout, register } from "@/routes";
import { CartItem, OrderItem, SharedData, type Cart } from "@/types";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { route } from "ziggy-js";


export default function Cart({
    
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth, cart, flash } = usePage<SharedData>().props;

    useEffect(() => {
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const { data, setData } = useForm<{
        cartItems: CartItem[];
        orderItems: OrderItem[];
        operation?: 'add' | 'deduct' | 'remove';
        id?: number
        }>({
        cartItems: cart?.items ?? [],
        orderItems: [],
    });

    return(
        <>
            <Head title="Cart">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-4 text-[#1b1b18] lg:justify-center lg:py-8 px-4 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-6xl text-sm">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <>
                            
                                <HeaderCartButton onClick={() => {}} noOfCartItems={cart?.count ?? 0} />   
                                <button
                                    onClick={() => router.post(route('logout'))}
                                    type='button'
                                    className="cursor-pointer inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Register
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </header>
                <CartContent total={cart?.total ?? 0} data={data} setData={setData} />        
            </div>
        </>
    );
}