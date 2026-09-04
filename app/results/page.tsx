"use client";

import { useState } from "react";
import ComparisonSlider from "../components/ComparisonSlider";
import AppointmentModal from "../components/AppointmentModal";
import { useData } from "../DataStore";
import { WHATSAPP_NUMBER, PHONE_NUMBER } from "../data";

export default function ResultsPage() {
  const { beforeAfter: dataBA } = useData();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container-lg">
          <div className="page-hero-content">
            <span className="page-hero-tag">See the Difference</span>
            <h1 className="page-hero-title">
              Transformations that <br />
              <span className="text-primary">speak for themselves</span>
            </h1>
            <p className="page-hero-desc">
              Small changes can create a confident smile. Explore our
              before-and-after results to see what&apos;s possible.
            </p>
            <div className="page-hero-btns">
              <button className="btn-primary-solid" onClick={() => setModalOpen(true)}>
                Get Similar Results →
              </button>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa"
              >
                💬 Ask Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="section-results">
        <div className="container-lg">
          <div className="results-grid">
            {dataBA.filter((item) => item.visible).map((item) => (
              <div key={item.id} className="result-card">
                <ComparisonSlider
                  beforeImg={item.beforeImg}
                  afterImg={item.afterImg}
                />
                <div className="result-card-body">
                  <h3>{item.label}</h3>
                  <p>{item.description}</p>
                  <button
                    className="btn-primary-solid"
                    onClick={() => setModalOpen(true)}
                    style={{ marginTop: "12px" }}
                  >
                    Get This Treatment →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="ba-disclaimer">
            *Results may vary. Images are illustrative. Consultation required
            for personalised treatment plan.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="section-results-stats">
        <div className="container-lg">
          <div className="results-stats-grid">
            <div className="result-stat-item">
              <strong>500+</strong>
              <small>Smile Makeovers</small>
            </div>
            <div className="result-stat-item">
              <strong>98%</strong>
              <small>Patient Satisfaction</small>
            </div>
            <div className="result-stat-item">
              <strong>12+</strong>
              <small>Years Experience</small>
            </div>
            <div className="result-stat-item">
              <strong>4.9</strong>
              <small>Star Rating</small>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-cta">
        <div className="container-lg">
          <div className="cta-card">
            <h2>Want a smile like this?</h2>
            <p>Book a consultation to discuss your treatment options</p>
            <div className="cta-btns">
              <button className="btn-primary-solid" onClick={() => setModalOpen(true)}>
                Book Consultation →
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

      <AppointmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        preselectedService=""
      />
    </>
  );
}
