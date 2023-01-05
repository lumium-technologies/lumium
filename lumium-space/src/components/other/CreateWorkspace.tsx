import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Flex, Text, Heading, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, FormErrorMessage, ButtonGroup, useColorModeValue } from "@chakra-ui/react";
import { useUserInfo } from "@hooks/api";
import { ROOT } from "@routes/space";
import { useFormik } from 'formik';
import { create_workspace } from "lumium-renderer";
import Router from "next/router";
import { useState } from "react";
import { WidgetCentered } from "./WidgetCentered";
interface CreateWorkspaceProps {
    standalone?: boolean;
}
export const CreateWorkspace = ({ standalone = true }: CreateWorkspaceProps) => {
    const buttonBackground = useColorModeValue("green.200", "green.900");
    const [showPassword, setShowPassword] = useState(false);
    const [credentialsMatchError, setCredentialsMatchError] = useState(false);
    const [step, setStep] = useState(1);
    const [progress, setProgress] = useState(50);
    const { refetchUserInfo } = useUserInfo();

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
        create_workspace(formik.values.password, formik.values.name).then(() => {
            refetchUserInfo().then((info) => {
                localStorage.setItem('workspacePassword', formik.values.password);
                Router.push(ROOT + info?.recentWorkspace.id);
            });
        });
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
        <form onSubmit={formik.handleSubmit} data-cy={"form"}>
            <Flex
                height={standalone && "100vh" || "fit-content"}
                justifyContent={"center"}
            >
                <Flex
                    flexDirection={"column"}
                    borderWidth="1px"
                    rounded="lg"
                    shadow="1px 1px 3px rgba(0,0,0,0.3)"
                    p={{ base: "0", md: "1vh" }}
                    m="2vh"
                    width={standalone && { base: "100%", md: "70vh" } || "100%"}
                    minH={"85vh"}
                    justifyContent="space-between"
                >
                    {
                        step === 1 && (
                            <WidgetCentered title="Create a new workspace" height="none">
                                <FormControl isRequired>
                                    <FormLabel fontWeight={'normal'}>
                                        Workspace Name
                                    </FormLabel>
                                    <Input
                                        name={"name"}
                                        type='text'
                                        onChange={formik.handleChange}
                                        value={formik.values.name}
                                        data-cy={"nameInput"}
                                    />
                                </FormControl>
                                <FormControl isRequired mt="5">
                                    <FormLabel>Master Workspace Password</FormLabel>
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
                                <FormControl isRequired isInvalid={credentialsMatchError} mt="5" >
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
                            </WidgetCentered>
                        ) ||
                            step === 2 && (
                                <Flex
                                    py={"3%"}
                                    px={"5%"}
                                    flexDirection={"column"}
                                >
                                    <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
                                        Download Recovery Keys
                                    </Heading>
                                    <Heading textAlign={'center'}>
                                        DISCLAIMER
                                    </Heading>
                                    <Text w="100%" mt={"5"}>
                                        Download your recovery keys and secure them in a safe location. These will be needed in case you forget your password.
                                    </Text>
                                    <Text w="100%" mt={"5"}>
                                        If you do not have access to your password or your recovery codes, you will not be able to decrypt the content in your workspace. We at lumium will not be able to help you recover your data.
                                    </Text>
                                    <Text w="100%" mt={"5"}>
                                        As your data is fully end-to-end encrypted, key management is your sole responsibility. You will be able to generate additional codes and invalidate existing codes later on.
                                    </Text>
                                    <Text w="100%" mt={"5"}>
                                        As soon as you click the button below, your workspace will be created and you will be prompted to download your recovery keys. The downloaded file will be named `lumium_recovery_keys.txt` and will contain one key per line.
                                    </Text>
                                    <Text w="100%" mt={"5"}>
                                        lumium cannot read your workspace content, except for some metadata (information like which users have access to which workspace, your workspace title, which page was created by which user, when was the last time a user has logged in etc.). We cannot read data like the titles/content of pages in your workspace.
                                    </Text>
                                    <Flex w="100%" mt={"5"} justifyContent="center">
                                        <Button backgroundColor={buttonBackground} onClick={handleDownloadKeys} data-cy={"downloadButton"}>I have read the above disclaimer and understand my responsibility</Button>
                                    </Flex>
                                </Flex>
                        )}
                    <ButtonGroup w="100%" mt="5">
                        <Flex w="100%" justifyContent="space-between">
                            <Button
                                onClick={() => {
                                    setStep(step - 1);
                                    setProgress(progress - 50);
                                }}
                                isDisabled={step == 1}
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
                    </ButtonGroup>
                </Flex>
            </Flex>
        </form >
    )
}
