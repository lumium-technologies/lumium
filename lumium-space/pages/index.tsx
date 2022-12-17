import { Container } from "@chakra-ui/react";
import { AppScreenshot } from "@sections/landing/AppScreenshot";
import { CallToAction } from "@sections/landing/CallToAction";
import { Footer } from "@sections/landing/Footer";
import { Pricing } from "@sections/landing/Pricing";
import { Statistics } from "@sections/landing/Statistics";
import { NavBar } from "@sections/landing/NavBar";

const LandingPage = () => {
    return (
        <>
            <NavBar />
            <Container maxW="container.xl">
                <CallToAction />
                <Statistics />
                <Pricing />
                <AppScreenshot />
            </Container>
            <Footer />
        </>
    );
};

export default LandingPage;

