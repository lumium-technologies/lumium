import React from 'react';
import { Authenticator } from '@components/security/Authenticator';
import { CreateWorkspace, PageTitle } from '@components/other';
import { useColorModeValue } from '@chakra-ui/react';

const MultistepForm: React.FC = () => {
    let disclaimerButtonColor = useColorModeValue('green', 'darkgreen');

    return (
        <>
            <PageTitle title={"Lumium | Create your Space"} />
            <Authenticator>
                <CreateWorkspace disclaimerButtonColor={disclaimerButtonColor} />
            </Authenticator >
        </>
    );
};

export default MultistepForm;
