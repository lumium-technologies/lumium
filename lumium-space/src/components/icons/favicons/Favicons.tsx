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
            <link rel="apple-touch-icon" sizes="57x57" href="/icons/favicons/apple-icon-57x57.png" />
            <link rel="apple-touch-icon" sizes="60x60" href="/icons/favicons/apple-icon-60x60.png" />
            <link rel="apple-touch-icon" sizes="72x72" href="/icons/favicons/apple-icon-72x72.png" />
            <link rel="apple-touch-icon" sizes="76x76" href="/icons/favicons/apple-icon-76x76.png" />
            <link rel="apple-touch-icon" sizes="114x114" href="/icons/favicons/apple-icon-114x114.png" />
            <link rel="apple-touch-icon" sizes="120x120" href="/icons/favicons/apple-icon-120x120.png" />
            <link rel="apple-touch-icon" sizes="144x144" href="/icons/favicons/apple-icon-144x144.png" />
            <link rel="apple-touch-icon" sizes="152x152" href="/icons/favicons/apple-icon-152x152.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/icons/favicons/apple-icon-180x180.png" />
            <link rel="icon" type="image/png" sizes="192x192"  href="/icons/favicons/android-icon-192x192.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicons/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="96x96" href="/icons/favicons/favicon-96x96.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicons/favicon-16x16.png" />
            <link rel="manifest" href="/icons/favicons/manifest.json" />
            <meta name="msapplication-TileColor" content="#ffffff" />
            <meta name="msapplication-TileImage" content="/icons/favicons/ms-icon-144x144.png" />
            <meta name="theme-color" content="#ffffff" />
        </Head>
    );
}
