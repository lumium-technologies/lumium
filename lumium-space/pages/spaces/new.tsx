import {
    Text,
    Button,
    Flex,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import Router from 'next/router';
import { SPACES_CREATE, SPACES_JOIN } from '@routes/space';

export default function CreateOrJoin() {
    return (
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
                    Request to join an existing Space.
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
                    onClick={() => Router.push(SPACES_JOIN)}
                >
                    Start now
                </Button>
            </Flex>
        </Flex>
    );
}