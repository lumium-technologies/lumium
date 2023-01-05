import { Box } from "@chakra-ui/react";
import { PageTitle } from "@components/other/PageTitle";
import { NavBar, Footer, CallToAction } from "@sections/landing";

const LandingPage = () => {
    return (
        <>
            <PageTitle title={"Lumium | Your Secure Collaborative Workspace"} />
            <Box mb={"1%"}>
                <NavBar />
                <CallToAction />
            </Box>
            <Footer />
        </>
    );
};

export default LandingPage;

