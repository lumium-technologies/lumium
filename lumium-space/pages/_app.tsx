import React from "react";
import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@definitions/chakra/theme";
import "@styles/global.css";
import { PageTransition } from "@components/transitions/PageTransition";

const Lumium = ({ Component, pageProps }: AppProps): JSX.Element => {
    return (
        <ChakraProvider theme={theme}>
            <PageTransition>
                <Component {...pageProps} />
            </PageTransition>
        </ChakraProvider>
    );
};

export default Lumium;
