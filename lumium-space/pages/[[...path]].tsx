import { Authenticator } from "@security";
import { LumiumRenderer } from "@components";

const Space: React.FC = () => {
    return (
        <Authenticator>
            <LumiumRenderer />
        </Authenticator>
    );
};

export default Space;
