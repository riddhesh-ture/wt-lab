import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

const DEFAULT_USERS = [
  {
    id: 'fac_1',
    name: 'Dr. abc',
    email: 'faculty@vit.edu',
    password: 'vit123',
    role: 'Faculty',
    designation: 'Associate Professor & Exam Coordinator',
    department: 'SCOPE, VIT vishawakarma',
    avatar: '👨‍🏫',
    createdAt: '2025-07-01'
  },
  {
    id: 'stud_1',
    name: 'Aarav Sharma',
    email: 'student@vit.edu',
    password: 'vit123',
    role: 'Student',
    regNo: '21BCE1042',
    program: 'B.Tech Computer Science and Engineering',
    semester: 'Semester IV',
    campus: 'VIT vishawakarma Campus',
    avatar: '🎓',
    createdAt: '2025-08-15'
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('vit_auth_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('vit_auth_token') || null;
    } catch {
      return null;
    }
  });

  const [loading] = useState(false);

  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('vit_auth_users');
      if (!storedUsers) {
        localStorage.setItem('vit_auth_users', JSON.stringify(DEFAULT_USERS));
      }
    } catch (err) {
      console.error('Failed to initialize VIT auth users in localStorage:', err);
    }
  }, []);

  const getUsers = () => {
    try {
      const usersStr = localStorage.getItem('vit_auth_users');
      return usersStr ? JSON.parse(usersStr) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  };

  const login = async (emailOrRegNo, password) => {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const users = getUsers();
    const query = emailOrRegNo.trim().toLowerCase();

    const foundUser = users.find(
      (u) =>
        (u.email.toLowerCase() === query || (u.regNo && u.regNo.toLowerCase() === query)) &&
        u.password === password
    );

    if (!foundUser) {
      return {
        success: false,
        error: 'Invalid VIT credentials. Check your email/RegNo and password.'
      };
    }

    const sessionUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      regNo: foundUser.regNo,
      program: foundUser.program,
      semester: foundUser.semester,
      campus: foundUser.campus,
      department: foundUser.department,
      designation: foundUser.designation,
      avatar: foundUser.avatar || (foundUser.role === 'Faculty' ? '👨‍🏫' : '🎓'),
      createdAt: foundUser.createdAt
    };

    const sessionToken = `vit_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    localStorage.setItem('vit_auth_user', JSON.stringify(sessionUser));
    localStorage.setItem('vit_auth_token', sessionToken);

    setUser(sessionUser);
    setToken(sessionToken);

    return { success: true, user: sessionUser };
  };

  const register = async ({ name, email, password, role, regNo, program }) => {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedRegNo = regNo ? regNo.trim().toUpperCase() : null;

    if (!trimmedName || !normalizedEmail || !password) {
      return { success: false, error: 'Name, email and password are required.' };
    }

    const users = getUsers();
    const emailExists = users.some((u) => u.email.toLowerCase() === normalizedEmail);
    if (emailExists) {
      return { success: false, error: 'An account with this email already exists in VIT portal.' };
    }

    if (normalizedRegNo) {
      const regExists = users.some((u) => u.regNo && u.regNo.toUpperCase() === normalizedRegNo);
      if (regExists) {
        return { success: false, error: `Registration number ${normalizedRegNo} is already registered.` };
      }
    }

    const newUser = {
      id: `vit_${Date.now()}`,
      name: trimmedName,
      email: normalizedEmail,
      password,
      role: role || 'Student',
      regNo: normalizedRegNo || (role === 'Student' ? `21BCE${Math.floor(1000 + Math.random() * 9000)}` : null),
      program: program || (role === 'Student' ? 'B.Tech Computer Science and Engineering' : null),
      semester: role === 'Student' ? 'Semester IV' : null,
      campus: role === 'Student' ? 'VIT Vishwakarma Campus' : null,
      department: role === 'Faculty' ? 'School of Computer Science & Engineering' : null,
      avatar: role === 'Faculty' ? '👨‍🏫' : '🎓',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('vit_auth_users', JSON.stringify(updatedUsers));

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('vit_auth_user');
    localStorage.removeItem('vit_auth_token');
    setUser(null);
    setToken(null);
  };

  const updateProfile = (updatedData) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('vit_auth_user', JSON.stringify(updatedUser));

    const users = getUsers();
    const newUsers = users.map((u) => (u.id === user.id ? { ...u, ...updatedData } : u));
    localStorage.setItem('vit_auth_users', JSON.stringify(newUsers));
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user),
    loading,
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
