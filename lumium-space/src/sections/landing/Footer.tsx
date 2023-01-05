import {
    useColorModeValue,
    Image,
    Flex,
    Link,
} from '@chakra-ui/react';
import packageInfo from 'package.json';
import { LOGO_DARK, LOGO_LIGHT } from '@definitions/constants';

export const Footer = () => {
    return (
        <Flex
            pos={"fixed"}
            bottom={"0"}
            minW={"100%"}
            flexDirection={{ base: 'column', md: 'row' }}
            justifyContent={{ base: 'center', md: 'flex-end' }}
            pb={"2vh"}
            pr={{ base: "none", md: "2vh" }}
        >
            <Image display={{ base: 'flex', md: 'none' }} maxH={16} src={useColorModeValue(LOGO_DARK, LOGO_LIGHT)} alt="lumium logo" />
            <Link href={`${packageInfo.repository.url}/releases/${packageInfo.version}`} target="_blank" alignSelf={"center"}>
                v{packageInfo.version}
            </Link>
        </Flex>
    );
}
