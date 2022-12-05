import React, { useRef, useState } from 'react';
import {
    Progress,
    Box,
    ButtonGroup,
    Button,
    Heading,
    Flex,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    FormErrorMessage,
    Text
} from '@chakra-ui/react';

import { useToast } from '@chakra-ui/react';
import { Authenticator } from '@components/security/Authenticator';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const SpaceSpecification = () => {
    const inputPassword = useRef<HTMLInputElement>(null);
    const [passwordError, setPasswordError] = useState(false);
    const inputPasswordVerify = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState(false);
    return (
        <>
            <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
                Private Space Creation
            </Heading>
            <FormControl mr="5%">
                <FormLabel htmlFor="first-name" fontWeight={'normal'}>
                    Your Private Space Name
                </FormLabel>
                <Input />
            </FormControl>
            <FormControl id="password" isRequired isInvalid={passwordError}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        ref={inputPassword}
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
                {passwordError && (<FormErrorMessage>Password is required.</FormErrorMessage>)}
            </FormControl>
            <FormControl id="password-verify" isRequired isInvalid={passwordMatchError}>
                <FormLabel>Repeat Password</FormLabel>
                <Input
                    type={showPassword ? 'text' : 'password'}
                    ref={inputPasswordVerify}
                    data-cy="signUpPasswordVerifyInput"
                />
                {passwordMatchError && (<FormErrorMessage>Password do not match.</FormErrorMessage>)}
            </FormControl>
        </>
    );
};

const DownloadPrivateKeysPage = () => {
    return (
        <>
            <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
                Download Private Keys
            </Heading>
            <Text w="100%" textAlign={'center'}>
                Download your private keys and secure them in a safe location. These will be needed in case you forget your password.
            </Text>
            <Flex w="100%" justifyContent="center">
                <Button backgroundColor={"lightgreen"}>Download Keys</Button>
            </Flex>
        </>
    );
};

export default function multistep() {
    const toast = useToast();
    const [step, setStep] = useState(1);
    const [progress, setProgress] = useState(50);
    return (
        <Authenticator>
            <Flex
                flexDirection={"column"}
                borderWidth="1px"
                rounded="lg"
                shadow="1px 1px 3px rgba(0,0,0,0.3)"
                maxWidth={800}
                height="50vh"
                p={6}
                m="10px auto"
                as="form">
                <Progress
                    hasStripe
                    value={progress}
                    mb="5%"
                    mx="5%"
                    isAnimated></Progress>
                {step === 1 && <SpaceSpecification /> || step === 2 && <DownloadPrivateKeysPage />}
                <ButtonGroup w="100%" mt="auto">
                    <Flex w="100%" justifyContent="space-between">
                        <Flex>
                            <Button
                                onClick={() => {
                                    setStep(step - 1);
                                    setProgress(progress - 50);
                                }}
                                isDisabled={step === 1}
                                colorScheme="teal"
                                variant="solid"
                                w="7rem"
                                mr="5%">
                                Back
                            </Button>
                            <Button
                                w="7rem"
                                isDisabled={step === 3}
                                onClick={() => {
                                    setStep(step + 1);
                                    if (step === 3) {
                                        setProgress(100);
                                    } else {
                                        setProgress(progress + 50);
                                    }
                                }}
                                colorScheme="teal"
                                variant="outline">
                                Next
                            </Button>
                        </Flex>
                        {step === 3 ? (
                            <Button
                                w="7rem"
                                colorScheme="red"
                                variant="solid"
                                onClick={() => {
                                    toast({
                                        title: 'Account created.',
                                        description: "We've created your account for you.",
                                        status: 'success',
                                        duration: 3000,
                                        isClosable: true,
                                    });
                                }}>
                                Submit
                            </Button>
                        ) : null}
                    </Flex>
                </ButtonGroup>
            </Flex>
        </Authenticator >
    );
}