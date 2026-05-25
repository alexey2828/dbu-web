import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    element: JSX.Element
    roles?: string[]
}

const ProtectedRoute = ({ element, roles }: ProtectedRouteProps) => {

    const userString = localStorage.getItem("user");

    if (!userString) {
        return <Navigate to="/login" replace />;
    }

    const user = JSON.parse(userString);

    // если роли не указаны — просто проверяем авторизацию
    if (!roles) {
        return element;
    }

    // проверяем роль
    if (!roles.includes(user.user.role)) {
        return <Navigate to="/login" replace />;
    }

    return element;
};

export default ProtectedRoute;