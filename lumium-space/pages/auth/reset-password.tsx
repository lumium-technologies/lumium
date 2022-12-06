import { InfoIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Image, Box, Button, Fade, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, InputGroup, InputRightElement, Link, ScaleFade, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { AuthBox } from "@components/auth/AuthBox";
import { useApi } from "@hooks/api";
import { AUTH_SIGNIN, EMAIL_EXISTS, PASSWORD_RESET, PASSWORD_RESET_TOKEN, ROOT } from "@routes/space";
import Router, { useRouter } from 'next/router';
import { useRef, useState } from "react";

const ResetPassword: React.FC = () => {
    const inputEmail = useRef<HTMLInputElement>(null);
    const [email, setEmail] = useState<string>();
    const [emailError, setEmailError] = useState(false);
    const [emailExistsError, setEmailExistsError] = useState(false);

    const inputPassword = useRef<HTMLInputElement>(null);
    const [passwordError, setPasswordError] = useState(false);

    const inputPasswordVerify = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState(false);

    const [emailSent, setEmailSent] = useState(false);
    const [emailResent, setEmailResent] = useState(false);
    const [api] = useApi();
    const router = useRouter();
    const { token } = router.query;

    const handleResetPassword = () => {
        setEmail(inputEmail.current?.value);
        setEmailError(email == '');
        if (email != '') {
            const emailExists = api.get(EMAIL_EXISTS, { params: { email } }).then((response) => response.data).then(email => email.exists);
            emailExists.then(value => {
                if (value) {
                    api.post(PASSWORD_RESET_TOKEN, {
                        "formFields": [
                            {
                                "id": "email",
                                "value": email
                            }
                        ]
                    });
                    setEmailSent(true);
                } else {
                    setEmailExistsError(true);
                };
            });
        };
    };

    const handleChangePassword = () => {
        const password = inputPassword.current?.value;
        const passwordVerify = inputPasswordVerify.current?.value;

        setPasswordError(password == '');
        setPasswordMatchError(password != passwordVerify);
        if (password != '' && passwordVerify != '' && password == passwordVerify) {
            api.post(PASSWORD_RESET, {
                "method": "token",
                "formFields": [
                    {
                        "id": "password",
                        "value": password
                    }
                ],
                "token": token
            }).then(() => Router.push(AUTH_SIGNIN));
        };
    };

    const handleResendEmail = () => {
        api.post(PASSWORD_RESET_TOKEN, {
            "formFields": [
                {
                    "id": "email",
                    "value": email
                }
            ]
        });
        setEmailResent(true);
    };

    const resetPasswordEmail = (
        <AuthBox title="Forgot your password">
            <Stack spacing={4}>
                <Text
                    fontSize={{ base: 'sm', sm: 'md' }}
                    color={useColorModeValue('gray.800', 'gray.400')}>
                    You&apos;ll get an email with a reset link
                </Text>
                <FormControl id="email" isRequired isInvalid={emailError || emailExistsError}>
                    <FormLabel>Email address</FormLabel>
                    <Input
                        type="email"
                        ref={inputEmail}
                        onKeyPress={event => { if (event.key == 'Enter') handleResetPassword() }}
                        data-cy="emailInput"
                    />
                    {
                        emailError && (<FormErrorMessage>E-Mail is required.</FormErrorMessage>) ||
                        emailExistsError && (<FormErrorMessage>E-Mail doesn&apos;t exist.</FormErrorMessage>)
                    }
                </FormControl>
                <Button
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                        bg: 'blue.500',
                    }}
                    onClick={handleResetPassword}
                    data-cy="requestResetButton"
                >
                    Request Reset
                </Button>
            </Stack>
        </AuthBox>
    );

    const emailSentPage = (
        <Box textAlign="center" py={10} px={6}>
            <InfoIcon boxSize={'50px'} color={'blue.500'} />
            {!emailResent &&
                <Heading as="h2" size="xl" mt={6} mb={2}>
                    Check your Email
                </Heading>
                ||
                <Heading as="h2" size="xl" mt={6} mb={2} data-cy="resendHeader">
                    E-Mail has been resent
                </Heading>
            }
            <Text color={'gray.500'}>
                Check your inbox to reset your password
            </Text>
            {!emailResent &&
                <ScaleFade initialScale={0.9} in={emailSent}>
                    <Button onClick={handleResendEmail} data-cy="resendButton">
                        Resend E-Mail
                    </Button>
                </ScaleFade>
            }
        </Box>
    );

    const changePassword = (
        <AuthBox title="Enter new password">
            <Stack spacing={4}>
                <FormControl id="password" isRequired isInvalid={passwordError}>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            ref={inputPassword}
                            onKeyPress={event => { if (event.key == 'Enter') handleChangePassword() }}
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
                    {passwordError ? (<FormErrorMessage>Password is required.</FormErrorMessage>) : (null)}
                </FormControl>
                <FormControl id="password-verify" isRequired isInvalid={passwordMatchError}>
                    <FormLabel>Repeat Password</FormLabel>
                    <Input
                        type={'password'}
                        ref={inputPasswordVerify}
                        onKeyPress={event => { if (event.key == 'Enter') handleChangePassword() }}
                        data-cy="signUpPasswordVerifyInput"
                    />
                    {passwordMatchError ? (<FormErrorMessage>Password do not match.</FormErrorMessage>) : (null)}
                </FormControl>
                <Stack spacing={6}>
                    <Button
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                            bg: 'blue.500',
                        }}
                        onClick={handleChangePassword}>
                        Submit
                    </Button>
                </Stack>
            </Stack>
        </AuthBox>
    );

    return (
        <Fade in={true}>
            {token && changePassword || emailSent && emailSentPage || resetPasswordEmail}
        </Fade>
    );
};

export default ResetPassword;