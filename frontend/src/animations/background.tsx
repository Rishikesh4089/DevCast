import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function BackgroundAnimation() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const lines = svgRef.current.querySelectorAll('.line');
    const circles = svgRef.current.querySelectorAll('.circle');

    gsap.set([lines, circles], { opacity: 0 });

    gsap.to(lines, {
      opacity: 0.3,
      duration: 1,
      stagger: 0.1,
      ease: "power2.inOut"
    });

    gsap.to(circles, {
      opacity: 0.25,
      duration: 1,
      stagger: 0.2,
      ease: "power2.inOut"
    });

    // Animate circles continuously
    circles.forEach((circle) => {
      gsap.to(circle, {
        y: "random(-30, 30)",
        x: "random(-30, 30)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  }, []);

  return (
    <svg
      ref={svgRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background lines */}
      <line className="line stroke-blue-300" x1="0" y1="0" x2="100%" y2="100%" strokeWidth="1.5" />
      <line className="line stroke-blue-300" x1="100%" y1="0" x2="0" y2="100%" strokeWidth="1.5" />
      <line className="line stroke-blue-300" x1="50%" y1="0" x2="50%" y2="100%" strokeWidth="1.5" />
      <line className="line stroke-blue-300" x1="0" y1="50%" x2="100%" y2="50%" strokeWidth="1.5" />
      
      {/* Floating circles */}
      <circle className="circle fill-blue-300" cx="20%" cy="30%" r="6" />
      <circle className="circle fill-blue-300" cx="80%" cy="70%" r="10" />
      <circle className="circle fill-blue-300" cx="40%" cy="60%" r="8" />
      <circle className="circle fill-blue-300" cx="70%" cy="20%" r="5" />
      <circle className="circle fill-blue-300" cx="60%" cy="80%" r="9" />
      <circle className="circle fill-blue-300" cx="30%" cy="40%" r="7" />
    </svg>
  );
}