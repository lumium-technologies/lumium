import { FaMoon, FaSun } from "react-icons/fa";
import {
    useColorMode,
    useColorModeValue,
    IconButton
} from '@chakra-ui/react'

function SwitchColorTheme() {
    const { toggleColorMode: toggleMode } = useColorMode();
    const text = useColorModeValue("dark", "light");
    const SwitchIcon = useColorModeValue(FaMoon, FaSun);
    return (
        <>
            <IconButton
                size="md"
                fontSize="lg"
                aria-label={`Switch to ${text} mode`}
                data-cy="color-theme-switcher"
                variant="ghost"
                color="current"
                ml={{ base: "0", md: "3" }}
                onClick={toggleMode}
                icon={<SwitchIcon />}
            />
        </>
    )
}
export { SwitchColorTheme };