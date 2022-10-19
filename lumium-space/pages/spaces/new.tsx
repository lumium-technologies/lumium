import { useEffect } from "react";
import { generate_workspace_key_with_recovery } from "lumium-renderer";

import { ProfileMenu } from "@components/headers";
import { Authenticator } from "@security/authentication";

export default function NewWorkspace() {
    useEffect(() => {
        generate_workspace_key_with_recovery('dummy_password');
    });
    return (
        <Authenticator>
            <ProfileMenu />
        </Authenticator>
    )
}
