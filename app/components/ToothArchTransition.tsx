"use client";

import { useEffect, useRef } from "react";

export default function ToothArchTransition() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      const progress = Math.max(
        0,
        Math.min(1, 1 - (rect.top / (viewH * 0.8)))
      );

      section.style.setProperty("--progress", String(progress));
    };

    if (!prefersReduced) {
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="tooth-arch-section"
      aria-hidden="true"
    >
      <div className="tooth-arch-container">
        {/* Single tooth that transitions into arch */}
        <div className="tooth-arch-center-tooth">
          <svg
            viewBox="0 0 60 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M30 5C18 5 8 15 8 30C8 40 12 48 16 52C18 54 20 60 22 68C23 72 26 78 30 78C34 78 37 72 38 68C40 60 42 54 44 52C48 48 52 40 52 30C52 15 42 5 30 5Z"
              fill="var(--primary)"
              opacity="0.15"
            />
            <path
              d="M30 8C20 8 11 17 11 30C11 39 14 46 18 50C20 52 22 58 23 65C24 70 27 75 30 75C33 75 36 70 37 65C38 58 40 52 42 50C46 46 49 39 49 30C49 17 40 8 30 8Z"
              stroke="var(--primary)"
              strokeWidth="1.5"
              fill="none"
              opacity="0.4"
            />
          </svg>
        </div>

        {/* Arch teeth that appear on scroll */}
        {[
          { x: -120, y: 8, rot: -25, scale: 0.6, delay: 0 },
          { x: -95, y: 2, rot: -18, scale: 0.7, delay: 0.02 },
          { x: -65, y: -3, rot: -10, scale: 0.85, delay: 0.04 },
          { x: -35, y: -5, rot: -4, scale: 0.95, delay: 0.06 },
          { x: 35, y: -5, rot: 4, scale: 0.95, delay: 0.06 },
          { x: 65, y: -3, rot: 10, scale: 0.85, delay: 0.04 },
          { x: 95, y: 2, rot: 18, scale: 0.7, delay: 0.02 },
          { x: 120, y: 8, rot: 25, scale: 0.6, delay: 0 },
        ].map((tooth, i) => (
          <div
            key={i}
            className="tooth-arch-tooth"
            style={{
              transform: `translateX(${tooth.x}px) translateY(${tooth.y}px) rotate(${tooth.rot}deg) scale(${tooth.scale})`,
              transitionDelay: `${tooth.delay}s`,
            }}
          >
            <svg
              viewBox="0 0 40 55"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 3C12 3 5 10 5 20C5 27 8 32 11 35C12 36 14 42 15 48C16 51 18 54 20 54C22 54 24 51 25 48C26 42 28 36 29 35C32 32 35 27 35 20C35 10 28 3 20 3Z"
                fill="var(--accent)"
                opacity="0.25"
              />
              <path
                d="M20 5C13 5 7 12 7 20C7 26 9 30 12 33C13 34 15 40 16 45C17 49 19 52 20 52C21 52 23 49 24 45C25 40 27 34 28 33C31 30 33 26 33 20C33 12 27 5 20 5Z"
                stroke="var(--primary)"
                strokeWidth="1"
                fill="none"
                opacity="0.3"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Connecting arc line */}
      <svg
        className="tooth-arch-line"
        viewBox="0 0 300 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M30 55 Q150 -10 270 55"
          stroke="var(--primary)"
          strokeWidth="1"
          fill="none"
          opacity="0.2"
          strokeDasharray="4 4"
        />
      </svg>
    </section>
  );
}
