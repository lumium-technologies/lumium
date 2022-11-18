import { AppScreenshot } from "@sections/landing/AppScreenshot";
import { CallToAction } from "@sections/landing/CallToAction";
import { Footer } from "@sections/landing/Footer";
import { Pricing } from "@sections/landing/Pricing";
import { Statistics } from "@sections/landing/Statistics";

export default function LandingPage() {
    return (
        <>
            <CallToAction />
            <Statistics />
            <Pricing />
            <AppScreenshot />
            <Footer />
        </>
    );
};

