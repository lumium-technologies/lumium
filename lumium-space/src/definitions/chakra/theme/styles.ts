import { ThemeOverride } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools';

type GlobalStyles = Pick<ThemeOverride, "styles">;

export default {
    styles: {
        global: props => ({
            body: {
                bg: mode('#ffffff', '#1a1a1a')(props),
            },
            h1: {
                fontWeight: 500,
            },
        }),
    },
} as GlobalStyles;
