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
    Alert,
    AlertIcon,
    AlertTitle,
    Spacer,
    Fade,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import SuperTokens from 'supertokens-auth-react'
import { redirectToAuth } from 'supertokens-auth-react/recipe/thirdpartyemailpassword'
import { useApi } from "@hooks/api";
import Router, { useRouter } from 'next/router';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useLoginStatus } from "@hooks";
export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [api] = useApi();
    const router = useRouter();
    const { show, redirectToPath } = router.query;
    const [showPassword, setShowPassword] = useState(false);
    const [credentialsMatchError, showCredentialsMatch] = useState(false);
    const [emailExistsIsShown, setEmailExistsIsShown] = useState(false);
    const loggedIn = useLoginStatus();
    useEffect(() => {
        if (loggedIn) {
            var url = "/page";
            if (redirectToPath) {
                url = redirectToPath.toString();
            }
            Router.push(url);
        }
    }, [loggedIn]);
    useEffect(() => {
        if (SuperTokens.canHandleRoute() === false) {
            redirectToAuth
        }
    }, [])
    const handleSignIn = () => {
        var url = "/page";
        if (redirectToPath) {
            url = redirectToPath.toString();
        }
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
        }).then((promise) => promise.data).then((status) => {
            if (status.status == "OK") {
                Router.push(url)
            } else {
                showCredentialsMatch(true)
            }
        });
        /*
       import { emailPasswordSignIn, emailPasswordSignUp, getUsersByEmail } from 'supertokens-node/recipe/thirdpartyemailpassword'
        const handleSignIn = () => {
        var url = "/page";
        if (redirectToPath) {
            url = redirectToPath.toString();
        }
        emailPasswordSignIn(email, password).then((status) => {
            if (status.status == "OK") {
                Router.push(url)
            } else {
                showCredentialsMatch(true)
            }
        });
        };
        const handleSignUp = () => {
            emailPasswordSignUp(email, password).then((value) => {
                if (value.status == "OK") {
                    getUsersByEmail(email).then((value) => {
                        console.log(value)
                    })
                } else {
                    setEmailExistsIsShown(true)
                }
            })
        };*/
    };
    const handleSignUp = () => {
        const emailExists = api.get("/auth/signup/email/exists", { params: { email } }).then((response) => response.data).then(email => email.exists);
        emailExists.then(value => {
            if (!value) {
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
                    api.post("/auth/user/email/verify/token");
                }).then(() => Router.push("/auth/verify-email"));
            } else {
                setEmailExistsIsShown(true)
            }
        })
    };
    const switchToSignUp = () => {
        Router.push("/auth?rid=thirdpartyemailpassword&show=signup")
    };
    const switchToSignIn = () => {
        Router.push("/auth?rid=thirdpartyemailpassword&show=signin")
    };
    const switchToPasswordReset = () => {
        Router.push("/auth/reset-password")
    };
    const signInPage =
        <Flex flexDir="column" minH={'100vh'}>
            <Flex
                minH={'93vh'}
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
                                <Input
                                    type="email"
                                    onChange={event => setEmail(event.currentTarget.value)}
                                    data-cy="signInEmailInput"
                                />
                            </FormControl>
                            <FormControl id="password" isRequired>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    onChange={event => setPassword(event.currentTarget.value)}
                                    data-cy="signInPasswordInput"
                                />
                            </FormControl>
                            <Stack spacing={10}>
                                <Stack
                                    direction={{ base: 'column', sm: 'row' }}
                                    align={'start'}
                                    justify={'space-between'}>
                                    {/*<Checkbox>Remember me</Checkbox>*/}
                                    <Spacer />
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
                                data-cy="submitSignInButton"
                            >
                                Sign in
                            </Button>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
            <Fade in={credentialsMatchError}>
                <Flex justifyContent="flex-end">
                    <Alert status='error' width="20%" mr="1%" borderRadius="10px">
                        <AlertIcon />
                        <AlertTitle>Email or Password is incorrect</AlertTitle>
                    </Alert>
                </Flex>
            </Fade>
        </Flex>

        ;

    const signUpPage =
        <Flex flexDir="column" minH={'100vh'}>
            <Flex
                minH={'93vh'}
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
                                <Input
                                    type="email"
                                    onChange={event => setEmail(event.currentTarget.value)}
                                    data-cy="signUpEmailInput"
                                />
                            </FormControl>
                            <FormControl id="password" isRequired>
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        onChange={event => setPassword(event.currentTarget.value)}
                                        data-cy="signUpPasswordInput"
                                    />
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
                                    data-cy="submitSignUpButton"
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
            <Flex justifyContent="flex-end">
                {
                    emailExistsIsShown ?
                        <Alert status='error' width="20%" mr="1%">
                            <AlertIcon />
                            <AlertTitle>Email does already exist</AlertTitle>
                        </Alert>
                        :
                        <Text></Text>
                }
            </Flex>
        </Flex>
        ;
    return (
        <Fade in={true}>
            {show == "signup" && signUpPage || signInPage}
        </Fade>
    )
}
