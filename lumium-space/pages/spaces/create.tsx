import React from 'react';
import { Authenticator } from '@components/security/Authenticator';
import { CreateWorkspace, PageTitle } from '@components/other';

const MultistepForm: React.FC = () => {
    return (
        <>
            <PageTitle title={"Lumium | Create your Space"} />
            <Authenticator>
                <CreateWorkspace />
            </Authenticator >
        </>
    );
};

export default MultistepForm;
