import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useColorMode, useColorModeValue, Box, Image, Text, FlexProps, Flex, IconButton, Stack, HStack, Button, Menu, MenuButton, Avatar, VStack, MenuList, MenuItem, MenuDivider, Spacer } from "@chakra-ui/react";
import { UserDTO, WorkspaceDTO } from "@types";
import { FiMenu, FiBell, FiChevronDown } from "react-icons/fi";

interface MobileProps extends FlexProps {
    onOpen: () => void;
    userInfo?: UserDTO;
    workspace?: WorkspaceDTO;
}

const MobileNav = ({ onOpen, userInfo, workspace, ...rest }: MobileProps) => {
    const { colorMode, toggleColorMode } = useColorMode();

    let role = ""
    if (userInfo?.id) {
        if (workspace?.ownerId == userInfo?.id) {
            role = "Owner"
        } else if (workspace?.admins.includes(userInfo?.id)) {
            role = "Admin"
        } else if (workspace?.members.includes(userInfo?.id)) {
            role = "Member"
        } else if (workspace?.visitors.includes(userInfo?.id)) {
            role = "Visitor"
        }
    }

    return (
        <Flex
            alignItems={"Center"}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            {...rest}
            pl={{ base: "4%", md: "2%" }}
            pr={{ base: "4%", md: "2%" }}
            pt={"1vh"}
            pb={"1vh"}
        >
            <IconButton
                display={'flex'}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />
            <Spacer />
            <HStack>
                <IconButton
                    size="lg"
                    variant="ghost"
                    aria-label="open menu"
                    icon={<FiBell />}
                />
                <Button onClick={toggleColorMode} data-cy="switchThemeButton" mr="1%">
                    {colorMode === 'light' && <MoonIcon /> || <SunIcon />}
                </Button>
                <Flex>
                    <Menu>
                        <MenuButton
                            py={2}
                            transition="all 0.3s"
                            _focus={{ boxShadow: 'none' }}
                        >
                            <HStack>
                                <Avatar
                                    size={'sm'}
                                    src={
                                        'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                                    }
                                />
                                <VStack
                                    display={'flex'}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2">
                                    <Text fontSize="sm">{userInfo?.nickName}</Text>
                                    <Text fontSize="xs" color="gray.600">
                                        {role}
                                    </Text>
                                </VStack>
                                <Box display={'flex'}>
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
        </Flex >
    );
};
export default MobileNav;
