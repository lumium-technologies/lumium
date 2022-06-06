import React, { useEffect, useState } from "react"

export const usePromise = ({f, deps}: {f: Function, deps?: any[]})  => {
    const [result, setResult] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let subscribed = true;
        setIsLoading(true);

        f().then(
            r => {
                if (subscribed) {
                    setIsLoading(false);
                    setResult(r);
                }
            },
            e => {
                if (subscribed) {
                    setIsLoading(false);
                    setError(e);
                }
            }
        )
        return () => {
            subscribed = false;
        }
    }, deps || []);

    return [result, error, isLoading];
}
