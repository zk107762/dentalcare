"use client";

import { useState } from "react";
import { useData } from "../../DataStore";
import ImageUpload from "../../components/ImageUpload";

export default function AdminServicesPage() {
  const { services, updateServices } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<typeof services[0]>>({});

  const toggleVisibility = (id: string) => {
    updateServices(services.map((s) => s.id === id ? { ...s, visible: !s.visible } : s));
  };

  const startEdit = (service: typeof services[0]) => {
    setEditingId(service.id);
    setEditForm({ ...service });
  };

  const saveEdit = () => {
    if (!editingId || !editForm) return;
    updateServices(services.map((s) => s.id === editingId ? { ...s, ...editForm } : s));
    setEditingId(null);
    setEditForm({});
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Manage Services</h1>
          <p>Edit, reorder, or toggle visibility — changes appear on the website instantly</p>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Features</th>
              <th>Visible</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className={!service.visible ? "admin-row-hidden" : ""}>
                <td>
                  {editingId === service.id ? (
                    <ImageUpload
                      currentImage={editForm.img || ""}
                      onImageChange={(img) => setEditForm({ ...editForm, img })}
                      size="small"
                    />
                  ) : (
                    <img src={service.img} alt="" className="admin-thumb" />
                  )}
                </td>
                <td>
                  {editingId === service.id ? (
                    <input className="admin-inline-input" value={editForm.title || ""} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                  ) : (
                    <strong>{service.title}</strong>
                  )}
                </td>
                <td className="admin-td-desc">
                  {editingId === service.id ? (
                    <textarea className="admin-inline-textarea" value={editForm.desc || ""} onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })} rows={2} />
                  ) : (
                    <span>{service.desc}</span>
                  )}
                </td>
                <td className="admin-td-features">
                  {service.features.slice(0, 3).map((f) => (
                    <span key={f} className="admin-tag">{f}</span>
                  ))}
                </td>
                <td>
                  <button className={`admin-toggle ${service.visible ? "active" : ""}`} onClick={() => toggleVisibility(service.id)}>
                    <span className="admin-toggle-knob" />
                  </button>
                </td>
                <td>
                  {editingId === service.id ? (
                    <div className="admin-actions-inline">
                      <button className="admin-btn-save" onClick={saveEdit}>Save</button>
                      <button className="admin-btn-cancel" onClick={() => { setEditingId(null); setEditForm({}); }}>Cancel</button>
                    </div>
                  ) : (
                    <button className="admin-btn-edit" onClick={() => startEdit(service)}>Edit</button>
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
