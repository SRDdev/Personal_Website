"use client";

import React, { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ─────────────────────────────────────────────────────────────────────
type Basin = { cx: number; cz: number; depth: number; sx: number; sz: number; isGlobal?: boolean };
type LandscapeDef = { basins: Basin[]; noiseA: number; noiseB: number; noiseFreq: number };
type Params = { lr: number; momentum: number; noise: number };

// ─── Random landscape factory ──────────────────────────────────────────────────
function makeLandscape(): LandscapeDef {
  const R = () => (Math.random() - 0.5) * 2;
  const count = 3 + Math.floor(Math.random() * 3);
  const basins: Basin[] = [];
  for (let i = 0; i < count; i++) {
    basins.push({
      cx: R() * 2.1, cz: R() * 2.1,
      depth: 0.9 + Math.random() * 0.7,
      sx: 0.45 + Math.random() * 0.35,
      sz: 0.45 + Math.random() * 0.35,
    });
  }
  const gIdx = Math.floor(Math.random() * basins.length);
  basins[gIdx].depth = 2.5 + Math.random() * 0.5;
  basins[gIdx].sx = 0.75 + Math.random() * 0.25;
  basins[gIdx].sz = 0.75 + Math.random() * 0.25;
  basins[gIdx].isGlobal = true;
  return {
    basins,
    noiseA: 0.07 + Math.random() * 0.07,
    noiseB: 0.06 + Math.random() * 0.05,
    noiseFreq: 1.6 + Math.random() * 0.8,
  };
}

function gauss(x: number, z: number, b: Basin) {
  return b.depth * Math.exp(-((x - b.cx) ** 2) / (2 * b.sx ** 2) - ((z - b.cz) ** 2) / (2 * b.sz ** 2));
}

function evalLoss(x: number, z: number, def: LandscapeDef): number {
  let y = 0.09 * x * x + 0.07 * z * z;
  for (const b of def.basins) y -= gauss(x, z, b);
  y += def.noiseA * Math.sin(x * def.noiseFreq) * Math.cos(z * def.noiseFreq);
  y += def.noiseB * Math.sin(x * 3.1 + 0.5) * Math.sin(z * 2.8 - 0.3);
  return y;
}

function evalGrad(x: number, z: number, def: LandscapeDef, eps = 0.009) {
  return {
    dx: (evalLoss(x + eps, z, def) - evalLoss(x - eps, z, def)) / (2 * eps),
    dz: (evalLoss(x, z + eps, def) - evalLoss(x, z - eps, def)) / (2 * eps),
  };
}

const WORLD = 2.0;   // landscape units → three.js world units
const HSCALE = 1.9;  // vertical exaggeration
const TRAIL = 160;

// ─── Surface ───────────────────────────────────────────────────────────────────
function LandscapeSurface({ def }: { def: LandscapeDef }) {
  const geo = useMemo(() => {
    const SEG = 64;
    const g = new THREE.PlaneGeometry(12, 12, SEG, SEG);
    const pos = g.attributes.position;
    const cols = new Float32Array(pos.count * 3);
    const ys: number[] = [];
    let lo = Infinity, hi = -Infinity;

    for (let i = 0; i < pos.count; i++) {
      const y = evalLoss(pos.getX(i) / WORLD, pos.getY(i) / WORLD, def) * HSCALE;
      ys.push(y);
      if (y < lo) lo = y;
      if (y > hi) hi = y;
    }
    const range = hi - lo || 1;
    const cPeak   = new THREE.Color("#1e40af");
    const cMid    = new THREE.Color("#7c3aed");
    const cValley = new THREE.Color("#c084fc");
    const tmp = new THREE.Color();

    for (let i = 0; i < pos.count; i++) {
      pos.setZ(i, ys[i]);
      const t = (ys[i] - lo) / range;
      if (t > 0.5) tmp.lerpColors(cMid, cPeak, (t - 0.5) * 2);
      else         tmp.lerpColors(cValley, cMid, t * 2);
      cols[i * 3] = tmp.r; cols[i * 3 + 1] = tmp.g; cols[i * 3 + 2] = tmp.b;
    }
    g.setAttribute("color", new THREE.BufferAttribute(cols, 3));
    g.computeVertexNormals();
    return g;
  }, [def]);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {/* Shaded surface */}
      <mesh geometry={geo}>
        <meshStandardMaterial vertexColors transparent opacity={0.52} side={THREE.DoubleSide} roughness={0.7} metalness={0.08} />
      </mesh>
      {/* Wireframe mesh — clearly visible */}
      <mesh geometry={geo}>
        <meshStandardMaterial
          color="#a78bfa"
          wireframe
          transparent
          opacity={0.38}
          side={THREE.DoubleSide}
          emissive="#a78bfa"
          emissiveIntensity={0.65}
        />
      </mesh>
    </group>
  );
}

