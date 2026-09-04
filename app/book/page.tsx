"use client";

import { useState } from "react";
import AppointmentModal from "../components/AppointmentModal";
import { SERVICES, OPENING_HOURS, WHATSAPP_NUMBER, PHONE_NUMBER, CLINIC_EMAIL, CLINIC_ADDRESS } from "../data";

export default function BookPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    date: "",
    time: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;
    setModalOpen(true);
  };

  return (
    <>
      {/* Page Hero */}
      <section className="page-hero page-hero-dark">
        <div className="container-lg">
          <div className="page-hero-content">
            <span className="page-hero-tag">Book Your Visit</span>
            <h1 className="page-hero-title">
              Your healthier smile <br />
              <span className="text-primary">starts here</span>
            </h1>
            <p className="page-hero-desc">
              Have a question or ready to schedule your visit? Fill in the form
              below or contact us directly.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form + Info */}
      <section className="section-book">
        <div className="container-lg">
          <div className="book-grid">
            {/* Form */}
            <div className="book-form-card">
              <h3>Request an Appointment</h3>
              <p className="book-form-desc">Fill in the details and we&apos;ll confirm via WhatsApp.</p>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row-2">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-row-2">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <select name="service" value={formData.service} onChange={handleChange}>
                    <option value="">Select Treatment</option>
                    {SERVICES.map((s) => (
                      <option key={s.title} value={s.title}>{s.title}</option>
                    ))}
                  </select>
                </div>
                <div className="form-row-2">
                  <input type="date" name="date" value={formData.date} onChange={handleChange} />
                  <input type="time" name="time" value={formData.time} onChange={handleChange} />
                </div>
                <textarea
                  name="message"
                  placeholder="Tell us briefly how we can help..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                />
                <button type="submit" className="btn-primary-solid btn-full">
                  Book via WhatsApp →
                </button>
              </form>
            </div>

            {/* Info Sidebar */}
            <div className="book-info">
              {/* Contact */}
              <div className="book-info-card">
                <h4>Contact Us</h4>
                <div className="contact-info-list">
                  <div className="contact-info-item">
                    <span className="contact-info-icon">☎</span>
                    <a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`}>{PHONE_NUMBER}</a>
                  </div>
                  <div className="contact-info-item">
                    <span className="contact-info-icon">✉</span>
                    <span>{CLINIC_EMAIL}</span>
                  </div>
                  <div className="contact-info-item">
                    <span className="contact-info-icon">⌖</span>
                    <span>{CLINIC_ADDRESS}</span>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="book-info-card">
                <h4>Opening Hours</h4>
                <div className="hours-list">
                  {OPENING_HOURS.map((h) => (
                    <div key={h.day} className="hours-item">
                      <span className="hours-day">{h.day}</span>
                      <span className="hours-time">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="book-info-card">
                <h4>Quick Actions</h4>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa btn-full"
                  style={{ justifyContent: "center", marginBottom: "10px" }}
                >
                  💬 Chat on WhatsApp
                </a>
                <a
                  href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`}
                  className="btn-outline btn-full"
                  style={{ justifyContent: "center" }}
                >
                  ☎ Call Now
                </a>
              </div>

              {/* Map */}
              <div className="book-info-card">
                <h4>Find Us</h4>
                <div className="contact-map">
                  <iframe
                    title="Clinic Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.8!2d74.3!3d31.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sMain+Boulevard%2C+Lahore!5e0!3m2!1sen!2spk"
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AppointmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        preselectedService={formData.service}
      />
    </>
  );
}
