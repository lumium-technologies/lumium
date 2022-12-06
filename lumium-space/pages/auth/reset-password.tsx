import { InfoIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Box, Button, Fade, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, InputGroup, InputRightElement, ScaleFade, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { useApi } from "@hooks/api";
import { AUTH_SIGNIN, EMAIL_EXISTS, PASSWORD_RESET, PASSWORD_RESET_TOKEN } from "@routes/space";
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
                    setEmailResent(true);
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
        setEmailSent(false);
        setEmailResent(true);
    };

    const resetPasswordEmail = (
        <Flex flexDir="column" minH={'100vh'}>
            <Flex
                minH={'93vh'}
                align={'center'}
                justify={'center'}
                bg={useColorModeValue('gray.50', 'gray.800')}
            >
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
                    <FormControl id="email" isRequired isInvalid={emailError || emailExistsError}>
                        <Input
                            placeholder="your-email@example.com"
                            _placeholder={{ color: 'gray.500' }}
                            type="email"
                            ref={inputEmail}
                            onKeyPress={event => { if (event.key == 'Enter') handleResetPassword() }}
                        />
                        {
                            emailError && (<FormErrorMessage>E-Mail is required.</FormErrorMessage>) ||
                            emailExistsError && (<FormErrorMessage>E-Mail doesn&apos;t exist.</FormErrorMessage>)
                        }
                    </FormControl>
                    <Stack spacing={6}>
                        <Button
                            bg={'blue.400'}
                            color={'white'}
                            _hover={{
                                bg: 'blue.500',
                            }}
                            onClick={handleResetPassword}
                        >
                            Request Reset
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </Flex>
    );

    const changePassword = (
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
                    Enter new password
                </Heading>
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
        </Flex>
    );

    const emailSentPage = (
        <Box textAlign="center" py={10} px={6}>
            <InfoIcon boxSize={'50px'} color={'blue.500'} />
            {emailResent ?
                <Heading as="h2" size="xl" mt={6} mb={2}>
                    Check your Email
                </Heading>
                :
                <Heading as="h2" size="xl" mt={6} mb={2}>
                    E-Mail has been resend
                </Heading>
            }
            <Text color={'gray.500'}>
                Check your inbox to reset your password
            </Text>
            <ScaleFade initialScale={0.9} in={emailResent}>
                <Button onClick={handleResendEmail}>
                    Resend E-Mail
                </Button>
            </ScaleFade>
        </Box>
    );

    const emailResendPage = (
        <Fade in={true}>
            <Box textAlign="center" py={10} px={6}>
                <InfoIcon boxSize={'50px'} color={'blue.500'} />
                <Heading as="h2" size="xl" mt={6} mb={2}>
                    E-Mail has been resend
                </Heading>
                <Text color={'gray.500'}>
                    Check your inbox to reset your password
                </Text>
            </Box>
        </Fade>
    );

    return (
        <Fade in={true}>
            {token && changePassword || emailSent && emailSentPage || emailResent && emailResendPage || resetPasswordEmail}
        </Fade>
    );
};

export default ResetPassword;