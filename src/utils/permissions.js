import axiosInstance from "../api/axiosConfig";

export const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

export const getUserRole = async () => {
  const user = getUserFromStorage();
  if (!user || !user.role_id) return null;

  try {
    const response = await axiosInstance.get(`/roles/${user.role_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
};

export const getUserPermissions = async () => {
  const role = await getUserRole();
  return role?.permissions || [];
};

export const hasPermission = async (permission) => {
  const permissions = await getUserPermissions();
  return permissions.includes(permission);
};

export const hasAnyPermission = async (permissionList) => {
  const permissions = await getUserPermissions();
  return permissionList.some(p => permissions.includes(p));
};

export const hasAllPermissions = async (permissionList) => {
  const permissions = await getUserPermissions();
  return permissionList.every(p => permissions.includes(p));
};

export const getRoleName = async () => {
  const role = await getUserRole();
  return role?.name || 'Unknown';
};

export const PERMISSION_MAP = {
  USER_READ: 'user.read',
  USER_CREATE: 'user.create',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
  ROLE_READ: 'role.read',
  ROLE_CREATE: 'role.create',
  ROLE_UPDATE: 'role.update',
  ROLE_DELETE: 'role.delete',
  DOSEN_MANAGE: 'dosen.manage',
  MATKUL_MANAGE: 'matkul.manage',
  MATKUL_READ: 'matkul.read',
  MAHASISWA_MANAGE: 'mahasiswa.manage',
  MAHASISWA_READ: 'mahasiswa.read',
};
