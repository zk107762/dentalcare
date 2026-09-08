"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import ServiceCard from "./components/ServiceCard";
import ComparisonSlider from "./components/ComparisonSlider";
import AppointmentModal from "./components/AppointmentModal";
import ToothArchTransition from "./components/ToothArchTransition";
import { useData } from "./DataStore";

const ThreeTooth = dynamic(() => import("./components/ThreeTooth"), {
  ssr: false,
  loading: () => <div className="three-tooth-placeholder" />,
});

const WHATSAPP_NUMBER = "923475291102";
const PHONE_NUMBER = "+92 347 5291102";

const SERVICES = [
  {
    icon: "tooth",
    title: "General Dentistry",
    desc: "Complete dental examinations, cleaning, fillings and preventative treatments.",
    img: "/images/service-general.jpg",
  },
  {
    icon: "sparkle",
    title: "Teeth Whitening",
    desc: "Professional whitening treatments for a brighter and more confident smile.",
    img: "/images/service-whitening.jpg",
  },
  {
    icon: "smile",
    title: "Cosmetic Dentistry",
    desc: "Transform your smile with veneers, bonding and modern cosmetic procedures.",
    img: "/images/service-cosmetic.jpg",
  },
  {
    icon: "implant",
    title: "Dental Implants",
    desc: "Natural-looking and long-lasting solutions for missing teeth.",
    img: "/images/service-implants.jpg",
  },
  {
    icon: "ortho",
    title: "Orthodontics",
    desc: "Straighten your teeth with modern orthodontic treatment options.",
    img: "/images/service-orthodontics.jpg",
  },
  {
    icon: "emergency",
    title: "Emergency Care",
    desc: "Fast professional assistance when unexpected dental problems happen.",
    img: "/images/service-emergency.jpg",
  },
];

const TESTIMONIALS = [
  {
    text: "The entire experience was amazing. The clinic is beautiful and the doctor explained everything clearly. I finally feel comfortable going to the dentist.",
    name: "Sarah Ahmed",
    initials: "SA",
    avatar: "/images/avatar-1.jpg",
  },
  {
    text: "Very professional and friendly. My treatment was completely painless and the results are better than I expected.",
    name: "Hamza Ali",
    initials: "HA",
    avatar: "/images/avatar-2.jpg",
  },
  {
    text: "Highly recommended. Booking was easy and the staff were incredibly helpful from the first call until the end of my treatment.",
    name: "Maham Khan",
    initials: "MK",
    avatar: "/images/avatar-3.jpg",
  },
];

const BEFORE_AFTER = [
  {
    label: "Teeth Whitening",
    beforeImg: "/images/before-whitening.jpg",
    afterImg: "/images/after-whitening.jpg",
  },
  {
    label: "Dental Veneers",
    beforeImg: "/images/before-veneers.jpg",
    afterImg: "/images/after-veneers.jpg",
  },
  {
    label: "Smile Makeover",
    beforeImg: "/images/before-smile.jpg",
    afterImg: "/images/after-smile.jpg",
  },
];

const OPENING_HOURS = [
  { day: "Monday - Friday", time: "9:00 AM - 8:00 PM" },
  { day: "Saturday", time: "9:00 AM - 5:00 PM" },
  { day: "Sunday", time: "Emergency Only" },
];

const CREDENTIALS = [
  "BDS (Bachelor of Dental Surgery)",
  "FCPS (Fellowship of College of Physicians & Surgeons)",
  "Certified Implantologist",
  "12+ years clinical experience",
  "500+ successful smile makeovers",
];

