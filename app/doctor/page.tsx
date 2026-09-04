"use client";

import { useState, useRef, useCallback } from "react";
import AppointmentModal from "../components/AppointmentModal";
import { useData } from "../DataStore";
import { OPENING_HOURS, WHATSAPP_NUMBER, PHONE_NUMBER } from "../data";

export default function DoctorPage() {
  const { doctor } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const doctorImgRef = useRef<HTMLDivElement>(null);

  const handleDoctorMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = doctorImgRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
      el.style.setProperty("--light-x", `${(x + 0.5) * 100}%`);
      el.style.setProperty("--light-y", `${(y + 0.5) * 100}%`);
    },
    []
  );

  const handleDoctorMouseLeave = useCallback(() => {
    const el = doctorImgRef.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
  }, []);

  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container-lg">
          <div className="page-hero-content">
            <span className="page-hero-tag">Meet Your Dentist</span>
            <h1 className="page-hero-title">
              Care you can trust. <br />
              <span className="text-primary">A smile you can love.</span>
            </h1>
            <p className="page-hero-desc">
              {doctor.bio}
            </p>
            <div className="page-hero-btns">
              <button className="btn-primary-solid" onClick={() => setModalOpen(true)}>
                Book with {doctor.name} →
              </button>
              <a
                href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`}
                className="btn-outline"
              >
                ☎ Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Profile */}
      <section className="section-doctor-page">
        <div className="container-lg">
          <div className="doctor-page-grid">
            <div>
              <div
                ref={doctorImgRef}
                className="doctor-image-wrap"
                onMouseMove={handleDoctorMouseMove}
                onMouseLeave={handleDoctorMouseLeave}
              >
                <img src={doctor.image} alt={doctor.name} />
                <div className="doctor-image-light" />
              </div>
              <div className="doctor-badge-float">
                <span className="doctor-badge-icon">✦</span>
                <div>
                  <strong>{doctor.experience} Years</strong>
                  <small>Experience</small>
                </div>
              </div>
            </div>

            <div>
              <h2 className="section-title-lg">{doctor.name}</h2>
              <p className="section-text" style={{ color: "var(--primary)", fontWeight: 600 }}>
                {doctor.title}
              </p>
              <p className="section-text">{doctor.bio}</p>

              {/* Stats */}
              <div className="doctor-stats-row">
                <div className="doctor-stat">
                  <strong>{doctor.experience}</strong>
                  <small>Years Experience</small>
                </div>
                <div className="doctor-stat">
                  <strong>{doctor.patients}</strong>
                  <small>Happy Patients</small>
                </div>
                <div className="doctor-stat">
                  <strong>★ {doctor.rating}</strong>
                  <small>Rating</small>
                </div>
              </div>

              {/* Credentials */}
              <div className="credentials-list">
                <strong className="credentials-heading">Credentials & Qualifications</strong>
                {doctor.credentials.map((c) => (
                  <div key={c} className="credential-item">
                    <span className="credential-check">✓</span>
                    {c}
                  </div>
                ))}
              </div>

              <button className="btn-primary-solid" onClick={() => setModalOpen(true)}>
                Meet Dr. Ahmed →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Opening Hours */}
      <section className="section-hours-page">
        <div className="container-lg">
          <div className="hours-page-grid">
            <div>
              <div className="section-tag">Opening Hours</div>
              <h2 className="section-title-lg">When we&apos;re open</h2>
              <div className="hours-list">
                {OPENING_HOURS.map((h) => (
                  <div key={h.day} className="hours-item">
                    <span className="hours-day">{h.day}</span>
                    <span className="hours-time">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="emergency-card">
                <div className="emergency-icon">🚨</div>
                <h3>Dental Emergency?</h3>
                <p>Experiencing sudden tooth pain, a broken tooth, or any dental emergency? Don&apos;t wait. Call us immediately.</p>
                <a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="emergency-btn">
                  ☎ Emergency Call Now
                </a>
                <p className="emergency-note">Available 24/7 for urgent cases</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AppointmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        preselectedService=""
      />
    </>
  );
}
