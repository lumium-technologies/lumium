import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Stack,
    Collapse,
    Icon,
    Link,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useColorModeValue,
    useDisclosure,
    useColorMode,
    Image,
    HStack,
    Spacer,
    MenuButton,
    Avatar,
    Menu,
    MenuDivider,
    MenuItem,
    MenuList,
} from '@chakra-ui/react';
import {
    HamburgerIcon,
    CloseIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    MoonIcon,
    SunIcon,
} from '@chakra-ui/icons';
import Router from 'next/router';
import { ACCOUNT, AUTH_SIGNIN, AUTH_SIGNUP } from '@routes/space';
import packageInfo from 'package.json';
import { ReactElement, useEffect, useState } from "react";
import { useApi } from "@hooks/api";
import { SECURE_AUTH_SIGNOUT, SECURE_PONG } from '@routes/api/v1';

interface NavBarProps {
    logo: string;
}

export const NavBar = ({ logo }: NavBarProps) => {
    const { isOpen, onToggle } = useDisclosure();
    const { colorMode, toggleColorMode } = useColorMode();
    const [loginStatus, setLoginStatus] = useState(false);
    const [api] = useApi();

    const handleLogout = () => {
        api.post(SECURE_AUTH_SIGNOUT).then(() => Router.reload());
    };

    useEffect(() => {
        api.get(SECURE_PONG).then((res) => {
            if (res.status == 200) {
                setLoginStatus(true);
            } else {
                setLoginStatus(false);
            }
        });
    }, [api]);

    return (
        <Box>
            <Flex
                minH={'60px'}
                py={{ base: 2 }}
                px={{ base: 4 }}
                align={'center'}>
                <Flex
                    flex={{ base: 1, lg: 'auto' }}
                    ml={{ base: -2 }}
                    display={{ base: 'flex', lg: 'none' }}>
                    <IconButton
                        onClick={onToggle}
                        icon={
                            isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
                        }
                        variant={'ghost'}
                        aria-label={'Toggle Navigation'}
                    />
                </Flex>
                <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
                    <HStack>
                        <Link display={{ base: 'none', lg: 'flex' }} href="https://lumium.space/" width={"10rem"}>
                            <Image src={logo} alt="lumium logo" />
                        </Link>
                        <Spacer />
                        <Flex display={{ base: 'none', lg: 'flex' }} ml={10}>
                            <DesktopNav />
                        </Flex>
                    </HStack>
                </Flex>
                <Button onClick={toggleColorMode} data-cy="switchThemeButton" mr="1%">
                    {colorMode === 'light' && <MoonIcon /> || <SunIcon />}
                </Button>
                {
                    loginStatus && (
                        <Flex alignItems={'center'}>
                            <Menu>
                                <MenuButton
                                    as={Button}
                                    rounded={'full'}
                                    variant={'link'}
                                    cursor={'pointer'}
                                    minW={0}
                                >
                                    <Avatar
                                        size={'sm'}
                                        src={
                                            'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                                        }
                                    />
                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={() => Router.push(ACCOUNT)}>Account</MenuItem>
                                    <MenuDivider />
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                </MenuList>
                            </Menu>
                        </Flex>
                    ) || (
                        <Stack
                            flex={{ base: 1, md: 0 }}
                            justify={'end'}
                            direction={'row'}
                            spacing={2}>
                            <Button
                                fontSize={'sm'}
                                fontWeight={400}
                                onClick={() => Router.push(AUTH_SIGNIN)}
                                data-cy="signInButton"
                            >
                                Sign In
                            </Button>
                            <Button
                                fontSize={'sm'}
                                fontWeight={600}
                                bg={"blue.400"}
                                onClick={() => Router.push(AUTH_SIGNUP)}
                                data-cy="signUpButton"
                            >
                                Sign Up
                            </Button>
                        </Stack>
                    )
                }
            </Flex>
            <Collapse in={isOpen} animateOpacity>
                <MobileNav />
            </Collapse>
        </Box>
    );
}

const DesktopNav = () => {
    return (
        <Stack direction={'row'} spacing={4}>
            {NAV_ITEMS.map((navItem) => (
                <Box key={navItem.label}>
                    <Popover trigger={'hover'} placement={'bottom-start'}>
                        <PopoverTrigger>
                            <Link
                                p={2}
                                href={navItem.href ?? '#'}
                                fontSize={{ base: 'md', 'xxLarge': 'lg' }}
                                fontWeight={500}>
                                {navItem.label}
                            </Link>
                        </PopoverTrigger>

                        {navItem.children && (
                            <PopoverContent
                                border={0}
                                bg={"transparent"}
                                boxShadow={'xl'}
                                p={4}
                                rounded={'xl'}
                                minW={'sm'}>
                                <Stack>
                                    {navItem.children.map((child) => (
                                        <DesktopSubNav key={child.label} {...child} />
                                    ))}
                                </Stack>
                            </PopoverContent>
                        )}
                    </Popover>
                </Box>
            ))}
        </Stack>
    );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
    return (
        <Link
            href={href}
            role={'group'}
            display={'block'}
            p={2}
            rounded={'md'}>
            <Stack direction={'row'} align={'center'}>
                <Box>
                    <Text
                        transition={'all .3s ease'}
                        fontWeight={500}>
                        {label}
                    </Text>
                    <Text fontSize={'sm'}>{subLabel}</Text>
                </Box>
                <Flex
                    transition={'all .3s ease'}
                    transform={'translateX(-10px)'}
                    opacity={0}
                    _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
                    justify={'flex-end'}
                    align={'center'}
                    flex={1}>
                    <Icon w={5} h={5} as={ChevronRightIcon} />
                </Flex>
            </Stack>
        </Link>
    );
};

const MobileNav = () => {
    return (
        <Stack
            p={4}
            display={{ lg: 'none' }}>
            {NAV_ITEMS.map((navItem) => (
                <MobileNavItem key={navItem.label} {...navItem} />
            ))}
        </Stack>
    );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
    const { isOpen, onToggle } = useDisclosure();

    return (
        <Stack spacing={4} onClick={children && onToggle}>
            <Flex
                py={2}
                as={Link}
                href={href ?? '#'}
                justify={'space-between'}
                align={'center'}
                _hover={{
                    textDecoration: 'none',
                }}>
                <Text
                    fontWeight={600}>
                    {label}
                </Text>
                {children && (
                    <Icon
                        as={ChevronDownIcon}
                        transition={'all .25s ease-in-out'}
                        transform={isOpen ? 'rotate(180deg)' : ''}
                        w={6}
                        h={6}
                    />
                )}
            </Flex>

            <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
                <Stack
                    mt={2}
                    pl={4}
                    borderLeft={1}
                    borderStyle={'solid'}
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    align={'start'}>
                    {children &&
                        children.map((child) => (
                            <Link key={child.label} py={2} href={child.href}>
                                {child.label}
                            </Link>
                        ))}
                </Stack>
            </Collapse>
        </Stack>
    );
};

interface NavItem {
    label: string;
    subLabel?: string;
    children?: Array<NavItem>;
    href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
    {
        label: 'Features',
        children: [
            {
                label: 'Explore Design Work',
                subLabel: 'Trending Design to inspire you',
                href: '#',
            },
            {
                label: 'New & Noteworthy',
                subLabel: 'Up-and-coming Designers',
                href: '#',
            },
        ],
    },
    {
        label: 'Security',
        href: '/security',
    },
    {
        label: 'Source Code',
        href: `${packageInfo.repository.url}/`,
    },
    {
        label: 'Changelog',
        href: `${packageInfo.repository.url}/releases/latest`,
    },
    {
        label: 'Pricing',
        href: '/pricing',
    },
];