// ─── Descent ball ──────────────────────────────────────────────────────────────
type BallProps = {
  def: LandscapeDef;
  params: Params;
  running: boolean;
  runKey: number;
  onMinima: () => void;
  onStep: (x: number, z: number, loss: number, dx: number, dz: number) => void;
};

function DescentBall({ def, params, running, runKey, onMinima, onStep }: BallProps) {
  const ballRef  = useRef<THREE.Mesh>(null);
  const haloRef  = useRef<THREE.Mesh>(null);

  const trailGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(TRAIL * 3), 3));
    g.setDrawRange(0, 0);
    return g;
  }, []);

  const st = useRef({
    x: 0, z: 0, vx: 0, vz: 0,
    stuck: 0, wait: 0, alerted: false, step: 0,
    trail: [] as [number, number, number][],
  });

  useEffect(() => {
    const s = st.current;
    frameCount.current = 0;
    s.x = (Math.random() - 0.5) * 4.8;
    s.z = (Math.random() - 0.5) * 4.8;
    s.vx = 0; s.vz = 0; s.stuck = 0; s.wait = 0;
    s.alerted = false; s.step = 0; s.trail = [];
    const pos = trailGeo.attributes.position as THREE.BufferAttribute;
    pos.array.fill(0); pos.needsUpdate = true;
    trailGeo.setDrawRange(0, 0);
  }, [runKey, trailGeo]);

  const frameCount = useRef(0);
  useFrame(() => {
    if (!running) return;
    frameCount.current++;
    if (frameCount.current % 6 !== 0) return;
    const s = st.current;

    const { dx, dz } = evalGrad(s.x, s.z, def);
    const nx = (Math.random() - 0.5) * params.noise;
    const nz = (Math.random() - 0.5) * params.noise;
    s.vx = params.momentum * s.vx - params.lr * (dx + nx);
    s.vz = params.momentum * s.vz - params.lr * (dz + nz);
    s.x  = Math.max(-2.85, Math.min(2.85, s.x + s.vx));
    s.z  = Math.max(-2.85, Math.min(2.85, s.z + s.vz));
    s.step++;

    const loss = evalLoss(s.x, s.z, def);
    if (s.step % 3 === 0) onStep(s.x, s.z, loss, dx, dz);

    if (Math.hypot(s.vx, s.vz) < 0.0003) s.stuck++; else s.stuck = 0;

    const globalB = def.basins.find(b => b.isGlobal);
    if (globalB && !s.alerted && Math.hypot(s.x - globalB.cx, s.z - globalB.cz) < 0.45) {
      s.alerted = true;
      onMinima();
      s.wait = 230;
      setTimeout(() => {
        s.x = (Math.random() - 0.5) * 4.8;
        s.z = (Math.random() - 0.5) * 4.8;
        s.vx = 0; s.vz = 0; s.stuck = 0; s.trail = [];
        s.alerted = false;
      }, 3600);
      return;
    }

    if (s.stuck > 100) {
      s.x = (Math.random() - 0.5) * 4.8;
      s.z = (Math.random() - 0.5) * 4.8;
      s.vx = 0; s.vz = 0; s.stuck = 0; s.trail = [];
    }

    const wx = s.x * WORLD;
    const wy = evalLoss(s.x, s.z, def) * HSCALE + 0.19;
    const wz = -s.z * WORLD;

    ballRef.current?.position.set(wx, wy, wz);
    haloRef.current?.position.set(wx, wy, wz);

    s.trail.unshift([wx, wy - 0.06, wz]);
    if (s.trail.length > TRAIL) s.trail.length = TRAIL;
    const tp = trailGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < s.trail.length; i++)
      tp.setXYZ(i, s.trail[i][0], s.trail[i][1], s.trail[i][2]);
    tp.needsUpdate = true;
    trailGeo.setDrawRange(0, s.trail.length);
  });

  return (
    <>
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.30, 14, 14]} />
        <meshStandardMaterial color="#e879f9" transparent opacity={0.11} depthWrite={false} />
      </mesh>
      <mesh ref={ballRef}>
        <sphereGeometry args={[0.12, 22, 22]} />
        <meshStandardMaterial color="#fae8ff" emissive="#d946ef" emissiveIntensity={2.5} roughness={0.04} metalness={0.7} />
      </mesh>
      <points geometry={trailGeo}>
        <pointsMaterial color="#c084fc" size={0.05} transparent opacity={0.45} sizeAttenuation depthWrite={false} />
      </points>
    </>
  );
}

