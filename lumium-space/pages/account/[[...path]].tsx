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
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { useApi } from "@hooks/api";
import { Authenticator } from "@security";
import Router from "next/router";
import type { User } from "@types";

export async function getServerSideProps() {
    const [api] = useApi();
    const userinfo = await api.get<User>("/secure/user");
    return {
        props: {
            userinfo
        },
    }
}
const Space: React.FC = () => {
    const [api] = useApi();

    const handleDelete = () => {
        api.delete("/secure/user").then(() => Router.push("/"));
    };

    return (
        <Authenticator>
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
        </Authenticator >
    );
};

export default Space;