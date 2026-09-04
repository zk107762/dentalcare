"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// ═══════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════

export interface SiteService {
  id: string;
  icon: string;
  title: string;
  desc: string;
  longDesc: string;
  img: string;
  features: string[];
  visible: boolean;
}

export interface SiteTestimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  treatment: string;
  avatar: string;
  approved: boolean;
  featured: boolean;
}

export interface SiteBeforeAfter {
  id: string;
  label: string;
  beforeImg: string;
  afterImg: string;
  description: string;
  visible: boolean;
}

export interface SiteDoctor {
  name: string;
  title: string;
  image: string;
  bio: string;
  experience: string;
  patients: string;
  rating: string;
  credentials: string[];
}

export interface SiteSettings {
  name: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
}

interface DataContextType {
  services: SiteService[];
  testimonials: SiteTestimonial[];
  beforeAfter: SiteBeforeAfter[];
  settings: SiteSettings;
  doctor: SiteDoctor;
  updateServices: (data: SiteService[]) => void;
  updateTestimonials: (data: SiteTestimonial[]) => void;
  updateBeforeAfter: (data: SiteBeforeAfter[]) => void;
  updateSettings: (data: SiteSettings) => void;
  updateDoctor: (data: SiteDoctor) => void;
}

// ═══════════════════════════════════════════
// DEFAULTS
// ═══════════════════════════════════════════

const DEFAULT_SERVICES: SiteService[] = [
  { id: "general", icon: "tooth", title: "General Dentistry", desc: "Complete dental examinations, cleaning, fillings and preventative treatments.", longDesc: "Our general dentistry services form the foundation of your oral health.", img: "/images/service-general.jpg", features: ["Routine Examinations", "Professional Cleaning", "Dental Fillings", "Root Canal Therapy"], visible: true },
  { id: "whitening", icon: "sparkle", title: "Teeth Whitening", desc: "Professional whitening treatments for a brighter and more confident smile.", longDesc: "Professional teeth whitening is one of the quickest ways to enhance your smile.", img: "/images/service-whitening.jpg", features: ["In-Office Whitening", "Take-Home Kits", "LED Treatment", "Enamel-Safe"], visible: true },
  { id: "cosmetic", icon: "smile", title: "Cosmetic Dentistry", desc: "Transform your smile with veneers, bonding and modern cosmetic procedures.", longDesc: "Cosmetic dentistry combines artistry with dental science.", img: "/images/service-cosmetic.jpg", features: ["Porcelain Veneers", "Dental Bonding", "Smile Makeover", "Gum Contouring"], visible: true },
  { id: "implants", icon: "implant", title: "Dental Implants", desc: "Natural-looking and long-lasting solutions for missing teeth.", longDesc: "Dental implants are the gold standard for replacing missing teeth.", img: "/images/service-implants.jpg", features: ["Single Tooth Implants", "All-on-4 Implants", "Bone Grafting", "Immediate Loading"], visible: true },
  { id: "orthodontics", icon: "ortho", title: "Orthodontics", desc: "Straighten your teeth with modern orthodontic treatment options.", longDesc: "Modern orthodontics offers more options than ever.", img: "/images/service-orthodontics.jpg", features: ["Traditional Braces", "Clear Aligners", "Lingual Braces", "Retainers"], visible: true },
  { id: "emergency", icon: "emergency", title: "Emergency Care", desc: "Fast professional assistance when unexpected dental problems happen.", longDesc: "Dental emergencies require immediate attention.", img: "/images/service-emergency.jpg", features: ["Same-Day Appointments", "Toothache Relief", "Broken Tooth Repair", "Trauma Care"], visible: true },
];

const DEFAULT_TESTIMONIALS: SiteTestimonial[] = [
  { id: "t1", name: "Sarah Ahmed", text: "The entire experience was amazing. The clinic is beautiful and the doctor explained everything clearly.", rating: 5, treatment: "Teeth Whitening", avatar: "/images/avatar-1.jpg", approved: true, featured: true },
  { id: "t2", name: "Hamza Ali", text: "Very professional and friendly. My treatment was completely painless and the results are better than I expected.", rating: 5, treatment: "Dental Implants", avatar: "/images/avatar-2.jpg", approved: true, featured: true },
  { id: "t3", name: "Maham Khan", text: "Highly recommended. Booking was easy and the staff were incredibly helpful from the first call.", rating: 5, treatment: "Cosmetic Dentistry", avatar: "/images/avatar-3.jpg", approved: true, featured: true },
];

