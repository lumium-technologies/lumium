import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    Avatar,
    AvatarBadge,
    IconButton,
    Center,
    Spacer,
    Text
} from '@chakra-ui/react';
import Router from "next/router";
import { signOut } from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import { ArrowBackIcon } from "@chakra-ui/icons";

import { SmallCloseIcon } from '@chakra-ui/icons';
import { useApi } from '@hooks/api';


export default function UserProfileEdit(): JSX.Element {
    const [api] = useApi();

    function handleDelete() {
        signOut();
        api.delete("/secure/user").then(() => Router.push("/"));
    }
    const onBack = () => {
        Router.push("/page");
    }

    return (
        <>
            <Flex p={["1%"]} borderBottom="1px">
                <Text fontSize="2xl" ml={["1%"]} mb={["0"]} >My Account</Text>
                <Spacer />
                <Button backgroundColor={"darkred"} onClick={handleDelete} data-cy="delete-button">
                    Delete Account
                </Button>
            </Flex>
            <Flex
                minH={'90vh'}
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
                    <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                        User Profile Edit
                    </Heading>
                    <FormControl id="userName">
                        <FormLabel>User Icon</FormLabel>
                        <Stack direction={['column', 'row']} spacing={6}>
                            <Center>
                                <Avatar size="xl" src="https://bit.ly/sage-adebayo" data-cy="avatar-image">
                                    <AvatarBadge
                                        as={IconButton}
                                        size="sm"
                                        rounded="full"
                                        top="-10px"
                                        colorScheme="red"
                                        aria-label="remove Image"
                                        icon={<SmallCloseIcon />}
                                    />
                                </Avatar>
                            </Center>
                            <Center w="full">
                                <Button w="full" data-cy="change-icon-button">Change Icon</Button>
                            </Center>
                        </Stack>
                    </FormControl>
                    <FormControl id="userName" isRequired>
                        <FormLabel>User name</FormLabel>
                        <Input
                            placeholder="UserName"
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                            data-cy="username-input"
                        />
                    </FormControl>
                    <FormControl id="email" isRequired>
                        <FormLabel>Email address</FormLabel>
                        <Input
                            placeholder="your-email@example.com"
                            _placeholder={{ color: 'gray.500' }}
                            type="email"
                            data-cy="email-input"
                        />
                    </FormControl>
                    <FormControl id="password" isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input
                            placeholder="password"
                            _placeholder={{ color: 'gray.500' }}
                            type="password"
                            data-cy="password-input"
                        />
                    </FormControl>
                    <Stack spacing={6} direction={['column', 'row']}>
                        <Button
                            bg={'red.400'}
                            color={'white'}
                            w="full"
                            _hover={{
                                bg: 'red.500',
                            }}
                            data-cy="cancel-button">
                            Cancel
                        </Button>
                        <Button
                            bg={'blue.400'}
                            color={'white'}
                            w="full"
                            _hover={{
                                bg: 'blue.500',
                            }}
                            data-cy="submit-button">
                            Submit
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </>
    );
}
export { UserProfileEdit };
