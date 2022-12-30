import React, { ReactNode, useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
    ButtonGroup,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    FormErrorMessage,
} from '@chakra-ui/react';
import { create_workspace } from 'lumium-renderer';
import { useFormik } from 'formik';
import { Heading, Button, Divider, Modal } from "@chakra-ui/react";
import { useWorkspace, useUserInfo } from "@hooks/api";
import { useRouter } from "next/router";
import Router from "next/router";
import { SPACES } from '@routes/space';
import { UserDTO, WorkspaceDTO } from '@types';
import {
    IconButton,
    Avatar,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Stack,
    Icon,
    useColorModeValue,
    Link,
    Image,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    BoxProps,
    FlexProps,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter
} from '@chakra-ui/react';
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
    FiBell,
    FiChevronDown,
    FiPlus,
    FiLock,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import { Authenticator } from '@components/security/Authenticator';

interface LinkItemProps {
    name: string;
    icon: IconType;
}

const LinkItems: Array<LinkItemProps> = [
    { name: 'Home', icon: FiHome },
    { name: 'Trending', icon: FiTrendingUp },
    { name: 'Explore', icon: FiCompass },
    { name: 'Favourites', icon: FiStar },
    { name: 'Settings', icon: FiSettings },
];

function SidebarWithHeader({
    workspace,
    userInfo,
    children,
}: {
    workspace?: WorkspaceDTO;
    userInfo?: UserDTO;
    children: ReactNode;
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <Box minH="100vh">
            <SidebarContent
                onSelfClose={() => onClose}
                display={{ base: 'none', md: 'block' }}
                workspace={workspace}
                userInfo={userInfo}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent onSelfClose={onClose} workspace={workspace} />
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            <MobileNav onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60 }} p="4">
                {children}
            </Box>
        </Box>
    );
}

interface SidebarProps extends BoxProps {
    onSelfClose: () => void;
    workspace?: WorkspaceDTO;
    userInfo?: UserDTO;
}

