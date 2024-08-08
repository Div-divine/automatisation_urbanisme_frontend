import { createBrowserRouter } from "react-router-dom";
import HomePage from "../components/HomePage.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />
    }
])

export default router;