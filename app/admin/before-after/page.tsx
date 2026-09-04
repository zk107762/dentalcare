"use client";

import { useState } from "react";
import { useData } from "../../DataStore";
import ImageUpload from "../../components/ImageUpload";

export default function AdminBeforeAfterPage() {
  const { beforeAfter, updateBeforeAfter } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<typeof beforeAfter[0]>>({});

  const toggleVisibility = (id: string) => {
    updateBeforeAfter(beforeAfter.map((c) => c.id === id ? { ...c, visible: !c.visible } : c));
  };

  const deleteCase = (id: string) => {
    if (!confirm("Delete this case?")) return;
    updateBeforeAfter(beforeAfter.filter((c) => c.id !== id));
  };

  const addNew = () => {
    const newId = `ba${Date.now()}`;
    const newCase = { id: newId, label: "New Case", beforeImg: "/images/before-whitening.jpg", afterImg: "/images/after-whitening.jpg", description: "Add description...", visible: false };
    updateBeforeAfter([...beforeAfter, newCase]);
    setEditingId(newId);
    setEditForm(newCase);
  };

  const startEdit = (c: typeof beforeAfter[0]) => {
    setEditingId(c.id);
    setEditForm({ ...c });
  };

  const saveEdit = () => {
    if (!editingId || !editForm) return;
    updateBeforeAfter(beforeAfter.map((c) => c.id === editingId ? { ...c, ...editForm } : c));
    setEditingId(null);
    setEditForm({});
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Before / After</h1>
          <p>Manage smile transformation cases — changes appear instantly</p>
        </div>
        <button className="btn-primary-solid" onClick={addNew} style={{ fontSize: 13, padding: "8px 18px" }}>+ Add Case</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Before</th>
              <th>After</th>
              <th>Label</th>
              <th>Description</th>
              <th>Visible</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {beforeAfter.map((c) => (
              <tr key={c.id} className={!c.visible ? "admin-row-hidden" : ""}>
                <td>
                  {editingId === c.id ? (
                    <ImageUpload currentImage={editForm.beforeImg || ""} onImageChange={(img) => setEditForm({ ...editForm, beforeImg: img })} size="small" label="Before" />
                  ) : (
                    <img src={c.beforeImg} alt="" className="admin-thumb" />
                  )}
                </td>
                <td>
                  {editingId === c.id ? (
                    <ImageUpload currentImage={editForm.afterImg || ""} onImageChange={(img) => setEditForm({ ...editForm, afterImg: img })} size="small" label="After" />
                  ) : (
                    <img src={c.afterImg} alt="" className="admin-thumb" />
                  )}
                </td>
                <td>
                  {editingId === c.id ? (
                    <input className="admin-inline-input" value={editForm.label || ""} onChange={(e) => setEditForm({ ...editForm, label: e.target.value })} />
                  ) : (
                    <strong>{c.label}</strong>
                  )}
                </td>
                <td className="admin-td-desc">
                  {editingId === c.id ? (
                    <textarea className="admin-inline-textarea" value={editForm.description || ""} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={2} />
                  ) : (
                    <span>{c.description}</span>
                  )}
                </td>
                <td>
                  <button className={`admin-toggle ${c.visible ? "active" : ""}`} onClick={() => toggleVisibility(c.id)}>
                    <span className="admin-toggle-knob" />
                  </button>
                </td>
                <td>
                  {editingId === c.id ? (
                    <div className="admin-actions-inline">
                      <button className="admin-btn-save" onClick={saveEdit}>Save</button>
                      <button className="admin-btn-cancel" onClick={() => { setEditingId(null); setEditForm({}); }}>Cancel</button>
                    </div>
                  ) : (
                    <div className="admin-actions-inline">
                      <button className="admin-btn-edit" onClick={() => startEdit(c)}>Edit</button>
                      <button className="admin-btn-delete" onClick={() => deleteCase(c.id)}>Delete</button>
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
