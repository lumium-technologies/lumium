import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import {DownloadIcon} from '@chakra-ui/icons';

import { useToast } from '@chakra-ui/react';


import { ProfileMenu } from "@components/headers";
import { Authenticator } from "@security/authentication";

const WorkspaceSettings = () => {
    const [show, setShow] = React.useState(false);
    const handleClick = () => setShow(!show);
    return (
        <>
            <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
                New Workspace
            </Heading>
            <Flex>
                <FormControl>
                    <FormLabel htmlFor="workspace-name" fontWeight={'normal'}>
                        Workspace name
                    </FormLabel>
                    <Input id="workspace-name" placeholder="Workspace name" />
                </FormControl>
            </Flex>
            <FormControl>
                <FormLabel htmlFor="password" fontWeight={'normal'} mt="2%">
                    Workspace password
                </FormLabel>
                <InputGroup size="md">
                    <Input
                        pr="4.5rem"
                        type={show ? 'text' : 'password'}
                        placeholder="Enter password"
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
        </>
    );
};

const RecoveryCodes = () => {
    return (
        <>
            <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
                Recovery Codes
            </Heading>
            <Button
                size='md'
                height='48px'
                width='100%'
                border='2px'
                borderColor='green.500'
                leftIcon={<DownloadIcon />}
            >
                Download and store in secure location (mandatory)
            </Button>
        </>
    );
};

const AllSet = () => {
    return (
        <>
            <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
                All Set!
            </Heading>
        </>
    );
}

export default function Multistep() {
    const toast = useToast();
    const [step, setStep] = useState(1);
    const [progress, setProgress] = useState(33.33);
    return (
        <Authenticator>
            <Box
                borderWidth="1px"
                rounded="lg"
                shadow="1px 1px 3px rgba(0,0,0,0.3)"
                maxWidth={800}
                p={6}
                m="10px auto"
                as="form">
                <Progress
                    hasStripe
                    value={progress}
                    mb="5%"
                    mx="5%"
                    isAnimated></Progress>
                {step === 1 ? <WorkspaceSettings /> : step === 2 ? <RecoveryCodes /> : <AllSet />}
                <ButtonGroup mt="5%" w="100%">
                    <Flex w="100%" justifyContent="space-between">
                        <Flex>
                            <Button
                                onClick={() => {
                                    setStep(step - 1);
                                    setProgress(progress - 33.33);
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
                                        setProgress(progress + 33.33);
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
                                        title: 'Workspace created.',
                                        description: "We've created your workspace for you.",
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
            </Box>
        </Authenticator>
    );
}
