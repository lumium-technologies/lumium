import { ManageWorkspaces } from "@components/menu";
import { Authenticator } from "@security";

const Space: React.FC = () => {
    return (
        <Authenticator>
            <ManageWorkspaces />
        </Authenticator >
    );
};

export default Space;