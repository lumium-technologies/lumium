import axios from 'axios';
import { render_page } from 'lumium-renderer';
import { useEffect, useState } from 'react';

export const LumiumRenderer = () => {
    useEffect(() => {
        render_page();
    }, []);
    return null;
};
