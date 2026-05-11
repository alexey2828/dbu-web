import { Navigate } from "react-router-dom";

interface PublicRouteProps {
    element: JSX.Element
}

const PublicRoute = ({ element }: PublicRouteProps) => {

    const user = localStorage.getItem("user");

    if (user) {
        return <Navigate to="/" replace />;
    }

    return element;
};

export default PublicRoute;