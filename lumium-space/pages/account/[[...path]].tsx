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
    Text,
    Box,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { useApi } from "@hooks/api";
import { Authenticator } from "@security";
import Router from "next/router";
import type { UserDTO } from "@types";
import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { SECURE_USER_GET, SECURE_USER_DELETE } from "@routes/api/v1";
import { LANDING_PAGE } from "@routes/space";

const Space: React.FC = () => {
    const [email, setEmail] = useState<string>();
    const [api] = useApi();
    useEffect(() => {
        api.get<UserDTO>(SECURE_USER_GET).then((userinfo) => {
            setEmail(userinfo.data.emails.filter((t) => t.primary)[0]!.email);
        });
    }, [api, email]);
    const handleDelete = () => {
        api.delete(SECURE_USER_DELETE).then(() => Router.push(LANDING_PAGE));
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
                    <Flex flexDirection="column">
                        <Flex flexDirection="column">
                            <Flex width="100%" >
                                <Text mb="0" as="b">Username</Text>
                            </Flex>
                            <Flex width="100%">
                                <Text margin="auto">name</Text>
                                <Spacer />
                                <IconButton mb="1%" aria-label="" icon={<FiEdit2 />} />
                            </Flex>
                        </Flex>
                        <Flex flexDirection="column" mt="1em">
                            <Flex width="100%" >
                                <Text mb="0" as="b">E-Mail</Text>
                            </Flex>
                            <Flex width="100%">
                                <Text margin="auto">{email}</Text>
                                <Spacer />
                                <IconButton mb="1%" aria-label="" icon={<FiEdit2 />} />
                            </Flex>
                        </Flex>
                        <Flex flexDirection="column" mt="1em">
                            <Flex width="100%" >
                                <Text mb="0" as="b">Password</Text>
                            </Flex>
                            <Flex width="100%">
                                <Text margin="auto"></Text>
                                <Spacer />
                                <IconButton mb="1%" aria-label="" icon={<FiEdit2 />} />
                            </Flex>
                        </Flex>
                    </Flex>

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
            </Flex >
        </Authenticator >
    );
};

export default Space;
