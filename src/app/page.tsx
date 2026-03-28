"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CountUp } from "@/components/CountUp";

/* ═══════════════════════════════════════════════════════════
   SLIDE REGISTRY — single source of truth
   ═══════════════════════════════════════════════════════════ */
const SLIDES = [
  { id: "title", label: "SENTINEL" },
  { id: "threat", label: "Threat" },
  { id: "gap", label: "The Gap" },
  { id: "solution", label: "Solution" },
  { id: "rf", label: "RF Spectrum" },
  { id: "elrs", label: "ELRS" },
  { id: "architecture", label: "Architecture" },
  { id: "tests", label: "Battle Tested" },
  { id: "journey", label: "W1→W21" },
  { id: "cta", label: "Join" },
] as const;

type SlideId = (typeof SLIDES)[number]["id"];

/* ═══════════════════════════════════════════════════════════
   ANIMATION VARIANTS — defined OUTSIDE components (stable refs)
   ═══════════════════════════════════════════════════════════ */
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 30 : -30, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -30 : 30, opacity: 0 }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.35,
      ease: "easeOut" as const,
    },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.35,
      ease: "easeOut" as const,
    },
  }),
};

const breatheGlow = {
  animate: {
    boxShadow: [
      "0 0 15px rgba(0,212,255,0.05)",
      "0 0 25px rgba(0,212,255,0.12)",
      "0 0 15px rgba(0,212,255,0.05)",
    ],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
  },
};

/* ═══════════════════════════════════════════════════════════
   REUSABLE COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function GlassCard({
  children,
  className = "",
  breathing = false,
}: {
  children: React.ReactNode;
  className?: string;
  breathing?: boolean;
}) {
  return (
    <motion.div
      className={`bg-[rgba(13,27,42,0.85)] backdrop-blur-xl border border-[rgba(0,212,255,0.15)] rounded-xl p-6 ${className}`}
      {...(breathing ? { animate: breatheGlow.animate } : {})}
    >
      {children}
    </motion.div>
  );
}

function SlideBg({
  src,
  overlay = "rgba(10,10,15,0.82)",
}: {
  src: string;
  overlay?: string;
}) {
  return (
    <div className="absolute inset-0 z-0">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${src})` }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(to bottom, ${overlay}, ${overlay})` }}
      />
      <div className="absolute inset-0 grid-bg" />
    </div>
  );
}

function Badge({ children, color = "cyan" }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    cyan: "border-[#00d4ff]/30 text-[#00d4ff] bg-[#00d4ff]/5",
    amber: "border-[#ffaa00]/30 text-[#ffaa00] bg-[#ffaa00]/5",
    threat: "border-[#ff4444]/30 text-[#ff4444] bg-[#ff4444]/5",
    safe: "border-[#00e676]/30 text-[#00e676] bg-[#00e676]/5",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-mono font-semibold tracking-wider uppercase ${colors[color] || colors.cyan}`}
    >
      {children}
    </span>
  );
}

function PulseRing() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className="absolute w-24 h-24 rounded-full border border-[#00d4ff]/15"
          animate={{
            scale: [1, 2],
            opacity: [0.3, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeOut" as const,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 1 — TITLE
   ═══════════════════════════════════════════════════════════ */
