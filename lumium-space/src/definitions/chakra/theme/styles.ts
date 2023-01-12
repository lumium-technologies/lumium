import { ThemeOverride } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools';
import { BACKGROUND_DARK, BACKGROUND_LIGHT } from "@definitions/constants";

type GlobalStyles = Pick<ThemeOverride, "styles">;

export default {
    styles: {
        global: props => ({
            body: {
                bg: mode(BACKGROUND_LIGHT, BACKGROUND_DARK)(props),
            },
            h1: {
                fontWeight: 500,
            },
        }),
    },
} as GlobalStyles;
