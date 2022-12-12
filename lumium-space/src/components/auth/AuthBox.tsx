import { Flex, Stack, Heading, Box, Link, Image } from "@chakra-ui/react"
import { useColorModeValue } from "@chakra-ui/system"
import { ROOT } from "@routes/space"
import Router from "next/router"

export const AuthBox = (props) => {
    return (
        <Flex
            minH={'100vh'}
            flexDir="column"
        >
            <Flex maxHeight={"10%"} justify="center" pt="1%">
                <Link>
                    <Image src={"/logo/logo.svg"} minWidth={"20%"} alt="lumium logo" onClick={() => Router.push(ROOT)} />
                </Link>
            </Flex>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={"3%"} px={"2%"} width="100%">
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        {props.title}
                    </Heading>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={"10%"}
                >
                    {props.children}
                </Box>
            </Stack >
        </Flex>
    )
}