function SlideTitle() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-120px)] text-center z-10">
      <SlideBg src="/images/slide-01-hero.jpg" overlay="rgba(10,10,15,0.55)" />
      <PulseRing />

      {/* Shield icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" as const }}
        className="relative mb-8"
      >
        <svg width="80" height="90" viewBox="0 0 80 90" fill="none" className="drop-shadow-[0_0_20px_rgba(0,212,255,0.25)]">
          <path
            d="M40 5L8 20V45C8 65 22 82 40 87C58 82 72 65 72 45V20L40 5Z"
            stroke="#00d4ff"
            strokeWidth="2"
            fill="rgba(0,212,255,0.05)"
          />
          <path
            d="M40 20L20 30V48C20 60 28 72 40 76C52 72 60 60 60 48V30L40 20Z"
            stroke="#00d4ff"
            strokeWidth="1"
            fill="rgba(0,212,255,0.08)"
            opacity="0.6"
          />
          <circle cx="40" cy="48" r="6" fill="#00d4ff" opacity="0.8" />
        </svg>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" as const }}
        className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-[8px] uppercase text-white mb-4"
        style={{ textShadow: "0 0 40px rgba(0,212,255,0.15)" }}
      >
        APEX SENTINEL
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" as const }}
        className="text-sm sm:text-base font-semibold tracking-[4px] uppercase text-[#7a9ab8] mb-6"
      >
        Distributed Civilian Drone Detection Network
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-[#556a7a] mb-10"
      >
        {["Acoustic", "RF", "RTL-SDR", "TDoA", "EKF", "LSTM"].map((t, i) => (
          <span key={t} className="flex items-center gap-2">
            <span className="text-[#00d4ff]/60">{t}</span>
            {i < 5 && <span className="text-[#00d4ff]/20">·</span>}
          </span>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <Badge color="cyan">Hackathon 2026</Badge>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 2 — THE THREAT
   ═══════════════════════════════════════════════════════════ */
function SlideThreat() {
  const stats = [
    { value: 400, prefix: "$", suffix: "", label: "FPV Combat Drone Cost", duration: 1200 },
    { value: 500000, prefix: "", suffix: "+", label: "Drone Attacks Since 2022", duration: 2500 },
    { value: 2, prefix: "$", suffix: "M", label: "Per Counter-Drone System", duration: 800 },
    { value: 3, prefix: "<", suffix: " sec", label: "Warning Time at 150km/h", duration: 600 },
  ];

  return (
    <div className="relative min-h-[calc(100vh-120px)] flex flex-col justify-center z-10">
      <SlideBg src="/images/slide-02-threat.jpg" overlay="rgba(10,10,15,0.6)" />

      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-2">
        <Badge color="threat">Critical Intelligence</Badge>
      </motion.div>

      <motion.h2
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-10"
      >
        The Threat
      </motion.h2>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={staggerItem}>
            <GlassCard className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#ff4444] mb-2 whitespace-nowrap">
                <CountUp target={s.value} duration={s.duration} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div className="text-xs font-mono text-[#7a9ab8] uppercase tracking-wider">
                {s.label}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
        <GlassCard className="border-[#ff4444]/20 max-w-3xl">
          <div className="flex items-start gap-3">
            <span className="text-[#ff4444] text-2xl mt-1 shrink-0">&ldquo;</span>
            <p className="text-lg sm:text-xl text-[#e8f4ff] font-medium leading-relaxed">
              FPV drones cost <span className="text-[#ff4444] font-bold">$400</span>. The systems to
              stop them cost{" "}
              <span className="text-[#ff4444] font-bold">$2,000,000</span>.{" "}
              <span className="text-[#7a9ab8]">
                This asymmetry is the defining challenge of modern defense.
              </span>
            </p>
            <span className="text-[#ff4444] text-2xl mt-1 shrink-0">&rdquo;</span>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 3 — THE GAP
   ═══════════════════════════════════════════════════════════ */
function SlideGap() {
  const columns = [
    {
      title: "Military C-UAS",
      highlighted: false,
      icon: "✗",
      iconColor: "text-[#ff4444]",
      items: [
        { label: "Cost", value: "$500K – $2M" },
        { label: "Deployment", value: "Fixed positions" },
        { label: "Operation", value: "Trained operators" },
        { label: "Coverage", value: "Point defense" },
      ],
    },
    {
      title: "Consumer Detection",
      highlighted: false,
      icon: "✗",
      iconColor: "text-[#ff4444]",
      items: [
        { label: "Sensors", value: "Single sensor" },
        { label: "Range", value: "Line of sight" },
        { label: "Tracking", value: "No tracking" },
        { label: "Network", value: "Standalone" },
      ],
    },
    {
      title: "APEX SENTINEL",
      highlighted: true,
      icon: "✓",
      iconColor: "text-[#00e676]",
      items: [
        { label: "Cost", value: "$0 per node" },
        { label: "Sensors", value: "500M+ smartphones" },
        { label: "Operation", value: "Autonomous mesh" },
        { label: "Coverage", value: "NATO Eastern Flank" },
      ],
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-120px)] flex flex-col justify-center z-10">
      <SlideBg src="/images/slide-03-gap.jpg" overlay="rgba(10,10,15,0.6)" />

      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-2">
        <Badge color="amber">Market Analysis</Badge>
      </motion.div>

      <motion.h2
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-10"
      >
        The Gap
      </motion.h2>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {columns.map((col) => (
          <motion.div key={col.title} variants={staggerItem}>
            <GlassCard
              className={
                col.highlighted
                  ? "border-[#00d4ff]/40 ring-1 ring-[#00d4ff]/20 relative overflow-hidden"
                  : "border-[rgba(0,212,255,0.08)]"
              }
              breathing={col.highlighted}
            >
              {col.highlighted && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent" />
              )}
              <div className="flex items-center justify-between mb-5">
                <h3
                  className={`text-lg font-bold ${col.highlighted ? "text-[#00d4ff]" : "text-[#7a9ab8]"}`}
                >
                  {col.title}
                </h3>
                <span className={`text-2xl font-bold ${col.iconColor}`}>{col.icon}</span>
              </div>
              <div className="space-y-4">
                {col.items.map((item) => (
                  <div key={item.label} className="flex justify-between items-baseline">
                    <span className="text-xs font-mono text-[#556a7a] uppercase tracking-wider">
                      {item.label}
                    </span>
                    <span
                      className={`text-sm font-semibold ${col.highlighted ? "text-white" : "text-[#7a9ab8]"}`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 4 — THE SOLUTION
   ═══════════════════════════════════════════════════════════ */
function SlideSolution() {
  const features = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="12" stroke="#00d4ff" strokeWidth="1.5" fill="none" />
          <path d="M16 8V16L22 20" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="16" cy="16" r="3" fill="#00d4ff" opacity="0.3" />
        </svg>
      ),
      title: "ACOUSTIC DETECTION",
      desc: "MEMS mic, 94dB SNR range, YAMNet ML classification in 156ms",
      color: "#00d4ff",
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M4 16H8L12 6L16 26L20 10L24 16H28" stroke="#ffaa00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "RF SCANNING",
      desc: "WiFi energy at 2.4/5.8GHz, passive detection, no extra hardware",
      color: "#ffaa00",
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="8" cy="16" r="3" stroke="#00e676" strokeWidth="1.5" fill="none" />
          <circle cx="24" cy="8" r="3" stroke="#00e676" strokeWidth="1.5" fill="none" />
          <circle cx="24" cy="24" r="3" stroke="#00e676" strokeWidth="1.5" fill="none" />
          <line x1="11" y1="15" x2="21" y2="9" stroke="#00e676" strokeWidth="1" opacity="0.5" />
          <line x1="11" y1="17" x2="21" y2="23" stroke="#00e676" strokeWidth="1" opacity="0.5" />
          <line x1="24" y1="11" x2="24" y2="21" stroke="#00e676" strokeWidth="1" opacity="0.5" />
        </svg>
      ),
      title: "MESH NETWORK",
      desc: "4G + LoRa, <50ms latency, redundant paths, self-healing topology",
      color: "#00e676",
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 4L4 12V24L16 28L28 24V12L16 4Z" stroke="#ff4444" strokeWidth="1.5" fill="none" />
          <path d="M16 12L10 16V22L16 24L22 22V16L16 12Z" stroke="#ff4444" strokeWidth="1" fill="rgba(255,68,68,0.1)" />
          <circle cx="16" cy="18" r="2" fill="#ff4444" />
        </svg>
      ),
      title: "COMMANDER ALERT",
      desc: "Red track on ATAK in <500ms from first detection event",
      color: "#ff4444",
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-120px)] flex flex-col justify-center z-10">
      <SlideBg src="/images/slide-04-solution.jpg" overlay="rgba(10,10,15,0.6)" />

      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-2">
        <Badge color="safe">Core Capability</Badge>
      </motion.div>

      <motion.h2
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-3"
      >
        The Solution
      </motion.h2>

      <motion.p
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-lg text-[#7a9ab8] mb-10 max-w-2xl"
      >
        Turn every smartphone into a defense sensor. 500M+ devices across the NATO
        Eastern Flank, operating as a distributed detection mesh.
      </motion.p>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
      >
        {features.map((f) => (
          <motion.div key={f.title} variants={staggerItem}>
            <GlassCard breathing className="h-full">
              <div className="flex items-start gap-4">
                <div
                  className="shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ background: `${f.color}10`, border: `1px solid ${f.color}25` }}
                >
                  {f.icon}
                </div>
                <div>
                  <h3
                    className="text-sm font-bold font-mono tracking-wider mb-1"
                    style={{ color: f.color }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-sm text-[#7a9ab8] leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 5 — RF SPECTRUM ANALYSIS
   ═══════════════════════════════════════════════════════════ */
function SlideRF() {
  const steps = [
    { label: "RF Capture", sub: "RTL-SDR receiver", color: "#00d4ff" },
    { label: "FHSS Detection", sub: "Hop pattern analysis", color: "#ffaa00" },
    { label: "Pattern Analysis", sub: "Spectral fingerprint", color: "#00e676" },
    { label: "Threat Classification", sub: "ML inference", color: "#ff4444" },
  ];

  const bottomStats = [
    { value: "2.4GHz + 5.8GHz", label: "Frequency Bands" },
    { value: "FHSS Detection", label: "Pattern Analysis" },
    { value: "Real-time", label: "Waterfall Display" },
  ];

  return (
    <div className="relative min-h-[calc(100vh-120px)] flex flex-col justify-center z-10">
      <SlideBg src="/images/slide-05-rf.jpg" overlay="rgba(10,10,15,0.87)" />

      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-2">
        <Badge color="amber">RF Intelligence</Badge>
      </motion.div>

      <motion.h2
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-3"
      >
        RF Spectrum Analysis
      </motion.h2>

      <motion.p
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-lg text-[#7a9ab8] mb-10 max-w-2xl"
      >
        See what others can&apos;t. Passive RF monitoring detects drone control signals
        before visual or acoustic contact.
      </motion.p>

      {/* Pipeline visualization */}
      <motion.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mb-10"
      >
        <GlassCard className="overflow-hidden">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-0">
            {steps.map((step, i) => (
              <div key={step.label} className="flex flex-1 items-center">
                <div className="flex-1 text-center px-3">
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-lg font-bold font-mono"
                    style={{
                      background: `${step.color}15`,
                      border: `2px solid ${step.color}50`,
                      color: step.color,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div className="text-sm font-bold text-white mb-1">{step.label}</div>
                  <div className="text-xs text-[#556a7a] font-mono">{step.sub}</div>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden sm:block relative w-12 h-[2px]">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00d4ff]/30 to-transparent" />
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#00d4ff]"
                      animate={{ x: [0, 48, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeInOut" as const,
                      }}
                      style={{ filter: "blur(0.5px)", boxShadow: "0 0 8px #00d4ff" }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Bottom stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-3 gap-4"
      >
        {bottomStats.map((s) => (
          <motion.div key={s.label} variants={staggerItem}>
            <GlassCard className="text-center py-4">
              <div className="text-sm sm:text-base font-bold text-[#00d4ff] font-mono mb-1">
                {s.value}
              </div>
              <div className="text-xs text-[#556a7a] uppercase tracking-wider">{s.label}</div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 6 — ELRS FINGERPRINTING
   ═══════════════════════════════════════════════════════════ */
function SlideELRS() {
  const capabilities = [
    {
      title: "Protocol Fingerprinting",
      desc: "Unique per-transmitter ID extraction from signal characteristics",
      color: "#00d4ff",
    },
    {
      title: "Multi-Protocol Classification",
      desc: "ELRS, Crossfire, DJI OcuSync, analog — all identified",
      color: "#ffaa00",
    },
    {
      title: "Bearing Estimation",
      desc: "RF-based direction finding with multi-antenna arrays",
      color: "#00e676",
    },
    {
      title: "Privacy Filtering",
      desc: "GDPR-compliant data handling — no personal data retained",
      color: "#7a9ab8",
    },
  ];

  const stats = [
    { value: "8", label: "RF Modules" },
    { value: "99", label: "Tests" },
    { value: "4", label: "Protocol Families" },
  ];

  return (
    <div className="relative min-h-[calc(100vh-120px)] flex flex-col justify-center z-10">
      <SlideBg src="/images/slide-06-elrs.jpg" overlay="rgba(10,10,15,0.87)" />

      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-2">
        <Badge color="cyan">Signal Intelligence</Badge>
      </motion.div>

      <motion.h2
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-3"
      >
        ELRS Fingerprinting
      </motion.h2>

      <motion.p
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-lg text-[#7a9ab8] mb-10 max-w-2xl"
      >
        Identify every drone by its digital DNA. Each transmitter leaves a unique electromagnetic
        signature we can classify in real time.
      </motion.p>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
      >
        {capabilities.map((cap) => (
          <motion.div key={cap.title} variants={staggerItem}>
            <GlassCard className="h-full">
              <div className="flex items-start gap-3">
                <div
                  className="w-2 h-2 rounded-full mt-2 shrink-0"
                  style={{ background: cap.color, boxShadow: `0 0 8px ${cap.color}60` }}
                />
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{cap.title}</h3>
                  <p className="text-xs text-[#7a9ab8] leading-relaxed">{cap.desc}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats row */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-3 gap-4"
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={staggerItem}>
            <GlassCard className="text-center py-4">
              <div className="text-3xl font-black text-[#00d4ff] font-mono mb-1">
                <CountUp target={parseInt(s.value)} duration={1500} />
              </div>
              <div className="text-xs text-[#556a7a] uppercase tracking-wider font-mono">
                {s.label}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 7 — ARCHITECTURE
   ═══════════════════════════════════════════════════════════ */
function SlideArchitecture() {
  const tiers = [
    {
      tier: "TIER 1",
      title: "RTL-SDR + Phone",
      detail: "GPS-PPS ±1μs → ±12m accuracy",
      color: "#00d4ff",
      desc: "Highest precision. RTL-SDR dongle paired with smartphone provides GPS-PPS time sync for sub-microsecond TDoA resolution.",
    },
    {
      tier: "TIER 2",
      title: "Smartphone Only",
      detail: "NTP ±50ms → ±62m accuracy",
      color: "#ffaa00",
      desc: "Zero hardware cost. Uses phone MEMS mic and WiFi energy detection. NTP time sync limits TDoA precision but enables massive scale.",
    },
    {
      tier: "TIER 3",
      title: "LoRa Mesh Relay",
      detail: "Relay only, no triangulation",
      color: "#00e676",
      desc: "Extends coverage to areas without cellular. Forwards detections via LoRa mesh to nearest connected node.",
    },
  ];

  const pipeline = ["TDoA", "EKF", "LSTM", "CoT"];

  return (
    <div className="relative min-h-[calc(100vh-120px)] flex flex-col justify-center z-10">
      <SlideBg src="/images/slide-07-arch.jpg" overlay="rgba(10,10,15,0.87)" />

      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-2">
        <Badge>System Architecture</Badge>
      </motion.div>

      <motion.h2
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-10"
      >
        Architecture
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
        {/* Left — tiers */}
        <div className="lg:col-span-2 space-y-4">
          {tiers.map((t, i) => (
            <motion.div key={t.tier} custom={i + 2} variants={scaleIn} initial="hidden" animate="visible">
              <GlassCard className="relative overflow-hidden">
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                  style={{ background: t.color }}
                />
                <div className="pl-4">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span
                      className="text-xs font-mono font-bold tracking-wider"
                      style={{ color: t.color }}
                    >
                      {t.tier}
                    </span>
                    <span className="text-base font-bold text-white">{t.title}</span>
                    <span className="text-xs font-mono text-[#556a7a] ml-auto hidden sm:inline">
                      {t.detail}
                    </span>
                  </div>
                  <p className="text-xs text-[#7a9ab8] leading-relaxed">{t.desc}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}

          {/* Connecting lines between tiers */}
          <div className="hidden lg:flex items-center justify-center gap-2 -mt-2">
            {[0, 1].map((i) => (
              <motion.div
                key={i}
                className="w-[2px] h-4 bg-gradient-to-b from-[#00d4ff]/30 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.2 }}
              />
            ))}
          </div>
        </div>

        {/* Right — pipeline */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
          <GlassCard className="h-full flex flex-col justify-center">
            <div className="text-xs font-mono text-[#556a7a] uppercase tracking-wider mb-4 text-center">
              Processing Pipeline
            </div>
            <div className="flex flex-col items-center gap-3">
              {pipeline.map((step, i) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className="w-full max-w-[140px] text-center py-2.5 px-4 rounded-lg border font-mono text-sm font-bold"
                    style={{
                      background: "rgba(0,212,255,0.05)",
                      borderColor: "rgba(0,212,255,0.2)",
                      color: "#00d4ff",
                    }}
                  >
                    {step}
                  </div>
                  {i < pipeline.length - 1 && (
                    <div className="relative h-6 w-[2px]">
                      <div className="absolute inset-0 bg-gradient-to-b from-[#00d4ff]/40 to-[#00d4ff]/10" />
                      <motion.div
                        className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00d4ff]"
                        animate={{ y: [0, 20, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.3,
                          ease: "easeInOut" as const,
                        }}
                        style={{ boxShadow: "0 0 6px #00d4ff" }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-[10px] font-mono text-[#556a7a] text-center mt-4 uppercase tracking-widest">
              Detection → Track → Predict → Alert
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 8 — BATTLE TESTED
   ═══════════════════════════════════════════════════════════ */
function SlideTests() {
  const stats = [
    { value: 21, label: "Waves Complete" },
    { value: 95, suffix: "%+", label: "Coverage" },
    { value: 0, label: "Failing" },
    { value: 19, suffix: "/19", label: "Mind-the-Gap" },
  ];

  return (
    <div className="relative min-h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center z-10">
      <SlideBg src="/images/slide-08-tests.jpg" overlay="rgba(10,10,15,0.6)" />

      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-6">
        <Badge color="safe">Quality Assurance</Badge>
      </motion.div>

      {/* Massive counter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" as const }}
        className="text-8xl sm:text-[120px] lg:text-[160px] font-black text-white leading-none mb-2"
        style={{ textShadow: "0 0 80px rgba(0,230,118,0.3)" }}
      >
        <CountUp target={3301} duration={2500} />
      </motion.div>

      <motion.p
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-xl sm:text-2xl text-[#00e676] font-bold font-mono tracking-wider mb-10"
      >
        Tests. All Green.
      </motion.p>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl mb-8"
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={staggerItem}>
            <GlassCard className="text-center py-4">
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                <CountUp target={s.value} duration={1800} suffix={s.suffix || ""} />
              </div>
              <div className="text-xs text-[#556a7a] uppercase tracking-wider font-mono mt-1">
                {s.label}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Progress bar */}
      <motion.div
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="w-full max-w-xl"
      >
        <div className="h-3 bg-[rgba(0,230,118,0.1)] rounded-full overflow-hidden border border-[rgba(0,230,118,0.15)]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#00e676] to-[#00d4ff]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, delay: 0.5, ease: "easeOut" as const }}
            style={{ boxShadow: "0 0 20px rgba(0,230,118,0.4)" }}
          />
        </div>
        <div className="flex justify-between text-xs font-mono text-[#556a7a] mt-2">
          <span>W1</span>
          <span className="text-[#00e676]">100% COMPLETE</span>
          <span>W21</span>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 9 — THE JOURNEY (W1→W21)
   ═══════════════════════════════════════════════════════════ */
function SlideJourney() {
  const milestones = [
    {
      range: "W1–W4",
      title: "Foundation",
      items: ["Acoustic detection", "RF scanning", "Mesh network", "EKF tracking"],
      color: "#00d4ff",
    },
    {
      range: "W5–W8",
      title: "Intelligence",
      items: ["ML classification", "Sensor fusion", "Safety protocols", "Coverage optimization"],
      color: "#ffaa00",
    },
    {
      range: "W9–W12",
      title: "RF Deep",
      items: ["Spectrum analysis", "ELRS fingerprinting", "Bearing estimation", "Privacy filters"],
      color: "#00e676",
    },
    {
      range: "W13–W16",
      title: "Hardening",
      items: ["Resilience testing", "Security audit", "Deployment pipeline", "Load testing"],
      color: "#ff4444",
    },
    {
      range: "W17–W21",
      title: "Production",
      items: ["Hackathon prep", "EU compliance", "Threat library", "API gateway"],
      color: "#00d4ff",
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-120px)] flex flex-col justify-center z-10">
      <SlideBg src="/images/slide-09-timeline.jpg" overlay="rgba(10,10,15,0.87)" />

      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-2">
        <Badge>Development Timeline</Badge>
      </motion.div>

      <motion.h2
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-10"
      >
        The Journey
      </motion.h2>

      {/* Timeline — horizontal on desktop, vertical on mobile */}
      <div className="relative">
        {/* Horizontal line (desktop) */}
        <div className="hidden lg:block absolute top-[28px] left-0 right-0 h-[2px] bg-gradient-to-r from-[#00d4ff]/20 via-[#ffaa00]/20 to-[#00d4ff]/20" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {milestones.map((m) => (
            <motion.div key={m.range} variants={staggerItem} className="relative">
              {/* Dot on timeline */}
              <div className="hidden lg:flex justify-center mb-4">
                <div
                  className="w-4 h-4 rounded-full border-2 relative z-10"
                  style={{
                    borderColor: m.color,
                    background: `${m.color}30`,
                    boxShadow: `0 0 12px ${m.color}40`,
                  }}
                />
              </div>

              <GlassCard className="h-full">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-xs font-mono font-bold" style={{ color: m.color }}>
                    {m.range}
                  </span>
                  <span className="text-sm font-bold text-white">{m.title}</span>
                </div>
                <ul className="space-y-1.5 mb-4">
                  {m.items.map((item) => (
                    <li key={item} className="text-xs text-[#7a9ab8] flex items-start gap-2">
                      <span style={{ color: m.color }} className="mt-0.5">
                        ▸
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                {/* Progress bar */}
                <div className="h-1.5 bg-[rgba(0,212,255,0.08)] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: m.color }}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" as const }}
                  />
                </div>
                <div
                  className="text-[10px] font-mono text-right mt-1"
                  style={{ color: m.color }}
                >
                  100%
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 10 — JOIN THE NETWORK (CTA)
   ═══════════════════════════════════════════════════════════ */
function SlideCTA() {
  const actions = [
    {
      label: "GitHub",
      desc: "github.com/fratilanico/apex-sentinel",
      cta: "Star ★",
      href: "https://github.com/fratilanico/apex-sentinel",
      color: "#00d4ff",
    },
    {
      label: "Live Demo",
      desc: "apex-sentinel-demo.vercel.app",
      cta: "Try It →",
      href: "https://apex-sentinel-demo.vercel.app",
      color: "#00e676",
    },
    {
      label: "Contact",
      desc: "nico@apexos.dev",
      cta: "Reach Out →",
      href: "mailto:nico@apexos.dev",
      color: "#ffaa00",
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center z-10">
      <SlideBg src="/images/slide-10-cta.jpg" overlay="rgba(10,10,15,0.78)" />

      {/* Breathing shield */}
      <motion.div
        className="mb-8"
        animate={{
          filter: [
            "drop-shadow(0 0 20px rgba(0,212,255,0.2))",
            "drop-shadow(0 0 40px rgba(0,212,255,0.5))",
            "drop-shadow(0 0 20px rgba(0,212,255,0.2))",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}
      >
        <svg width="64" height="72" viewBox="0 0 80 90" fill="none">
          <path
            d="M40 5L8 20V45C8 65 22 82 40 87C58 82 72 65 72 45V20L40 5Z"
            stroke="#00d4ff"
            strokeWidth="2"
            fill="rgba(0,212,255,0.08)"
          />
          <path
            d="M40 20L20 30V48C20 60 28 72 40 76C52 72 60 60 60 48V30L40 20Z"
            stroke="#00d4ff"
            strokeWidth="1"
            fill="rgba(0,212,255,0.05)"
          />
          <circle cx="40" cy="48" r="6" fill="#00d4ff" opacity="0.8" />
          <circle cx="40" cy="48" r="3" fill="#fff" opacity="0.9" />
        </svg>
      </motion.div>

      <motion.h2
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-3"
      >
        The Network Is Live
      </motion.h2>

      <motion.p
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-lg text-[#7a9ab8] mb-10 max-w-xl"
      >
        500M+ potential sensor nodes. Distributed detection. Open source defense.
      </motion.p>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-10"
      >
        {actions.map((a) => (
          <motion.a
            key={a.label}
            href={a.href}
            target="_blank"
            rel="noopener noreferrer"
            variants={staggerItem}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="block"
          >
            <GlassCard className="text-center cursor-pointer hover:border-[rgba(0,212,255,0.3)] transition-colors h-full">
              <div className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: a.color }}>
                {a.label}
              </div>
              <div className="text-sm text-[#7a9ab8] mb-4 font-mono">{a.desc}</div>
              <div
                className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-bold transition-all"
                style={{
                  borderColor: `${a.color}40`,
                  color: a.color,
                  background: `${a.color}08`,
                }}
              >
                {a.cta}
              </div>
            </GlassCard>
          </motion.a>
        ))}
      </motion.div>

      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex items-center gap-2 text-xs font-mono text-[#556a7a]">
          <svg width="14" height="14" viewBox="0 0 80 90" fill="none">
            <path
              d="M40 5L8 20V45C8 65 22 82 40 87C58 82 72 65 72 45V20L40 5Z"
              stroke="#556a7a"
              strokeWidth="4"
              fill="none"
            />
          </svg>
          Built with APEX OS
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PRESENTATION CONTROLLER
   ═══════════════════════════════════════════════════════════ */
export default function Presentation() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);

  const go = useCallback(
    (to: number) => {
      if (to < 0 || to >= SLIDES.length) return;
      setDir(to > idx ? 1 : -1);
      setIdx(to);
    },
    [idx],
  );

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        go(idx + 1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(idx - 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [idx, go]);

  const slide = SLIDES[idx].id as SlideId;

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-hidden">
      {/* ── Top nav bar ── */}
      <nav className="shrink-0 z-20 flex items-center justify-between px-4 py-2 border-b border-[rgba(0,212,255,0.08)] bg-[rgba(10,10,15,0.95)] backdrop-blur-lg">
        <div className="flex items-center gap-2">
          <svg width="18" height="20" viewBox="0 0 80 90" fill="none" className="opacity-60">
            <path
              d="M40 5L8 20V45C8 65 22 82 40 87C58 82 72 65 72 45V20L40 5Z"
              stroke="#00d4ff"
              strokeWidth="4"
              fill="none"
            />
          </svg>
          <span className="text-xs font-mono font-bold text-[#00d4ff] tracking-wider hidden sm:inline">
            APEX SENTINEL
          </span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => go(i)}
              className={`px-2 py-1 text-[10px] font-mono tracking-wider rounded transition-all whitespace-nowrap ${
                i === idx
                  ? "bg-[rgba(0,212,255,0.15)] text-[#00d4ff] font-bold"
                  : "text-[#556a7a] hover:text-[#7a9ab8] hover:bg-[rgba(0,212,255,0.05)]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="text-[10px] font-mono text-[#556a7a] tabular-nums">
          {idx + 1} / {SLIDES.length}
        </div>
      </nav>

      {/* ── Slide content area ── */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={slide}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 flex items-start justify-center p-6 pt-6 overflow-y-auto"
          >
            <div className="max-w-5xl w-full">
              {slide === "title" && <SlideTitle />}
              {slide === "threat" && <SlideThreat />}
              {slide === "gap" && <SlideGap />}
              {slide === "solution" && <SlideSolution />}
              {slide === "rf" && <SlideRF />}
              {slide === "elrs" && <SlideELRS />}
              {slide === "architecture" && <SlideArchitecture />}
              {slide === "tests" && <SlideTests />}
              {slide === "journey" && <SlideJourney />}
              {slide === "cta" && <SlideCTA />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom nav bar ── */}
      <nav className="shrink-0 z-20 flex items-center gap-4 px-4 py-2.5 border-t border-[rgba(0,212,255,0.08)] bg-[rgba(10,10,15,0.95)] backdrop-blur-lg">
        {/* Back button */}
        <button
          onClick={() => go(idx - 1)}
          disabled={idx === 0}
          className="text-xs font-mono text-[#556a7a] hover:text-[#00d4ff] disabled:opacity-20 disabled:cursor-not-allowed transition-colors px-2 py-1"
        >
          ← Back
        </button>

        {/* Progress bar + dots */}
        <div className="flex-1 flex flex-col items-center gap-1.5">
          {/* Progress bar */}
          <div className="w-full max-w-md h-1 bg-[rgba(0,212,255,0.08)] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#00d4ff] to-[#00d4ff]/60"
              animate={{ width: `${((idx + 1) / SLIDES.length) * 100}%` }}
              transition={{ duration: 0.3, ease: "easeOut" as const }}
            />
          </div>

          {/* Nav dots */}
          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === idx
                    ? "bg-[#00d4ff] w-4"
                    : i < idx
                      ? "bg-[#00d4ff]/30"
                      : "bg-[#556a7a]/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={() => go(idx + 1)}
          disabled={idx === SLIDES.length - 1}
          className="text-xs font-mono text-[#556a7a] hover:text-[#00d4ff] disabled:opacity-20 disabled:cursor-not-allowed transition-colors px-2 py-1"
        >
          Next →
        </button>
      </nav>
    </div>
  );
}
