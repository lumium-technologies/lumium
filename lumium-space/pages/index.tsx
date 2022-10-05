import React, { useState, useEffect } from "react";

import { LogoBlank } from "@components";
import { ScaleFade } from '@chakra-ui/react';

import { useLoginStatus } from "@hooks";

import Router from 'next/router'

import { Header } from "@components/headers";

import { Hero } from "@components/heros";

const Main: React.FC = () => {
    const [done, setDone] = useState(false);

    const loggedIn = useLoginStatus();

    useEffect(() => {
        if (loggedIn) {
            Router.push("/workspace");
        }
    }, [loggedIn]);

    return (
        <React.Fragment>
            {done || <LogoBlank animationTime={750} setDone={setDone} />}
            <ScaleFade initialScale={1.0} in={done} >
                <React.Fragment>
                    <Header showGithubButton={true} />
                    <Hero />
                </React.Fragment>
            </ScaleFade>
        </React.Fragment>
    );
};

export default Main;