// ─── Slider ────────────────────────────────────────────────────────────────────
function Slider({
  label, sub, value, min, max, step, color, fmt, onChange,
}: {
  label: string; sub: string; value: number;
  min: number; max: number; step: number;
  color: string; fmt: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{label}</span>
          <span className="text-[8px] text-gray-400/50 dark:text-gray-600 hidden sm:block">{sub}</span>
        </div>
        <span className={`shrink-0 font-mono text-[11px] font-bold ${color}`}>{fmt(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="h-[3px] w-full cursor-pointer appearance-none rounded-full bg-gray-200 dark:bg-zinc-700 accent-purple-500"
      />
    </div>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────
export function NeuralNetworkSim() {
  const [isOpen,  setIsOpen]  = useState(false);
  const [running, setRunning] = useState(false);
  const [runKey,  setRunKey]  = useState(0);
  const [flash,   setFlash]   = useState(false);
  const [def,     setDef]     = useState<LandscapeDef>(makeLandscape);
  const [params,  setParams]  = useState<Params>({ lr: 0.018, momentum: 0.88, noise: 0.04 });
  const [live,    setLive]    = useState({ x: 0, z: 0, loss: 0, dx: 0, dz: 0, active: false });

  const onMinima = useCallback(() => {
    setFlash(true);
    setTimeout(() => setFlash(false), 3200);
  }, []);

  const onStep = useCallback((x: number, z: number, loss: number, dx: number, dz: number) => {
    setLive({ x, z, loss, dx, dz, active: true });
  }, []);

  const toggleRun = () => {
    if (!running) setRunKey(k => k + 1);
    setRunning(r => !r);
  };

  const handleNew = () => {
    setRunning(false);
    setLive({ x: 0, z: 0, loss: 0, dx: 0, dz: 0, active: false });
    setFlash(false);
    setTimeout(() => {
      setDef(makeLandscape());
      setRunKey(k => k + 1);
    }, 80);
  };

  const set = (k: keyof Params) => (v: number) => setParams(p => ({ ...p, [k]: v }));

  // Formula display
  const vLine = `v = ${params.momentum.toFixed(2)}·v − ${params.lr.toFixed(3)}·(∇L + ε)`;
  const xLine = `θ = θ + v`;
  const stateLine = live.active
    ? `L(${live.x.toFixed(3)}, ${live.z.toFixed(3)}) = ${live.loss.toFixed(4)}   ∇L = (${live.dx.toFixed(3)}, ${live.dz.toFixed(3)})`
    : `L(θ) = ‖θ‖² − Σ gauss(θ, cₖ) + noise(θ)`;

  return (
    <div className="mb-4 w-full flex justify-start py-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-300"
        >
          <span className="text-sm sm:text-base underline underline-offset-8 decoration-gray-200 dark:decoration-zinc-800 group-hover:decoration-blue-500 transition-all">
            side feature: loss landscape
          </span>
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.985, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl overflow-hidden rounded-2xl border border-gray-100 bg-white/40 p-6 backdrop-blur-md dark:border-zinc-800/50 dark:bg-black/40"
        >
          {/* Header */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400 dark:text-gray-500">
                Loss Landscape
              </h3>
              <p className="mt-1 max-w-sm text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
                A ball descends via gradient descent with momentum. Tune the optimizer, press Run.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <AnimatePresence>
                {flash && (
                  <motion.span
                    key="flash"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] font-mono tracking-widest text-purple-400"
                  >
                    ✦ global minimum found
                  </motion.span>
                )}
              </AnimatePresence>

              <button
                onClick={toggleRun}
                className={`rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                  running
                    ? "bg-purple-100 text-purple-600 ring-1 ring-purple-300 dark:bg-purple-900/20 dark:text-purple-300 dark:ring-purple-700/40"
                    : "bg-gray-100 text-gray-600 hover:text-gray-900 dark:bg-zinc-800/50 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                {running ? "⏸ Pause" : "▶ Run"}
              </button>

              <button
                onClick={handleNew}
                className="rounded-full bg-gray-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 transition-all hover:text-gray-800 dark:bg-zinc-800/50 dark:hover:text-gray-200"
                title="Generate new landscape"
              >
                ↺ New landscape
              </button>

              <button
                onClick={() => { setIsOpen(false); setRunning(false); }}
                className="rounded-full bg-gray-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 transition-all hover:text-red-500 dark:bg-zinc-800/50"
              >
                ✕
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div
            className={`relative h-[340px] w-full cursor-grab overflow-hidden rounded-xl active:cursor-grabbing transition-all duration-700 ring-1 ${
              flash
                ? "ring-purple-400/40 shadow-[0_0_50px_rgba(192,132,252,0.18)]"
                : "ring-gray-100/60 dark:ring-zinc-800/40"
            }`}
          >
            <Canvas gl={{ alpha: true, antialias: true }}>
              <PerspectiveCamera makeDefault position={[11, 9, 11]} fov={36} />
              <OrbitControls enableZoom={false} autoRotate={!running} autoRotateSpeed={0.5} />
              <ambientLight intensity={0.45} />
              <directionalLight position={[8, 14, 8]} intensity={1.3} />
              <pointLight position={[-6, 8, -5]} intensity={1.5} color="#a855f7" />
              <pointLight position={[6, 3, 7]} intensity={0.5} color="#6366f1" />
              <LandscapeSurface def={def} />
              <DescentBall
                def={def} params={params} running={running}
                runKey={runKey} onMinima={onMinima} onStep={onStep}
              />
            </Canvas>

            <AnimatePresence>
              {!running && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                >
                  <p className="text-[9px] font-mono uppercase tracking-[0.28em] text-gray-400/45 dark:text-gray-600/55">
                    press ▶ run to begin descent
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="pointer-events-none absolute bottom-3 right-4 text-[8px] font-mono uppercase tracking-widest text-gray-300/40 dark:text-gray-600/50">
              drag to orbit
            </p>
          </div>

          {/* Controls row */}
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* Sliders */}
            <div className="space-y-5 rounded-xl border border-gray-100/50 bg-white/30 p-4 dark:border-zinc-800/30 dark:bg-black/20">
              <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Optimizer params
              </h4>

              <Slider
                label="Learning Rate" sub="step size"
                value={params.lr} min={0.002} max={0.055} step={0.001}
                color="text-blue-500" fmt={v => v.toFixed(3)}
                onChange={set("lr")}
              />
              <Slider
                label="Momentum" sub="inertia coefficient"
                value={params.momentum} min={0.0} max={0.98} step={0.01}
                color="text-indigo-400" fmt={v => v.toFixed(2)}
                onChange={set("momentum")}
              />
              <Slider
                label="Gradient Noise" sub="stochasticity ε"
                value={params.noise} min={0.0} max={0.18} step={0.005}
                color="text-purple-400" fmt={v => v.toFixed(3)}
                onChange={set("noise")}
              />

              <p className="text-[10px] leading-relaxed text-gray-400/70 dark:text-gray-500/60">
                High lr → overshoots. High momentum → fast but oscillates. Noise helps escape local minima.
              </p>
            </div>

            {/* Formula panel */}
            <div className="flex flex-col gap-3 rounded-xl border border-gray-100/50 bg-white/30 p-4 dark:border-zinc-800/30 dark:bg-black/20">
              <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Live formula
              </h4>

              <div className="rounded-lg bg-gray-50/70 px-3 py-2.5 dark:bg-zinc-900/50">
                <p className="mb-0.5 text-[8px] uppercase tracking-widest text-gray-400/60">velocity</p>
                <p className="font-mono text-[11px] text-indigo-500 dark:text-indigo-300">{vLine}</p>
              </div>

              <div className="rounded-lg bg-gray-50/70 px-3 py-2.5 dark:bg-zinc-900/50">
                <p className="mb-0.5 text-[8px] uppercase tracking-widest text-gray-400/60">position</p>
                <p className="font-mono text-[11px] text-blue-500 dark:text-blue-300">{xLine}</p>
              </div>

              <div className={`rounded-lg px-3 py-2.5 transition-colors duration-300 ${
                live.active && running
                  ? "bg-purple-50/80 ring-1 ring-purple-200/50 dark:bg-purple-900/10 dark:ring-purple-700/20"
                  : "bg-gray-50/70 dark:bg-zinc-900/50"
              }`}>
                <p className="mb-0.5 text-[8px] uppercase tracking-widest text-gray-400/60">
                  {live.active ? "current state" : "landscape definition"}
                </p>
                <p className="break-all font-mono text-[10px] leading-relaxed text-gray-600 dark:text-gray-300">
                  {stateLine}
                </p>
              </div>

              {/* Loss bar */}
              {live.active && (
                <div className="mt-auto space-y-1">
                  <div className="flex justify-between font-mono text-[8px] text-gray-400">
                    <span>loss</span>
                    <span>{live.loss.toFixed(4)}</span>
                  </div>
                  <div className="h-[3px] w-full overflow-hidden rounded-full bg-gray-200 dark:bg-zinc-700">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-purple-400 to-blue-400"
                      animate={{ width: `${Math.min(100, Math.max(2, (live.loss + 3) / 5 * 100))}%` }}
                      transition={{ duration: 0.12 }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}