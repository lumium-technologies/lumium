import React from 'react';
import { Authenticator } from '@components/security/Authenticator';
import CreateWorkspace from '@components/forms/CreateWorkspace';
import { useColorModeValue } from '@chakra-ui/react';

const MultistepForm: React.FC = () => {
    let disclaimerButtonColor = useColorModeValue('green', 'darkgreen');

    return (
        <Authenticator>
            <CreateWorkspace disclaimerButtonColor={disclaimerButtonColor} />
        </Authenticator >
    );
};

export default MultistepForm;
