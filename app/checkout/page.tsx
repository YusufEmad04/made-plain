import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { CheckoutForm } from "@/components/marketing/checkout-form";
import { activePrice } from "@/lib/content/kit";

export const metadata = {
    title: "Checkout — Made Plain",
    robots: { index: false, follow: false },
};

export default function CheckoutPage() {
    const tier = activePrice();
    return (
        <>
            <SiteNav />
            <main>
                <CheckoutForm price={tier.price} />
            </main>
            <SiteFooter />
        </>
    );
}
