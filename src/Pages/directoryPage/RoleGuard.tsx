import React, {FC} from 'react';

interface RoleGuardProps {
    allowedRoles: (string | number)[];
    currentRole?: string | number;
    children: React.ReactNode;
}


const RoleGuard = ({
                       allowedRoles,
                       currentRole,
                       children
                   }: RoleGuardProps) => {

    if (!allowedRoles.includes(currentRole!)) {
        return null;
    }

    return <>{children}</>;
};

export default RoleGuard;