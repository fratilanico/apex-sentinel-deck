"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";


/* ═══════════════════════════════════════════════════════════
   DATA — Sensor nodes, arcs, slides
   ═══════════════════════════════════════════════════════════ */

const SENSOR_NODES = [
  { id: "SN-BUC", city: "BUCHAREST", lat: 44.4326, lng: 26.1038, tier: 1, isHQ: true },
  { id: "SN-TIM", city: "TIMIȘOARA", lat: 45.7489, lng: 21.2087, tier: 1, isHQ: false },
  { id: "SN-CLJ", city: "CLUJ-NAPOCA", lat: 46.7712, lng: 23.6236, tier: 1, isHQ: false },
  { id: "SN-CTA", city: "CONSTANȚA", lat: 44.1765, lng: 28.6348, tier: 1, isHQ: false },
  { id: "SN-IAS", city: "IAȘI", lat: 47.1585, lng: 27.6014, tier: 1, isHQ: false },
  { id: "SN-BRA", city: "BRAȘOV", lat: 45.6553, lng: 25.6108, tier: 2, isHQ: false },
  { id: "SN-SBU", city: "SIBIU", lat: 45.7983, lng: 24.1256, tier: 2, isHQ: false },
  { id: "SN-CRA", city: "CRAIOVA", lat: 44.3302, lng: 23.7949, tier: 2, isHQ: false },
  { id: "SN-SUC", city: "SUCEAVA", lat: 47.6635, lng: 26.2596, tier: 2, isHQ: false },
  { id: "SN-GAL", city: "GALAȚI", lat: 45.4353, lng: 28.008, tier: 2, isHQ: false },
  { id: "SN-TUL", city: "TULCEA", lat: 45.1787, lng: 28.8012, tier: 3, isHQ: false },
  { id: "SN-BOT", city: "BOTOȘANI", lat: 47.7487, lng: 26.6616, tier: 3, isHQ: false },
  { id: "SN-BAC", city: "BACĂU", lat: 46.567, lng: 26.9146, tier: 3, isHQ: false },
  { id: "SN-DEV", city: "DEVA", lat: 45.8833, lng: 22.9, tier: 3, isHQ: false },
  { id: "SN-ALB", city: "ALBA IULIA", lat: 46.0667, lng: 23.5833, tier: 3, isHQ: false },
];

const THREAT_ARCS = [
  { startLat: 48.5, startLng: 35.0, endLat: 47.15, endLng: 27.6, label: "VECTOR NORTH" },
  { startLat: 46.0, startLng: 36.0, endLat: 44.43, endLng: 26.1, label: "VECTOR CENTRAL" },
  { startLat: 44.0, startLng: 33.5, endLat: 44.17, endLng: 28.63, label: "VECTOR BLACK SEA" },
  { startLat: 47.0, startLng: 38.0, endLat: 46.77, endLng: 23.62, label: "VECTOR DEEP" },
];

const HQ = SENSOR_NODES[0];
const DEFENSE_ARCS = [
  // Hub connections from Bucharest
  ...["SN-TIM", "SN-CLJ", "SN-CTA", "SN-IAS", "SN-BRA"].map((id) => {
    const node = SENSOR_NODES.find((n) => n.id === id)!;
    return { startLat: HQ.lat, startLng: HQ.lng, endLat: node.lat, endLng: node.lng };
  }),
  // Regional mesh
  { startLat: 45.7489, startLng: 21.2087, endLat: 45.7983, endLng: 24.1256 },
  { startLat: 46.7712, startLng: 23.6236, endLat: 47.1585, endLng: 27.6014 },
  { startLat: 44.1765, startLng: 28.6348, endLat: 45.4353, endLng: 28.008 },
  { startLat: 47.1585, startLng: 27.6014, endLat: 47.6635, endLng: 26.2596 },
  { startLat: 45.6553, startLng: 25.6108, endLat: 45.7983, endLng: 24.1256 },
];

const SLIDES = [
  { id: "title", label: "INDIGO" },
  { id: "threat", label: "THREAT" },
  { id: "phones", label: "PHONES" },
  { id: "demo", label: "LIVE" },
  { id: "tech", label: "TECH" },
  { id: "stack", label: "STACK" },
  { id: "running", label: "DEMO" },
  { id: "close", label: "NEXT" },
] as const;

type SlideId = (typeof SLIDES)[number]["id"];

/* ═══════════════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════════════ */

const slideVariants = {
  enter: { opacity: 0, y: 8 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const fade = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

/* ═══════════════════════════════════════════════════════════
   UTC CLOCK
   ═══════════════════════════════════════════════════════════ */

function useUTCClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        d.getUTCHours().toString().padStart(2, "0") +
          ":" +
          d.getUTCMinutes().toString().padStart(2, "0") +
          ":" +
          d.getUTCSeconds().toString().padStart(2, "0") +
          " UTC"
      );
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);
  return time;
}

