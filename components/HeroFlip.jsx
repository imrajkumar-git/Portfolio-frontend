"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Hero photo with a video on its back side.
 * - Desktop: hover the photo to flip it and play the video.
 * - Touch / keyboard: tap (or press Enter / Space) to flip; tap again to flip back.
 * The video file lives at /public/hero-video.mp4. Until it exists, the back side
 * shows a slow pan over the same photo, so the flip never looks broken.
 */
export default function HeroFlip() {
  const [flipped, setFlipped] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef(null);
  const lastPointer = useRef("keyboard");

  useEffect(() => {
    const v = videoRef.current;
    if (!v || videoFailed) return;
    if (flipped) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [flipped, videoFailed]);

  const onPointerDown = (e) => {
    lastPointer.current = e.pointerType || "mouse";
  };
  const onPointerEnter = (e) => {
    if (e.pointerType === "mouse") setFlipped(true);
  };
  const onPointerLeave = (e) => {
    if (e.pointerType === "mouse") setFlipped(false);
  };
  const onClick = () => {
    // A mouse click keeps the hover state; touch and keyboard toggle.
    if (lastPointer.current === "mouse") setFlipped(true);
    else setFlipped((f) => !f);
    lastPointer.current = "keyboard";
  };

  return (
    <div className="hero-flip-wrap">
      <button
        type="button"
        className={`hero-flip ${flipped ? "is-flipped" : ""}`}
        onPointerDown={onPointerDown}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onClick={onClick}
        aria-pressed={flipped}
        aria-label="Rajkumar's photo. Activate to play a short video of Abu Dhabi."
      >
        <span className="hero-flip-inner">
          {/* FRONT: the photo */}
          <span className="hero-flip-face hero-flip-front glass-card shadow-glow">
            <span className="relative block h-full w-full overflow-hidden rounded-[1.5rem]">
              <Image
                src="/hero-portrait.jpg"
                alt="Rajkumar Aryal standing in front of a large angel-wing sculpture"
                fill
                priority
                sizes="(max-width: 640px) 288px, (max-width: 1024px) 384px, 448px"
                className="object-cover object-center"
              />
            </span>
          </span>

          {/* BACK: the video */}
          <span className="hero-flip-face hero-flip-back glass-card shadow-glow">
            <span className="relative block h-full w-full overflow-hidden rounded-[1.5rem] bg-black">
              {videoFailed ? (
                <Image
                  src="/hero-portrait.jpg"
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(max-width: 640px) 288px, (max-width: 1024px) 384px, 448px"
                  className="hero-kenburns object-cover"
                />
              ) : (
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  poster="/hoverimage.jpg"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onError={() => setVideoFailed(true)}
                >
                  <source src="/hero-video.mp4" type="video/mp4" onError={() => setVideoFailed(true)} />
                </video>
              )}
              <span className="hero-flip-badge">Abu Dhabi</span>
            </span>
          </span>
        </span>
      </button>
      <p className="hero-flip-hint" aria-hidden="true">
        <span className="hero-hint-hover">Hover the photo to play</span>
        <span className="hero-hint-touch">Tap the photo to play</span>
      </p>
    </div>
  );
}
