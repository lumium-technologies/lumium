import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Link,
    Button,
    Heading,
    useColorModeValue,
    Alert,
    AlertIcon,
    AlertTitle,
    Spacer,
    Fade,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useApi } from '@hooks/api';
import Router, { useRouter } from 'next/router';
import { AUTH_SIGNIN, SPACES_NEW } from '@routes/space';
import Session from 'supertokens-auth-react/recipe/session';
import { useUserInfo } from '@hooks/api/useUserInfo';
import { ShowError } from '@components/notifications';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [credentialsMatchError, setCredentialsMatchError] = useState(false);
    const [api] = useApi();
    const router = useRouter();
    const userInfo = useUserInfo();
    const redirectionURL = router.query.redirectionURL + ""
    useEffect(() => {
        Session.doesSessionExist().then((loggedIn) => {
            if (loggedIn) {
                if (userInfo?.recentWorkspace) {
                    Router.push('/' + userInfo?.recentWorkspace.id);
                } else {
                    Router.push(SPACES_NEW);
                };
            };
        });
    }, []);
    const handleEnter = event => {
        if (event.key == 'Enter') {
            handleSignIn();
        }
    }
    const handleSignIn = () => {
        api.post(AUTH_SIGNIN, {
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
            if (status.status == "OK" && !redirectionURL) {
                if (userInfo?.recentWorkspace) {
                    Router.push('/' + userInfo?.recentWorkspace.id);
                } else {
                    Router.push(SPACES_NEW);
                }
            } else if (status.status == "FIELD_ERROR" || status.status == "WRONG_CREDENTIALS_ERROR") {
                setCredentialsMatchError(true);
            } else {
                Router.push(redirectionURL);
            }
        });
    };
    return (
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
                                    onKeyPress={handleEnter}
                                    data-cy="signInEmailInput"
                                />
                            </FormControl>
                            <FormControl id="password" isRequired>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    onChange={event => setPassword(event.currentTarget.value)}
                                    onKeyPress={handleEnter}
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
                                    <Link color={'blue.400'} onClick={() => Router.push("/auth/reset-password")}>Forgot password?</Link>
                                </Stack>
                            </Stack>
                            <Flex justifyContent="flex-end" mt="0">
                                <Link color={'blue.400'} onClick={() => Router.push("/auth/signup")}>Create Account</Link>
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
            </Flex >
            <Flex justifyContent="flex-end">
                <ShowError show={credentialsMatchError} message={"E-Mail or Password don't match"} />
            </Flex>
        </Flex >
    )
}
