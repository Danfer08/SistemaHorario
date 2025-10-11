import { useAuth } from '../contexts/AuthContext';

/**
 * Hook personalizado para verificar roles y permisos del usuario.
 * Proporciona funciones fáciles de usar para la lógica de autorización en el frontend.
 */
export const usePermissions = () => {
  const { user } = useAuth();

  const can = (permissionName) => {
    return user?.permissions?.includes(permissionName) ?? false;
  };

  const hasRole = (roleName) => {
    return user?.roles?.includes(roleName) ?? false;
  };

  return { can, hasRole, user };
};