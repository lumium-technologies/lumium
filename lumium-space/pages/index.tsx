
import {
    chakra,
    Box,
    useColorModeValue,
    Button,
    Stack,
    Image,
    Text,
    Icon,
    Flex,
    HStack,
    Link,
    useDisclosure,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { LogoBlank } from "@components";
import { ScaleFade } from '@chakra-ui/react';
import Router from 'next/router'
import { useViewportScroll } from "framer-motion";
import { AiFillGithub } from "react-icons/ai";
import { Logo } from "@choc-ui/logo";
import { SwitchColorTheme } from "@components/headers";

const Main: React.FC = () => {
    const [done, setDone] = useState(false);

    const bg = useColorModeValue("white", "gray.800");
    const ref = React.useRef<any>();
    const [y, setY] = React.useState(0);
    const { height = 0 } = ref.current ? ref.current.getBoundingClientRect() : {};

    return (
        <React.Fragment>
            {done || <LogoBlank animationTime={750} setDone={setDone} />}
            <ScaleFade initialScale={1.0} in={done} >
                <React.Fragment>
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
                                    </Flex>
                                </Flex>
                            </chakra.div>
                        </chakra.header>
                    </Box>
                    <Box px={8} py={24} mx="auto">
                        <Box
                            w={{ base: "full", md: 11 / 12, xl: 9 / 12 }}
                            mx="auto"
                            textAlign={{ base: "left", md: "center" }}
                        >
                            <chakra.h1
                                mb={6}
                                fontSize={{ base: "4xl", md: "6xl" }}
                                fontWeight="bold"
                                lineHeight="none"
                                letterSpacing={{ base: "normal", md: "tight" }}
                                color={useColorModeValue("gray.900", "gray.100")}
                                data-cy="lumium-tagline"
                            >
                                <Text
                                    display="inline"
                                    w="full"
                                    bgClip="text"
                                    bgGradient="linear(to-r, green.400,purple.500)"
                                    fontWeight="extrabold"
                                    data-cy="lumium-color-fade"
                                >
                                    lumium</Text><br />
                                the all-in-one workspace
                            </chakra.h1>
                            <chakra.p
                                px={{ base: 0, lg: 24 }}
                                mb={6}
                                data-cy="lumium-description"
                                fontSize={{ base: "lg", md: "xl" }}
                                color={useColorModeValue("gray.600", "gray.300")}
                            >
                                the transparent productivity platform where you own your data
                            </chakra.p>
                            <Stack
                                direction={{ base: "column", sm: "row" }}
                                mb={{ base: 4, md: 8 }}
                                spacing={2}
                                justifyContent={{ sm: "left", md: "center" }}
                            >
                                <Button
                                    as="a"
                                    variant="solid"
                                    display="inline-flex"
                                    alignItems="center"
                                    data-cy="continue-button"
                                    justifyContent="center"
                                    w={{ base: "full", sm: "auto" }}
                                    mb={{ base: 2, sm: 0 }}
                                    size="lg"
                                    cursor="pointer"
                                    onClick={() => Router.push("/auth/signin")}
                                >
                                    Continue
                                    <Icon boxSize={4} ml={1} viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </Icon>
                                </Button>
                                <Button
                                    as="a"
                                    colorScheme="gray"
                                    display="inline-flex"
                                    alignItems="center"
                                    data-cy="signup-button"
                                    justifyContent="center"
                                    w={{ base: "full", sm: "auto" }}
                                    mb={{ base: 2, sm: 0 }}
                                    size="lg"
                                    cursor="pointer"
                                    onClick={() => Router.push("/auth/signup")}
                                >
                                    Sign up
                                    <Icon boxSize={4} ml={1} viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
                                            clipRule="evenodd"
                                        />
                                    </Icon>
                                </Button>
                            </Stack>
                        </Box>
                        <Box
                            w={{ base: "full", md: 10 / 12 }}
                            mx="auto"
                            mt={20}
                            textAlign="center"
                        >
                            <Image
                                w="full"
                                rounded="lg"
                                shadow="2xl"
                                src="https://kutty.netlify.app/hero.jpg"
                                alt="Hellonext feedback boards software screenshot"
                                data-cy="lumium-hero-image"
                            />
                        </Box>
                    </Box>
                </React.Fragment>
            </ScaleFade>
        </React.Fragment>
    );
};

export default Main;
