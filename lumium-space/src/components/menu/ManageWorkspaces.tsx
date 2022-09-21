import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, BoxProps, CloseButton, Drawer, DrawerContent, Flex, FlexProps, Icon, IconButton, Link, Spacer, Text, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { ProfileMenu, SwitchColorTheme } from "@components/headers";
import { useRouter } from "next/router";
import { ReactText } from "react";
import { IconType } from "react-icons";
import { FiCompass, FiHome, FiSettings, FiStar, FiTrendingUp } from "react-icons/fi";
interface LinkItemProps {
    name: string;
    icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [
    { name: 'Spaces', icon: FiHome },
    { name: 'Settings', icon: FiSettings },
];
function ManageWorkspaces() {
    const router = useRouter()
    const { isOpen, onClose } = useDisclosure();
    return (
        <>
            <Flex p={["1%"]} borderBottom="1px">
                <IconButton onClick={() => router.back()} aria-label={''} icon={<ArrowBackIcon />} data-cy="back-button" >
                    Back
                </IconButton>
                <Text fontSize="2xl" ml={["1%"]} mb={["0"]} >Manage Workspaces</Text>
                <Spacer />

                <SwitchColorTheme />

                <ProfileMenu />
            </Flex>
            <Box minH="100vh">
                <SidebarContent
                    onClose={() => onClose}
                    display={{ base: 'none', md: 'block' }}
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
                        <SidebarContent onClose={onClose} />
                    </DrawerContent>
                </Drawer>
            </Box>
        </ >
    );
};
interface SidebarProps extends BoxProps {
    onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            borderRight="1px"
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            {LinkItems.map((link) => (
                <NavItem key={link.name} icon={link.icon}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    );
};

type NewType = ReactText;

interface NavItemProps extends FlexProps {
    icon: IconType;
    children: NewType;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
    return (
        <Link href="#" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'cyan.400',
                    color: 'white',
                }}
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

export { ManageWorkspaces };