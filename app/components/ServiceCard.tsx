"use client";

import { useRef, useState, useCallback } from "react";

interface ServiceCardProps {
  icon: string;
  title: string;
  desc: string;
  img: string;
  index: number;
  onClick?: () => void;
  loading?: "lazy" | "eager";
}

export default function ServiceCard({
  icon,
  title,
  desc,
  img,
  index,
  onClick,
  loading = "lazy",
}: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [shine, setShine] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setTilt({
        x: (y - 0.5) * -10,
        y: (x - 0.5) * 10,
      });
      setShine({ x: x * 100, y: y * 100 });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  return (
    <div
      ref={cardRef}
      className="service-card reveal"
      style={{
        transitionDelay: `${index * 0.08}s`,
        transform: isHovered
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-10px)`
          : "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {isHovered && (
        <div
          className="service-card-shine"
          style={{
            background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(11,124,131,0.15) 0%, transparent 50%)`,
          }}
        />
      )}
      <div className="service-card-img">
        <img src={img} alt={title} loading={loading} />
      </div>
      <div className="service-card-body">
        <div className="service-card-icon-wrap">
          <span className={`service-card-icon service-icon-${title.toLowerCase().replace(/\s+/g, "-")}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {icon === "tooth" && (<><path d="M12 2C9 2 6 5 6 9C6 13 8 15 9 17C10 19 11 22 12 22C13 22 14 19 15 17C16 15 18 13 18 9C18 5 15 2 12 2Z" /><path d="M9 9C9 9 10 11 12 11C14 11 15 9 15 9" /></>) }
              {icon === "sparkle" && (<><path d="M12 2L14 8L20 10L14 12L12 18L10 12L4 10L10 8Z" /><path d="M19 15L20 18L23 19L20 20L19 23L18 20L15 19L18 18Z" /></>) }
              {icon === "smile" && (<><circle cx="12" cy="12" r="10" /><path d="M8 14S9.5 16 12 16S16 14 16 14" /><circle cx="9" cy="10" r="1" fill="currentColor" /><circle cx="15" cy="10" r="1" fill="currentColor" /></>) }
              {icon === "implant" && (<><path d="M12 2V6" /><path d="M8 6H16V10C16 14 14 18 12 22C10 18 8 14 8 10V6Z" /><path d="M10 10H14" /></>) }
              {icon === "ortho" && (<><rect x="3" y="10" width="18" height="4" rx="2" /><circle cx="7" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="17" cy="12" r="1.5" /></>) }
              {icon === "emergency" && (<><path d="M12 2L2 20H22L12 2Z" /><path d="M12 8V13" /><circle cx="12" cy="16" r="0.5" fill="currentColor" /></>) }
            </svg>
          </span>
        </div>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </div>
  );
}
