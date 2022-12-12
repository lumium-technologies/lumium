import React from "react";
import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@definitions/chakra/theme";
import "@styles/global.css";
import SuperTokensReact from 'supertokens-auth-react';
import { frontendConfig } from '../config/frontendConfig';

if (typeof window !== 'undefined') {
    SuperTokensReact.init(frontendConfig())
};

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
    return (
        <ChakraProvider theme={theme}>
            <Component {...pageProps} />
        </ChakraProvider>
    );
};

export default MyApp;
