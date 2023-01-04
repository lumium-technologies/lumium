import { Box, useColorModeValue } from "@chakra-ui/react";
import { PageTitle } from "@components/other/PageTitle";
import { NavBar, Footer, CallToAction } from "@sections/landing";

const LandingPage = () => {
    const darkLogo = '/logo/svg/Black logo - no background.svg';
    const lightLogo = '/logo/svg/White logo - no background.svg';
    let logo = useColorModeValue(darkLogo, lightLogo);
    return (
        <>
            <PageTitle title={"Lumium | Your Secure Collaborative Workspace"} />
            <Box mb={"1%"}>
                <NavBar logo={logo} />
                <CallToAction />
            </Box>
            <Footer />
        </>
    );
};

export default LandingPage;

