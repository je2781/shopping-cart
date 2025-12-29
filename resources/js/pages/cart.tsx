import CartComponent from "@/components/cart/cart-content";
import HeaderCartButton from "@/components/header/header-cart-button";
import { login, logout, register } from "@/routes";
import { SharedData } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";


export default function CartPage({
    canRegister = true,
    cartItems,
    total
}: {
    cartItems: any[];
    total: number;
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return(
        <>
            <Head title="Cart">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <>
                            
                                <HeaderCartButton cartItems={cartItems} onClick={() => {
                                    // Navigate to cart page
                                    window.location.href = '/cart';
                                }} />   
                                <Link
                                    href={logout()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log out
                                </Link>
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
                <CartComponent total={total} cartItems={cartItems} />        
            </div>
        </>
    );
}