import React from "react";
import {
    chakra,
    Flex,
    HStack,
    Icon,
    Link,
    useColorModeValue,
    useDisclosure,
    Box,
} from "@chakra-ui/react";
import { useViewportScroll } from "framer-motion";
import {
    AiFillGithub,
} from "react-icons/ai";
import { Logo } from "@choc-ui/logo";
import { useLoginStatus } from "@hooks/security";

import { SwitchColorTheme } from "./SwitchColorTheme";

export function Header({ showGithubButton }: { showGithubButton?: boolean }) {
    const mobileNav = useDisclosure();

    const bg = useColorModeValue("white", "gray.800");
    const ref = React.useRef<any>();
    const [y, setY] = React.useState(0);
    const { height = 0 } = ref.current ? ref.current.getBoundingClientRect() : {};

    const { scrollY } = useViewportScroll();
    React.useEffect(() => {
        return scrollY.onChange(() => setY(scrollY.get()));
    }, [scrollY]);

    const loggedIn = useLoginStatus();

    const openSourceTextColor = useColorModeValue("gray.800", "gray.10");
    const openSourceBgColor = useColorModeValue("gray.50", "gray.800");

    const OpenSourceButton = (
        <Box
            display="flex"
            alignItems="center"
            as="a"
            aria-label="Continue to GitHub repository"
            href="https://github.com/d3psi/lumium"
            data-cy="github-link"
            target="_blank"
            bg={openSourceBgColor}
            borderWidth="1px"
            borderColor="gray.200"
            px="1em"
            minH="36px"
            rounded="md"
            fontSize="sm"
            color={openSourceTextColor}
            outline="0"
            transition="all 0.3s"
            _hover={{
                color: "gray.800",
                bg: "gray.100",
                borderColor: "gray.300",
            }}
            _active={{
                borderColor: "gray.200",
            }}
            _focus={{
                boxShadow: "outline",
            }}
            ml={5}
        >
            <HStack spacing="5" display="flex">
                <Box as="span" lineHeight="inherit" fontWeight="semibold">
                    We are open source:
                </Box>
                <Icon
                    as={AiFillGithub}
                    display="block"
                    transition="color 0.2s"
                    w="5"
                    h="5"
                />
            </HStack>
        </Box>
    );

    return (
        <Box pos="relative">
            <chakra.header
                ref={ref}
                shadow={y > height ? "sm" : undefined}
                transition="box-shadow 0.2s"
                bg={bg}
                borderTopColor="brand.400"
                w="full"
                overflowY="hidden"
            >
                <chakra.div h="4.5rem" mx="auto" maxW="1200px">
                    <Flex w="full" h="full" px="6" align="center" justify="space-between">
                        <Flex align="center">
                            <Link href="/">
                                <HStack>
                                    <Logo />
                                </HStack>
                            </Link>
                        </Flex>

                        <Flex
                            justify="flex-end"
                            w="full"
                            maxW="824px"
                            align="center"
                            color="gray.400"
                        >
                            <SwitchColorTheme />
                            {showGithubButton && OpenSourceButton}
                        </Flex>
                    </Flex>
                </chakra.div>
            </chakra.header>
        </Box>
    );
};