const DEFAULT_BEFORE_AFTER: SiteBeforeAfter[] = [
  { id: "ba1", label: "Teeth Whitening", beforeImg: "/images/before-whitening.jpg", afterImg: "/images/after-whitening.jpg", description: "Professional in-office whitening transformed dull, yellowed teeth.", visible: true },
  { id: "ba2", label: "Dental Veneers", beforeImg: "/images/before-veneers.jpg", afterImg: "/images/after-veneers.jpg", description: "Custom porcelain veneers corrected shape and color.", visible: true },
  { id: "ba3", label: "Smile Makeover", beforeImg: "/images/before-smile.jpg", afterImg: "/images/after-smile.jpg", description: "A comprehensive smile makeover combining multiple treatments.", visible: true },
];

const DEFAULT_SETTINGS: SiteSettings = {
  name: "SmileCare",
  phone: "+92 347 5291102",
  email: "hello@smilecare.com",
  address: "Main Boulevard, Lahore, Pakistan",
  whatsapp: "923475291102",
};

const DEFAULT_DOCTOR: SiteDoctor = {
  name: "Dr. Ahmed Khan",
  title: "BDS, FCPS — Certified Implantologist",
  image: "/images/doctor-about.jpg",
  bio: "Dr. Ahmed Khan combines years of clinical experience with modern dental technology to provide safe, comfortable and personalized treatment for every patient.",
  experience: "12+",
  patients: "500+",
  rating: "4.9",
  credentials: [
    "BDS (Bachelor of Dental Surgery)",
    "FCPS (Fellowship of College of Physicians & Surgeons)",
    "Certified Implantologist",
    "12+ years clinical experience",
    "500+ successful smile makeovers",
  ],
};

// ═══════════════════════════════════════════
// STORAGE HELPERS
// ═══════════════════════════════════════════

function loadFromStorage<T>(key: string, defaults: T): T {
  if (typeof window === "undefined") return defaults;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaults;
  } catch {
    return defaults;
  }
}

function saveToStorage(key: string, data: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Storage save failed:", e);
  }
}

// ═══════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════

const DataContext = createContext<DataContextType>({
  services: DEFAULT_SERVICES,
  testimonials: DEFAULT_TESTIMONIALS,
  beforeAfter: DEFAULT_BEFORE_AFTER,
  settings: DEFAULT_SETTINGS,
  doctor: DEFAULT_DOCTOR,
  updateServices: () => {},
  updateTestimonials: () => {},
  updateBeforeAfter: () => {},
  updateSettings: () => {},
  updateDoctor: () => {},
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<SiteService[]>(DEFAULT_SERVICES);
  const [testimonials, setTestimonials] = useState<SiteTestimonial[]>(DEFAULT_TESTIMONIALS);
  const [beforeAfter, setBeforeAfter] = useState<SiteBeforeAfter[]>(DEFAULT_BEFORE_AFTER);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [doctor, setDoctor] = useState<SiteDoctor>(DEFAULT_DOCTOR);
  const [ready, setReady] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setServices(loadFromStorage("smilecare_services", DEFAULT_SERVICES));
    setTestimonials(loadFromStorage("smilecare_testimonials", DEFAULT_TESTIMONIALS));
    setBeforeAfter(loadFromStorage("smilecare_before_after", DEFAULT_BEFORE_AFTER));
    setSettings(loadFromStorage("smilecare_site_settings", DEFAULT_SETTINGS));
    setDoctor(loadFromStorage("smilecare_doctor", DEFAULT_DOCTOR));
    setReady(true);
  }, []);

  // Listen for storage changes from other tabs (admin → public sync)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "smilecare_services" && e.newValue) {
        setServices(JSON.parse(e.newValue));
      }
      if (e.key === "smilecare_testimonials" && e.newValue) {
        setTestimonials(JSON.parse(e.newValue));
      }
      if (e.key === "smilecare_before_after" && e.newValue) {
        setBeforeAfter(JSON.parse(e.newValue));
      }
      if (e.key === "smilecare_site_settings" && e.newValue) {
        setSettings(JSON.parse(e.newValue));
      }
      if (e.key === "smilecare_doctor" && e.newValue) {
        setDoctor(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const updateServices = useCallback((data: SiteService[]) => {
    setServices(data);
    saveToStorage("smilecare_services", data);
  }, []);

  const updateTestimonials = useCallback((data: SiteTestimonial[]) => {
    setTestimonials(data);
    saveToStorage("smilecare_testimonials", data);
  }, []);

  const updateBeforeAfter = useCallback((data: SiteBeforeAfter[]) => {
    setBeforeAfter(data);
    saveToStorage("smilecare_before_after", data);
  }, []);

  const updateSettings = useCallback((data: SiteSettings) => {
    setSettings(data);
    saveToStorage("smilecare_site_settings", data);
  }, []);

  const updateDoctor = useCallback((data: SiteDoctor) => {
    setDoctor(data);
    saveToStorage("smilecare_doctor", data);
  }, []);

  if (!ready) return null;

  return (
    <DataContext.Provider value={{ services, testimonials, beforeAfter, settings, doctor, updateServices, updateTestimonials, updateBeforeAfter, updateSettings, updateDoctor }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
