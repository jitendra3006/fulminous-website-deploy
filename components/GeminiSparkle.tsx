"use client";

import styles from "./GeminiSparkle.module.css";

type GeminiSparkleProps = {
  size?: number; // px, controls main star. companion stars scale proportionally.
  className?: string;
};

const STAR_PATH =
  "M12 0 C12.8 5.5 13.5 9.2 16 11.7 C18.5 14.2 21 15 24 12 C21 14.5 18.5 15.3 16 17.8 C13.5 20.3 12.8 23 12 24 C11.2 23 10.5 20.3 8 17.8 C5.5 15.3 3 14.5 0 12 C3 15 5.5 14.2 8 11.7 C10.5 9.2 11.2 5.5 12 0 Z";

/**
 * Gemini 3-Star Twinkling Cluster (Strictly Blue, Purple, and White)
 * - Star 1: Large Center Star (Blue -> Purple -> White)
 * - Star 2: Top-Right Star (Purple -> White -> Blue)
 * - Star 3: Bottom-Left Star (White -> Blue -> Purple)
 */
export default function GeminiSparkle({ size = 32, className = "" }: GeminiSparkleProps) {
  return (
    <div
      className={`${styles.wrapper} ${className}`}
      style={{ width: size, height: size }}
    >
      {/* 1. Main Center Star */}
      <svg
        viewBox="0 0 24 24"
        className={styles.mainStar}
        style={{ width: size, height: size }}
      >
        <defs>
          <linearGradient id="geminiGradMainBPW" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4285F4" />
            <stop offset="50%" stopColor="#9C27B0" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
        </defs>
        <path d={STAR_PATH} fill="url(#geminiGradMainBPW)" />
      </svg>

      {/* 2. Top-Right Star */}
      <svg viewBox="0 0 24 24" className={styles.starTwo}>
        <defs>
          <linearGradient id="geminiGradTwoBPW" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9C27B0" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#3887FE" />
          </linearGradient>
        </defs>
        <path d={STAR_PATH} fill="url(#geminiGradTwoBPW)" />
      </svg>

      {/* 3. Bottom-Left Star */}
      <svg viewBox="0 0 24 24" className={styles.starThree}>
        <defs>
          <linearGradient id="geminiGradThreeBPW" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#3887FE" />
            <stop offset="100%" stopColor="#9C27B0" />
          </linearGradient>
        </defs>
        <path d={STAR_PATH} fill="url(#geminiGradThreeBPW)" />
      </svg>
    </div>
  );
}
