import { greet } from 'lumium-renderer';
import { useEffect } from 'react';

export const LumiumRenderer = () => {
    useEffect(greet);
    return null;
};