export default function Home() {
  const { services: dataServices, testimonials: dataTestimonials, beforeAfter: dataBA, settings, doctor } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [navScrolled, setNavScrolled] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [heroMouse, setHeroMouse] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);
  const doctorImgRef = useRef<HTMLDivElement>(null);
  const clinicImgRef = useRef<HTMLDivElement>(null);
  const ratingCardRef = useRef<HTMLDivElement>(null);
  const expCardRef = useRef<HTMLDivElement>(null);
  const cursorLightRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [mobileMenuOpen]);

  // Scroll reveal + nav glass + hero progress
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Intersection observer for reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    // Active section tracking for nav
    const sectionIds = ["services", "doctor", "before-after", "reviews", "contact"];
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-80px 0px -50% 0px" }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    // Nav scroll effect
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 50);

      // Hero parallax/scroll progress
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const progress = Math.max(
          0,
          Math.min(1, 1 - rect.bottom / (rect.height + window.innerHeight))
        );
        setHeroProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      sectionObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Hero entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Hero mouse parallax — clinic image, rating card, experience card, cursor light
  const handleHeroMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const hero = heroRef.current;
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setHeroMouse({ x, y });

      // Clinic image — subtle parallax opposite direction
      const clinicImg = clinicImgRef.current;
      if (clinicImg) {
        clinicImg.style.transform = `scale(1.02) translate(${-x * 8}px, ${-y * 6}px)`;
      }

      // Rating card — independent tiny parallax
      const ratingCard = ratingCardRef.current;
      if (ratingCard) {
        ratingCard.style.transform = `translate(${x * 12}px, ${y * 10}px) perspective(600px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
      }

      // Experience card — offset parallax
      const expCard = expCardRef.current;
      if (expCard) {
        expCard.style.transform = `translate(${x * -10}px, ${y * -8}px)`;
      }

      // Cursor light — follow mouse
      const cursorLight = cursorLightRef.current;
      if (cursorLight) {
        cursorLight.style.transform = `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px)`;
      }
    },
    []
  );

  const handleHeroMouseLeave = useCallback(() => {
    const clinicImg = clinicImgRef.current;
    if (clinicImg) clinicImg.style.transform = "scale(1) translate(0px, 0px)";
    const ratingCard = ratingCardRef.current;
    if (ratingCard) ratingCard.style.transform = "";
    const expCard = expCardRef.current;
    if (expCard) expCard.style.transform = "";
    if (cursorLightRef.current) cursorLightRef.current.style.opacity = "0";
  }, []);

  const handleHeroMouseEnter = useCallback(() => {
    if (cursorLightRef.current) cursorLightRef.current.style.opacity = "1";
  }, []);

  // Doctor image 3D mouse interaction
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

  // Premium magnetic button effects
  const magneticRef = useRef<HTMLAnchorElement>(null);
  const handleMagneticMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const btn = (e.currentTarget as HTMLElement);
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      btn.style.boxShadow = `${-x * 0.08}px ${-y * 0.08}px 30px rgba(11,124,131,0.2)`;
    },
    []
  );

  const handleMagneticLeave = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const btn = (e.currentTarget as HTMLElement);
      if (!btn) return;
      btn.style.transform = "translate(0px, 0px)";
      btn.style.boxShadow = "";
    },
    []
  );

  const openModal = (service?: string) => {
    setSelectedService(service || "");
    setModalOpen(true);
  };

  return (
    <>
      {/* NAVIGATION */}
      <nav className={`nav-main ${navScrolled ? "nav-scrolled" : ""}`}>
        <div className="nav-inner">
          <a href="#" className="nav-logo">
            <span className="nav-logo-icon">✦</span>
            SmileCare
          </a>

          <div className="nav-links-desktop">
            <a href="/services">Services</a>
            <a href="/doctor">Doctor</a>
            <a href="/results">Results</a>
            <a href="/reviews">Reviews</a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-wa-btn"
            >
              💬 WhatsApp
            </a>
            <a
              href="/book"
              ref={magneticRef}
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              className="nav-book-btn"
            >
              Book Appointment
            </a>
          </div>

          <button
            className="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="nav-mobile-menu" ref={mobileMenuRef}>
            <a href="/services" onClick={() => setMobileMenuOpen(false)}>
              Services
            </a>
            <a href="/doctor" onClick={() => setMobileMenuOpen(false)}>
              Doctor
            </a>
            <a href="/results" onClick={() => setMobileMenuOpen(false)}>
              Results
            </a>
            <a href="/reviews" onClick={() => setMobileMenuOpen(false)}>
              Reviews
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-wa-btn-mobile"
            >
              💬 WhatsApp
            </a>
            <a
              href="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="nav-book-btn-mobile"
            >
              Book Appointment
            </a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section
        ref={heroRef}
        className="hero-section"
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        onMouseEnter={handleHeroMouseEnter}
      >
        {/* Cursor Light — follows mouse */}
        <div ref={cursorLightRef} className="hero-cursor-light" />

        {/* 3D Tooth Canvas */}
        <div className="hero-3d-container">
          <ThreeTooth />
        </div>

        <div className="hero-inner">
          <div className="hero-content">
            {/* Staggered entrance: Badge → Headline → Description → Buttons */}
            <span className={`hero-tag ${heroLoaded ? "hero-animate-in" : ""}`}
              style={{ transitionDelay: "0.15s" }}
            >
              <span className="hero-tag-dot" />
              Accepting New Patients
            </span>

            <h1 className="hero-title">
              <span className={`hero-title-line ${heroLoaded ? "hero-animate-in" : ""}`}
                style={{ transitionDelay: "0.35s" }}
              >
                Your smile
              </span>
              <br />
              <span className={`hero-title-line ${heroLoaded ? "hero-animate-in" : ""}`}
                style={{ transitionDelay: "0.45s" }}
              >
                deserves{' '}
                <span className="hero-title-accent">exceptional care.</span>
              </span>
            </h1>

            <p className={`hero-desc ${heroLoaded ? "hero-animate-in" : ""}`}
              style={{ transitionDelay: "0.6s" }}
            >
              Modern, comfortable and personalized dental care designed to give
              you a healthier smile and a better experience every time you visit.
            </p>

            <div className={`hero-btns ${heroLoaded ? "hero-animate-in" : ""}`}
              style={{ transitionDelay: "0.75s" }}
            >
              <a
                href="/book"
                className="btn-primary-solid magnetic-btn hero-btn-book"
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
              >
                Book an Appointment
                <span className="btn-arrow">→</span>
              </a>
              <a
                href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`}
                className="btn-outline magnetic-btn"
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
              >
                <span className="btn-phone-icon">☎</span>
                Call Doctor
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa magnetic-btn"
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
              >
                💬 WhatsApp
              </a>
            </div>
          </div>

          <div className="hero-visual">
            {/* Clinic image with parallax */}
            <div className="hero-image-wrap" ref={clinicImgRef}>
              <img
                src="/images/hero-dentist.jpg"
                alt={`${doctor.name} - Modern Dental Care`}
                loading="eager"
              />
              {/* Teal atmospheric glow around edges */}
              <div className="hero-image-glow" />
            </div>

            {/* Experience badge — glassmorphism floating */}
            <div className="hero-float hero-float-exp" ref={expCardRef}>
              <span className="hero-float-icon hero-float-icon-green">✓</span>
              <div>
                <strong>12+</strong>
                <small>Years Experience</small>
              </div>
            </div>

            {/* Rating card — glassmorphism + 3D tilt */}
            <div className="hero-float hero-float-rating" ref={ratingCardRef}>
              <div className="stars-small">★★★★★</div>
              <strong>4.9 / 5</strong>
              <small>500+ Patients</small>
            </div>
          </div>
        </div>

        {/* Scroll progress indicator */}
        <div
          className="hero-scroll-progress"
          style={{ transform: `scaleX(${heroProgress})` }}
        />
      </section>

      {/* TOOTH ARCH TRANSITION */}
      <ToothArchTransition />

      {/* TRUST BAR */}
      <div className="trust-bar">
        <div className="container-lg">
          <div className="trust-grid">
            {[
              { icon: "✦", title: "Modern Technology", sub: "Advanced equipment" },
              { icon: "♡", title: "Patient First", sub: "Comfortable treatment" },
              { icon: "✓", title: "Experienced", sub: "12+ years experience" },
              { icon: "★", title: "4.9 Rating", sub: "500+ happy patients" },
            ].map((item) => (
              <div key={item.title} className="trust-item reveal">
                <span className="trust-icon">{item.icon}</span>
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.sub}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <section className="section-services" id="services">
        <div className="container-lg">
          <div className="section-head text-center reveal">
            <div className="section-tag">Our Services</div>
            <h2 className="section-title">
              Complete care for your smile
            </h2>
            <p className="section-desc">
              From routine checkups to advanced cosmetic treatments, everything
              you need is available under one roof.
            </p>
          </div>

          <div className="services-grid">
            {dataServices.filter((s) => s.visible).map((s, i) => (
              <ServiceCard
                key={s.id}
                icon={s.icon}
                title={s.title}
                desc={s.desc}
                img={s.img}
                index={i}
                onClick={() => openModal(s.title)}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="section-marquee">
        <div className="marquee-track slide-left">
          {[
            { img: "/images/tooth-1.jpg", label: "Dental Exams" },
            { img: "/images/tooth-2.jpg", label: "Whitening" },
            { img: "/images/tooth-3.jpg", label: "Cosmetic" },
            { img: "/images/tooth-4.jpg", label: "Implants" },
            { img: "/images/tooth-5.jpg", label: "Orthodontics" },
            { img: "/images/tooth-6.jpg", label: "Emergency" },
            { img: "/images/dental-tools.jpg", label: "Technology" },
            { img: "/images/clinic-interior.jpg", label: "Our Clinic" },
            { img: "/images/tooth-1.jpg", label: "Dental Exams" },
            { img: "/images/tooth-2.jpg", label: "Whitening" },
            { img: "/images/tooth-3.jpg", label: "Cosmetic" },
            { img: "/images/tooth-4.jpg", label: "Implants" },
            { img: "/images/tooth-5.jpg", label: "Orthodontics" },
            { img: "/images/tooth-6.jpg", label: "Emergency" },
            { img: "/images/dental-tools.jpg", label: "Technology" },
            { img: "/images/clinic-interior.jpg", label: "Our Clinic" },
          ].map((item, i) => (
            <div key={i} className="marquee-item">
              <img src={item.img} alt={item.label} loading="lazy" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* DOCTOR */}
      <section className="section-doctor" id="doctor">
        <div className="container-lg">
          <div className="doctor-grid">
            <div className="reveal">
              <div
                ref={doctorImgRef}
                className="doctor-image-wrap"
                onMouseMove={handleDoctorMouseMove}
                onMouseLeave={handleDoctorMouseLeave}
              >
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  loading="lazy"
                />
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

            <div className="reveal">
              <div className="section-tag">Meet Your Dentist</div>
              <h2 className="section-title-lg">
                Care you can trust. A smile you can love.
              </h2>
              <p className="section-text">
                {doctor.bio}
              </p>

              <div className="credentials-list">
                <strong className="credentials-heading">Credentials</strong>
                {doctor.credentials.map((c) => (
                  <div key={c} className="credential-item">
                    <span className="credential-check">✓</span>
                    {c}
                  </div>
                ))}
              </div>

              <button
                className="btn-primary-solid"
                onClick={() => openModal()}
              >
                Meet Dr. Ahmed →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* OPENING HOURS + EMERGENCY CTA */}
      <section className="section-hours" id="hours">
        <div className="container-lg">
          <div className="hours-grid">
            <div className="reveal">
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

            <div className="reveal">
              <div className="emergency-card">
                <div className="emergency-icon">🚨</div>
                <h3>Dental Emergency?</h3>
                <p>
                  Experiencing sudden tooth pain, a broken tooth, or any dental
                  emergency? Don&apos;t wait. Call us immediately for fast,
                  professional help.
                </p>
                <a
                  href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`}
                  className="emergency-btn"
                >
                  ☎ Emergency Call Now
                </a>
                <p className="emergency-note">Available 24/7 for urgent cases</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="section-before-after" id="before-after">
        <div className="container-lg">
          <div className="section-head text-center reveal">
            <div className="section-tag">See the Difference</div>
            <h2 className="section-title">Transformations that speak</h2>
            <p className="section-desc">
              Small changes can create a confident smile.
            </p>
          </div>

          <div className="ba-grid">
            {dataBA.filter((item) => item.visible).map((item) => (
              <div key={item.id} className="ba-card reveal">
                <ComparisonSlider
                  beforeImg={item.beforeImg}
                  afterImg={item.afterImg}
                />
                <h4 className="ba-card-label">{item.label}</h4>
              </div>
            ))}
          </div>

          <p className="ba-disclaimer">
            *Results may vary. Images are illustrative. Consultation required
            for personalised treatment plan.
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-reviews" id="reviews">
        <div className="container-lg">
          <div className="section-head text-center reveal">
            <div className="section-tag">Patient Stories</div>
            <h2 className="section-title">Loved by our patients</h2>
            <p className="section-desc">
              Real experiences from people who trusted us with their smiles.
            </p>
          </div>

          <div className="reviews-grid">
            {dataTestimonials.filter((t) => t.approved).slice(0, 3).map((t, i) => (
              <div
                key={t.id}
                className="review-card reveal"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="review-stars">★★★★★</div>
                <p className="review-text">&ldquo;{t.text}&rdquo;</p>
                <div className="review-author">
                  <img src={t.avatar} alt={t.name} loading="lazy" />
                  <div>
                    <strong>{t.name}</strong>
                    <small>Verified Patient</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPOINTMENT + MAP */}
      <section className="section-contact" id="contact">
        <div className="container-lg">
          <div className="contact-grid">
            <div className="reveal">
              <div className="section-tag section-tag-light">Book Your Visit</div>
              <h2 className="section-title-xl">
                Your healthier smile starts here.
              </h2>
              <p className="contact-desc">
                Have a question or ready to schedule your visit? Contact us
                directly or send an appointment request.
              </p>

              <div className="contact-info-list">
                <div className="contact-info-item">
                  <span className="contact-info-icon">☎</span>
                  <a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`}>
                    {PHONE_NUMBER}
                  </a>
                </div>
                <div className="contact-info-item">
                  <span className="contact-info-icon">✉</span>
                  <span>hello@smilecare.com</span>
                </div>
                <div className="contact-info-item">
                  <span className="contact-info-icon">⌖</span>
                  <span>Main Boulevard, Lahore, Pakistan</span>
                </div>
              </div>

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

            <div className="reveal">
              <div className="form-card">
                <h3>Request an Appointment</h3>
                <ContactForm onSubmit={() => openModal()} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="container-lg">
          <div className="footer-inner">
            <div>
              <a href="#" className="nav-logo footer-logo">
                <span className="nav-logo-icon">✦</span>
                SmileCare
              </a>
              <p className="footer-tagline">Modern dentistry. Better smiles.</p>
            </div>
            <div className="footer-links">
              <a href="/services">Services</a>
              <a href="/doctor">Doctor</a>
              <a href="/reviews">Reviews</a>
              <a href="/book">Book</a>
              <a href="/admin/login" className="footer-admin-link">Admin</a>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}
      <div className="wa-float-wrap">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="wa-float-btn"
        >
          💬
        </a>
        <span className="wa-tooltip">Chat with us</span>
      </div>

      {/* APPOINTMENT MODAL */}
      <AppointmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        preselectedService={selectedService}
      />
    </>
  );
}

function ContactForm({ onSubmit }: { onSubmit: () => void }) {
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <div className="contact-form">
      <div className="form-row-2">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          autoComplete="name"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          inputMode="tel"
          autoComplete="tel"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          inputMode="email"
          autoComplete="email"
        />
        <select
          name="service"
          value={formData.service}
          onChange={handleChange}
        >
          <option value="">Select Service</option>
          {SERVICES.map((s) => (
            <option key={s.title} value={s.title}>
              {s.title}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          autoComplete="off"
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <textarea
        name="message"
        placeholder="Tell us briefly how we can help..."
        value={formData.message}
        onChange={handleChange}
        rows={4}
      />
      <button className="btn-primary-solid btn-full" onClick={handleSubmit}>
        Book via WhatsApp →
      </button>
    </div>
  );
}
