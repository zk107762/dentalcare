"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useData } from "../../DataStore";
import ImageUpload from "../../components/ImageUpload";

export default function AdminSettingsPage() {
  const { adminEmail, changeCredentials } = useAuth();
  const { settings, updateSettings, doctor, updateDoctor } = useData();

  // Account
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [accountMsg, setAccountMsg] = useState("");
  const [accountError, setAccountError] = useState("");

  // Site
  const [clinicName, setClinicName] = useState("");
  const [clinicPhone, setClinicPhone] = useState("");
  const [clinicEmail, setClinicEmail] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [siteMsg, setSiteMsg] = useState("");
  const [siteError, setSiteError] = useState("");

  // Doctor
  const [docName, setDocName] = useState("");
  const [docTitle, setDocTitle] = useState("");
  const [docImage, setDocImage] = useState("");
  const [docBio, setDocBio] = useState("");
  const [docExp, setDocExp] = useState("");
  const [docPatients, setDocPatients] = useState("");
  const [docRating, setDocRating] = useState("");
  const [docCredentials, setDocCredentials] = useState("");
  const [docMsg, setDocMsg] = useState("");
  const [docError, setDocError] = useState("");

  useEffect(() => {
    setEmail(adminEmail || "");
    setClinicName(settings.name);
    setClinicPhone(settings.phone);
    setClinicEmail(settings.email);
    setClinicAddress(settings.address);
    setWhatsappNumber(settings.whatsapp);
    setDocName(doctor.name);
    setDocTitle(doctor.title);
    setDocImage(doctor.image);
    setDocBio(doctor.bio);
    setDocExp(doctor.experience);
    setDocPatients(doctor.patients);
    setDocRating(doctor.rating);
    setDocCredentials(doctor.credentials.join("\n"));
  }, [adminEmail, settings, doctor]);

  const handleAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setAccountMsg(""); setAccountError("");
    if (newPassword && newPassword !== confirmPassword) { setAccountError("Passwords do not match."); return; }
    if (newPassword && newPassword.length < 8) { setAccountError("Password must be at least 8 characters."); return; }
    const stored = JSON.parse(localStorage.getItem("smilecare_admin_credentials") || '{"email":"admin@smilecare.com","password":"smilecare2024"}');
    if (currentPassword && currentPassword !== stored.password) { setAccountError("Current password is incorrect."); return; }
    changeCredentials(email, newPassword || stored.password, stored.name || "Admin");
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    setAccountMsg("Account updated successfully!");
  };

  const handleSite = (e: React.FormEvent) => {
    e.preventDefault();
    setSiteMsg(""); setSiteError("");
    if (!clinicName.trim() || !clinicPhone.trim()) { setSiteError("Name and phone are required."); return; }
    updateSettings({ name: clinicName, phone: clinicPhone, email: clinicEmail, address: clinicAddress, whatsapp: whatsappNumber });
    setSiteMsg("Site settings saved!");
  };

  const handleDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    setDocMsg(""); setDocError("");
    if (!docName.trim()) { setDocError("Doctor name is required."); return; }
    updateDoctor({
      name: docName,
      title: docTitle,
      image: docImage,
      bio: docBio,
      experience: docExp,
      patients: docPatients,
      rating: docRating,
      credentials: docCredentials.split("\n").filter((c) => c.trim()),
    });
    setDocMsg("Doctor info saved and published to website!");
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage doctor profile, site info, and account security</p>
        </div>
      </div>

      <div className="admin-settings-grid">
        {/* ── DOCTOR PROFILE ── */}
        <div className="admin-settings-card">
          <h2>👨‍⚕️ Doctor Profile</h2>
          <p className="admin-settings-desc">Changes appear on the website instantly</p>

          <form onSubmit={handleDoctor} className="admin-settings-form">
            {docMsg && <div className="admin-success-msg">✓ {docMsg}</div>}
            {docError && <div className="admin-error-msg">⚠ {docError}</div>}

            <ImageUpload currentImage={docImage} onImageChange={setDocImage} label="Doctor Photo" size="medium" />

            <div className="admin-field">
              <label>Doctor Name</label>
              <input type="text" value={docName} onChange={(e) => setDocName(e.target.value)} required />
            </div>

            <div className="admin-field">
              <label>Title / Qualification</label>
              <input type="text" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} placeholder="BDS, FCPS — Certified Implantologist" />
            </div>

            <div className="admin-field">
              <label>Bio</label>
              <textarea value={docBio} onChange={(e) => setDocBio(e.target.value)} rows={3} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <div className="admin-field">
                <label>Experience</label>
                <input type="text" value={docExp} onChange={(e) => setDocExp(e.target.value)} placeholder="12+" />
              </div>
              <div className="admin-field">
                <label>Patients</label>
                <input type="text" value={docPatients} onChange={(e) => setDocPatients(e.target.value)} placeholder="500+" />
              </div>
              <div className="admin-field">
                <label>Rating</label>
                <input type="text" value={docRating} onChange={(e) => setDocRating(e.target.value)} placeholder="4.9" />
              </div>
            </div>

            <div className="admin-field">
              <label>Credentials (one per line)</label>
              <textarea value={docCredentials} onChange={(e) => setDocCredentials(e.target.value)} rows={5} placeholder={"BDS (Bachelor of Dental Surgery)\nFCPS (Fellowship...)\nCertified Implantologist"} />
            </div>

            <button type="submit" className="btn-primary-solid" style={{ width: "100%", justifyContent: "center" }}>
              Save Doctor Profile →
            </button>
          </form>
        </div>

        {/* ── SITE INFO ── */}
        <div className="admin-settings-card">
          <h2>🏥 Site Information</h2>
          <p className="admin-settings-desc">Clinic details shown on the website</p>

          <form onSubmit={handleSite} className="admin-settings-form">
            {siteMsg && <div className="admin-success-msg">✓ {siteMsg}</div>}
            {siteError && <div className="admin-error-msg">⚠ {siteError}</div>}

            <div className="admin-field">
              <label>Clinic Name</label>
              <input type="text" value={clinicName} onChange={(e) => setClinicName(e.target.value)} required />
            </div>
            <div className="admin-field">
              <label>Phone Number</label>
              <input type="tel" value={clinicPhone} onChange={(e) => setClinicPhone(e.target.value)} required />
            </div>
            <div className="admin-field">
              <label>Email Address</label>
              <input type="email" value={clinicEmail} onChange={(e) => setClinicEmail(e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Address</label>
              <input type="text" value={clinicAddress} onChange={(e) => setClinicAddress(e.target.value)} />
            </div>
            <div className="admin-field">
              <label>WhatsApp Number (with country code)</label>
              <input type="text" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="923475291102" />
            </div>
            <button type="submit" className="btn-primary-solid" style={{ width: "100%", justifyContent: "center" }}>
              Save Site Settings →
            </button>
          </form>

          <hr style={{ margin: "24px 0", border: "none", borderTop: "1px solid var(--border)" }} />

          {/* ── ACCOUNT SECURITY ── */}
          <h2>🔐 Account Security</h2>
          <p className="admin-settings-desc">Change your login email and password</p>

          <form onSubmit={handleAccount} className="admin-settings-form">
            {accountMsg && <div className="admin-success-msg">✓ {accountMsg}</div>}
            {accountError && <div className="admin-error-msg">⚠ {accountError}</div>}

            <div className="admin-field">
              <label>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="admin-field">
              <label>Current Password</label>
              <div className="admin-input-wrap">
                <input type={showCurrentPw ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" />
                <button type="button" className="admin-password-toggle" onClick={() => setShowCurrentPw(!showCurrentPw)}>{showCurrentPw ? "🙈" : "👁"}</button>
              </div>
            </div>
            <div className="admin-field">
              <label>New Password</label>
              <div className="admin-input-wrap">
                <input type={showNewPw ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Leave blank to keep current" />
                <button type="button" className="admin-password-toggle" onClick={() => setShowNewPw(!showNewPw)}>{showNewPw ? "🙈" : "👁"}</button>
              </div>
            </div>
            <div className="admin-field">
              <label>Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
            </div>
            <button type="submit" className="btn-primary-solid" style={{ width: "100%", justifyContent: "center" }}>
              Update Account →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
