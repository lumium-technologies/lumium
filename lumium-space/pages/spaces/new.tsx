import {
    Text,
    Button,
    Flex,
} from '@chakra-ui/react';
import Router from 'next/router';
import { SPACES_CREATE, SPACES_JOIN } from '@routes/space';
import { Authenticator } from '@components/security/Authenticator';

const CreateOrJoin: React.FC = () => {
    return (
        <Authenticator>
            <Flex justifyContent={"center"} width="100%">
                <Flex
                    m={"5%"}
                    w={'30%'}
                    boxShadow={'2xl'}
                    rounded={'md'}
                    overflow={'hidden'}
                    flexDir="column"
                    padding={"4%"}
                >
                    <Text fontSize={'6xl'} fontWeight={800}>
                        Create Space
                    </Text>
                    <Text fontSize={'2xl'}>
                        Create your own space now and add collaborators.
                    </Text>
                    <Button
                        mt="auto"
                        w={'full'}
                        bg={'green.400'}
                        color={'white'}
                        rounded={'xl'}
                        boxShadow={'0 5px 20px 0px rgb(72 187 120 / 43%)'}
                        _hover={{
                            bg: 'green.500',
                        }}
                        _focus={{
                            bg: 'green.500',

                        }}
                        data-cy={"createButton"}
                        onClick={() => Router.push(SPACES_CREATE)}
                    >
                        Start now
                    </Button>
                </Flex>
                <Flex
                    m={"5%"}
                    w={'30%'}
                    boxShadow={'2xl'}
                    rounded={'md'}
                    overflow={'hidden'}
                    flexDir="column"
                    padding={"4%"}
                >
                    <Text fontSize={'6xl'} fontWeight={800}>
                        Join Space
                    </Text>
                    <Text fontSize={'2xl'}>
                        Join an existing collaborative Space with Spacekey and Spacepassword.
                    </Text>
                    <Button
                        mt="auto"
                        w={'full'}
                        bg={'green.400'}
                        color={'white'}
                        rounded={'xl'}
                        boxShadow={'0 5px 20px 0px rgb(72 187 120 / 43%)'}
                        _hover={{
                            bg: 'green.500',
                        }}
                        _focus={{
                            bg: 'green.500',
                        }}
                        data-cy={"joinButton"}
                        onClick={() => Router.push(SPACES_JOIN)}
                    >
                        Start now
                    </Button>
                </Flex>
            </Flex>
        </Authenticator>
    );
};

export default CreateOrJoin;