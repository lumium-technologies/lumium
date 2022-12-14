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
    InputGroup,
    InputRightElement,
    FormErrorMessage,
    Image
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useApi } from "@hooks/api";
import Router from 'next/router';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { AUTH_SIGNIN, AUTH_SIGNUP, EMAIL_EXISTS, ROOT, SPACES_NEW } from '@routes/space';
import Session from 'supertokens-auth-react/recipe/session';
import { useUserInfo } from '@hooks/api';
import { AuthBox } from '@components/auth/AuthBox';
import { useFormik } from 'formik';

const SignUp: React.FC = () => {
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            passwordConfirm: "",
        },
        onSubmit: () => {
            if (formik.values.password == formik.values.passwordConfirm) {
                handleSignUp();
            } else {
                setPasswordMatchError(true);
                formik.errors.passwordConfirm = "Passwords don't match."
            }
        },
        validateOnChange: (false),
    });
    const [api] = useApi();
    const userInfo = useUserInfo();
    const [showPassword, setShowPassword] = useState(false);
    const [emailExistsError, setEmailExistsError] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState(false);

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

    const handleSignUp = () => {
        const email = formik.values.email
        const password = formik.values.password
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
                }).then(() => Router.push(SPACES_NEW));
            } else {
                setEmailExistsError(true);
            };
        });
    };

    return (
        <AuthBox title="Create your account">
            <form onSubmit={formik.handleSubmit}>
                <Stack spacing={4}>
                    <FormControl id="email" isRequired isInvalid={emailExistsError}>
                        <FormLabel>Email address</FormLabel>
                        <Input
                            name={"email"}
                            type={"email"}
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            data-cy="emailInput"
                        />
                        {emailExistsError && (<FormErrorMessage data-cy="emailExistsError">{formik.errors.email}</FormErrorMessage>)}
                    </FormControl>
                    <FormControl id="password" isRequired isInvalid={passwordMatchError}>
                        <FormLabel>Password</FormLabel>
                        <InputGroup>
                            <Input
                                name={"password"}
                                type={showPassword ? 'text' : 'password'}
                                onChange={formik.handleChange}
                                value={formik.values.password}
                                data-cy="passwordInput"
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
                    <FormControl id="passwordConfirmInput" isRequired isInvalid={passwordMatchError}>
                        <FormLabel>Repeat Password</FormLabel>
                        <Input
                            name={"passwordConfirm"}
                            type={'password'}
                            onChange={formik.handleChange}
                            value={formik.values.passwordConfirm}
                            data-cy="passwordConfirmInput"
                        />
                        <FormErrorMessage data-cy="passwordMatchError">{formik.errors.passwordConfirm}</FormErrorMessage>
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
                            data-cy="signUpButton"
                            type="submit"
                        >
                            Sign up
                        </Button>
                    </Stack>
                    <Flex flexDir="column" alignItems={"center"}>
                        <Text mb={"0"}>
                            Already an account?
                        </Text>
                        <Link color={'blue.400'} onClick={() => Router.push(AUTH_SIGNIN)} data-cy="signInSwitchButton">Login</Link>
                    </Flex>
                </Stack>
            </form>
        </AuthBox>
    );
};

export default SignUp;