const SidebarContent = ({ onSelfClose, workspace, userInfo, ...rest }: SidebarProps) => {
    const darkLogo = '/logo/svg/Black logo - no background.svg';
    const lightLogo = '/logo/svg/White logo - no background.svg';
    let logo = useColorModeValue(darkLogo, lightLogo);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [showPassword, setShowPassword] = useState(false);
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
        create_workspace(formik.values.password, formik.values.name).then(() => {
            Router.push(SPACES);
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
    const workspaceCreateModal = (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent maxW={800}>
                <ModalHeader>Create a new workspace</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex
                        flexDirection={"column"}
                        borderWidth="1px"
                        rounded="lg"
                        shadow="1px 1px 3px rgba(0,0,0,0.3)"
                        maxWidth={800}
                        height="50vh"
                        p={6}
                        m="10px auto"
                        alignSelf={"center"}
                    >
                        <form onSubmit={formik.handleSubmit} data-cy={"form"}>
                            {
                                step === 1 && (
                                    <>
                                        <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
                                            Create a new workspace
                                        </Heading>
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
                                    </>
                                ) ||
                                    step === 2 && (
                                        <>
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
                                                <Button backgroundColor={"darkgreen"} onClick={handleDownloadKeys} data-cy={"downloadButton"}>I have read the above disclaimer and understand my own responsibility</Button>
                                            </Flex>
                                        </>
                                )}
                            <ButtonGroup w="100%" mt="5">
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
                                        {step != 2 &&
                                        <Button
                                            w="7rem"
                                            type="submit"
                                            isDisabled={step == 2}
                                            data-cy={"nextButton"}
                                        >
                                            Next
                                        </Button>
                                        }
                                    </Flex>
                                </Flex>
                            </ButtonGroup>
                        </form>
                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );

    return (
        <Flex
            flexDir={"column"}
            transition="3s ease"
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="100%"
            {...rest}>
            {workspaceCreateModal}
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Stack align={'center'}>
                    <Image src={logo} minWidth={"70%"} maxWidth={"80%"} alt="lumium logo" />
                </Stack>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onSelfClose} />
            </Flex>
            {workspace?.name &&
            <Menu>
                <MenuButton p={"2"} bg="none" w="100%" as={Button} leftIcon={<FiChevronDown />}>
                    {workspace?.name}
                </MenuButton>
                <MenuList>
                    {userInfo?.ownedWorkspaces?.length != 0 &&
                    <>
                        {userInfo?.ownedWorkspaces.map((w) => {
                            return <MenuItem key={w.id} as={Button} icon={<FiLock />}>{w.name}</MenuItem>;
                        })}
                        <Divider />
                    </>
                    }
                    {userInfo?.administratedWorkspaces?.length != 0 &&
                        <>
                            {userInfo?.administratedWorkspaces.map((w) => {
                                return <MenuItem key={w.id} as={Button} icon={<FiLock />}>{w.name}</MenuItem>;
                            })}
                            <Divider />
                        </>
                    }
                    {userInfo?.visitorWorkspaces?.length != 0 &&
                        <>
                            {userInfo?.visitorWorkspaces.map((w) => {
                                return <MenuItem key={w.id} as={Button} icon={<FiLock />}>{w.name}</MenuItem>;
                            })}
                            <Divider />
                        </>
                    }
                    <MenuItem as={Button} onClick={onOpen} icon={<FiPlus />}>New workspace</MenuItem>
                </MenuList>
            </Menu>
            }
            <Divider mb="2" />
            <NavItem h="1%" w="100%" icon={FiPlus} mb="2" mt="2" as={Button} bg="none">
                New page
            </NavItem>
            <Divider mt="2" mb="2" />
            {LinkItems.map((link) => (
                <NavItem h="1%" w="100%" key={link.name} icon={link.icon} as={Button} bg="none">
                    {link.name}
                </NavItem>
            ))}
        </Flex>
    );
};

interface NavItemProps extends FlexProps {
    icon: IconType;
    children: ReactText;
}

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
    return (
        <Link href="#" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
            <Flex
                p="4"
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

interface MobileProps extends FlexProps {
    onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
            {...rest}>
            <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Text
                display={{ base: 'flex', md: 'none' }}
                fontSize="2xl"
                fontFamily="monospace"
                fontWeight="bold">
                Logo
            </Text>

            <HStack spacing={{ base: '0', md: '6' }}>
                <IconButton
                    size="lg"
                    variant="ghost"
                    aria-label="open menu"
                    icon={<FiBell />}
                />
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton
                            py={2}
                            transition="all 0.3s"
                            _focus={{ boxShadow: 'none' }}>
                            <HStack>
                                <Avatar
                                    size={'sm'}
                                    src={
                                        'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                                    }
                                />
                                <VStack
                                    display={{ base: 'none', md: 'flex' }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2">
                                    <Text fontSize="sm">Justina Clark</Text>
                                    <Text fontSize="xs" color="gray.600">
                                        Admin
                                    </Text>
                                </VStack>
                                <Box display={{ base: 'none', md: 'flex' }}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            borderColor={useColorModeValue('gray.200', 'gray.700')}>
                            <MenuItem>Profile</MenuItem>
                            <MenuItem>Settings</MenuItem>
                            <MenuItem>Billing</MenuItem>
                            <MenuDivider />
                            <MenuItem>Sign out</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    );
};


const Workspace: React.FC = () => {
    const router = useRouter();
    const { workspaceId } = router.query;
    const workspace = useWorkspace(workspaceId);
    const { userInfo } = useUserInfo();

    return (
        <Authenticator>
            <SidebarWithHeader>
                {
                    (workspace?.name && userInfo?.nickName) &&
                    <Heading>
                        Welcome to the <em>{workspace?.name}</em> workspace, {userInfo?.nickName}!
                    </Heading>
                }
                {
                    workspace?.pages.map((p) => {
                        return (
                            <Button key={p.id} onClick={() => router.push(p.id)}></Button>
                        );
                    })
                }
            </SidebarWithHeader>
        </Authenticator>
    );
};

export default Workspace;
