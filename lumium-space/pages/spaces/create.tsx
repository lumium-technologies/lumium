import React, { useEffect } from 'react';
import { Authenticator } from '@components/security/Authenticator';
import CreateWorkspace from '@components/forms/CreateWorkspace';
import { useColorModeValue } from '@chakra-ui/react';

const MultistepForm: React.FC = () => {
    useEffect(() => {
        document.title = "Lumium | Create your Workspace"
    }, []);
    let disclaimerButtonColor = useColorModeValue('green', 'darkgreen');

    return (
        <Authenticator>
            <CreateWorkspace disclaimerButtonColor={disclaimerButtonColor} />
        </Authenticator >
    );
};

export default MultistepForm;
