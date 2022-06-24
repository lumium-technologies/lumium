import React, {useEffect, useState} from "react";

// @ts-ignore
import SvgLines from 'react-mt-svg-lines';

import {Box, Center, ScaleFade, useUnmountEffect, useTheme, useColorModeValue} from '@chakra-ui/react'

export const LogoTransition = ({scale, strokeWidth, animationTime, numRepeats, setDone}: {
    scale?: number, strokeWidth?: number,
    animationTime?: number, numRepeats?: number, setDone?: Function
}) => {
    if (!scale) {
        scale = 1;
    }
    if (!strokeWidth) {
        strokeWidth = 1;
    }
    if (!animationTime) {
        animationTime = 2000;
    }
    if (numRepeats) {
        numRepeats *= 2;
    }

    const theme = useTheme();
    const letterBFillColor =  useColorModeValue("#ffffff", theme["background"]);

    const [scrollPosition, setScrollPosition] = useState(0);

    const handleScroll = () => {
        const position = window.pageYOffset;
        setScrollPosition(position);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    let animation =
        <SvgLines animate={true} fade={true} timing={"ease-in-out"} stagger={15}
            playback={numRepeats ? numRepeats + " alternate both" : "infinite alternate both"}
            duration={animationTime}
            className={"logo-transition"}>
            <svg
                width="2.7423387in"
                height="2.3938935in"
                viewBox="0 0 181.43113 215.44999"
                version="1.1"
                id="svg3">
                <defs
                    id="defs7">
                    <linearGradient
                        id="linearGradient4073">
                        <stop
                            style={{stopColor: "#f60080", stopOpacity: 1}}
                            offset="0"
                            id="stop4069" />
                        <stop
                            style={{stopColor: "#00ffff", stopOpacity: 1}}
                            offset="1"
                            id="stop4071" />
                    </linearGradient>
                    <linearGradient
                        xlinkHref="#linearGradient4073"
                        id="linearGradient4075"
                        x1="317.81873"
                        y1="618.13013"
                        x2="316.84256"
                        y2="404.97577"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(0.86831028,0,0,0.86831028,-184.40512,-337.47476)" />
                </defs>
                <path
                    id="icon"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="1"
                    d="M 196.53129,192.21187 95.182134,16.656893 C 94.253037,15.059202 92.51642,13.99118 90.554037,13.99118 c -1.988431,0 -3.699004,1.068022 -4.619413,2.665713 L -15.457971,192.21187 c -0.460204,0.78149 -0.712014,1.7019 -0.712014,2.66572 0,2.95225 2.379171,5.33142 5.296693,5.33142 h 0.04341 202.741762 0.0347 c 2.91752,0 5.33142,-2.37917 5.33142,-5.33142 0,-0.96382 -0.27785,-1.88423 -0.74674,-2.66572 v 0 z M -1.582372,189.54616 90.554037,29.994139 182.65569,189.54616 Z M 72.059025,88.249075 c -2.952254,0 -5.340108,2.387857 -5.340108,5.340105 0,2.943575 2.387854,5.331425 5.340108,5.331425 3.548288,0.447151 11.883092,4.734375 17.002763,19.852655 l -28.820466,50.42839 c -0.390739,0.74676 -0.633866,1.56296 -0.633866,2.44864 0,2.95226 2.413902,5.3401 5.331425,5.3401 1.962381,0 3.629537,-0.99855 4.593361,-2.56151 l 25.259146,-44.63982 c 6.790172,15.25621 15.290932,34.5327 15.438542,34.85397 3.02172,7.32854 10.24606,12.4863 18.67736,12.4863 2.10131,0 4.12447,-0.32128 6.0087,-0.88568 2.17078,-0.67728 3.76847,-2.70912 3.76847,-5.0883 0,-2.95225 -2.41391,-5.37484 -5.36616,-5.37484 -0.53835,0 -1.06802,0.11289 -1.56296,0.25181 -0.89436,0.28654 -1.8495,0.42548 -2.81332,0.42548 -4.08974,0 -7.58035,-2.56152 -8.96965,-6.18237 -0.85095,-1.92765 -20.769976,-47.13188 -23.479096,-52.88879 l -0.46021,-0.99855 C 93.297894,100.5183 87.671244,88.249075 72.059025,88.249075 Z"
                    style={{mixBlendMode: "color", fill: "url(#linearGradient4075)", fillOpacity: 1, strokeWidth: 0.859625, strokeMiterlimit: 4, strokeDasharray: "none"}}
                />
            </svg>
        </SvgLines>;

    const [mounted, setMounted] = useState(true);
    useEffect(() => {
        if (mounted) document.body.style.overflow = "hidden";
        let timeout: ReturnType<typeof setTimeout>;
        if (setDone && numRepeats && animationTime) {
            timeout = setTimeout(() => setDone(true), numRepeats * 0.8 * animationTime);
        }
        return () => {
            setMounted(!mounted);
            document.body.style.overflow = "auto";
            clearTimeout(timeout);
        };
    }, [mounted, numRepeats, animationTime, setDone]);

    animation =
        <ScaleFade initialScale={0.9} in={mounted} >
            {animation}
        </ScaleFade>;

    return (
        <React.Fragment>
            <Center width="100vw" height="100vh" position="absolute" transform={"translate(-100px, " + scrollPosition + "px)"}>
                <Box>
                    {animation}
                </Box>
            </Center>
        </React.Fragment>
    )
};

export const LogoBlank = ({animationTime, fillText, fillBall, setDone}: {
    animationTime?: number, fillText?: boolean, fillBall?: boolean, setDone: Function
}) => {
    if (!animationTime) {
        animationTime = 3000;
    }
    return <LogoTransition numRepeats={1} animationTime={animationTime} setDone={setDone} />;
}
