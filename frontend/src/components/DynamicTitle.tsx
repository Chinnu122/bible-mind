import { useEffect } from 'react';

export default function DynamicTitle() {
    useEffect(() => {
        const originalTitle = document.title;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                document.title = "🙏 Come back to the Word...";
            } else {
                document.title = originalTitle;
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            document.title = originalTitle;
        };
    }, []);

    return null;
}
