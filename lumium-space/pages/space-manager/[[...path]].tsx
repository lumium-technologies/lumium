import { Box, BoxProps, Drawer, DrawerContent, Flex, FlexProps, Icon, IconButton, Link, Spacer, Text, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { ProfileMenu, SwitchColorTheme } from "@components/headers";
import { Authenticator } from "@security/authentication";
import { ReactText } from "react";
import { IconType } from "react-icons";
import { FiHome, FiSettings, } from "react-icons/fi";

const Space: React.FC = () => {
    const { isOpen, onClose } = useDisclosure();

    interface LinkItemProps {
        name: string;
        icon: IconType;
        datacy: string;
    }

    const LinkItems: Array<LinkItemProps> = [
        { name: 'Spaces', icon: FiHome, datacy: 'spaces-item' },
        { name: 'Settings', icon: FiSettings, datacy: 'settings-item' },
    ];

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
                    <NavItem key={link.name} icon={link.icon} data-cy={link.datacy}>
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
    };

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

    return (
        <Authenticator>
            <Flex p={["1%"]} borderBottom="1px">
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
        </Authenticator >
    );
};


export default Space;