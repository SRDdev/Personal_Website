"use client";
/* The existing article contains a few literal quote characters in prose examples. */
/* eslint-disable react/no-unescaped-entities */

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import BlogViewCount from "../../components/BlogViewCount";

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="my-6 overflow-x-auto rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm leading-7 text-gray-800 shadow-inner dark:border-zinc-800 dark:bg-zinc-950 dark:text-gray-200">
      <code>{children}</code>
    </pre>
  );
}

function InteractiveQuantizer() {
  const [fp32, setFp32] = useState<number>(20.0);
  const [scale, setScale] = useState<number>(0.1);

  // nearbyintf uses round-to-nearest, ties-to-even under CUDA's default mode.
  const roundToNearestEven = (value: number) => {
    const lower = Math.floor(value);
    const fraction = value - lower;
    if (fraction < 0.5) return lower;
    if (fraction > 0.5) return lower + 1;
    return lower % 2 === 0 ? lower : lower + 1;
  };

  const rawDivided = fp32 / scale;
  const rounded = roundToNearestEven(rawDivided);
  const clampedInt8 = Math.max(-128, Math.min(127, rounded));
  const dequantized = clampedInt8 * scale;
  const error = Math.abs(fp32 - dequantized);
  const isClamped = rounded > 127 || rounded < -128;
  const int8Bits = ((clampedInt8 + 256) % 256).toString(2).padStart(8, "0");
  const scaleLabel = scale < 0.01 ? scale.toFixed(6) : scale.toFixed(3);
  const inputPosition = Math.max(0, Math.min(100, ((fp32 + 30) / 60) * 100));
  const reconstructedPosition = Math.max(
    0,
    Math.min(100, ((dequantized + 30) / 60) * 100)
  );
  const errorBarWidth = Math.min(100, (error / 30) * 100);

  return (
    <section className="relative left-1/2 my-10 w-[min(92vw,1200px)] max-w-none -translate-x-1/2 overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-lg dark:border-blue-900/40 dark:bg-zinc-950">
      <div className="border-b border-gray-100 p-5 dark:border-zinc-800 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Live data path
            </p>
            <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
              Watch one value move through the kernel
            </h3>
            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Change the input or scale. Each block shows what that thread reads,
              computes, stores, and reconstructs.
            </p>
          </div>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300">
            FP32 → INT8 → FP32
          </span>
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[250px_minmax(0,1fr)]">
        {/* Controls */}
        <aside className="space-y-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="quantizer-fp32"
                className="text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                Input value (x)
              </label>
              <output
                htmlFor="quantizer-fp32"
                className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400"
              >
                {fp32.toFixed(2)}
              </output>
            </div>
            <input
              id="quantizer-fp32"
              type="range"
              min="-30"
              max="30"
              step="0.1"
              value={fp32}
              onChange={(e) => setFp32(parseFloat(e.target.value))}
              className="w-full cursor-pointer accent-blue-600"
            />
            <div className="mt-1 flex justify-between text-[11px] text-gray-400">
              <span>-30</span>
              <span>0</span>
              <span>+30</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFp32(0.4)}
                className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-300 hover:text-blue-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-gray-300 dark:hover:text-blue-300"
              >
                Example: 0.4
              </button>
              <button
                type="button"
                onClick={() => setFp32(20)}
                className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-300 hover:text-blue-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-gray-300 dark:hover:text-blue-300"
              >
                Outlier: 20.0
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-5 dark:border-zinc-800">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="quantizer-scale"
                className="text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                Quantization scale
              </label>
              <output
                htmlFor="quantizer-scale"
                className="font-mono text-sm font-bold text-purple-600 dark:text-purple-400"
              >
                {scaleLabel}
              </output>
            </div>
            <input
              id="quantizer-scale"
              type="range"
              min="0.001"
              max="0.5"
              step="0.000001"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full cursor-pointer accent-purple-600"
            />
            <div className="mt-1 flex justify-between text-[11px] text-gray-400">
              <span>0.001</span>
              <span>0.5</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setScale(1 / 127)}
                className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:border-purple-300 hover:text-purple-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-gray-300 dark:hover:text-purple-300"
              >
                Set to 1/127
              </button>
              <button
                type="button"
                onClick={() => setScale(0.1)}
                className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:border-purple-300 hover:text-purple-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-gray-300 dark:hover:text-purple-300"
              >
                Set to 0.1
              </button>
            </div>
          </div>

          <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
            This sandbox uses symmetric quantization, so the zero-point is 0.
            The scale is supplied to the kernel; it is not recalculated for
            each value.
          </p>
        </aside>

        {/* Visual data path */}
        <div className="min-w-0 space-y-4" aria-live="polite">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {/* FP32 input */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 dark:border-blue-900/60 dark:bg-blue-950/30">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700 dark:text-blue-300">
                01 · Load
              </p>
              <p className="mt-3 text-2xl font-black tabular-nums text-blue-700 dark:text-blue-300">
                {fp32.toFixed(2)}
              </p>
              <p className="text-xs font-semibold text-blue-800 dark:text-blue-200">
                FP32 input
              </p>
              <div className="mt-4 grid grid-cols-4 gap-1" aria-label="FP32 storage: four bytes">
                {[0, 1, 2, 3].map((byte) => (
                  <div
                    key={byte}
                    className="rounded-md border border-blue-200 bg-white/80 px-1 py-2 text-center dark:border-blue-800 dark:bg-blue-950/70"
                  >
                    <span className="block text-[9px] font-bold text-blue-700 dark:text-blue-300">
                      B{byte}
                    </span>
                    <span className="block text-[9px] text-blue-500 dark:text-blue-400">
                      8 bits
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] leading-4 text-blue-800/80 dark:text-blue-200/80">
                32 bits total · 4 bytes
              </p>
            </div>

            {/* Scale */}
            <div className="rounded-2xl border border-purple-200 bg-purple-50/70 p-4 dark:border-purple-900/60 dark:bg-purple-950/30">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-purple-700 dark:text-purple-300">
                02 · Scale
              </p>
              <p className="mt-3 text-2xl font-black tabular-nums text-purple-700 dark:text-purple-300">
                {rawDivided.toFixed(2)}
              </p>
              <p className="text-xs font-semibold text-purple-800 dark:text-purple-200">
                Integer-space value
              </p>
              <div className="mt-4 rounded-lg border border-purple-200 bg-white/80 p-2 text-center font-mono text-xs text-purple-800 dark:border-purple-800 dark:bg-purple-950/70 dark:text-purple-200">
                {fp32.toFixed(2)} ÷ {scaleLabel}
              </div>
              <p className="mt-3 text-[11px] leading-4 text-purple-800/80 dark:text-purple-200/80">
                One INT8 step represents {scaleLabel} in the original value space.
              </p>
            </div>

            {/* Round */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/60 dark:bg-amber-950/25">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
                03 · Round
              </p>
              <div className="mt-3 space-y-2">
                <div className="rounded-lg border border-amber-200 bg-white/80 p-2 dark:border-amber-800 dark:bg-amber-950/60">
                  <span className="block text-[10px] text-amber-700 dark:text-amber-300">
                    Before
                  </span>
                  <span className="font-mono text-lg font-bold tabular-nums text-amber-900 dark:text-amber-100">
                    {rawDivided.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-center text-xs font-bold text-amber-600 dark:text-amber-300">
                  ↓ nearest integer
                </div>
                <div className="rounded-lg border border-amber-300 bg-white p-2 dark:border-amber-700 dark:bg-amber-950/70">
                  <span className="block text-[10px] text-amber-700 dark:text-amber-300">
                    After
                  </span>
                  <span className="font-mono text-lg font-bold tabular-nums text-amber-900 dark:text-amber-100">
                    {rounded}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-[11px] leading-4 text-amber-800/80 dark:text-amber-200/80">
                Fractional information is discarded here.
              </p>
            </div>

            {/* INT8 byte */}
            <div
              className={`rounded-2xl border p-4 transition-colors duration-300 ${
                isClamped
                  ? "border-rose-300 bg-rose-50/80 dark:border-rose-900/70 dark:bg-rose-950/30"
                  : "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/60 dark:bg-emerald-950/25"
              }`}
            >
              <p
                className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                  isClamped
                    ? "text-rose-700 dark:text-rose-300"
                    : "text-emerald-700 dark:text-emerald-300"
                }`}
              >
                04 · Store
              </p>
              <p
                className={`mt-3 text-2xl font-black tabular-nums ${
                  isClamped
                    ? "text-rose-700 dark:text-rose-300"
                    : "text-emerald-700 dark:text-emerald-300"
                }`}
              >
                {clampedInt8}
              </p>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                Signed INT8 code
              </p>
              <div className="mt-4 grid grid-cols-8 gap-1" aria-label={`INT8 two's-complement bits: ${int8Bits}`}>
                {int8Bits.split("").map((bit, index) => (
                  <div
                    key={index}
                    className={`flex aspect-square items-center justify-center rounded text-[10px] font-bold ${
                      bit === "1"
                        ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900"
                        : "border border-gray-300 bg-white text-gray-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-400"
                    }`}
                  >
                    {bit}
                  </div>
                ))}
              </div>
              <p
                className={`mt-2 text-[10px] font-semibold ${
                  isClamped
                    ? "text-rose-700 dark:text-rose-300"
                    : "text-emerald-700 dark:text-emerald-300"
                }`}
              >
                {isClamped
                  ? rounded > 127
                    ? `Overflow: ${rounded} → 127`
                    : `Underflow: ${rounded} → -128`
                  : "Inside the INT8 range"}
              </p>
              <p className="mt-1 text-[10px] leading-4 text-gray-500 dark:text-gray-400">
                8-bit two’s-complement byte
              </p>
            </div>

            {/* Dequantized FP32 */}
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4 dark:border-cyan-900/60 dark:bg-cyan-950/30">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">
                05 · Rebuild
              </p>
              <p className="mt-3 text-2xl font-black tabular-nums text-cyan-700 dark:text-cyan-300">
                {dequantized.toFixed(4)}
              </p>
              <p className="text-xs font-semibold text-cyan-800 dark:text-cyan-200">
                Reconstructed FP32
              </p>
              <div className="mt-4 rounded-lg border border-cyan-200 bg-white/80 p-2 text-center font-mono text-xs text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-200">
                {clampedInt8} × {scaleLabel}
              </div>
              <div className="mt-3 grid grid-cols-4 gap-1" aria-label="Reconstructed FP32 storage: four bytes">
                {[0, 1, 2, 3].map((byte) => (
                  <div
                    key={byte}
                    className="rounded-md border border-cyan-200 bg-white/80 px-1 py-2 text-center dark:border-cyan-800 dark:bg-cyan-950/70"
                  >
                    <span className="block text-[9px] font-bold text-cyan-700 dark:text-cyan-300">
                      B{byte}
                    </span>
                    <span className="block text-[9px] text-cyan-500 dark:text-cyan-400">
                      8 bits
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compare the original and reconstructed values on one shared axis. */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                Did the value survive the round trip?
              </h4>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                Shared axis: -30 to +30
              </span>
            </div>
            {[
              {
                label: "Original FP32",
                value: fp32,
                position: inputPosition,
                marker: "bg-blue-600 ring-blue-200 dark:bg-blue-400 dark:ring-blue-950",
                text: "text-blue-700 dark:text-blue-300",
              },
              {
                label: "After dequantization",
                value: dequantized,
                position: reconstructedPosition,
                marker: "bg-cyan-600 ring-cyan-200 dark:bg-cyan-400 dark:ring-cyan-950",
                text: "text-cyan-700 dark:text-cyan-300",
              },
            ].map((item) => (
              <div key={item.label} className="mb-4 last:mb-0">
                <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                  <span className="font-medium text-gray-600 dark:text-gray-300">
                    {item.label}
                  </span>
                  <span className={`font-mono font-bold tabular-nums ${item.text}`}>
                    {item.value.toFixed(4)}
                  </span>
                </div>
                <div className="relative h-3 rounded-full bg-gradient-to-r from-rose-200 via-gray-200 to-emerald-200 dark:from-rose-950 dark:via-zinc-700 dark:to-emerald-950">
                  <span className="absolute left-1/2 top-0 h-3 w-px bg-gray-500/60" />
                  <span
                    className={`absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 transition-all duration-300 ${item.marker}`}
                    style={{ left: `${item.position}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-gray-400">
                  <span>-30</span>
                  <span>0</span>
                  <span>+30</span>
                </div>
              </div>
            ))}

            <div className="mt-5 border-t border-gray-200 pt-4 dark:border-zinc-800">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  Absolute reconstruction error
                </span>
                <span
                  className={`font-mono text-sm font-bold tabular-nums ${
                    isClamped
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-gray-800 dark:text-gray-100"
                  }`}
                >
                  {error.toFixed(4)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-zinc-800">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isClamped ? "bg-rose-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${errorBarWidth}%` }}
                />
              </div>
              <p className="mt-3 text-xs leading-5 text-gray-600 dark:text-gray-400">
                {isClamped
                  ? `Clipping changed the value: ${rounded} is outside the signed INT8 range, so the kernel stores ${clampedInt8}.`
                  : error > 1e-8
                    ? "No clipping occurred. The remaining difference comes from rounding to the nearest representable INT8 step."
                    : "This value is represented exactly at the selected scale; no reconstruction error is visible."}
              </p>
            </div>
          </div>

          <p className="text-[11px] leading-5 text-gray-500 dark:text-gray-400">
            The FP32 byte tiles show storage width, not the individual IEEE-754
            bit pattern. The INT8 tiles show the actual signed two’s-complement
            code produced by this calculation.
          </p>
        </div>
      </div>
    </section>
  );
}
function DistributionQuantizationVisual() {
  const [levels, setLevels] = useState(15);
  const samples = [-2.15, -1.82, -1.55, -1.22, -0.94, -0.68, -0.39, -0.12, 0.18, 0.43, 0.72, 1.02, 1.31, 1.62, 1.95, 2.28];
  const domainMin = -3;
  const domainMax = 3;
  const chartLeft = 42;
  const chartRight = 958;
  const baseline = 286;
  const curveHeight = 238;
  const binWidth = (domainMax - domainMin) / levels;
  const xToSvg = (value: number) => chartLeft + ((value - domainMin) / (domainMax - domainMin)) * (chartRight - chartLeft);
  const gaussian = (value: number) => Math.exp(-0.5 * value * value);
  const yToSvg = (value: number) => baseline - gaussian(value) * curveHeight;
  const quantize = (value: number) => {
    const clipped = Math.max(domainMin, Math.min(domainMax, value));
    const index = Math.min(levels - 1, Math.max(0, Math.floor((clipped - domainMin) / binWidth)));
    return domainMin + (index + 0.5) * binWidth;
  };
  const reconstructed = samples.map((value) => quantize(value));
  const errors = samples.map((value, index) => Math.abs(value - reconstructed[index]));
  const mae = errors.reduce((sum, value) => sum + value, 0) / errors.length;
  const mse = errors.reduce((sum, value) => sum + value * value, 0) / errors.length;
  const rmse = Math.sqrt(mse);
  const curvePath = Array.from({ length: 241 }, (_, index) => {
    const value = domainMin + (index / 240) * (domainMax - domainMin);
    return `${index === 0 ? "M" : "L"} ${xToSvg(value).toFixed(2)} ${yToSvg(value).toFixed(2)}`;
  }).join(" ");
  const fmt = (value: number) => (Math.abs(value) < 0.0005 ? "0.000" : value.toFixed(3));

  return (
    <section className="my-10 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-gray-100 p-5 dark:border-zinc-800 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-600 dark:text-fuchsia-400">Visual 02 · quantization levels</p>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">From a weight distribution to discrete values</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
              Change the number of uniform quantization bins. Each original weight is mapped to a bin, then reconstructed at that bin's representative value.
            </p>
          </div>
          <output className="rounded-full bg-fuchsia-100 px-3 py-1.5 font-mono text-sm font-bold text-fuchsia-700 dark:bg-fuchsia-950/50 dark:text-fuchsia-300">
            {levels} levels
          </output>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <label htmlFor="distribution-levels" className="text-sm font-semibold text-gray-700 dark:text-gray-200">Quantization levels</label>
          <input
            id="distribution-levels"
            aria-label="Number of quantization levels"
            className="min-w-[150px] flex-1 cursor-pointer accent-fuchsia-600"
            type="range"
            min="4"
            max="32"
            step="1"
            value={levels}
            onChange={(event) => setLevels(Number(event.target.value))}
          />
          <span className="min-w-16 text-right font-mono text-sm font-bold text-fuchsia-700 dark:text-fuchsia-300">{levels}</span>
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-gray-400"><span>4 · coarse</span><span>32 · fine</span></div>
      </div>

      <div className="p-3 sm:p-5">
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-zinc-950">
          <svg
            viewBox="0 0 1000 390"
            role="img"
            aria-label={`Gaussian weight distribution quantized into ${levels} uniform bins`}
            className="block h-auto w-full"
          >
            {Array.from({ length: 48 }, (_, index) => {
              const value = domainMin + ((index + 0.5) / 48) * 6;
              const barWidth = (chartRight - chartLeft) / 48;
              const height = gaussian(value) * curveHeight;

              return (
                <rect
                  key={`density-${index}`}
                  x={Number((xToSvg(value) - barWidth / 2 + 1).toFixed(4))}
                  y={Number((baseline - height).toFixed(4))}
                  width={Number((barWidth - 2).toFixed(4))}
                  height={Number(height.toFixed(4))}
                  fill="#e5e5e5"
                  opacity="0.9"
                />
              );
            })}

            <path
              d={curvePath}
              fill="none"
              stroke="#111827"
              strokeWidth="4"
            />

            <line
              x1={Number(chartLeft.toFixed(4))}
              y1={Number(baseline.toFixed(4))}
              x2={Number(chartRight.toFixed(4))}
              y2={Number(baseline.toFixed(4))}
              stroke="#111827"
              strokeWidth="2.5"
            />

            {Array.from({ length: levels }, (_, index) => {
              const start = domainMin + index * binWidth;
              const binWidthSvg = (chartRight - chartLeft) / levels - 2;

              return (
                <rect
                  key={`bin-${index}`}
                  x={Number((xToSvg(start) + 1).toFixed(4))}
                  y={Number((baseline + 20).toFixed(4))}
                  width={Number(binWidthSvg.toFixed(4))}
                  height="29"
                  fill="#f7d6e3"
                  stroke="#171717"
                  strokeWidth="1.6"
                />
              );
            })}

            {samples.map((value, index) => {
              const q = reconstructed[index];

              return (
                <line
                  key={`connector-${index}`}
                  x1={Number(xToSvg(value).toFixed(4))}
                  y1={Number((yToSvg(value) + 6).toFixed(4))}
                  x2={Number(xToSvg(q).toFixed(4))}
                  y2={Number((baseline + 34).toFixed(4))}
                  stroke="#555"
                  strokeWidth="1.2"
                  strokeDasharray="2 3"
                />
              );
            })}

            {samples.map((value, index) => (
              <circle
                key={`original-${index}`}
                cx={Number(xToSvg(value).toFixed(4))}
                cy={Number(yToSvg(value).toFixed(4))}
                r="8.5"
                fill="#9900f5"
              >
                <title>{`Original weight ${fmt(value)}`}</title>
              </circle>
            ))}

            {samples.map((value, index) => (
              <circle
                key={`quantized-${index}`}
                cx={Number(xToSvg(reconstructed[index]).toFixed(4))}
                cy={Number((baseline + 34).toFixed(4))}
                r="6.5"
                fill="#e31863"
              >
                <title>{`Dequantized reconstruction ${fmt(reconstructed[index])}`}</title>
              </circle>
            ))}

            <g fontFamily="Arial, sans-serif" fontSize="17" fill="#444">
              <text x="42" y="365" fontWeight="700" fill="#e31863">
                quantized / reconstructed values
              </text>
              <text x="42" y="22" fontSize="14" fill="#777">
                Illustrative Gaussian-shaped weight distribution
              </text>
              <text x="42" y="309" fontSize="12" fill="#777">
                −3
              </text>
              <text x="493" y="309" fontSize="12" fill="#777">
                0
              </text>
              <text x="940" y="309" fontSize="12" fill="#777">
                +3
              </text>
            </g>
          </svg>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-600 dark:text-gray-400">
          <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-fuchsia-600" /> Original weights</span>
          <span className="inline-flex items-center gap-2"><span className="h-3 w-3 border border-gray-900 bg-pink-200" /> Quantization bins</span>
          <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-pink-600" /> Quantized / dequantized values</span>
          <span className="inline-flex items-center gap-2"><span className="w-5 border-t border-dashed border-gray-500" /> Mapping</span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-gray-50 p-3 dark:bg-zinc-900"><p className="text-xs text-gray-500 dark:text-gray-400">Mean absolute reconstruction error</p><p className="mt-1 font-mono text-xl font-bold text-gray-900 dark:text-white">{mae.toFixed(4)}</p></div>
          <div className="rounded-xl bg-gray-50 p-3 dark:bg-zinc-900"><p className="text-xs text-gray-500 dark:text-gray-400">Root mean squared error</p><p className="mt-1 font-mono text-xl font-bold text-gray-900 dark:text-white">{rmse.toFixed(4)}</p></div>
          <div className="rounded-xl bg-gray-50 p-3 dark:bg-zinc-900"><p className="text-xs text-gray-500 dark:text-gray-400">Bin width / quantization step</p><p className="mt-1 font-mono text-xl font-bold text-gray-900 dark:text-white">{binWidth.toFixed(4)}</p></div>
        </div>

        <div className="mt-5 rounded-xl border border-gray-200 p-4 dark:border-zinc-800">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Dequantization and reconstruction</h4>
            <span className="text-xs text-gray-500">sample values · original → reconstructed</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {samples.slice(0, 8).map((value, index) => (
              <div key={`rebuild-${index}`} className="rounded-lg bg-gray-50 p-2 dark:bg-zinc-900">
                <p className="font-mono text-xs text-fuchsia-700 dark:text-fuchsia-300">{fmt(value)}</p>
                <p className="my-1 text-[10px] text-gray-400">↓</p>
                <p className="font-mono text-sm font-bold text-pink-600 dark:text-pink-400">{fmt(reconstructed[index])}</p>
                <p className="mt-1 text-[10px] text-gray-500">error {errors[index].toFixed(3)}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 text-xs leading-5 text-gray-500 dark:text-gray-400">
          This is a synthetic scalar-quantization demonstration over the fixed range [−3, 3]. The pink values are reconstructed at their bin centers. Lower reconstruction error indicates a closer numerical match, but this toy example does not measure a neural network's task accuracy.
        </p>
      </div>
    </section>
  );
}


function MemoryFootprintVisual() {
  const [parameters, setParameters] = useState(7);

  const formats = [
    ["FP32", 4, "bg-blue-500", "full precision"],
    ["FP16", 2, "bg-violet-500", "half precision"],
    ["INT8", 1, "bg-emerald-500", "code + scale"],
    ["INT4", 0.5, "bg-amber-500", "two packed values/byte"],
  ] as const;

  return (
    <section className="my-8 sm:my-10 w-full min-w-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900 sm:p-7">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-blue-600 dark:text-blue-400">
            Visual 01 · memory budget
          </p>

          <h3 className="mt-2 text-lg sm:text-xl font-bold leading-snug text-gray-900 dark:text-white">
            Same parameters, very different traffic
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
            Choose a model size and compare the storage-only footprint.
            Runtime activations, KV cache, metadata, and workspaces are not included.
          </p>
        </div>

        <output className="inline-flex w-fit shrink-0 items-center rounded-full bg-blue-100 px-3 py-1.5 font-mono text-xs sm:text-sm font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
          {parameters}B parameters
        </output>
      </div>

      {/* Slider */}
      <div className="mt-6 rounded-xl bg-white/70 p-3 sm:bg-transparent sm:p-0 dark:bg-zinc-950/40 sm:dark:bg-transparent">
        <input
          aria-label="Model parameter count in billions"
          className="block min-h-8 w-full cursor-pointer touch-pan-y accent-blue-600"
          type="range"
          min="1"
          max="70"
          step="1"
          value={parameters}
          onChange={(event) => setParameters(Number(event.target.value))}
        />

        <div className="mt-1 flex justify-between text-[11px] font-medium text-gray-400">
          <span>1B</span>
          <span>70B</span>
        </div>
      </div>

      {/* Memory comparison */}
      <div className="mt-6 sm:mt-8 space-y-5 sm:space-y-6">
        {formats.map(([name, bytes, color, note]) => {
          const memory = parameters * bytes;
          const percentage = (bytes / 4) * 100;

          return (
            <div
              key={name}
              className="min-w-0 space-y-2"
            >
              {/* Label and memory value */}
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="font-mono text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                      {name}
                    </span>

                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      {note}
                    </span>
                  </div>

                  <p className="mt-0.5 text-[11px] text-gray-400">
                    {bytes} {bytes === 1 ? "byte" : "bytes"} / value
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="font-mono text-base sm:text-lg font-bold tabular-nums text-gray-800 dark:text-gray-100">
                    {Number.isInteger(memory)
                      ? memory
                      : memory.toFixed(1)}{" "}
                    <span className="text-xs font-semibold text-gray-500">
                      GB
                    </span>
                  </p>
                </div>
              </div>

              {/* Responsive memory bar */}
              <div
                className="h-5 sm:h-7 w-full overflow-hidden rounded-full bg-gray-200/80 p-1 dark:bg-zinc-800"
                role="img"
                aria-label={`${name}: ${percentage}% of FP32 storage`}
              >
                <div
                  className={`${color} h-full min-w-1 rounded-full transition-all duration-300 ease-out`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 sm:mt-7 border-t border-gray-200 pt-4 dark:border-zinc-800">
        <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
          Quantization changes the storage contract. The GPU still needs
          metadata and conversion work, but fewer bytes travel through
          the memory hierarchy.
        </p>
      </div>
    </section>
  );
}



function MappingVisual() {
  const [mode, setMode] = useState<"symmetric" | "asymmetric">("symmetric");
  const values = [-7.6, -3.2, 0, 3.2, 10.8];
  const min = mode === "symmetric" ? -10.8 : -7.6;
  const max = 10.8;
  const scale = mode === "symmetric" ? max / 127 : (max - min) / 255;
  const zeroPoint = mode === "symmetric" ? 0 : Math.round(-128 - min / scale);
  const toCode = (value: number) => mode === "symmetric" ? Math.round(value / scale) : Math.max(-128, Math.min(127, Math.round(value / scale + zeroPoint)));
  const position = (value: number, lower: number, upper: number) => Math.max(0, Math.min(100, ((value - lower) / (upper - lower)) * 100)) + "%";
  return (
    <div className="my-8 rounded-3xl border border-gray-200 bg-gray-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/60 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Visual 03 · mapping choice</p><h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">Symmetric and asymmetric quantization</h3></div><div className="flex rounded-xl border border-gray-200 bg-white p-1 text-xs dark:border-zinc-700 dark:bg-zinc-950"><button className={"rounded-lg px-3 py-2 font-semibold " + (mode === "symmetric" ? "bg-emerald-600 text-white" : "text-gray-500")} onClick={() => setMode("symmetric")} type="button">Symmetric</button><button className={"rounded-lg px-3 py-2 font-semibold " + (mode === "asymmetric" ? "bg-emerald-600 text-white" : "text-gray-500")} onClick={() => setMode("asymmetric")} type="button">Asymmetric</button></div></div>
      <div className="mt-7 grid gap-7 lg:grid-cols-[1fr_240px]"><div className="space-y-7">
        <div><div className="mb-2 flex justify-between text-[11px] font-semibold text-gray-500"><span>float range · {min}</span><span>{max}</span></div><div className="relative h-8 rounded-full bg-gradient-to-r from-rose-300 via-gray-200 to-emerald-300 dark:from-rose-950 dark:via-zinc-700 dark:to-emerald-950">{values.map((value) => <span key={value} className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-gray-900 shadow dark:border-zinc-900 dark:bg-white" style={{ left: position(value, min, max) }} />)}</div><div className="mt-2 text-xs text-gray-500">Five real values share the line; zero is {mode === "symmetric" ? "at the center" : "shifted toward the lower side"}.</div></div>
        <div><div className="mb-2 flex justify-between text-[11px] font-semibold text-gray-500"><span>INT8 code · -128</span><span>127</span></div><div className="relative h-8 rounded-full bg-gradient-to-r from-indigo-400 via-slate-300 to-cyan-400 dark:from-indigo-950 dark:via-zinc-700 dark:to-cyan-950">{values.map((value) => <span key={value} className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-indigo-900 shadow dark:border-zinc-900 dark:bg-cyan-100" style={{ left: position(toCode(value), -128, 127) }} />)}</div><div className="mt-2 text-xs text-gray-500">The same points after the linear map.</div></div>
      </div><div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-950"><p className="font-bold text-gray-900 dark:text-white">Metadata with the byte</p><dl className="mt-4 space-y-3 text-xs"><div className="flex justify-between gap-4"><dt className="text-gray-500">scale</dt><dd className="font-mono font-bold">{scale.toFixed(4)}</dd></div><div className="flex justify-between gap-4"><dt className="text-gray-500">zero-point</dt><dd className="font-mono font-bold">{zeroPoint}</dd></div><div className="flex justify-between gap-4"><dt className="text-gray-500">real zero code</dt><dd className="font-mono font-bold">{toCode(0)}</dd></div></dl><p className="mt-5 leading-5 text-gray-500">Symmetric is simple for many kernels. Asymmetric uses code space more efficiently when the distribution is shifted.</p></div></div>
    </div>
  );
}






function ResultTable() {
  const rows = [
    ["256 × 2048", "FP32 → INT8", "0.011 ms", "49.066", "245.328"],
    ["256 × 2048", "INT8 → FP32", "0.012 ms", "44.775", "223.874"],
    ["2048 × 2048", "FP32 → INT8", "0.077 ms", "54.715", "273.577"],
    ["2048 × 2048", "INT8 → FP32", "0.075 ms", "55.785", "278.924"],
    ["256 × 2048", "Symmetric", "0.011 ms", "48.739", "243.693"],
    ["256 × 2048", "Asymmetric", "0.019 ms", "27.971", "139.853"],
  ];

  return (
    <div className="my-8 overflow-x-auto rounded-2xl border border-gray-200 shadow-sm dark:border-zinc-800">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 dark:bg-zinc-900 dark:text-gray-400">
          <tr>
            <th className="px-4 py-3">Tensor shape</th>
            <th className="px-4 py-3">Operation</th>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Gelem/s</th>
            <th className="px-4 py-3">Nominal GB/s</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
          {rows.map(([tensor, operation, time, throughput, bandwidth]) => (
            <tr key={`${tensor}-${operation}`} className="bg-white transition-colors hover:bg-gray-50 dark:bg-black dark:hover:bg-zinc-900/50">
              <td className="whitespace-nowrap px-4 py-3 font-medium">{tensor}</td>
              <td className="whitespace-nowrap px-4 py-3">{operation}</td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-blue-600 dark:text-blue-400">{time}</td>
              <td className="whitespace-nowrap px-4 py-3 font-mono">{throughput}</td>
              <td className="whitespace-nowrap px-4 py-3 font-mono">{bandwidth}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


// function ThreadExecutionVisual() {
//   const [blockIndex, setBlockIndex] = useState(0);
//   const [threadIndex, setThreadIndex] = useState(3);
//   const [count, setCount] = useState(100003);
//   const blockSize = 256;
//   const totalBlocks = Math.ceil(count / blockSize);
//   const safeBlockIndex = Math.min(blockIndex, totalBlocks - 1);
//   const globalIndex = safeBlockIndex * blockSize + threadIndex;
//   const valid = globalIndex < count;
//   const totalThreads = totalBlocks * blockSize;

//   return (
//     <section className="my-10 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
//       <div className="border-b border-gray-100 p-5 dark:border-zinc-800 sm:p-6">
//         <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">CUDA execution · one thread</p>
//         <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">Calculate the global thread index</h3>
//         <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
//           Select a block and thread to see which tensor element that CUDA thread owns and whether it is inside the input bounds.
//         </p>
//       </div>
//       <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[220px_minmax(0,1fr)]">
//         <div className="space-y-4 rounded-2xl bg-gray-50 p-4 dark:bg-zinc-900">
//           <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="thread-count">Tensor element count</label>
//           <input id="thread-count" type="number" min="1" max="1000000" value={count}
//             onChange={(e) => setCount(Math.max(1, Math.min(1000000, Number(e.target.value) || 1)))}
//             className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950" />
//           <div>
//             <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="block-index">Block index</label>
//             <input id="block-index" type="range" min="0" max={Math.max(0, totalBlocks - 1)} value={safeBlockIndex}
//               onChange={(e) => setBlockIndex(Number(e.target.value))} className="w-full accent-blue-600" />
//             <p className="font-mono text-xs text-gray-500">blockIdx.x = {safeBlockIndex}</p>
//           </div>
//           <div>
//             <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="thread-index">Thread index</label>
//             <input id="thread-index" type="range" min="0" max="255" value={threadIndex}
//               onChange={(e) => setThreadIndex(Number(e.target.value))} className="w-full accent-purple-600" />
//             <p className="font-mono text-xs text-gray-500">threadIdx.x = {threadIndex}</p>
//           </div>
//           <div className="border-t border-gray-200 pt-3 text-xs leading-5 text-gray-500 dark:border-zinc-700 dark:text-gray-400">
//             blockDim.x = 256<br />
//             gridDim.x = {totalBlocks}<br />
//             launched threads = {totalThreads.toLocaleString()}
//           </div>
//         </div>
//         <div className="space-y-4">
//           <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
//             <p className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">Global index</p>
//             <p className="mt-2 break-all font-mono text-lg font-bold text-gray-900 dark:text-white">
//               {safeBlockIndex} × 256 + {threadIndex} = {globalIndex.toLocaleString()}
//             </p>
//             <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
//               index = blockIdx.x × blockDim.x + threadIdx.x
//             </p>
//           </div>
//           <div className={`rounded-xl border p-4 ${valid ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/30" : "border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/30"}`}>
//             <p className={`text-xs font-bold uppercase tracking-wider ${valid ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}`}>
//               {valid ? "Bounds check passed" : "Bounds check failed"}
//             </p>
//             <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
//               {valid ? `input[${globalIndex}] is valid` : `index ${globalIndex} is outside count ${count}`}
//             </p>
//             <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
//               {valid ? "This thread may safely load and store its assigned element." : "This thread must skip the memory access."}
//             </p>
//           </div>
//           <div className="rounded-xl border border-gray-200 p-4 dark:border-zinc-800">
//             <p className="text-sm font-bold text-gray-900 dark:text-white">Kernel guard</p>
//             <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-950 p-3 text-xs leading-6 text-gray-100"><code>{`size_t index =
//     blockIdx.x * blockDim.x + threadIdx.x;

// if (index < count) {
//     // load, quantize, and store
// }`}</code></pre>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// function CoalescingVisual() {
//   const [count, setCount] = useState(100003);
//   const blockSize = 256;
//   const blocks = Math.ceil(count / blockSize);
//   const launched = blocks * blockSize;
//   const extra = launched - count;
//   const lanes = Array.from({ length: 8 }, (_, i) => i);

//   return (
//     <section className="my-10 overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-7">
//       <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">Memory access · coalescing and bounds</p>
//       <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">Neighboring threads, neighboring addresses</h3>
//       <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
//         In this element-wise kernel, adjacent threads access adjacent FP32 inputs and adjacent INT8 outputs. This is the access pattern we want the GPU memory system to handle efficiently.
//       </p>

//       <div className="mt-6 grid gap-5 lg:grid-cols-2">
//         <div className="rounded-2xl bg-blue-50 p-4 dark:bg-blue-950/25">
//           <p className="text-sm font-bold text-blue-900 dark:text-blue-200">FP32 input · 4 bytes per element</p>
//           <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-8">
//             {lanes.map((lane) => (
//               <div key={lane} className="rounded-lg border border-blue-200 bg-white p-2 text-center dark:border-blue-900 dark:bg-zinc-950">
//                 <p className="text-[10px] text-gray-500">T{lane}</p>
//                 <p className="mt-1 font-mono text-xs font-bold text-blue-700 dark:text-blue-300">x[{lane}]</p>
//                 <p className="mt-1 text-[9px] text-gray-400">4 B</p>
//               </div>
//             ))}
//           </div>
//           <p className="mt-3 text-xs text-blue-800 dark:text-blue-300">Addresses advance by 4 bytes per thread.</p>
//         </div>
//         <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/25">
//           <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">INT8 output · 1 byte per element</p>
//           <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-8">
//             {lanes.map((lane) => (
//               <div key={lane} className="rounded-lg border border-emerald-200 bg-white p-2 text-center dark:border-emerald-900 dark:bg-zinc-950">
//                 <p className="text-[10px] text-gray-500">T{lane}</p>
//                 <p className="mt-1 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">q[{lane}]</p>
//                 <p className="mt-1 text-[9px] text-gray-400">1 B</p>
//               </div>
//             ))}
//           </div>
//           <p className="mt-3 text-xs text-emerald-800 dark:text-emerald-300">Addresses advance by 1 byte per thread.</p>
//         </div>
//       </div>

//       <div className="mt-6 rounded-2xl border border-gray-200 p-4 dark:border-zinc-800">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <div>
//             <p className="text-sm font-bold text-gray-900 dark:text-white">Partial final block</p>
//             <p className="mt-1 text-xs text-gray-500">Change the tensor size to see the launch geometry.</p>
//           </div>
//           <input aria-label="Tensor size for bounds-check demonstration" type="number" min="1" max="1000000" value={count}
//             onChange={(e) => setCount(Math.max(1, Math.min(1000000, Number(e.target.value) || 1)))}
//             className="w-36 rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950" />
//         </div>
//         <div className="mt-4 grid gap-3 sm:grid-cols-3">
//           <div className="rounded-xl bg-gray-50 p-3 dark:bg-zinc-900"><p className="text-xs text-gray-500">Blocks launched</p><p className="mt-1 font-mono text-xl font-bold">{blocks.toLocaleString()}</p></div>
//           <div className="rounded-xl bg-gray-50 p-3 dark:bg-zinc-900"><p className="text-xs text-gray-500">Threads launched</p><p className="mt-1 font-mono text-xl font-bold">{launched.toLocaleString()}</p></div>
//           <div className="rounded-xl bg-gray-50 p-3 dark:bg-zinc-900"><p className="text-xs text-gray-500">Threads out of bounds</p><p className="mt-1 font-mono text-xl font-bold text-rose-600">{extra.toLocaleString()}</p></div>
//         </div>
//         <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-400">
//           For {count.toLocaleString()} elements with 256 threads per block, the launch uses {blocks} blocks. The final block may contain threads whose global index is greater than or equal to count; the bounds check prevents those threads from accessing memory.
//         </p>
//       </div>
//     </section>
//   );
// }


export default function QuantizationFundamentalsPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-12 text-gray-900 dark:bg-black dark:text-gray-100 sm:px-8 lg:px-12">
      <article className="mx-auto max-w-4xl">
        <div className="mb-10 flex items-center justify-between gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          <Link href="/" className="transition-colors hover:text-black dark:hover:text-white">
            ← Back to portfolio
          </Link>
          <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-zinc-900">CUDA · Quantized Kernels</span>
        </div>

        <header className="mb-12 border-b border-gray-200 pb-10 dark:border-zinc-800">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">GPU Kernel Engineering · Part 01</p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Why Using Fewer Bits Can Make AI{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Run Faster
            </span>
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-relaxed text-gray-600 dark:text-gray-400">
            Follow one FP32 value through a CUDA quantization kernel: load it, scale it, round it, clamp it, store an INT8 code, and reconstruct an approximation.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <span className="rounded-full border border-gray-200 px-3 py-1 dark:border-zinc-800">CUDA</span>
            <span className="rounded-full border border-gray-200 px-3 py-1 dark:border-zinc-800">FP32</span>
            <span className="rounded-full border border-gray-200 px-3 py-1 dark:border-zinc-800">INT8</span>
            <span className="rounded-full border border-gray-200 px-3 py-1 dark:border-zinc-800">Memory coalescing</span>
            <BlogViewCount path="/blog/quantization-fundamentals" />
          </div>
        </header>

        <figure className="my-12">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <Image src="/blog/quantization-fundamentals/Inference Acceleration.png" alt="FP32 values transformed into compact INT8 values by a CUDA quantization kernel" width={1600} height={900} className="h-auto w-full" priority />
          </div>
          <figcaption className="mt-3 text-center text-sm leading-6 text-gray-500">
            One element-wise conversion: four-byte FP32 input, one-byte INT8 code, and the metadata needed to reconstruct an approximation.
          </figcaption>
        </figure>

        <div className="space-y-10 text-lg leading-8 text-gray-700 dark:text-gray-300">
          <section>
            <p>
              Quantization is often introduced as a model-compression technique: replace floating-point values with smaller integers and reduce memory consumption. That is true, but it leaves out the part that matters to a CUDA kernel engineer.
            </p>
            <p className="mt-4">
              What happens between the moment a thread loads an FP32 value and the moment it stores an INT8 byte? Where do scale and zero-point enter the computation? How does rounding work? What happens when the result is outside the INT8 range? And how do we know the GPU implementation is correct?
            </p>
            <p className="mt-4">
              In this first installment, we will stay with element-wise quantization and dequantization. We will not implement GEMM, Tensor Core instructions, INT4 packing, GPTQ, or AWQ. The objective is to understand the data representation, the thread-level operations, memory access, validation, and a measured baseline.
            </p>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-6 shadow-sm dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">The experiment</p>
            <div className="mt-5 grid gap-6 sm:grid-cols-3">
              <div><p className="text-4xl font-black text-blue-600 dark:text-blue-400">4 → 1</p><p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">Bytes per value: FP32 to INT8</p></div>
              <div><p className="text-4xl font-black text-emerald-600 dark:text-emerald-400">1</p><p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">Element handled by each thread in the baseline kernel</p></div>
              <div><p className="text-4xl font-black text-purple-600 dark:text-purple-400">2</p><p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">Kernels: quantization and dequantization</p></div>
            </div>
          </section>

          <section>
            <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-900 dark:text-white">1. Why Quantization Matters: The GPU Memory Wall</h2>
            <p>
              A neural network stores weights, activations, and intermediate tensors. Those values must be moved through the GPU memory hierarchy before or during computation. When a workload moves a large amount of data but performs relatively little arithmetic per value, memory traffic can limit performance.
            </p>
            <p className="mt-4">
              Quantization reduces the number of bits used to represent each value. An FP32 element occupies four bytes; an INT8 element occupies one byte. For a tensor with the same number of elements, the raw data storage can therefore be reduced by a factor of four, excluding scales, zero-points, alignment, and other metadata.
            </p>
            <MemoryFootprintVisual />
            <p className="mt-4">
              Smaller storage can reduce memory traffic in later operations, but quantization itself also performs work: values must be converted, and metadata must be available. Whether an end-to-end workload becomes faster depends on how those costs interact with the surrounding kernels.
            </p>
          </section>

          <section>
            <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-900 dark:text-white">2. FP32 vs INT8: Understanding the Representation</h2>
            <p>
              FP32 uses a sign bit, an exponent, and a fraction. The exponent gives floating-point values a wide dynamic range, with spacing between representable values changing with magnitude.
            </p>
            <p className="mt-4">
              Signed INT8 is an 8-bit two's-complement integer with the range:
            </p>
            <CodeBlock>{`-128 <= q <= 127`}</CodeBlock>
            <p>
              INT8 codes are evenly spaced integers. An integer code alone does not identify the original real value. The quantization scale, and for asymmetric quantization the zero-point, define how the code maps back into the real-valued domain.
            </p>
            <CodeBlock>{`int8_t q = 10;

// Same integer code, different reconstructed values:
scale = 0.1   ->  real_value = 1.0
scale = 0.01  ->  real_value = 0.1
scale = 0.001 ->  real_value = 0.01`}</CodeBlock>
            <p>
              The stored byte is the code. Scale and zero-point are metadata used to interpret that code.
            </p>
          </section>

          <section>
            <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-900 dark:text-white">3. What One CUDA Thread Actually Does</h2>
            <p>
              In the baseline element-wise kernel, each CUDA thread is responsible for one tensor element. The thread computes its global index from the block index, block size, and thread index. It then checks that the index is valid before accessing memory.
            </p>
            <CodeBlock>{`size_t index =
    blockIdx.x * blockDim.x + threadIdx.x;

if (index < count) {
    float x = input[index];

    float transformed = x / scale + zero_point;
    int rounded = nearbyintf(transformed);
    int q = max(-128, min(127, rounded));

    output[index] = static_cast<int8_t>(q);
}`}</CodeBlock>
            <p>
              This is the essential data path: calculate the index, load the FP32 value, transform it into integer space, round, clamp, and store the INT8 code. The scale and zero-point are supplied to the kernel; this element-wise kernel does not derive them from the tensor.
            </p>
            {/* <ThreadExecutionVisual /> */}
          </section>

          <section>
            <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-900 dark:text-white">4. Quantization, Dequantization and Reconstruction</h2>
            <InteractiveQuantizer />
            <p>
              For affine quantization, the integer code is computed as:
            </p>
            <CodeBlock>{`q = clamp(round(x / scale) + zero_point,
          q_min, q_max)`}</CodeBlock>
            <p>
              Dequantization reconstructs an approximation of the original value:
            </p>
            <CodeBlock>{`x_hat = scale * (q - zero_point)`}</CodeBlock>
            <p>
              Consider a symmetric INT8 example with scale approximately 1/127. The original value 0.4 becomes an integer code of 51. Dequantizing that code gives approximately 0.4016. The difference is quantization error.
            </p>
            <p className="mt-4">
              If the rounded code falls outside the signed INT8 range, clamping saturates it to -128 or 127. This is different from ordinary rounding: the output is limited by the representable range, and reconstruction error can become much larger.
            </p>
            
            <p className="mt-4">
              The first interactive follows one value through the thread's arithmetic. The distribution view shows multiple illustrative weights being assigned to quantization bins and reconstructed. Its error metrics describe this synthetic sample; they are not measurements of neural-network task accuracy.
            </p>
            <DistributionQuantizationVisual />
          </section>

          <section>
            <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-900 dark:text-white">5. Symmetric vs Asymmetric Quantization</h2>
            <p>
              Symmetric quantization uses a zero-point of zero. A common signed INT8 scale choice is based on the largest absolute input magnitude:
            </p>
            <CodeBlock>{`// Symmetric
scale = max(abs(x)) / 127;
zero_point = 0;

q = clamp(round(x / scale), -128, 127);`}</CodeBlock>
            <p>
              Asymmetric quantization maps a chosen floating-point interval onto the integer code range. It uses both scale and zero-point:
            </p>
            <CodeBlock>{`// Asymmetric signed INT8 example
scale = (x_max - x_min) / 255;
zero_point = round(-128 - x_min / scale);

q = clamp(round(x / scale) + zero_point,
          -128, 127);`}</CodeBlock>
            <p>
              During dequantization, the zero-point is subtracted before multiplying by the scale. Symmetric mapping has simpler metadata and arithmetic. Asymmetric mapping can use the integer code range more effectively when the selected input range is shifted away from zero.
            </p>
            <MappingVisual />
            <p className="mt-4">
              The important CUDA connection is direct: the selected mapping determines which parameters the kernel reads and which arithmetic operations it performs for every element.
            </p>
          </section>

          <section>
            <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-900 dark:text-white">7. CPU Reference vs CUDA Kernel Validation</h2>
            <p>
              A kernel that completes without an error is not necessarily numerically correct. We validate the GPU output against a CPU reference that uses the same scale, zero-point, rounding rule, and clamping limits.
            </p>
            <p className="mt-4">
              There are two separate checks. First, compare the quantized integer codes. For deterministic test inputs and matching rounding semantics, the expected mismatch count is zero. Second, compare the dequantized values with the original FP32 inputs. These values are not expected to match exactly because quantization is lossy.
            </p>
            <div className="my-8 overflow-x-auto rounded-2xl border border-gray-200 dark:border-zinc-800">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 dark:bg-zinc-900"><tr><th className="px-4 py-3">Validation case</th><th className="px-4 py-3">What it checks</th></tr></thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                  <tr><td className="px-4 py-3 font-medium">Positive, negative, and zero values</td><td className="px-4 py-3">Basic mapping behavior</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Rounding boundaries</td><td className="px-4 py-3">CPU/GPU rounding agreement</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Out-of-range values</td><td className="px-4 py-3">INT8 saturation and clamping</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Non-multiple tensor sizes</td><td className="px-4 py-3">Final-block bounds checking</td></tr>
                  <tr><td className="px-4 py-3 font-medium">Dequantized output</td><td className="px-4 py-3">Maximum error and mean squared error</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              Integer-code equality validates the conversion implementation. Reconstruction metrics quantify the expected information loss. They answer different questions and should not be conflated.
            </p>
          </section>

          <section>
            <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-900 dark:text-white">8. Benchmarking on the RTX 3060</h2>
            <p>
              After correctness, we measure execution time with CUDA events. The benchmark results below are the measurements recorded for this project. They are specific to the tested GPU, launch configuration, compiler settings, and benchmark procedure; they are not universal performance guarantees.
            </p>
            <p className="mt-4">
              The table reports element throughput and nominal bandwidth. For these element-wise conversions, nominal bandwidth is calculated from the bytes read and written per element. It is a derived traffic rate, not a direct measurement of physical DRAM traffic.
            </p>
            <ResultTable />
            <p>
              The 2048 × 2048 results are around 55 Gelem/s for the recorded conversion runs. Small tensors are more sensitive to launch overhead and timing resolution. The symmetric and asymmetric rows also show that additional per-element arithmetic and the particular implementation can affect measured performance.
            </p>
            <p className="mt-4">
              When comparing kernels, keep the tensor size, warmup, repetition count, synchronization, and timing region consistent. Allocation and host-to-device transfer should be outside the timed region if the goal is to measure kernel execution alone.
            </p>
          </section>

          
          <section className="mt-12 rounded-2xl border border-blue-100 bg-blue-50/50 p-5 sm:p-8 dark:border-blue-900/30 dark:bg-blue-950/20">
            <h2 className="mt-0 text-xl font-bold text-blue-900 dark:text-blue-300">
              Summary
            </h2>

            <p className="mt-4 leading-7 text-blue-800 dark:text-blue-300">
              A basic quantization kernel is a sequence of explicit operations: calculate an index, load a float, apply scale and zero-point, round, clamp, and store an integer code. Dequantization reverses the mapping approximately. Correctness depends on matching the numerical rules, while performance depends on launch geometry and memory access as well as arithmetic.
            </p>

            <p className="mt-4 leading-7 text-blue-800 dark:text-blue-300">
              For further reading and a deeper understanding of quantization, including numerical representations, symmetric and asymmetric quantization, and practical applications in large language models, refer to these resources:{" "}
              <a
                href="https://ngrok.com/blog/quantization"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 underline underline-offset-4 dark:text-blue-400"
              >
                Quantization from the Ground Up by ngrok
              </a>
              {" "}and{" "}
              <a
                href="https://www.maartengrootendorst.com/blog/quantization/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 underline underline-offset-4 dark:text-blue-400"
              >
                A Visual Guide to Quantization by Maarten Grootendorst
              </a>.
            </p>

            {/* GitHub Repository */}
            <div className="mt-6 border-t border-blue-200 pt-5 dark:border-blue-900/50">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                Explore the implementation
              </p>

              <a
                href="https://github.com/SRDdev/gpu-performance-lab/tree/master/GPU-Quantized-Kernels"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex w-full min-w-0 items-center gap-3 rounded-xl border border-blue-200 bg-white p-4 text-sm font-semibold text-blue-700 transition-colors hover:border-blue-400 hover:bg-blue-50 dark:border-blue-900/60 dark:bg-zinc-950 dark:text-blue-400 dark:hover:bg-blue-950/40 sm:w-fit"
              >
                <svg
                  className="h-5 w-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 .1.76 2.3 3.75 1.61.1-.73.4-1.23.7-1.52-2.47-.28-5.06-1.24-5.06-5.5 0-1.22.44-2.21 1.16-2.99-.12-.28-.5-1.42.11-2.95 0 0 .95-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.1-1.43 3.05-1.14 3.05-1.14.61 1.53.23 2.67.11 2.95.72.78 1.16 1.77 1.16 2.99 0 4.27-2.6 5.22-5.08 5.5.4.35.76 1.02.76 2.06v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
                </svg>

                <span className="min-w-0 break-all">
                  View GPU Quantized Kernels on GitHub
                </span>

                <span className="ml-auto shrink-0">↗</span>
              </a>
            </div>
          </section>

          <p>All interactive elements in this article were developed with the assistance of AI to enhance the learning experience.</p>
        </div>
      </article>
    </main>
  );
}
