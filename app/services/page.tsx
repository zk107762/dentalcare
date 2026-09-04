"use client";

import { useState } from "react";
import Link from "next/link";
import ServiceCard from "../components/ServiceCard";
import AppointmentModal from "../components/AppointmentModal";
import { useData } from "../DataStore";
import { WHATSAPP_NUMBER, PHONE_NUMBER } from "../data";

export default function ServicesPage() {
  const { services: dataServices } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const openModal = (service?: string) => {
    setSelectedService(service || "");
    setModalOpen(true);
  };

  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container-lg">
          <div className="page-hero-content">
            <span className="page-hero-tag">Our Services</span>
            <h1 className="page-hero-title">
              Complete dental care <br />
              <span className="text-primary">for your smile</span>
            </h1>
            <p className="page-hero-desc">
              From routine checkups to advanced cosmetic treatments, everything
              you need is available under one roof.
            </p>
            <div className="page-hero-btns">
              <button className="btn-primary-solid" onClick={() => openModal()}>
                Book an Appointment →
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

      {/* Services Grid */}
      <section className="section-services-page">
        <div className="container-lg">
          <div className="services-page-grid">
            {dataServices.filter((s) => s.visible).map((s, i) => (
              <ServiceCard
                key={s.title}
                icon={s.icon}
                title={s.title}
                desc={s.desc}
                img={s.img}
                index={i}
                onClick={() => openModal(s.title)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="section-service-details">
        <div className="container-lg">
          {dataServices.filter((s) => s.visible).map((service, i) => (
            <div
              key={service.id}
              className={`service-detail-row ${i % 2 === 1 ? "reversed" : ""}`}
            >
              <div className="service-detail-img">
                <img src={service.img} alt={service.title} />
              </div>
              <div className="service-detail-content">
                <span className="section-tag">{service.icon} {service.title}</span>
                <h2 className="section-title-lg">{service.title}</h2>
                <p className="section-text">{service.longDesc}</p>
                <div className="service-features-grid">
                  {service.features.map((f) => (
                    <div key={f} className="service-feature-item">
                      <span className="credential-check">✓</span>
                      {f}
                    </div>
                  ))}
                </div>
                <button
                  className="btn-primary-solid"
                  onClick={() => openModal(service.title)}
                  style={{ marginTop: "24px" }}
                >
                  Book {service.title} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-cta">
        <div className="container-lg">
          <div className="cta-card">
            <h2>Ready to transform your smile?</h2>
            <p>Contact us today for a consultation</p>
            <div className="cta-btns">
              <button className="btn-primary-solid" onClick={() => openModal()}>
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
        preselectedService={selectedService}
      />
    </>
  );
}