/* ═══════════════════════════════════════════════════════════
   GLOBE BACKGROUND (dynamic import — no SSR)
   ═══════════════════════════════════════════════════════════ */

function GlobeBackground({ onGlobeReady }: { onGlobeReady?: (globe: any) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<ReturnType<typeof Object> | null>(null);

  useEffect(() => {
    if (!containerRef.current || globeRef.current) return;

    let mounted = true;

    (async () => {
      const GlobeGL = (await import("globe.gl")).default;
      const THREE = await import("three");
      const topoClient = await import("topojson-client");

      if (!mounted || !containerRef.current) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const globe = (GlobeGL as any)()(containerRef.current)
        .globeImageUrl("")
        .backgroundImageUrl("")
        .showAtmosphere(true)
        .atmosphereColor("#00d4ff")
        .atmosphereAltitude(0.2)
        .width(window.innerWidth)
        .height(window.innerHeight);

      globeRef.current = globe;

      // Dark globe material
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const material = globe.globeMaterial() as any;
      material.color = new THREE.Color(0x0a1525);
      material.emissive = new THREE.Color(0x001122);
      material.emissiveIntensity = 0.8;
      material.map = null;
      material.bumpMap = null;
      material.needsUpdate = true;

      // Lighting
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const scene = globe.scene() as any;
      scene.background = new THREE.Color(0x000000);
      scene.add(new THREE.AmbientLight(0x00d4ff, 0.5));
      const dirLight = new THREE.DirectionalLight(0x00d4ff, 0.8);
      dirLight.position.set(-3, 2, 4);
      scene.add(dirLight);

      // Country polygons
      try {
        const res = await fetch("/countries-110m.json");
        const topo = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const countries = (topoClient.feature as any)(topo, topo.objects.countries).features;

        globe
          .polygonsData(countries)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .polygonGeoJsonGeometry((d: any) => d.geometry)
          .polygonCapColor(() => "rgba(0,212,255,0.04)")
          .polygonSideColor(() => "rgba(0,212,255,0.02)")
          .polygonStrokeColor(() => "rgba(0,212,255,0.25)")
          .polygonAltitude(0.005)
          .polygonsTransitionDuration(0);
      } catch (e) {
        console.warn("Failed to load countries", e);
      }

      // Sensor node points
      globe
        .pointsData(SENSOR_NODES)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .pointLat((d: any) => d.lat)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .pointLng((d: any) => d.lng)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .pointColor((d: any) =>
          d.isHQ ? "#00d4ff" : d.tier === 1 ? "#00d4ff" : d.tier === 2 ? "#0088aa" : "#005566"
        )
        .pointAltitude(0.02)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .pointRadius((d: any) => (d.isHQ ? 0.6 : d.tier === 1 ? 0.4 : 0.25))
        .pointResolution(16);

      // Pulse rings
      globe
        .ringsData(SENSOR_NODES)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .ringLat((d: any) => d.lat)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .ringLng((d: any) => d.lng)
        .ringColor(() => (t: number) => `rgba(0,212,255,${(1 - t) * 0.6})`)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .ringMaxRadius((d: any) => (d.isHQ ? 4 : d.tier === 1 ? 2.5 : 1.5))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .ringPropagationSpeed((d: any) => (d.isHQ ? 2.5 : 1.5))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .ringRepeatPeriod((d: any) => (d.isHQ ? 1000 : 2000));

      // Arcs: threats in red, defense in cyan
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const allArcs: any[] = [
        ...THREAT_ARCS.map((a) => ({
          ...a,
          color: ["rgba(255,68,68,0.05)", "rgba(255,68,68,0.6)", "rgba(255,68,68,0.05)"],
        })),
        ...DEFENSE_ARCS.map((a) => ({
          ...a,
          color: ["rgba(0,212,255,0.05)", "rgba(0,212,255,0.4)", "rgba(0,212,255,0.05)"],
        })),
      ];

      globe
        .arcsData(allArcs)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .arcStartLat((d: any) => d.startLat)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .arcStartLng((d: any) => d.startLng)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .arcEndLat((d: any) => d.endLat)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .arcEndLng((d: any) => d.endLng)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .arcColor((d: any) => d.color)
        .arcAltitudeAutoScale(0.3)
        .arcStroke(0.5)
        .arcDashLength(0.6)
        .arcDashGap(2)
        .arcDashAnimateTime(2500);

      // Grid lines
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gridPaths: any[] = [];
      for (let lat = -60; lat <= 60; lat += 30) {
        const pts = [];
        for (let i = 0; i <= 72; i++) pts.push({ lat, lng: -180 + (360 / 72) * i });
        gridPaths.push({ coords: pts });
      }
      for (let lng = -180; lng <= 150; lng += 30) {
        const pts = [];
        for (let i = 0; i <= 72; i++) pts.push({ lat: -90 + (180 / 72) * i, lng });
        gridPaths.push({ coords: pts });
      }

      globe
        .pathsData(gridPaths)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .pathPoints((d: any) => d.coords)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .pathPointLat((p: any) => p.lat)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .pathPointLng((p: any) => p.lng)
        .pathColor(() => "rgba(0,212,255,0.06)")
        .pathStroke(0.3)
        .pathDashLength(999)
        .pathDashGap(0);

      // Camera: zoomed in tight on Romania — see the action
      globe.pointOfView({ lat: 45.5, lng: 25, altitude: 0.55 }, 0);

      // Controls
      const controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.08;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableDamping = true;

      // Star field
      const starGeo = new THREE.BufferGeometry();
      const starPos = new Float32Array(3000 * 3);
      for (let i = 0; i < 3000; i++) {
        const r = 40 + Math.random() * 60;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        starPos[i * 3 + 2] = r * Math.cos(phi);
      }
      starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
      const stars = new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({
          size: 0.1,
          color: 0x00d4ff,
          transparent: true,
          opacity: 0.6,
        })
      );
      scene.add(stars);

      // Expose globe instance
      if (onGlobeReady) onGlobeReady(globe);

      // Resize
      const onResize = () => {
        globe.width(window.innerWidth).height(window.innerHeight);
      };
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
      };
    })();

    return () => {
      mounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} id="globe-container" />;
}

/* ═══════════════════════════════════════════════════════════
   HUD COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function HudTopBar() {
  const utc = useUTCClock();
  return (
    <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 pointer-events-none">
      {/* Left: system label */}
      <div className="flex items-center gap-4">
        <div>
          <div className="font-mono text-[13px] tracking-[0.2em] text-[#00d4ff] uppercase font-bold">
            INDIGO-AIRGUARD
          </div>
          <div className="font-mono text-[10px] tracking-[0.15em] text-[#3a5a6a] uppercase">
            Defending Airspace
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <span className="status-dot" />
          <span className="font-mono text-[11px] tracking-wider text-[#0088aa] uppercase">
            ACTIVE
          </span>
        </div>
      </div>

      {/* Right: coords + UTC clock */}
      <div className="text-right">
        <div className="font-mono text-[11px] text-[#3a5a6a] tracking-wider">
          45.9432&deg;N &nbsp; 24.9668&deg;E
        </div>
        <div className="font-mono text-[13px] text-[#00d4ff] tracking-[0.15em] tabular-nums">
          {utc}
        </div>
      </div>
    </div>
  );
}

function ClassificationBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none">
      <div className="w-full h-[1px] bg-[rgba(0,212,255,0.15)]" />
      <div className="flex items-center justify-center py-1.5 bg-[rgba(0,0,0,0.85)]">
        <span className="font-mono text-[9px] tracking-[0.3em] text-[#1a3a4a] uppercase">
          INDIGO AIRGUARD &nbsp;&middot; &nbsp;DEFENDING AIRSPACE &nbsp;&middot; &nbsp;EUDIS 2026
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE CONTENT — EUDIS "Defending Airspace" narrative
   ═══════════════════════════════════════════════════════════ */

function SlideTitle() {
  return (
    <div className="flex flex-col justify-end h-full pb-24">
      <motion.div custom={0} variants={fade} initial="hidden" animate="visible">
        <h1 className="font-mono text-[44px] sm:text-[60px] font-bold tracking-[0.12em] text-white uppercase leading-none">
          INDIGO AIRGUARD
        </h1>
      </motion.div>
      <motion.div custom={1} variants={fade} initial="hidden" animate="visible" className="mt-3">
        <div className="w-[80px] h-[2px] bg-[#00d4ff]" />
      </motion.div>
      <motion.p custom={2} variants={fade} initial="hidden" animate="visible"
        className="mt-5 text-[18px] sm:text-[22px] text-[#e8f4ff] leading-relaxed max-w-[580px]">
        What if the phone in your pocket could warn you about an incoming drone?
      </motion.p>
      <motion.p custom={3} variants={fade} initial="hidden" animate="visible"
        className="mt-3 text-[15px] text-[#7a9ab8] leading-relaxed max-w-[580px]">
        Our answer to Defending Airspace. A civilian sensor network for Europe&apos;s most exposed border.
      </motion.p>
      <motion.div custom={4} variants={fade} initial="hidden" animate="visible"
        className="mt-8 font-mono text-[12px] tracking-[0.2em] text-[#00d4ff]/50 uppercase">
        EUDIS 2026
      </motion.div>
    </div>
  );
}

