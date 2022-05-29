import React from "react";
import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@definitions/chakra/theme";
import "@styles/global.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { Provider } from "react-redux";
import store from "@redux/store";

import { Favicons } from "@components/icons";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    const queryClient = new QueryClient();
    return (
        <ChakraProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <Hydrate state={pageProps.dehydratedState}>
                    <Provider store={store}>
                        <Favicons initialTitle="Lumium" />
                        <Component {...pageProps} />
                    </Provider>
                </Hydrate>
            </QueryClientProvider>
        </ChakraProvider>
    );
}

export default MyApp;
