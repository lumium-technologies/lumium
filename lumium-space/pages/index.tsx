import { useColorModeValue } from "@chakra-ui/react";
import { CallToAction } from "@sections/landing/CallToAction";
import { Footer } from "@sections/landing/Footer";
import { NavBar } from "@sections/landing/NavBar";
import { useEffect } from "react";

const LandingPage = () => {
    useEffect(() => {
        document.title = "Lumium | Your Collaboration Space"
    }, []);
    const darkLogo = '/logo/svg/Black logo - no background.svg';
    const lightLogo = '/logo/svg/White logo - no background.svg';
    let logo = useColorModeValue(darkLogo, lightLogo);
    return (
        <>
            <NavBar logo={logo} />
            <CallToAction />
            <Footer />
        </>
    );
};

export default LandingPage;

