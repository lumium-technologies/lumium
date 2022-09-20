import { UserProfileEdit } from "@components/widgets";
import { Authenticator } from "@security";

const Space: React.FC = () => {
    return (
        <Authenticator>
            <UserProfileEdit />
        </Authenticator >
    );
};

export default Space;