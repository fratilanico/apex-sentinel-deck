"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CountUp } from "@/components/CountUp";

/* ═══════════════════════════════════════════════════════════
   SLIDE REGISTRY
   ═══════════════════════════════════════════════════════════ */
const SLIDES = [
  { id: "title", label: "SENTINEL" },
  { id: "problem", label: "Problem" },
  { id: "insight", label: "Insight" },
  { id: "pipeline", label: "Pipeline" },
  { id: "rf", label: "RF" },
  { id: "elrs", label: "ELRS" },
  { id: "4d", label: "4D Node" },
  { id: "depth", label: "Depth" },
  { id: "oss", label: "Open Source" },
  { id: "roadmap", label: "Roadmap" },
] as const;

type SlideId = (typeof SLIDES)[number]["id"];

/* ═══════════════════════════════════════════════════════════
   ANIMATION VARIANTS — stable refs, outside components
   ═══════════════════════════════════════════════════════════ */
const slideVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

const fade = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.04, duration: 0.3, ease: "easeOut" as const },
  }),
};

/* ═══════════════════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════════════════ */
function SlideBg({
  src,
  overlay = "rgba(10,10,15,0.55)",
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
      <div className="absolute inset-0" style={{ background: overlay }} />
    </div>
  );
}

function Card({
  children,
  className = "",
  borderColor = "rgba(255,255,255,0.08)",
}: {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
}) {
  return (
    <div
      className={`bg-[rgba(10,12,18,0.65)] backdrop-blur-sm rounded-lg p-5 ${className}`}
      style={{ border: `1px solid ${borderColor}` }}
    >
      {children}
    </div>
  );
}

