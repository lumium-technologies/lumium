import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useColorMode, useColorModeValue, Box, FlexProps, Flex, IconButton, HStack, Button, Menu, MenuButton, Avatar, MenuList, Spacer } from "@chakra-ui/react";
import { BORDER_DARK, BORDER_LIGHT } from "@definitions/constants";
// import { useApi } from "@hooks/api";
// import { SECURE_AUTH_SIGNOUT } from "@routes/api/v1";
// import { ROOT } from "@routes/space";
import Router from "next/router";
import { FiChevronDown } from "react-icons/fi";

interface NavBarProps extends FlexProps {
    backgroundColor: string;
}

export const NavBar = ({ backgroundColor, ...rest }: NavBarProps) => {
    const { colorMode, toggleColorMode } = useColorMode();
    // const [api] = useApi();
    const borderColor = useColorModeValue(BORDER_LIGHT, BORDER_DARK);
    return (
        <Flex
            borderBottomWidth="1px"
            borderBottomColor={borderColor}
            pl={{ base: "4%", md: "2%" }}
            pr={{ base: "4%", md: "2%" }}
            pt={"2vh"}
            pb={"2vh"}
            maxH={"9vh"}
            alignItems={"Center"}
            {...rest}
            width={"100%"}
        >
            <Spacer />
            <HStack>
                <IconButton
                    icon={colorMode === 'light' && <MoonIcon /> || <SunIcon />}
                    mr="1%"
                    aria-label="switch theme"
                    onClick={toggleColorMode}
                    data-cy="switchThemeButton"
                />
                <Flex>
                    <Menu>
                        <MenuButton>
                            <HStack>
                                <Avatar
                                    size={'sm'}
                                    src={
                                        'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                                    }
                                />
                                <Box display={'flex'}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            borderColor={borderColor}
                            backgroundColor={backgroundColor}
                        >
                            <Button
                                justifyContent={{ base: "center", md: "flex-start" }}
                                bg="None"
                                width={"100%"}
                            // onClick={() => { api.post(SECURE_AUTH_SIGNOUT).then(() => Router.push(ROOT)); }}
                            >Sign out</Button>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack >
        </Flex >
    );
};
