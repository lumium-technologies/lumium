import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import SuperTokens from 'supertokens-auth-react'
import { redirectToAuth } from 'supertokens-auth-react/recipe/thirdpartyemailpassword'
import { useApi } from "@hooks/api";

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [api] = useApi();
    useEffect(() => {
        if (SuperTokens.canHandleRoute() === false) {
            redirectToAuth()
        }
    }, [])
    const handleSignIn = event => {
        event.preventDefault();
        api.post("/secure/user/signIn", { loginEmail: email, loginPassword: password });
    }
    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Sign in to your account</Heading>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <FormControl id="email" isRequired>
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" onChange={event => setEmail(event.currentTarget.value)} />
                        </FormControl>
                        <FormControl id="password" isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" onChange={event => setPassword(event.currentTarget.value)} />
                        </FormControl>
                        <Stack spacing={10}>
                            <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                align={'start'}
                                justify={'space-between'}>
                                <Checkbox>Remember me</Checkbox>
                                <Link color={'blue.400'}>Forgot password?</Link>
                            </Stack>
                        </Stack>
                        <Flex justifyContent="flex-end" mt="0">
                            <Link color={'blue.400'} >Create Account</Link>
                        </Flex>
                        <Button
                            bg={'blue.400'}
                            color={'white'}
                            _hover={{
                                bg: 'blue.500',
                            }}
                            onClick={handleSignIn}
                        >
                            Sign in
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    )
}
