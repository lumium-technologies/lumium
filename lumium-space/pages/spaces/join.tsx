import {
    Button,
    FormControl,
    Flex,
    Heading,
    Input,
    Stack,
    Text,
    useColorModeValue,
    FormLabel,
    FormErrorMessage,
} from '@chakra-ui/react';
import { Authenticator } from '@components/security/Authenticator';
import { useRef, useState } from 'react';

const JoinSpace: React.FC = () => {
    const inputSpaceInfo = useRef<HTMLInputElement>(null);
    const inputPassword = useRef<HTMLInputElement>(null);
    const [passwordError, setPasswordError] = useState(false);
    const [credentialsMatchError, setCredentialsMatchError] = useState(false);
    return (
        <Authenticator>
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
                        Join a Space
                    </Heading>
                    <Text
                        fontSize={{ base: 'sm', sm: 'md' }}
                        color={useColorModeValue('gray.800', 'gray.400')}>
                        Fill out this form to gain access to an collaborative space.
                    </Text>
                    <FormControl>
                        <FormLabel>Space name or key</FormLabel>
                        <Input
                            type="text"
                            ref={inputSpaceInfo}
                        />
                    </FormControl>
                    <FormControl id="password" isRequired isInvalid={passwordError || credentialsMatchError}>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            ref={inputPassword}
                        />
                        {
                            passwordError && (<FormErrorMessage>Password is required.</FormErrorMessage>) ||
                            credentialsMatchError && <FormErrorMessage>E-Mail or Password incorrect</FormErrorMessage>
                        }
                    </FormControl>
                    <Stack spacing={6}>
                        <Button
                            bg={'blue.400'}
                            color={'white'}
                            _hover={{
                                bg: 'blue.500',
                            }}
                            data-cy={"button"}>
                            Request Reset
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </Authenticator>
    );
};

export default JoinSpace;