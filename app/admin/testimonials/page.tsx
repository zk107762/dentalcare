"use client";

import { useState } from "react";
import { useData } from "../../DataStore";
import ImageUpload from "../../components/ImageUpload";

export default function AdminTestimonialsPage() {
  const { testimonials, updateTestimonials } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<typeof testimonials[0]>>({});
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");

  const toggleApproval = (id: string) => {
    updateTestimonials(testimonials.map((t) => t.id === id ? { ...t, approved: !t.approved } : t));
  };

  const toggleFeatured = (id: string) => {
    updateTestimonials(testimonials.map((t) => t.id === id ? { ...t, featured: !t.featured } : t));
  };

  const deleteTestimonial = (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    updateTestimonials(testimonials.filter((t) => t.id !== id));
  };

  const startEdit = (t: typeof testimonials[0]) => {
    setEditingId(t.id);
    setEditForm({ ...t });
  };

  const saveEdit = () => {
    if (!editingId || !editForm) return;
    updateTestimonials(testimonials.map((t) => t.id === editingId ? { ...t, ...editForm } : t));
    setEditingId(null);
    setEditForm({});
  };

  const addNew = () => {
    const newId = `t${Date.now()}`;
    const newT = { id: newId, name: "New Patient", text: "Add testimonial...", rating: 5, treatment: "General", avatar: "/images/avatar-1.jpg", approved: false, featured: false };
    updateTestimonials([...testimonials, newT]);
    setEditingId(newId);
    setEditForm(newT);
  };

  const filtered = testimonials.filter((t) => {
    if (filter === "approved") return t.approved;
    if (filter === "pending") return !t.approved;
    return true;
  });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Manage Testimonials</h1>
          <p>Approve, edit, or remove patient reviews — changes appear instantly</p>
        </div>
        <button className="btn-primary-solid" onClick={addNew} style={{ fontSize: 13, padding: "8px 18px" }}>+ Add New</button>
      </div>

      <div className="admin-filters">
        {(["all", "approved", "pending"] as const).map((f) => (
          <button key={f} className={`admin-filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Patient</th>
              <th>Review</th>
              <th>Treatment</th>
              <th>Approved</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className={!t.approved ? "admin-row-pending" : ""}>
                <td>
                  {editingId === t.id ? (
                    <ImageUpload currentImage={editForm.avatar || ""} onImageChange={(img) => setEditForm({ ...editForm, avatar: img })} size="small" />
                  ) : (
                    <img src={t.avatar} alt="" className="admin-thumb" style={{ borderRadius: "50%" }} />
                  )}
                </td>
                <td>
                  {editingId === t.id ? (
                    <input className="admin-inline-input" value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                  ) : (
                    <strong>{t.name}</strong>
                  )}
                </td>
                <td className="admin-td-desc">
                  {editingId === t.id ? (
                    <textarea className="admin-inline-textarea" value={editForm.text || ""} onChange={(e) => setEditForm({ ...editForm, text: e.target.value })} rows={2} />
                  ) : (
                    <span>&ldquo;{t.text}&rdquo;</span>
                  )}
                </td>
                <td>
                  {editingId === t.id ? (
                    <input className="admin-inline-input" value={editForm.treatment || ""} onChange={(e) => setEditForm({ ...editForm, treatment: e.target.value })} />
                  ) : (
                    <span className="admin-tag">{t.treatment}</span>
                  )}
                </td>
                <td>
                  <button className={`admin-toggle ${t.approved ? "active" : ""}`} onClick={() => toggleApproval(t.id)}>
                    <span className="admin-toggle-knob" />
                  </button>
                </td>
                <td>
                  <button className={`admin-toggle ${t.featured ? "active" : ""}`} onClick={() => toggleFeatured(t.id)}>
                    <span className="admin-toggle-knob" />
                  </button>
                </td>
                <td>
                  {editingId === t.id ? (
                    <div className="admin-actions-inline">
                      <button className="admin-btn-save" onClick={saveEdit}>Save</button>
                      <button className="admin-btn-cancel" onClick={() => { setEditingId(null); setEditForm({}); }}>Cancel</button>
                    </div>
                  ) : (
                    <div className="admin-actions-inline">
                      <button className="admin-btn-edit" onClick={() => startEdit(t)}>Edit</button>
                      <button className="admin-btn-delete" onClick={() => deleteTestimonial(t.id)}>Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
