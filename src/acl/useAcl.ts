export const useAcl = () => {
  const hasPermission = (permission: string): boolean => {
    // Stub: always returns true. Wire up real ACL logic later.
    return true;
  };
  return { hasPermission };
};
