export default function StaffFilters({ departments, posts, filters, onChange }) {
  const filteredPosts = filters.departmentId
    ? posts.filter((p) => String(p.DepId) === String(filters.departmentId))
    : posts;

  const handleChange = (e) => {
    const { name, value } = e.target;
    // When department changes, reset post selection
    if (name === 'departmentId') {
      onChange({ ...filters, departmentId: value, postId: '' });
    } else {
      onChange({ ...filters, [name]: value });
    }
  };

  const handleClear = () => {
    onChange({ departmentId: '', postId: '', hireStart: '', hireEnd: '' });
  };

  const hasFilters =
    filters.departmentId || filters.postId || filters.hireStart || filters.hireEnd;

  return (
    <div className="card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-slate-800">Staff Directory</h2>
          <p className="text-sm text-slate-500">Filter by department, post, or hire date range.</p>
        </div>
        {hasFilters && (
          <button
            onClick={handleClear}
            className="btn btn-ghost text-rose-500 text-sm"
          >
            ✕ Clear Filters
          </button>
        )}
      </div>

      {/* Row 1: Department + Post */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-400">
            Department
          </label>
          <select
            className="input"
            name="departmentId"
            value={filters.departmentId}
            onChange={handleChange}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.DepId} value={d.DepId}>
                {d.DepName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-400">
            Post
          </label>
          <select
            className="input"
            name="postId"
            value={filters.postId}
            onChange={handleChange}
            disabled={filteredPosts.length === 0}
          >
            <option value="">All Posts</option>
            {filteredPosts.map((p) => (
              <option key={p.PostID} value={p.PostID}>
                {p.PostTitle}
              </option>
            ))}
          </select>
          {filters.departmentId && filteredPosts.length === 0 && (
            <p className="text-xs text-slate-400 mt-1">No posts in this department yet.</p>
          )}
        </div>
      </div>

      {/* Row 2: Hire Date Range */}
      <div>
        <label className="label mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-400">
          Hire Date Range
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">From</span>
            <input
              className="input pl-12"
              type="date"
              name="hireStart"
              value={filters.hireStart}
              onChange={handleChange}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">To</span>
            <input
              className="input pl-8"
              type="date"
              name="hireEnd"
              value={filters.hireEnd}
              onChange={handleChange}
            />
          </div>
        </div>
        {filters.hireStart && filters.hireEnd && filters.hireStart > filters.hireEnd && (
          <p className="text-xs text-rose-500 mt-1">⚠ "From" date cannot be after "To" date.</p>
        )}
      </div>
    </div>
  );
}
