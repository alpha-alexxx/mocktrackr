import { useEffect, useState } from 'react';

/**
 * useIsClient hook
 * Returns true if the component is mounted on the client, false during SSR.
 */
export function useIsClient(): boolean {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    return isClient;
}
