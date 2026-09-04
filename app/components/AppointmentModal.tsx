"use client";

import { useState, useEffect, useRef } from "react";

const WHATSAPP_NUMBER = "923475291102";

const SERVICES = [
  "General Dentistry",
  "Teeth Whitening",
  "Cosmetic Dentistry",
  "Dental Implants",
  "Orthodontics",
  "Emergency Care",
];

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

export default function AppointmentModal({
  isOpen,
  onClose,
  preselectedService = "",
}: AppointmentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: preselectedService,
    date: "",
    time: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setSubmitted(false);
      setFormData((prev) => ({ ...prev, service: preselectedService }));
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, preselectedService]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    const msg = `Hello! I'd like to book an appointment.\n\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email || "-"}\nService: ${formData.service || "-"}\nPreferred Date: ${formData.date || "Flexible"}\nPreferred Time: ${formData.time || "Flexible"}\nMessage: ${formData.message || "None"}`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {submitted ? (
          <div className="modal-success">
            <div className="modal-success-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" stroke="#0b7c83" strokeWidth="2" fill="#e8f7f5" />
                <path
                  d="M20 32L28 40L44 24"
                  stroke="#0b7c83"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="checkmark-path"
                />
              </svg>
            </div>
            <h3>Appointment Request Sent!</h3>
            <p>We&apos;ll confirm your appointment via WhatsApp shortly.</p>
            <button className="modal-btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <h3>Book Your Appointment</h3>
              <p>Fill in the details and we&apos;ll confirm via WhatsApp.</p>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-form-row">
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
              <div className="modal-form-row">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                >
                  <option value="">Select Treatment</option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-form-row">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>
              <textarea
                name="message"
                placeholder="Tell us briefly how we can help..."
                value={formData.message}
                onChange={handleChange}
                rows={3}
              />
              <button type="submit" className="modal-btn-primary">
                Confirm Appointment →
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