function SlideThreat() {
  return (
    <div className="flex flex-col justify-end h-full pb-24">
      <motion.div custom={0} variants={fade} initial="hidden" animate="visible">
        <h2 className="font-mono text-[28px] sm:text-[36px] font-bold tracking-[0.08em] text-white uppercase">
          Drones Changed Warfare
        </h2>
      </motion.div>
      <motion.div custom={1} variants={fade} initial="hidden" animate="visible" className="mt-5">
        <p className="text-[16px] sm:text-[18px] text-[#c8d8e8] leading-relaxed max-w-[580px]">
          A <span className="text-[#ff4444] font-semibold">$400 racing drone</span> with a grenade
          can take out an armoured vehicle. A Shahed loitering munition hits a power station from
          a thousand kilometres away.
        </p>
      </motion.div>
      <motion.div custom={2} variants={fade} initial="hidden" animate="visible" className="mt-4">
        <p className="text-[15px] sm:text-[17px] text-[#7a9ab8] leading-relaxed max-w-[580px]">
          The defence systems that could stop them &mdash; radar, jammers, interceptors &mdash; cost
          tens of thousands to millions per unit. They protect one building, one base. They need
          trained operators and fixed infrastructure.
        </p>
      </motion.div>
      <motion.div custom={3} variants={fade} initial="hidden" animate="visible" className="mt-5">
        <p className="text-[15px] text-[#556a7a] leading-relaxed max-w-[580px]">
          Romania is on the front line. The threat doesn&apos;t stop at the border.
        </p>
      </motion.div>
    </div>
  );
}

function SlidePhones() {
  return (
    <div className="flex flex-col justify-end h-full pb-24">
      <motion.div custom={0} variants={fade} initial="hidden" animate="visible">
        <h2 className="font-mono text-[28px] sm:text-[36px] font-bold tracking-[0.08em] text-white uppercase">
          The Sensors Already Exist
        </h2>
      </motion.div>
      <motion.div custom={1} variants={fade} initial="hidden" animate="visible" className="mt-5">
        <p className="text-[16px] sm:text-[18px] text-[#c8d8e8] leading-relaxed max-w-[580px]">
          Romania has <span className="text-[#00d4ff] font-semibold">28 million mobile connections</span>.
          Every smartphone has a microphone that can hear a drone, a WiFi radio that can
          sense its control signal, GPS that knows where it is, and enough processing power
          to classify what it heard.
        </p>
      </motion.div>
      <motion.div custom={2} variants={fade} initial="hidden" animate="visible" className="mt-4">
        <p className="text-[15px] sm:text-[17px] text-[#7a9ab8] leading-relaxed max-w-[580px]">
          We built an app that turns those phones into detection nodes. When three phones hear
          the same drone, the system triangulates its position and a commander sees it on their
          display in under half a second.
        </p>
      </motion.div>
      <motion.div custom={3} variants={fade} initial="hidden" animate="visible" className="mt-5">
        <p className="font-mono text-[14px] text-[#00d4ff]/50">
          No new infrastructure. No specialized equipment. No trained operators.
        </p>
      </motion.div>
    </div>
  );
}

function SlideDemo() {
  return (
    <div className="flex flex-col justify-end h-full pb-24">
      <motion.div custom={0} variants={fade} initial="hidden" animate="visible">
        <h2 className="font-mono text-[28px] sm:text-[36px] font-bold tracking-[0.08em] text-white uppercase">
          Watch It Happen
        </h2>
      </motion.div>
      <motion.div custom={1} variants={fade} initial="hidden" animate="visible" className="mt-5">
        <p className="text-[16px] sm:text-[18px] text-[#c8d8e8] leading-relaxed max-w-[580px]">
          What you see behind this text is a simulation of our sensor network over Romania.
        </p>
      </motion.div>
      <motion.div custom={2} variants={fade} initial="hidden" animate="visible" className="mt-4">
        <p className="text-[15px] sm:text-[17px] text-[#7a9ab8] leading-relaxed max-w-[580px]">
          <span className="text-[#ff4444]">Red</span> &mdash; inbound drones.{" "}
          <span className="text-[#00d4ff]">Cyan</span> &mdash; phone sensors.{" "}
          Watch the detection cascade: acoustic contact, RF confirmation, triangulation, tracking, alert.
        </p>
      </motion.div>
      <motion.div custom={3} variants={fade} initial="hidden" animate="visible" className="mt-5">
        <p className="text-[15px] text-[#556a7a] leading-relaxed max-w-[580px]">
          This is what it looks like when a civilian population becomes an early warning system.
        </p>
      </motion.div>
    </div>
  );
}

