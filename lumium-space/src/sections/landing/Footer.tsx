import {
    chakra,
    Container,
    Stack,
    Text,
    useColorModeValue,
    Image,
    VisuallyHidden,
} from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';
import { ReactNode } from 'react';
import packageInfo from 'package.json';

export function Footer() {
    const darkLogo = '/logo/svg/Black logo - no background.svg';
    const lightLogo = '/logo/svg/White logo - no background.svg';
    const logo = useColorModeValue(darkLogo, lightLogo);

    return (
        <Container
            pos={"fixed"}
            as={Stack}
            bottom={0}
            minW={"100%"}
            py={4}
            direction={{ base: 'column', md: 'row' }}
            spacing={4}
            justify={{ base: 'center', md: 'space-between' }}
            align={{ base: 'center', md: 'center' }}>
            <Image maxH={16} src={logo} alt="lumium logo" />
            <a href={`${packageInfo.repository.url}/releases/${packageInfo.version}`} target="_blank" rel="noreferrer">
                <Text>v{packageInfo.version}</Text>
            </a>
        </Container>
    );
}
