import SignIn from './signin';
import { Authenticator } from '@security/authentication';

export default function Auth() {
    return (
        <Authenticator>
            <SignIn></SignIn>
        </Authenticator>
    )
}
