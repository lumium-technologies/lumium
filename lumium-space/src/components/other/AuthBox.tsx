import { Flex, Stack, Heading, Box, Image, Link, Center } from "@chakra-ui/react"
import { ROOT } from "@routes/space";
import NextLink from 'next/link';

export const AuthBox = (props) => {
    return (
        <Flex
            minH={'100vh'}
            flexDir="column"
        >
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={"3%"} px={"2%"} width="100%">
                <Stack align={'center'}>
                    <Link as={NextLink} href={ROOT}>
                        <Center>
                            <Image src={props.logo} minWidth={"70%"} maxWidth={"80%"} alt="lumium logo" />
                        </Center>
                    </Link>
                </Stack>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        {props.title}
                    </Heading>
                </Stack>
                <Box
                    rounded={'lg'}
                    boxShadow={'lg'}
                    p={"10%"}
                >
                    {props.children}
                </Box>
            </Stack >
        </Flex>
    )
};