function SlideTech() {
  return (
    <div className="flex flex-col justify-end h-full pb-24">
      <motion.div custom={0} variants={fade} initial="hidden" animate="visible">
        <h2 className="font-mono text-[28px] sm:text-[36px] font-bold tracking-[0.08em] text-white uppercase">
          How It Works
        </h2>
      </motion.div>
      <motion.div custom={1} variants={fade} initial="hidden" animate="visible" className="mt-5">
        <p className="text-[16px] sm:text-[18px] text-[#c8d8e8] leading-relaxed max-w-[580px]">
          Every sensor node has a position and a clock. The better the clock, the better
          the triangulation. A GPS pulse-per-second signal gives <span className="text-[#00d4ff] font-semibold">&plusmn;12 metre</span> accuracy.
          Regular network time gives &plusmn;62 metres. Both are useful &mdash; the system weights
          them according to their actual precision.
        </p>
      </motion.div>
      <motion.div custom={2} variants={fade} initial="hidden" animate="visible" className="mt-4">
        <p className="text-[15px] sm:text-[17px] text-[#7a9ab8] leading-relaxed max-w-[580px]">
          Behind this: a tracking filter that predicts trajectory. Seven acoustic profiles
          matching specific drone types. RF analysis that identifies the control protocol and
          fingerprints the individual transmitter. The system never overstates what it knows.
        </p>
      </motion.div>
      <motion.div custom={3} variants={fade} initial="hidden" animate="visible" className="mt-5">
        <code className="font-mono text-[15px] text-[#00d4ff]/70">
          Node(lat, lon, alt, timePrecision&mu;s)
        </code>
      </motion.div>
    </div>
  );
}

function SlideStack() {
  return (
    <div className="flex flex-col justify-end h-full pb-24">
      <motion.div custom={0} variants={fade} initial="hidden" animate="visible">
        <h2 className="font-mono text-[28px] sm:text-[36px] font-bold tracking-[0.08em] text-white uppercase">
          The Full Stack
        </h2>
      </motion.div>
      <motion.div custom={1} variants={fade} initial="hidden" animate="visible" className="mt-5">
        <p className="text-[16px] sm:text-[18px] text-[#c8d8e8] leading-relaxed max-w-[580px]">
          We&apos;re not just software. Our team brings acoustic detection and sensor fusion &mdash;
          the distributed phone network. Machine learning &mdash; seven drone profiles trained
          on real acoustic signatures.
        </p>
      </motion.div>
      <motion.div custom={2} variants={fade} initial="hidden" animate="visible" className="mt-4">
        <p className="text-[15px] sm:text-[17px] text-[#7a9ab8] leading-relaxed max-w-[580px]">
          Field hardware &mdash; radar, cameras, RF analysis, physical intercept.
          The complete chain from first detection to response. Open source software.
          Field hardware. One integrated system for Defending Airspace.
        </p>
      </motion.div>
    </div>
  );
}

function SlideRunning() {
  return (
    <div className="flex flex-col justify-end h-full pb-24">
      <motion.div custom={0} variants={fade} initial="hidden" animate="visible">
        <h2 className="font-mono text-[28px] sm:text-[36px] font-bold tracking-[0.08em] text-white uppercase">
          It&apos;s Running
        </h2>
      </motion.div>
      <motion.div custom={1} variants={fade} initial="hidden" animate="visible" className="mt-5">
        <p className="text-[16px] sm:text-[18px] text-[#c8d8e8] leading-relaxed max-w-[580px]">
          Our demo dashboard is live right now. Real Romanian airspace data &mdash; NOTAMs, weather,
          ADS-B aircraft positions &mdash; alongside simulated drone tracks with full alert escalation.
        </p>
      </motion.div>
      <motion.div custom={2} variants={fade} initial="hidden" animate="visible" className="mt-4">
        <p className="text-[15px] sm:text-[17px] text-[#7a9ab8] leading-relaxed max-w-[580px]">
          Eight protected zones across Romania: Henri Coanda Airport,
          Cernavoda nuclear plant, Mihail Kogalniceanu NATO air base, Deveselu, and more.
        </p>
      </motion.div>
      <motion.div custom={3} variants={fade} initial="hidden" animate="visible" className="mt-5 space-y-2">
        <p className="font-mono text-[14px]">
          <span className="text-[#556a7a]">DEMO </span>
          <span className="text-[#00d4ff]">apex-sentinel-demo.vercel.app</span>
        </p>
        <p className="font-mono text-[14px]">
          <span className="text-[#556a7a]">CODE </span>
          <span className="text-[#00d4ff]">github.com/fratilanico/apex-sentinel</span>
        </p>
        <p className="font-mono text-[13px] text-[#3a5a6a]">
          Open source &middot; MIT licence
        </p>
      </motion.div>
    </div>
  );
}

