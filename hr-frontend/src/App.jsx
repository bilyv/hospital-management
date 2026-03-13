import { useEffect, useState } from 'react';
import axios from 'axios';
import LoginForm from './components/LoginForm.jsx';
import StaffForm from './components/StaffForm.jsx';
import StaffTable from './components/StaffTable.jsx';
import StaffFilters from './components/StaffFilters.jsx';
import TopBar from './components/TopBar.jsx';
import OrgManagement from './components/OrgManagement.jsx';
import Toast from './components/Toast.jsx';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});

export default function App() {
  const [user, setUser] = useState(null);
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [posts, setPosts] = useState([]);

  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');
  const [filters, setFilters] = useState({
    departmentId: '',
    postId: '',
    hireStart: '',
    hireEnd: ''
  });

  const loadMeta = async () => {
    const [depRes, postRes] = await Promise.all([
      api.get('/meta/departments'),
      api.get('/meta/posts')
    ]);
    setDepartments(depRes.data);
    setPosts(postRes.data);
  };

  const loadStaff = async (activeFilters = filters) => {
    const params = {};
    if (activeFilters.departmentId) params.departmentId = activeFilters.departmentId;
    if (activeFilters.postId) params.postId = activeFilters.postId;
    if (activeFilters.hireStart) params.hireStart = activeFilters.hireStart;
    if (activeFilters.hireEnd) params.hireEnd = activeFilters.hireEnd;
    const res = await api.get('/staff', { params });
    setStaff(res.data);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    loadStaff(newFilters);
  };

  const handleAddDepartment = async (name) => {
    await api.post('/meta/departments', { name });
    await loadMeta();
    setMessage(`Department "${name}" added.`);
  };

  const handleAddPost = async (title, departmentId) => {
    await api.post('/meta/posts', { title, departmentId });
    await loadMeta();
    setMessage(`Role "${title}" added.`);
  };

  const loadMe = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  useEffect(() => {
    if (!user) return;
    loadMeta();
    loadStaff();
  }, [user]);

  const handleLogin = async (values) => {
    try {
      setMessage('');
      const res = await api.post('/auth/login', values);
      setUser(res.data);
    } catch (err) {
      console.error('Login error:', err);
      setMessage(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleLogout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  const handleCreate = async (values) => {
    setMessage('');
    await api.post('/staff', values);
    setEditing(null);
    await loadStaff();
    setMessage('Staff member created.');
  };

  const handleUpdate = async (id, values) => {
    setMessage('');
    await api.put(`/staff/${id}`, values);
    setEditing(null);
    await loadStaff();
    setMessage('Staff member updated.');
  };

  const handleDelete = async (id) => {
    setMessage('');
    await api.delete(`/staff/${id}`);
    await loadStaff();
    setMessage('Staff member deleted.');
  };

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center px-6">
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Toast message={message} onDismiss={() => setMessage('')} />
      <TopBar user={user} onLogout={handleLogout} />
      <main className="px-6 pb-12">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="card p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="font-display text-3xl text-slate-800">St. Luke HR Management</h1>
                <p className="text-sm text-slate-500">
                  Manage staff records, roles, and recruitment data in one place.
                </p>
              </div>
            </div>
          </section>


          <OrgManagement 
            departments={departments} 
            onAddDepartment={handleAddDepartment}
            onAddPost={handleAddPost}
          />

          <section className="grid gap-8">
            <StaffForm
              departments={departments}
              posts={posts}
              editing={editing}
              onCancel={() => setEditing(null)}
              onCreate={handleCreate}
              onUpdate={handleUpdate}
            />
          </section>

          <StaffFilters
            departments={departments}
            posts={posts}
            filters={filters}
            onChange={handleFilterChange}
          />

          <section className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl text-slate-800">Staff Directory</h2>
              <span className="text-sm text-slate-500">
                {staff.length} record{staff.length !== 1 ? 's' : ''} found
              </span>
            </div>
            <StaffTable
              staff={staff}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          </section>
        </div>
      </main>
    </div>
  );
}