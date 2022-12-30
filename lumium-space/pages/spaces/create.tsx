import React from 'react';
import { Authenticator } from '@components/security/Authenticator';
import CreateWorkspace from '@components/forms/CreateWorkspace';

const MultistepForm: React.FC = () => {
    return (
        <Authenticator>
            <CreateWorkspace />
        </Authenticator >
    );
};

export default MultistepForm;
