import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Referensi:
// 1. https://www.geeksforgeeks.org/how-to-make-your-page-scroll-to-the-top-when-route-changes/

export default function ScrollToTop() {
    const routePath = useLocation();
    const onTop = () => {
        window.scrollTo(0, 0);
    }
    useEffect(() => {
        onTop()
    }, [routePath]);

    return null;
}