import React from 'react';
import { useAcl } from './useAcl';

interface AclProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Acl = ({ permission, children, fallback = null }: AclProps) => {
  const { hasPermission } = useAcl();
  return hasPermission(permission) ? <>{children}</> : <>{fallback}</>;
};
