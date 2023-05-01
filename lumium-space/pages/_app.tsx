import React from "react";
import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@definitions/chakra/theme";
import "@styles/global.css";
import { PageTransition } from "@components/transitions/PageTransition";
import NoSSR from "react-no-ssr";

const Lumium = ({ Component, pageProps }: AppProps): JSX.Element => {
    return (
        <ChakraProvider theme={theme}>
            <NoSSR>
                <PageTransition>
                    <Component {...pageProps} />
                </PageTransition>
            </NoSSR>
        </ChakraProvider>
    );
};

export default Lumium;
