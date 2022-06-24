import { Authenticator } from "@security";
import { LumiumRenderer } from "@components";
import { TopDrawerMenu } from "@components/menu";

const Space: React.FC = () => {
    return (
        <Authenticator>
            <TopDrawerMenu />
            <LumiumRenderer />
        </Authenticator>
    );
};

export default Space;
