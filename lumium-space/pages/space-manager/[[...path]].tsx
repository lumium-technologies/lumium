import { ManageWorkspaces } from "@components/menu";
import { Authenticator } from "@security";
import { useRouter } from "next/router";

const Space: React.FC = () => {
    return (
        <Authenticator>
            <ManageWorkspaces />
        </Authenticator >
    );
};

export default Space;