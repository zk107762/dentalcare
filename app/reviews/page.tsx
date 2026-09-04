"use client";

import { useState } from "react";
import AppointmentModal from "../components/AppointmentModal";
import { useData } from "../DataStore";
import { WHATSAPP_NUMBER, PHONE_NUMBER } from "../data";

export default function ReviewsPage() {
  const { testimonials: dataTestimonials } = useData();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container-lg">
          <div className="page-hero-content">
            <span className="page-hero-tag">Patient Stories</span>
            <h1 className="page-hero-title">
              Loved by our <br />
              <span className="text-primary">patients</span>
            </h1>
            <p className="page-hero-desc">
              Real experiences from people who trusted us with their smiles.
              See why hundreds of patients choose SmileCare.
            </p>
            <div className="page-hero-btns">
              <button className="btn-primary-solid" onClick={() => setModalOpen(true)}>
                Join Our Patients →
              </button>
              <a
                href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`}
                className="btn-outline"
              >
                ☎ Call Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Rating Overview */}
      <section className="section-rating-overview">
        <div className="container-lg">
          <div className="rating-overview-card">
            <div className="rating-big">
              <strong>4.9</strong>
              <div className="stars-big">★★★★★</div>
              <small>Based on 500+ reviews</small>
            </div>
            <div className="rating-bars">
              {[
                { stars: 5, count: 475, pct: 95 },
                { stars: 4, count: 20, pct: 4 },
                { stars: 3, count: 3, pct: 0.6 },
                { stars: 2, count: 1, pct: 0.2 },
                { stars: 1, count: 1, pct: 0.2 },
              ].map((bar) => (
                <div key={bar.stars} className="rating-bar-row">
                  <span>{bar.stars} ★</span>
                  <div className="rating-bar">
                    <div className="rating-bar-fill" style={{ width: `${bar.pct}%` }} />
                  </div>
                  <span className="rating-bar-count">{bar.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="section-reviews-page">
        <div className="container-lg">
          <div className="reviews-page-grid">
            {dataTestimonials.filter((t) => t.approved).map((t, i) => (
              <div
                key={t.id}
                className="review-card-full"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="review-card-header">
                  <img src={t.avatar} alt={t.name} className="review-avatar" />
                  <div>
                    <strong>{t.name}</strong>
                    <small>{t.treatment}</small>
                  </div>
                </div>
                <div className="review-stars">{"★".repeat(t.rating)}</div>
                <p className="review-text">&ldquo;{t.text}&rdquo;</p>
                <div className="review-meta">
                  <span className="review-verified">✓ Verified Patient</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-cta">
        <div className="container-lg">
          <div className="cta-card">
            <h2>Ready to experience the SmileCare difference?</h2>
            <p>Book your appointment today and see why patients love us</p>
            <div className="cta-btns">
              <button className="btn-primary-solid" onClick={() => setModalOpen(true)}>
                Book Appointment →
              </button>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa"
              >
                💬 WhatsApp
              </a>
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
