import { useState } from 'react';

export default function OrgManagement({ departments, onAddDepartment, onAddPost }) {
  const [depName, setDepName] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [selectedDepId, setSelectedDepId] = useState('');

  const handleDepSubmit = (e) => {
    e.preventDefault();
    if (!depName) return;
    onAddDepartment(depName);
    setDepName('');
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!postTitle || !selectedDepId) return;
    onAddPost(postTitle, selectedDepId);
    setPostTitle('');
  };

  return (
    <section className="grid gap-8 lg:grid-cols-2">
      {/* Department Section */}
      <div className="card p-6 space-y-4">
        <div>
          <h2 className="font-display text-2xl text-slate-800">Departments</h2>
          <p className="text-sm text-slate-500">Add new organizational departments.</p>
        </div>

        <form onSubmit={handleDepSubmit} className="flex gap-2">
          <input
            className="input"
            placeholder="Department Name (e.g. IT, Finance)"
            value={depName}
            onChange={(e) => setDepName(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Add</button>
        </form>

        <div className="flex flex-wrap gap-2 pt-2">
          {departments.map((d) => (
            <span key={d.DepId} className="badge bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
              {d.DepName}
            </span>
          ))}
        </div>
      </div>

      {/* Post Section */}
      <div className="card p-6 space-y-4">
        <div>
          <h2 className="font-display text-2xl text-slate-800">Posts & Roles</h2>
          <p className="text-sm text-slate-500">Create roles within existing departments.</p>
        </div>

        <form onSubmit={handlePostSubmit} className="space-y-4">
          <select
            className="input"
            value={selectedDepId}
            onChange={(e) => setSelectedDepId(e.target.value)}
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.DepId} value={d.DepId}>{d.DepName}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              className="input"
              placeholder="Role Title (e.g. Senior Dev)"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Add Role</button>
          </div>
        </form>
      </div>
    </section>
  );
}
