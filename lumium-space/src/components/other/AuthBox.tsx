import { Flex, Stack, Heading, Box, Image, Link, Center, useColorModeValue } from "@chakra-ui/react"
import { LOGO_DARK, LOGO_LIGHT } from "@definitions/constants";
import { ROOT } from "@routes/space";
import NextLink from 'next/link';
import { ReactElement } from "react";

interface AuthBoxProps {
    title: string;
    children: ReactElement;
}

export const AuthBox = ({ title, children }: AuthBoxProps) => {
    return (
        <Flex
            minH={'100vh'}
            flexDir="column"
        >
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={"3%"} px={"2%"} width="100%">
                <Stack align={'center'}>
                    <Link as={NextLink} href={ROOT}>
                        <Center>
                            <Image src={useColorModeValue(LOGO_DARK, LOGO_LIGHT)} minWidth={"70%"} maxWidth={"80%"} alt="lumium logo" />
                        </Center>
                    </Link>
                </Stack>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        {title}
                    </Heading>
                </Stack>
                <Box
                    rounded={'lg'}
                    boxShadow={'lg'}
                    p={"10%"}
                >
                    {children}
                </Box>
            </Stack >
        </Flex>
    )
};