function SlideClose() {
  return (
    <div className="flex flex-col justify-end h-full pb-24">
      <motion.div custom={0} variants={fade} initial="hidden" animate="visible">
        <h2 className="font-mono text-[28px] sm:text-[36px] font-bold tracking-[0.08em] text-white uppercase">
          What&apos;s Next
        </h2>
      </motion.div>
      <motion.div custom={1} variants={fade} initial="hidden" animate="visible" className="mt-5">
        <p className="text-[16px] sm:text-[18px] text-[#c8d8e8] leading-relaxed max-w-[580px]">
          <span className="text-[#00d4ff] font-semibold">Today:</span> An open-source library and a working demo.
        </p>
      </motion.div>
      <motion.div custom={2} variants={fade} initial="hidden" animate="visible" className="mt-3">
        <p className="text-[16px] sm:text-[18px] text-[#c8d8e8] leading-relaxed max-w-[580px]">
          <span className="text-[#ffaa00] font-semibold">Next:</span> An Android app any civilian can install.
          Field testing in Romania with real sensors and real drones.
        </p>
      </motion.div>
      <motion.div custom={3} variants={fade} initial="hidden" animate="visible" className="mt-3">
        <p className="text-[16px] sm:text-[18px] text-[#c8d8e8] leading-relaxed max-w-[580px]">
          <span className="text-[#00e676] font-semibold">The goal:</span> A detection mesh where phones across
          the Eastern Flank form a continuous early warning layer. Not replacing military systems &mdash;
          extending their reach.
        </p>
      </motion.div>
      <motion.div custom={4} variants={fade} initial="hidden" animate="visible" className="mt-8">
        <p className="text-[16px] italic text-[#7a9ab8] max-w-[580px]">
          The threat is cheap and everywhere. The defence should be too.
        </p>
      </motion.div>
      <motion.div custom={5} variants={fade} initial="hidden" animate="visible" className="mt-5">
        <p className="font-mono text-[13px] text-[#556a7a]">nico@apexos.dev</p>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NAV DOTS — bottom center
   ═══════════════════════════════════════════════════════════ */

function NavDots({
  idx,
  total,
  onGo,
}: {
  idx: number;
  total: number;
  onGo: (i: number) => void;
}) {
  return (
    <div className="fixed bottom-[28px] left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => onGo(i)}
          aria-label={`Slide ${i + 1}`}
          className={`nav-dot ${i === idx ? "active" : ""}`}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROGRESS LINE — bottom 1px
   ═══════════════════════════════════════════════════════════ */

function ProgressLine({ idx, total }: { idx: number; total: number }) {
  return (
    <div className="fixed bottom-[22px] left-0 right-0 z-25 h-[1px] bg-[rgba(0,212,255,0.08)]">
      <motion.div
        className="h-full bg-[#00d4ff]/40"
        animate={{ width: `${((idx + 1) / total) * 100}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DRONE INCURSION SIMULATION
   ═══════════════════════════════════════════════════════════ */

interface SimDrone {
  id: string;
  arcIdx: number;
  progress: number; // 0 to 1
  phase: "inbound" | "detected" | "tracked" | "neutralized";
  lat: number;
  lng: number;
  spawnedAt: number;
}

interface AlertEvent {
  id: string;
  time: string;
  text: string;
  color: string; // tailwind-safe hex
  ts: number;
}

const DRONE_PROTOCOLS = ["ELRS 2.4GHz", "DJI O3", "Crossfire 868MHz", "Analog 5.8GHz"];
const DRONE_SECTORS = ["NORTH", "CENTRAL", "BLACK SEA", "DEEP"];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

function utcStamp() {
  const d = new Date();
  return (
    d.getUTCHours().toString().padStart(2, "0") +
    ":" +
    d.getUTCMinutes().toString().padStart(2, "0") +
    ":" +
    d.getUTCSeconds().toString().padStart(2, "0")
  );
}

let droneCounter = 0;

function DroneSimulation({
  globe,
  onAlert,
}: {
  globe: any;
  onAlert: (evt: AlertEvent) => void;
}) {
  const dronesRef = useRef<SimDrone[]>([]);
  const firedDetectRef = useRef<Set<string>>(new Set());
  const firedTrackRef = useRef<Set<string>>(new Set());
  const firedNeutRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!globe) return;

    // Spawn a new drone every 8 seconds
    const spawnInterval = setInterval(() => {
      const arcIdx = Math.floor(Math.random() * THREAT_ARCS.length);
      const arc = THREAT_ARCS[arcIdx];
      droneCounter++;
      const id = `UAS-${String(droneCounter).padStart(3, "0")}`;
      const drone: SimDrone = {
        id,
        arcIdx,
        progress: 0,
        phase: "inbound",
        lat: arc.startLat,
        lng: arc.startLng,
        spawnedAt: Date.now(),
      };
      dronesRef.current = [...dronesRef.current, drone];

      const proto = DRONE_PROTOCOLS[Math.floor(Math.random() * DRONE_PROTOCOLS.length)];
      const freq = Math.random() > 0.5 ? "2.4GHz" : "5.8GHz";
      const sector = DRONE_SECTORS[arcIdx];
      onAlert({
        id: `${id}-spawn`,
        time: utcStamp(),
        text: `RF anomaly — ${freq} — sector ${sector}`,
        color: "#ff4444",
        ts: Date.now(),
      });

      setTimeout(() => {
        onAlert({
          id: `${id}-proto`,
          time: utcStamp(),
          text: `${id} confirmed — ${proto}`,
          color: "#ffaa00",
          ts: Date.now(),
        });
      }, 1500);
    }, 8000);

    // Ambient network status messages every 12s
    const ambientInterval = setInterval(() => {
      const msgs = [
        { text: "15 nodes online — coverage nominal", color: "#0088aa" },
        { text: "RF baseline stable — no interference", color: "#0088aa" },
        { text: "Mesh latency 38ms — within threshold", color: "#0088aa" },
        { text: "Acoustic calibration — background 42dB", color: "#0088aa" },
      ];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      onAlert({
        id: `ambient-${Date.now()}`,
        time: utcStamp(),
        ...msg,
        ts: Date.now(),
      });
    }, 12000);

    // Advance drones at 100ms tick
    const tickInterval = setInterval(() => {
      const now = Date.now();
      const updated: SimDrone[] = [];

      for (const drone of dronesRef.current) {
        const age = now - drone.spawnedAt;
        const arc = THREAT_ARCS[drone.arcIdx];

        // Total journey: 6s inbound, detect at ~60%, track at ~75%, neutralize at ~90%
        const progress = Math.min(1, age / 6000);
        const lat = lerp(arc.startLat, arc.endLat, progress);
        const lng = lerp(arc.startLng, arc.endLng, progress);

        let phase = drone.phase;

        if (progress >= 0.6 && phase === "inbound") {
          phase = "detected";
          if (!firedDetectRef.current.has(drone.id)) {
            firedDetectRef.current.add(drone.id);
            onAlert({
              id: `${drone.id}-detect`,
              time: utcStamp(),
              text: `${drone.id} — 3 nodes — CEP ±${Math.floor(12 + Math.random() * 20)}m`,
              color: "#00d4ff",
              ts: Date.now(),
            });
          }
        }

        if (progress >= 0.75 && (phase === "detected" || phase === "inbound")) {
          phase = "tracked";
          if (!firedTrackRef.current.has(drone.id)) {
            firedTrackRef.current.add(drone.id);
            const brg = String(Math.floor(Math.random() * 360)).padStart(3, "0");
            onAlert({
              id: `${drone.id}-track`,
              time: utcStamp(),
              text: `${drone.id} tracked — brg ${brg}° — ${75 + Math.floor(Math.random() * 20)}%`,
              color: "#ffaa00",
              ts: Date.now(),
            });
          }
        }

        if (progress >= 0.9 && phase !== "neutralized") {
          phase = "neutralized";
          if (!firedNeutRef.current.has(drone.id)) {
            firedNeutRef.current.add(drone.id);
            onAlert({
              id: `${drone.id}-neut`,
              time: utcStamp(),
              text: `${drone.id} neutralized — track closed`,
              color: "#00e676",
              ts: Date.now(),
            });
          }
        }

        // Remove fully completed drones (after 8s total)
        if (age < 8000) {
          updated.push({ ...drone, progress, lat, lng, phase });
        } else {
          // cleanup fired refs
          firedDetectRef.current.delete(drone.id);
          firedTrackRef.current.delete(drone.id);
          firedNeutRef.current.delete(drone.id);
        }
      }

      dronesRef.current = updated;

      // Update globe htmlElementsData
      const htmlData = updated.map((d) => ({
        lat: d.lat,
        lng: d.lng,
        id: d.id,
        phase: d.phase,
      }));

      try {
        globe
          .htmlElementsData(htmlData)
          .htmlLat((d: any) => d.lat)
          .htmlLng((d: any) => d.lng)
          .htmlAltitude(0.03)
          .htmlElement((d: any) => {
            const existing = document.getElementById(`drone-${d.id}`);
            if (existing) return existing;

            const el = document.createElement("div");
            el.id = `drone-${d.id}`;
            el.style.width = "10px";
            el.style.height = "10px";
            el.style.borderRadius = "50%";
            el.style.pointerEvents = "none";
            el.style.transition = "background 0.3s, box-shadow 0.3s, opacity 0.5s";

            const phaseColor: Record<string, string> = {
              inbound: "#ff4444",
              detected: "#00d4ff",
              tracked: "#ffaa00",
              neutralized: "#00e676",
            };
            const c = phaseColor[d.phase] || "#ff4444";
            el.style.background = c;
            el.style.boxShadow = `0 0 8px ${c}, 0 0 16px ${c}80`;
            if (d.phase === "neutralized") el.style.opacity = "0.4";
            return el;
          });
      } catch {
        // globe may not be ready
      }
    }, 100);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(tickInterval);
      clearInterval(ambientInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globe]);

  return null; // Simulation is side-effect only
}

/* ═══════════════════════════════════════════════════════════
   ALERT FEED
   ═══════════════════════════════════════════════════════════ */

function AlertFeed({ events }: { events: AlertEvent[] }) {
  const visible = events.slice(0, 8);

  return (
    <div className="fixed top-[72px] right-6 z-20 pointer-events-none w-[280px]">
      <div className="glass px-4 py-3">
        <div className="font-mono text-[12px] tracking-[0.2em] text-[#00d4ff]/60 uppercase mb-3">
          SENSOR FEED
        </div>
        <div className="space-y-1.5">
          <AnimatePresence initial={false}>
            {visible.map((evt) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex gap-2 items-start"
              >
                <span className="font-mono text-[11px] text-[#3a5a6a] tabular-nums shrink-0">
                  [{evt.time}]
                </span>
                <span
                  className="font-mono text-[12px] leading-snug"
                  style={{ color: evt.color }}
                >
                  {evt.text}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          {visible.length === 0 && (
            <div className="font-mono text-[11px] text-[#3a5a6a] animate-pulse">
              MONITORING...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PRESENTATION
   ═══════════════════════════════════════════════════════════ */

export default function Presentation() {
  const [idx, setIdx] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeInstanceRef = useRef<any>(null);
  const [globeReady, setGlobeReady] = useState(false);
  const [alertEvents, setAlertEvents] = useState<AlertEvent[]>([]);

  const handleGlobeReady = useCallback((g: any) => {
    globeInstanceRef.current = g;
    setGlobeReady(true);
  }, []);

  const handleAlert = useCallback((evt: AlertEvent) => {
    setAlertEvents((prev) => [evt, ...prev].slice(0, 20));
  }, []);

  const go = useCallback((to: number) => {
    if (to < 0 || to >= SLIDES.length) return;
    setIdx(to);
  }, []);

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

  const slideId = SLIDES[idx].id;

  return (
    <>
      {/* Layer 1: Globe */}
      <GlobeBackground onGlobeReady={handleGlobeReady} />

      {/* Drone simulation (side-effect component) */}
      {globeReady && (
        <DroneSimulation globe={globeInstanceRef.current} onAlert={handleAlert} />
      )}

      {/* Layer 2: Vignette */}
      <div className="vignette" />

      {/* Layer 3: HUD */}
      <HudTopBar />
      <ClassificationBar />

      {/* Layer 4: Alert feed (replaces right panel) */}
      <AlertFeed events={alertEvents} />

      {/* Layer 5: Slide content — bottom left */}
      <div className="fixed bottom-[40px] left-6 z-20 w-[640px] max-w-[calc(100vw-48px)] h-[calc(100vh-120px)] pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={slideId}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="h-full"
          >
            {slideId === "title" && <SlideTitle />}
            {slideId === "threat" && <SlideThreat />}
            {slideId === "phones" && <SlidePhones />}
            {slideId === "demo" && <SlideDemo />}
            {slideId === "tech" && <SlideTech />}
            {slideId === "stack" && <SlideStack />}
            {slideId === "running" && <SlideRunning />}
            {slideId === "close" && <SlideClose />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Layer 6: Navigation */}
      <ProgressLine idx={idx} total={SLIDES.length} />
      <NavDots idx={idx} total={SLIDES.length} onGo={go} />

      {/* Slide counter — bottom left corner */}
      <div className="fixed bottom-[28px] left-6 z-30 font-mono text-[11px] text-[#3a5a6a] tabular-nums tracking-wider">
        {String(idx + 1).padStart(2, "0")} / {SLIDES.length}
      </div>
    </>
  );
}
