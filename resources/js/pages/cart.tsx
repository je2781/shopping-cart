import CartComponent from "@/components/cart/cart-content";
import HeaderCartButton from "@/components/header/header-cart-button";
import { login, logout, register } from "@/routes";
import { SharedData } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";


export default function Cart({
    canRegister = true
}: {
    canRegister?: boolean;
}) {
    const { auth, cart } = usePage<SharedData>().props;

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
                <header className="mb-6 w-full max-w-6xl text-sm not-has-[nav]:hidden">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <>
                            
                                <HeaderCartButton noOfCartItems={cart?.count ?? 0} onClick={() => {}} />   
                                <button
                                    onClick={() =>{
                                        router.post(route('logout'));
                                    }}
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
                <CartComponent total={cart?.total ?? 0} cartItems={cart?.items ?? []} />        
            </div>
        </>
    );
}