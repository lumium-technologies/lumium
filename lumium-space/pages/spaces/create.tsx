import React, { useRef, useState } from 'react';
import {
    Progress,
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
import { Authenticator } from '@components/security/Authenticator';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { create_workspace } from 'lumium-renderer';
import { useFormik } from 'formik';

const MultistepForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [downloadedKeys, setDownloadedKeys] = useState(false);
    const [credentialsMatchError, setCredentialsMatchError] = useState(false);
    const [step, setStep] = useState(1);
    const [progress, setProgress] = useState(50);
    const nextStep = () => {
        if (formik.values.password == formik.values.passwordConfirm) {
            setStep(step + 1);
            if (step === 2) {
                setProgress(100);
            } else {
                setProgress(progress + 50);
            };
        } else {
            setCredentialsMatchError(true);
        }
    };
    const handleEnter = (event) => {
        if (event.key == "Enter") {
            nextStep();
        };
    };
    const handleDownloadKeys = () => {
        create_workspace(formik.values.password);
        setDownloadedKeys(true);
    };
    const formik = useFormik({
        initialValues: {
            name: "",
            password: "",
            passwordConfirm: ""
        },
        onSubmit: () => {
            nextStep();
        },
        validateOnChange: (false),
    });
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
            >
                <Progress
                    hasStripe
                    value={progress}
                    mb="5%"
                    mx="5%"
                    isAnimated />
                <form onSubmit={formik.handleSubmit} data-cy={"form"}>
                    {
                        step === 1 && (
                            <>
                                <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
                                    Space Creation
                                </Heading>
                                <FormControl isRequired>
                                    <FormLabel fontWeight={'normal'}>
                                        Your Space Name
                                    </FormLabel>
                                    <Input
                                        name={"name"}
                                        type='text'
                                        onChange={formik.handleChange}
                                        value={formik.values.name}
                                        data-cy={"nameInput"}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Password</FormLabel>
                                    <InputGroup>
                                        <Input
                                            name={"password"}
                                            type={showPassword ? 'text' : 'password'}
                                            onChange={formik.handleChange}
                                            value={formik.values.password}
                                            onKeyPress={handleEnter}
                                            data-cy={"passwordInput"}
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
                                <FormControl isRequired isInvalid={credentialsMatchError}>
                                    <FormLabel>Repeat Password</FormLabel>
                                    <Input
                                        name={"passwordConfirm"}
                                        type={'password'}
                                        onChange={formik.handleChange}
                                        value={formik.values.passwordConfirm}
                                        onKeyPress={handleEnter}
                                        data-cy={"passwordConfirmInput"}
                                    />
                                    <FormErrorMessage data-cy={"passwordMatchError"}>Password doesn&apos;t match</FormErrorMessage>
                                </FormControl>
                            </>
                        ) ||
                        step === 2 && (
                            <>
                                <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
                                    Download Recovery Keys
                                </Heading>
                                <Text w="100%" textAlign={'center'}>
                                    Download your recovery keys and secure them in a safe location. These will be needed in case you forget your password.
                                </Text>
                                <Flex w="100%" justifyContent="center">
                                    <Button backgroundColor={"lightgreen"} onClick={handleDownloadKeys} data-cy={"downloadButton"}>Download Keys and Create Space</Button>
                                </Flex>
                            </>
                        )}
                    <ButtonGroup w="100%" mt="auto">
                        <Flex w="100%" justifyContent="space-between">
                            <Flex>
                                <Button
                                    onClick={() => {
                                        setStep(step - 1);
                                        setProgress(progress - 50);
                                    }}
                                    isDisabled={step == 1}
                                    colorScheme="teal"
                                    variant="solid"
                                    w="7rem"
                                    mr="5%"
                                    data-cy={"backButton"}
                                >
                                    Back
                                </Button>
                                <Button
                                    w="7rem"
                                    type="submit"
                                    isDisabled={step == 2}
                                    data-cy={"nextButton"}
                                >
                                    Next
                                </Button>
                            </Flex>
                            {
                                downloadedKeys && (
                                    <Button
                                        w="7rem"
                                        colorScheme="red"
                                        variant="solid"
                                        data-cy={"submitButton"}
                                    >
                                        Submit
                                    </Button>
                                )
                            }
                        </Flex>
                    </ButtonGroup>
                </form>
            </Flex>
        </Authenticator >
    );
};

export default MultistepForm;