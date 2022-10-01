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
    HStack,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import SuperTokens from 'supertokens-auth-react'
import { redirectToAuth } from 'supertokens-auth-react/recipe/thirdpartyemailpassword'
import { useApi } from "@hooks/api";
import Router, { useRouter } from 'next/router';
import { InfoIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import Cookies from 'js-cookie';

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [api] = useApi();
    const router = useRouter();
    const { show } = router.query;
    const [showPassword, setShowPassword] = useState(false);
    useEffect(() => {
        if (SuperTokens.canHandleRoute() === false) {
            redirectToAuth()
        }
    }, [])
    const handleSignIn = () => {
        api.post("/auth/signin", {
            "formFields": [
                {
                    "id": "email",
                    "value": email
                },
                {
                    "id": "password",
                    "value": password
                }
            ]
        }).then(() => Router.push("/"));
        //emailPasswordSignIn(email, password).then(() => Router.push("/"));
    };
    const handleSignUp = () => {
        api.post("/auth/signup", {
            "formFields": [
                {
                    "id": "email",
                    "value": email
                },
                {
                    "id": "password",
                    "value": password
                }
            ]
        }).then(() => {
            const token = Cookies.get("sAccessToken");
            /*api.post("/auth/user/email/verify", {
                "method": "token",
                "token": token
            });*/
        }).then(() => Router.push("/auth?rid=thirdpartyemailpassword&show=verify-email"));
    };
    const switchToSignUp = () => {
        Router.push("/auth?rid=thirdpartyemailpassword&show=signup")
    };
    const switchToSignIn = () => {
        Router.push("/auth?rid=thirdpartyemailpassword&show=signin")
    };
    const switchToPasswordReset = () => {
        Router.push("/auth?rid=thirdpartyemailpassword&show=reset-password")
    };
    const switchToVerifyEmail = () => {
        Router.push("/auth?rid=thirdpartyemailpassword&show=verify-email")
    };
    const signInPage =
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
                                <Link color={'blue.400'} onClick={switchToPasswordReset}>Forgot password?</Link>
                            </Stack>
                        </Stack>
                        <Flex justifyContent="flex-end" mt="0">
                            <Link color={'blue.400'} onClick={switchToSignUp}>Create Account</Link>
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
        ;

    const signUpPage =
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Sign up
                    </Heading>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <HStack>
                            <Box>
                                <FormControl id="firstName">
                                    <FormLabel>First Name</FormLabel>
                                    <Input type="text" />
                                </FormControl>
                            </Box>
                            <Box>
                                <FormControl id="lastName">
                                    <FormLabel>Last Name</FormLabel>
                                    <Input type="text" />
                                </FormControl>
                            </Box>
                        </HStack>
                        <FormControl id="email" isRequired>
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" onChange={event => setEmail(event.currentTarget.value)} />
                        </FormControl>
                        <FormControl id="password" isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input type={showPassword ? 'text' : 'password'} onChange={event => setPassword(event.currentTarget.value)} />
                                <InputRightElement h={'full'}>
                                    <Button
                                        variant={'ghost'}
                                        onClick={() =>
                                            setShowPassword((showPassword) => !showPassword)
                                        }>
                                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={10} pt={2}>
                            <Button
                                loadingText="Submitting"
                                size="lg"
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                onClick={handleSignUp}
                            >
                                Sign up
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align={'center'}>
                                Already a user? <Link color={'blue.400'} onClick={switchToSignIn}>Login</Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
        ;
    const resetPasswordPage =
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack
                spacing={4}
                w={'full'}
                maxW={'md'}
                bg={useColorModeValue('white', 'gray.700')}
                rounded={'xl'}
                boxShadow={'lg'}
                p={6}
                my={12}>
                <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
                    Forgot your password?
                </Heading>
                <Text
                    fontSize={{ base: 'sm', sm: 'md' }}
                    color={useColorModeValue('gray.800', 'gray.400')}>
                    You&apos;ll get an email with a reset link
                </Text>
                <FormControl id="email">
                    <Input
                        placeholder="your-email@example.com"
                        _placeholder={{ color: 'gray.500' }}
                        type="email"
                    />
                </FormControl>
                <Stack spacing={6}>
                    <Button
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                            bg: 'blue.500',
                        }}>
                        Request Reset
                    </Button>
                </Stack>
            </Stack>
        </Flex>
        ;
    const verifyEmailPage =
        <Box textAlign="center" py={10} px={6}>
            <InfoIcon boxSize={'50px'} color={'blue.500'} />
            <Heading as="h2" size="xl" mt={6} mb={2}>
                Verify your E-Mail
            </Heading>
            <Text color={'gray.500'}>
                Check your inbox to access Lumium
            </Text>
        </Box>
        ;
    return (
        show == "reset-password" && resetPasswordPage ||
        show == "signup" && signUpPage ||
        show == "verify-email" && verifyEmailPage || signInPage
    )
}
