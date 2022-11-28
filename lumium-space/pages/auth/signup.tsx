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
    Text,
    useColorModeValue,
    HStack,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useApi } from "@hooks/api";
import Router from 'next/router';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { AUTH_SIGNUP, EMAIL_EXISTS, EMAIL_VERIFY, EMAIL_VERIFY_TOKEN, SPACES_NEW } from '@routes/space';
import { ShowError } from '@components/notifications';
import Session from 'supertokens-auth-react/recipe/session';
import { useUserInfo } from '@hooks/api/useUserInfo';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVerify, setPasswordVerify] = useState('');
    const [api] = useApi();
    const userInfo = useUserInfo();
    const [showPassword, setShowPassword] = useState(false);
    const [emailExistsError, setEmailExistsError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

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
    }, [userInfo?.recentWorkspace]);

    const handleEnter = event => {
        if (event.key == 'Enter') {
            handleSignUp();
        }
    }

    const handleSignUp = () => {
        if (password == passwordVerify) {
            api.get(EMAIL_EXISTS, { params: { email } }).then((response) => response.data).then(email => email.exists).then(value => {
                if (!value) {
                    api.post(AUTH_SIGNUP, {
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
                        api.post(EMAIL_VERIFY_TOKEN);
                    }).then(() => Router.push(EMAIL_VERIFY));
                } else {
                    setEmailExistsError(true);
                }
            })
        } else {
            setPasswordError(true)
        }
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
                                    onKeyPress={handleEnter}
                                    data-cy="signUpEmailInput"
                                />
                            </FormControl>
                            <FormControl id="password" isRequired>
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        onChange={event => setPassword(event.currentTarget.value)}
                                        onKeyPress={handleEnter}
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
                            <FormControl id="password-verify" isRequired>
                                <FormLabel>Repeat Password</FormLabel>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={event => setPasswordVerify(event.currentTarget.value)}
                                    onKeyPress={handleEnter}
                                    data-cy="signUpPasswordVerifyInput"
                                />
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
                                    Already a user? <Link color={'blue.400'} onClick={() => Router.push("/auth/signin")}>Login</Link>
                                </Text>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
            <Flex justifyContent="flex-end">
                <ShowError show={emailExistsError} message={"Email does already exist"} />
                <ShowError show={passwordError} message={"Passwords don't match"} />
            </Flex>
        </Flex>
    )
}
