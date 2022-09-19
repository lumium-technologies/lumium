import React, { useState, useEffect } from 'react';
import Head from "next/head";
import { useRouter } from 'next/router';

export const Favicons = ({initialTitle}: {initialTitle: string}) => {
    const router = useRouter();

    let title: string;
    if (router.pathname === '/') {
        title = initialTitle;
    } else {
        const sub: string[] = router.pathname.split("/");
        const cap: string = sub[1].charAt(0).toUpperCase() + sub[1].slice(1);
        title = cap + " | " + initialTitle;
    }

    return (
        <Head>
            <title>{title}</title>
            <link rel="apple-touch-icon" sizes="57x57" href="logo/parts/fg/icon.svg" />
            <link rel="apple-touch-icon" sizes="60x60" href="logo/parts/fg/icon.svg" />
            <link rel="apple-touch-icon" sizes="72x72" href="logo/parts/fg/icon.svg" />
            <link rel="apple-touch-icon" sizes="76x76" href="logo/parts/fg/icon.svg" />
            <link rel="apple-touch-icon" sizes="114x114" href="logo/parts/fg/icon.svg" />
            <link rel="apple-touch-icon" sizes="120x120" href="logo/parts/fg/icon.svg" />
            <link rel="apple-touch-icon" sizes="144x144" href="logo/parts/fg/icon.svg" />
            <link rel="apple-touch-icon" sizes="152x152" href="logo/parts/fg/icon.svg" />
            <link rel="apple-touch-icon" sizes="180x180" href="logo/parts/fg/icon.svg" />
            <link rel="icon" type="image/png" sizes="192x192"  href="logo/parts/fg/icon.svg" />
            <link rel="icon" type="image/png" sizes="32x32" href="logo/parts/fg/icon.svg" />
            <link rel="icon" type="image/png" sizes="96x96" href="logo/parts/fg/icon.svg" />
            <link rel="icon" type="image/png" sizes="16x16" href="logo/parts/fg/icon.svg" />
            <link rel="manifest" href="icons/manifest.json" />
            <meta name="msapplication-TileColor" content="#ffffff" />
            <meta name="msapplication-TileImage" content="logo/parts/fg/icon.svg" />
            <meta name="theme-color" content="#ffffff" />
        </Head>
    );
}
