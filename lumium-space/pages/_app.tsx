import React from "react";
import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@definitions/chakra/theme";
import "@styles/global.css";

const Lumium = ({ Component, pageProps }: AppProps): JSX.Element => {
    return (
        <ChakraProvider theme={theme}>
            <Component {...pageProps} />
        </ChakraProvider>
    );
};

export default Lumium;
