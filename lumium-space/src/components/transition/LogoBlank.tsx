import { LogoTransition } from "./LogoTransition";

export const LogoBlank = ({animationTime, setDone}: {
    animationTime?: number, setDone: Function
}) => {
    if (!animationTime) {
        animationTime = 3000;
    }
    return <LogoTransition numRepeats={1} animationTime={animationTime} setDone={setDone} />;
}