function Mono({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span className={`font-mono text-xs tracking-wide ${className}`} style={style}>
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 1 — APEX SENTINEL
   ═══════════════════════════════════════════════════════════ */
function SlideTitle() {
  return (
    <div className="relative min-h-screen flex items-end z-10">
      <SlideBg src="/images/slide-01-hero.jpg" overlay="rgba(10,10,15,0.55)" />
      <div className="relative z-10 pb-24 pl-2">
        <motion.h1
          custom={0}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-[6px] uppercase text-white leading-none"
        >
          APEX SENTINEL
        </motion.h1>

        <motion.div
          custom={1}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="mt-5 mb-5"
        >
          <div className="w-[120px] h-[2px] bg-[#00d4ff]" />
        </motion.div>

        <motion.p
          custom={2}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="text-sm tracking-[2px] uppercase text-[#7a9ab8] mb-10"
        >
          Distributed Civilian Counter-UAS Sensor Network
        </motion.p>

        <motion.div
          custom={3}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-3 text-xs font-mono text-[#556a7a]"
        >
          {["Acoustic", "RF", "RTL-SDR", "TDoA", "EKF", "LSTM"].map((t, i) => (
            <span key={t} className="flex items-center gap-3">
              <span>{t}</span>
              {i < 5 && <span className="text-[#00d4ff]/30">·</span>}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 2 — THE COST ASYMMETRY
   ═══════════════════════════════════════════════════════════ */
function SlideProblem() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center z-10">
      <SlideBg src="/images/slide-02-threat.jpg" overlay="rgba(10,10,15,0.6)" />
      <div className="relative z-10">
        <motion.h2
          custom={0}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-12"
        >
          The Cost Asymmetry
        </motion.h2>

        <motion.div
          custom={1}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mb-12"
        >
          {/* Attacker card */}
          <Card borderColor="rgba(255,68,68,0.25)">
            <div className="text-4xl sm:text-5xl font-extrabold text-[#ff4444] font-mono mb-3">
              $<CountUp target={400} duration={1000} />
            </div>
            <div className="text-sm font-semibold text-white mb-1">FPV Combat Drone</div>
            <Mono className="text-[#7a9ab8]">Mass-produced, GPS-guided, 150km/h</Mono>
          </Card>

          {/* Defender card */}
          <Card borderColor="rgba(255,170,0,0.25)">
            <div className="text-4xl sm:text-5xl font-extrabold text-[#ffaa00] font-mono mb-3">
              $<CountUp target={2} duration={800} suffix=",000,000" />
            </div>
            <div className="text-sm font-semibold text-white mb-1">Counter-UAS System</div>
            <Mono className="text-[#7a9ab8]">Fixed position, trained operators, single-point coverage</Mono>
          </Card>
        </motion.div>

        <motion.p
          custom={2}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="text-base italic text-[#7a9ab8] max-w-2xl leading-relaxed"
        >
          &ldquo;500,000+ drone attacks since 2022. The defenders are outspent 5,000:1.&rdquo;
        </motion.p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 3 — THE INSIGHT
   ═══════════════════════════════════════════════════════════ */
function SlideInsight() {
  const caps = [
    { label: "MEMS Mic", spec: "94dB SNR", color: "#00d4ff" },
    { label: "WiFi Radio", spec: "2.4GHz passive", color: "#00d4ff" },
    { label: "GPS", spec: "±3m accuracy", color: "#00d4ff" },
    { label: "NPU", spec: "YAMNet 156ms", color: "#ffaa00" },
    { label: "4G Uplink", spec: "<50ms latency", color: "#ffaa00" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-center z-10">
      <SlideBg src="/images/slide-03-gap.jpg" overlay="rgba(10,10,15,0.6)" />
      <div className="relative z-10">
        <motion.h2
          custom={0}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4"
        >
          500 Million Sensors Already Deployed
        </motion.h2>

        <motion.p
          custom={1}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="text-base text-[#7a9ab8] mb-10 max-w-2xl"
        >
          Every smartphone has the hardware for drone detection. MEMS microphones,
          WiFi radios, GPS receivers, neural processing — all in your pocket.
        </motion.p>

        <motion.div
          custom={2}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-3 mb-12"
        >
          {caps.map((c) => (
            <div
              key={c.label}
              className="flex items-center gap-3 px-4 py-2.5 rounded bg-[rgba(10,12,18,0.7)] backdrop-blur-sm"
              style={{ border: `1px solid ${c.color}20` }}
            >
              <span className="text-sm font-semibold text-white">{c.label}</span>
              <span className="font-mono text-xs" style={{ color: c.color }}>
                {c.spec}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.p
          custom={3}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="text-sm text-[#556a7a] max-w-2xl"
        >
          APEX Sentinel turns existing hardware into a distributed defense grid.
          No new infrastructure. No procurement cycles. Deploy tomorrow.
        </motion.p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 4 — DETECTION PIPELINE
   ═══════════════════════════════════════════════════════════ */
function SlidePipeline() {
  const steps = [
    { label: "DETECT", sub: "Sensor capture", color: "#00d4ff" },
    { label: "CLASSIFY", sub: "ML inference", color: "#ffaa00" },
    { label: "TRACK", sub: "Sensor fusion", color: "#ffffff" },
    { label: "ALERT", sub: "CoT to ATAK", color: "#00e676" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-center z-10">
      <SlideBg src="/images/slide-04-solution.jpg" overlay="rgba(10,10,15,0.6)" />
      <div className="relative z-10">
        <motion.h2
          custom={0}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-12"
        >
          Detection Pipeline
        </motion.h2>

        {/* SVG Pipeline Diagram */}
        <motion.div
          custom={1}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <svg
            viewBox="0 0 800 120"
            className="w-full max-w-4xl"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {steps.map((step, i) => {
              const x = i * 200 + 10;
              return (
                <g key={step.label}>
                  {/* Box */}
                  <rect
                    x={x}
                    y={20}
                    width={140}
                    height={52}
                    rx={4}
                    stroke={step.color}
                    strokeWidth={1}
                    fill="rgba(10,12,18,0.6)"
                  />
                  {/* Label */}
                  <text
                    x={x + 70}
                    y={48}
                    textAnchor="middle"
                    fill={step.color}
                    fontFamily="monospace"
                    fontSize={14}
                    fontWeight={700}
                  >
                    {step.label}
                  </text>
                  {/* Sub label */}
                  <text
                    x={x + 70}
                    y={100}
                    textAnchor="middle"
                    fill="#556a7a"
                    fontFamily="monospace"
                    fontSize={11}
                  >
                    {step.sub}
                  </text>
                  {/* Arrow connector */}
                  {i < steps.length - 1 && (
                    <>
                      <line
                        x1={x + 140}
                        y1={46}
                        x2={x + 200}
                        y2={46}
                        stroke="#556a7a"
                        strokeWidth={1}
                      />
                      <polygon
                        points={`${x + 196},42 ${x + 200},46 ${x + 196},50`}
                        fill="#556a7a"
                      />
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </motion.div>

        {/* Stats row */}
        <motion.div
          custom={2}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-4"
        >
          {[
            "<500ms end-to-end",
            "Multi-sensor fusion",
            "ATAK integration",
          ].map((s) => (
            <div
              key={s}
              className="px-4 py-2 rounded bg-[rgba(10,12,18,0.6)] border border-white/[0.06] font-mono text-xs text-[#7a9ab8]"
            >
              {s}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 5 — RF SPECTRUM ANALYSIS
   ═══════════════════════════════════════════════════════════ */
function SlideRF() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center z-10">
      <SlideBg src="/images/slide-05-rf.jpg" overlay="rgba(10,10,15,0.65)" />
      <div className="relative z-10">
        <motion.h2
          custom={0}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4"
        >
          See What Others Can&apos;t
        </motion.h2>

        <motion.div
          custom={1}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8"
        >
          {/* Left: description */}
          <div>
            <p className="text-base text-[#7a9ab8] leading-relaxed mb-6">
              Passive RF monitoring detects drone control signals before visual or
              acoustic contact. FHSS hopping patterns at 2.4GHz and 5.8GHz are captured
              via RTL-SDR, analyzed through waterfall spectral decomposition, and
              classified against a known threat library.
            </p>
            <div className="space-y-3">
              {[
                { label: "Frequency", value: "2.4GHz + 5.8GHz ISM bands" },
                { label: "Method", value: "FHSS hop pattern analysis" },
                { label: "Latency", value: "<200ms signal classification" },
                { label: "Hardware", value: "RTL-SDR v3/v4 ($30 dongle)" },
              ].map((row) => (
                <div key={row.label} className="flex items-baseline gap-3">
                  <Mono className="text-[#556a7a] uppercase w-24 shrink-0">{row.label}</Mono>
                  <span className="text-sm text-white">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: SVG waterfall visualization */}
          <div className="flex items-center justify-center">
            <svg
              viewBox="0 0 360 260"
              className="w-full max-w-[360px]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Y axis */}
              <line x1={50} y1={20} x2={50} y2={220} stroke="#333" strokeWidth={1} />
              {/* X axis */}
              <line x1={50} y1={220} x2={340} y2={220} stroke="#333" strokeWidth={1} />

              {/* Y label */}
              <text x={12} y={125} fill="#556a7a" fontFamily="monospace" fontSize={9} transform="rotate(-90,12,125)">
                Frequency (GHz)
              </text>
              {/* X label */}
              <text x={190} y={248} fill="#556a7a" fontFamily="monospace" fontSize={9} textAnchor="middle">
                Time
              </text>

              {/* Frequency band labels */}
              <text x={44} y={58} fill="#556a7a" fontFamily="monospace" fontSize={9} textAnchor="end">5.8</text>
              <text x={44} y={108} fill="#556a7a" fontFamily="monospace" fontSize={9} textAnchor="end">5.2</text>
              <text x={44} y={158} fill="#556a7a" fontFamily="monospace" fontSize={9} textAnchor="end">2.4</text>
              <text x={44} y={208} fill="#556a7a" fontFamily="monospace" fontSize={9} textAnchor="end">0.9</text>

              {/* Spectral bands - horizontal color bars */}
              {[
                { y: 45, h: 18, opacity: 0.25 },
                { y: 68, h: 14, opacity: 0.15 },
                { y: 95, h: 18, opacity: 0.20 },
                { y: 118, h: 14, opacity: 0.10 },
                { y: 142, h: 22, opacity: 0.30 },
                { y: 168, h: 14, opacity: 0.12 },
                { y: 187, h: 18, opacity: 0.18 },
                { y: 210, h: 6, opacity: 0.08 },
              ].map((band, i) => (
                <rect
                  key={i}
                  x={55}
                  y={band.y}
                  width={280}
                  height={band.h}
                  rx={1}
                  fill="#00d4ff"
                  opacity={band.opacity}
                />
              ))}

              {/* Detected drone signals - amber markers */}
              {[
                { cx: 120, cy: 52 },
                { cx: 195, cy: 150 },
                { cx: 248, cy: 48 },
                { cx: 280, cy: 152 },
              ].map((dot, i) => (
                <g key={i}>
                  <circle cx={dot.cx} cy={dot.cy} r={5} fill="#ffaa00" opacity={0.9} />
                  <circle cx={dot.cx} cy={dot.cy} r={10} stroke="#ffaa00" strokeWidth={1} opacity={0.3} fill="none" />
                </g>
              ))}

              {/* Legend */}
              <circle cx={70} cy={240} r={4} fill="#ffaa00" />
              <text x={80} y={243} fill="#7a9ab8" fontFamily="monospace" fontSize={9}>
                Detected drone signal
              </text>
            </svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 6 — ELRS FINGERPRINTING
   ═══════════════════════════════════════════════════════════ */
function SlideELRS() {
  const capabilities = [
    { code: "PROTOCOL ID", desc: "Identifies ELRS, Crossfire, DJI, analog" },
    { code: "TX FINGERPRINT", desc: "Unique per-transmitter identification" },
    { code: "RF BEARING", desc: "Direction finding from signal analysis" },
    { code: "PRIVACY GUARD", desc: "GDPR-compliant data pipeline" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-center z-10">
      <SlideBg src="/images/slide-06-elrs.jpg" overlay="rgba(10,10,15,0.65)" />
      <div className="relative z-10">
        <motion.h2
          custom={0}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4"
        >
          Digital DNA Extraction
        </motion.h2>

        <motion.p
          custom={1}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="text-base text-[#7a9ab8] mb-10 max-w-2xl"
        >
          Every transmitter leaves a unique electromagnetic signature.
          We classify it in real time.
        </motion.p>

        <motion.div
          custom={2}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left: capabilities */}
          <div className="lg:col-span-2 space-y-4">
            {capabilities.map((cap) => (
              <div key={cap.code} className="flex items-baseline gap-4">
                <code className="font-mono text-sm font-bold text-[#00d4ff] w-40 shrink-0 tracking-wide">
                  {cap.code}
                </code>
                <span className="text-sm text-[#7a9ab8]">&mdash;</span>
                <span className="text-sm text-white/80">{cap.desc}</span>
              </div>
            ))}
          </div>

          {/* Right: stats */}
          <Card borderColor="rgba(255,255,255,0.06)">
            <div className="space-y-5">
              {[
                { value: "8", label: "modules" },
                { value: "99", label: "tests" },
                { value: "4", label: "protocol families" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    {s.value}
                  </div>
                  <Mono className="text-[#556a7a] uppercase">{s.label}</Mono>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 7 — THE 4D NODE MODEL
   ═══════════════════════════════════════════════════════════ */
function Slide4D() {
  const tiers = [
    {
      tier: "TIER 1",
      title: "RTL-SDR + Phone",
      clock: "GPS-PPS ±1μs",
      accuracy: "±12m",
      weight: "1.0",
      color: "#00d4ff",
    },
    {
      tier: "TIER 2",
      title: "Smartphone",
      clock: "NTP ±50ms",
      accuracy: "±62m",
      weight: "0.3",
      color: "#ffaa00",
    },
    {
      tier: "TIER 3",
      title: "LoRa Relay",
      clock: "±500ms",
      accuracy: "Relay only",
      weight: "0.0",
      color: "#556a7a",
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-center z-10">
      <SlideBg src="/images/slide-07-arch.jpg" overlay="rgba(10,10,15,0.65)" />
      <div className="relative z-10">
        <motion.h2
          custom={0}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-3"
        >
          Every Node in 4-Dimensional Space
        </motion.h2>

        <motion.div
          custom={1}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <code className="font-mono text-sm text-[#00d4ff]">
            Node(lat, lon, alt, timePrecisionUs)
          </code>
        </motion.div>

        <motion.div
          custom={2}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10"
        >
          {tiers.map((t) => (
            <Card key={t.tier} borderColor={`${t.color}30`}>
              <Mono className="uppercase tracking-wider mb-3 block" style={{ color: t.color }}>
                {t.tier}
              </Mono>
              <div className="text-lg font-bold text-white mb-4">{t.title}</div>
              <div className="space-y-2">
                {[
                  { label: "Clock", value: t.clock },
                  { label: "Accuracy", value: t.accuracy },
                  { label: "Weight", value: t.weight },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-baseline">
                    <Mono className="text-[#556a7a] uppercase">{row.label}</Mono>
                    <span className="text-sm font-mono text-white/80">{row.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </motion.div>

        <motion.p
          custom={3}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="text-sm text-[#556a7a] max-w-3xl"
        >
          TDoA triangulation weights each node by clock quality.
          The system never lies about what it knows.
        </motion.p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 8 — ENGINEERING DEPTH
   ═══════════════════════════════════════════════════════════ */
function SlideDepth() {
  const metrics = [
    { value: 3301, label: "Tests Passing", suffix: "" },
    { value: 95, label: "Code Coverage", suffix: "%+" },
    { value: 21, label: "Dev Waves", suffix: "" },
    { value: 19, label: "Gap Analysis", suffix: "/19" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-center z-10">
      <SlideBg src="/images/slide-08-tests.jpg" overlay="rgba(10,10,15,0.6)" />
      <div className="relative z-10">
        <motion.h2
          custom={0}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-12"
        >
          21 Waves. 3,301 Tests. Zero Compromises.
        </motion.h2>

        {/* Metric cards */}
        <motion.div
          custom={1}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 max-w-3xl"
        >
          {metrics.map((m) => (
            <Card key={m.label} borderColor="rgba(255,255,255,0.06)">
              <div className="text-3xl font-extrabold text-white font-mono mb-1">
                <CountUp target={m.value} duration={1800} suffix={m.suffix} />
              </div>
              <Mono className="text-[#556a7a] uppercase">{m.label}</Mono>
            </Card>
          ))}
        </motion.div>

        {/* Wave completion dots */}
        <motion.div
          custom={2}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <Mono className="text-[#556a7a] uppercase block mb-3">Wave Completion</Mono>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 21 }, (_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm bg-[#00e676]/80"
                title={`W${i + 1}`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1.5 max-w-[calc(21*18px)]">
            <Mono className="text-[#556a7a]">W1</Mono>
            <Mono className="text-[#556a7a]">W21</Mono>
          </div>
        </motion.div>

        <motion.p
          custom={3}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="text-sm text-[#556a7a] max-w-2xl"
        >
          Mutation testing at 85%+ on critical paths. IEC 61508 safety compliance.
          Full test pyramid: unit, integration, E2E.
        </motion.p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 9 — OPEN SOURCE
   ═══════════════════════════════════════════════════════════ */
function SlideOSS() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center z-10">
      <SlideBg src="/images/slide-09-timeline.jpg" overlay="rgba(10,10,15,0.6)" />
      <div className="relative z-10">
        <motion.h2
          custom={0}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4"
        >
          Built in Public. Battle-Ready.
        </motion.h2>

        <motion.p
          custom={1}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="text-base text-[#7a9ab8] mb-10 max-w-2xl"
        >
          Not a prototype. A production-grade sensor fusion library.
        </motion.p>

        <motion.div
          custom={2}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl"
        >
          {/* GitHub card */}
          <Card borderColor="rgba(255,255,255,0.08)">
            <Mono className="text-[#556a7a] uppercase block mb-4">Repository</Mono>
            <div className="space-y-3">
              <div className="font-mono text-sm text-[#00d4ff]">
                fratilanico/apex-sentinel
              </div>
              {[
                "34+ TypeScript modules",
                "Full test pyramid: unit → integration → E2E",
                "MIT License",
              ].map((line) => (
                <div key={line} className="flex items-start gap-2">
                  <span className="text-[#556a7a] mt-0.5 shrink-0">—</span>
                  <span className="text-sm text-white/80">{line}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Demo card */}
          <Card borderColor="rgba(255,255,255,0.08)">
            <Mono className="text-[#556a7a] uppercase block mb-4">Live Demo</Mono>
            <div className="font-mono text-sm text-[#00e676] mb-4">
              apex-sentinel-demo.vercel.app
            </div>
            <p className="text-sm text-[#7a9ab8] leading-relaxed">
              Real-time dashboard showing acoustic detection, RF analysis,
              and multi-sensor fusion on synthetic threat data.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE 10 — ROADMAP
   ═══════════════════════════════════════════════════════════ */
function SlideRoadmap() {
  const phases = [
    {
      phase: "NOW",
      title: "Open source library + live demo dashboard",
      color: "#00d4ff",
    },
    {
      phase: "NEXT",
      title: "Android sensor app + field testing Romania",
      color: "#ffaa00",
    },
    {
      phase: "FUTURE",
      title: "NATO interop · ATAK plugin · Municipal deployment",
      color: "#00e676",
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-center z-10">
      <SlideBg src="/images/slide-10-cta.jpg" overlay="rgba(10,10,15,0.55)" />
      <div className="relative z-10">
        <motion.h2
          custom={0}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-12"
        >
          Roadmap
        </motion.h2>

        <motion.div
          custom={1}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mb-16"
        >
          {phases.map((p) => (
            <Card key={p.phase} borderColor={`${p.color}25`}>
              <Mono className="uppercase tracking-wider block mb-3" style={{ color: p.color }}>
                {p.phase}
              </Mono>
              <p className="text-sm text-white/80 leading-relaxed">{p.title}</p>
            </Card>
          ))}
        </motion.div>

        <motion.div
          custom={2}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          <div className="font-mono text-sm text-[#7a9ab8]">
            github.com/fratilanico/apex-sentinel
          </div>
          <div className="font-mono text-xs text-[#556a7a]">
            nico@apexos.dev
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PRESENTATION CONTROLLER
   ═══════════════════════════════════════════════════════════ */
export default function Presentation() {
  const [idx, setIdx] = useState(0);

  const go = useCallback(
    (to: number) => {
      if (to < 0 || to >= SLIDES.length) return;
      setIdx(to);
    },
    [],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        setIdx((prev) => Math.min(prev + 1, SLIDES.length - 1));
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setIdx((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const slide = SLIDES[idx].id as SlideId;

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-hidden">
      {/* ── Slide content ── */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0 overflow-y-auto"
          >
            <div className="max-w-5xl mx-auto px-8 sm:px-12">
              {slide === "title" && <SlideTitle />}
              {slide === "problem" && <SlideProblem />}
              {slide === "insight" && <SlideInsight />}
              {slide === "pipeline" && <SlidePipeline />}
              {slide === "rf" && <SlideRF />}
              {slide === "elrs" && <SlideELRS />}
              {slide === "4d" && <Slide4D />}
              {slide === "depth" && <SlideDepth />}
              {slide === "oss" && <SlideOSS />}
              {slide === "roadmap" && <SlideRoadmap />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom bar: progress + dots ── */}
      <div className="shrink-0 z-20">
        {/* 2px progress line */}
        <div className="w-full h-[2px] bg-[rgba(255,255,255,0.04)]">
          <motion.div
            className="h-full bg-[#00d4ff]"
            animate={{ width: `${((idx + 1) / SLIDES.length) * 100}%` }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        </div>

        {/* Nav row */}
        <div className="flex items-center justify-between px-6 py-3 bg-[rgba(10,10,15,0.95)] backdrop-blur-lg">
          <Mono className="text-[#556a7a] tabular-nums w-16">
            {String(idx + 1).padStart(2, "0")} / {SLIDES.length}
          </Mono>

          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all ${
                  i === idx
                    ? "w-6 h-1.5 bg-[#00d4ff]"
                    : i < idx
                      ? "w-1.5 h-1.5 bg-[#00d4ff]/30 hover:bg-[#00d4ff]/50"
                      : "w-1.5 h-1.5 bg-white/10 hover:bg-white/20"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3 w-16 justify-end">
            <button
              onClick={() => go(idx - 1)}
              disabled={idx === 0}
              aria-label="Previous slide"
              className="text-[#556a7a] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => go(idx + 1)}
              disabled={idx === SLIDES.length - 1}
              aria-label="Next slide"
              className="text-[#556a7a] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
