"use client";
/* The article includes literal quotes in prose and bit-level examples. */
/* eslint-disable react/no-unescaped-entities */

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import BlogViewCount from "../../components/BlogViewCount";

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="my-6 overflow-x-auto rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm leading-7 text-gray-800 shadow-inner dark:border-zinc-800 dark:bg-zinc-950 dark:text-gray-200">
      <code>{children}</code>
    </pre>
  );
}

function BytePackingLayoutVisual() {
  const [mode, setMode] = useState<"int4" | "int2">("int4");
  const [activeSlot, setActiveSlot] = useState<number>(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlot((prev) => (prev + 1) % (mode === "int4" ? 2 : 4));
    }, 1800);
    return () => window.clearInterval(timer);
  }, [mode]);

  const int4Slots = [
    {
      label: "High Nibble",
      sub: "Element 2i + 1",
      bits: [7, 6, 5, 4],
      shift: "<< 4",
      mask: "0xF0",
      color:
        "border-purple-300 bg-purple-50 text-purple-800 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-200",
      activeRing: "ring-2 ring-purple-500 shadow-md scale-[1.01]",
    },
    {
      label: "Low Nibble",
      sub: "Element 2i",
      bits: [3, 2, 1, 0],
      shift: "<< 0",
      mask: "0x0F",
      color:
        "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200",
      activeRing: "ring-2 ring-blue-500 shadow-md scale-[1.01]",
    },
  ];

  const int2Slots = [
    {
      label: "Bits 7–6",
      sub: "Elem 4i + 3",
      bits: [7, 6],
      shift: "<< 6",
      mask: "0xC0",
      color:
        "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-800 dark:border-fuchsia-800 dark:bg-fuchsia-950/40 dark:text-fuchsia-200",
      activeRing: "ring-2 ring-fuchsia-500 shadow-md scale-[1.02]",
    },
    {
      label: "Bits 5–4",
      sub: "Elem 4i + 2",
      bits: [5, 4],
      shift: "<< 4",
      mask: "0x30",
      color:
        "border-purple-300 bg-purple-50 text-purple-800 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-200",
      activeRing: "ring-2 ring-purple-500 shadow-md scale-[1.02]",
    },
    {
      label: "Bits 3–2",
      sub: "Elem 4i + 1",
      bits: [3, 2],
      shift: "<< 2",
      mask: "0x0C",
      color:
        "border-cyan-300 bg-cyan-50 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200",
      activeRing: "ring-2 ring-cyan-500 shadow-md scale-[1.02]",
    },
    {
      label: "Bits 1–0",
      sub: "Elem 4i",
      bits: [1, 0],
      shift: "<< 0",
      mask: "0x03",
      color:
        "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200",
      activeRing: "ring-2 ring-blue-500 shadow-md scale-[1.02]",
    },
  ];

  const slots = mode === "int4" ? int4Slots : int2Slots;
  const current = slots[activeSlot % slots.length];

  return (
    <div className="my-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            One byte in memory (uint8_t)
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Click a slice or watch the packer cycle through bit offsets
          </p>
        </div>
        <div className="flex rounded-xl border border-gray-200 bg-white p-1 text-xs dark:border-zinc-700 dark:bg-zinc-950">
          <button
            type="button"
            onClick={() => {
              setMode("int4");
              setActiveSlot(0);
            }}
            className={`rounded-lg px-3 py-1.5 font-semibold transition ${
              mode === "int4"
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            INT4 (2 / byte)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("int2");
              setActiveSlot(0);
            }}
            className={`rounded-lg px-3 py-1.5 font-semibold transition ${
              mode === "int2"
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            INT2 (4 / byte)
          </button>
        </div>
      </div>

      {/* Bit index header 7..0 */}
      <div className="mb-1.5 grid grid-cols-8 gap-1.5 text-center font-mono text-[11px] font-bold text-gray-400">
        {[7, 6, 5, 4, 3, 2, 1, 0].map((b) => (
          <span key={b}>bit {b}</span>
        ))}
      </div>

      {/* Byte slices */}
      <div
        className={`grid gap-2 ${
          mode === "int4" ? "grid-cols-2" : "grid-cols-4"
        }`}
      >
        {slots.map((slot, idx) => {
          const isActive = idx === activeSlot % slots.length;
          return (
            <button
              key={slot.label}
              type="button"
              onClick={() => setActiveSlot(idx)}
              className={`rounded-xl border p-3 text-left transition-all duration-300 ${
                slot.color
              } ${isActive ? slot.activeRing : "opacity-80 hover:opacity-100"}`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold">{slot.label}</span>
                <span className="rounded bg-white/70 px-1.5 py-0.5 font-mono text-[10px] font-bold dark:bg-black/30">
                  {slot.shift}
                </span>
              </div>
              <p className="mt-1 font-mono text-xs font-semibold">{slot.sub}</p>
              <div
                className={`mt-2 grid gap-1 ${
                  mode === "int4" ? "grid-cols-4" : "grid-cols-2"
                }`}
              >
                {slot.bits.map((bit, bIdx) => (
                  <span
                    key={bit}
                    className={`rounded border border-current/20 bg-white/60 py-1 text-center font-mono text-[11px] font-bold dark:bg-black/25 ${
                      bIdx === 0 ? "underline decoration-2" : ""
                    }`}
                    title={bIdx === 0 ? "Sign bit" : "Magnitude bit"}
                  >
                    {bIdx === 0 ? "S" : `b${bit}`}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs dark:border-zinc-800 dark:bg-zinc-950">
        <span className="font-mono text-gray-700 dark:text-gray-300">
          Active slice: <strong>{current.sub}</strong> → mask{" "}
          <code>{current.mask}</code>, shift <code>{current.shift}</code>
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          <code>S</code> marks the two&apos;s-complement sign bit
        </span>
      </div>
    </div>
  );
}

function SignTrapVisual() {
  const [signedVal, setSignedVal] = useState<number>(-1);
  const [step, setStep] = useState<number>(2);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 2000);
    return () => window.clearInterval(timer);
  }, []);

  const nibble = signedVal & 0x0f;
  const nibbleBits = nibble.toString(2).padStart(4, "0");
  const fullBits = `0000${nibbleBits}`;
  const badVal = nibble; // +8..+15 when negative

  const steps = [
    {
      title: "Step 1 · Packed byte in memory",
      desc: `Low nibble holds ${signedVal} (0b${nibbleBits}), high nibble holds unrelated neighbor bits.`,
    },
    {
      title: "Step 2 · Mask: uint8_t nibble = packed & 0x0F",
      desc: `ANDing with 0x0F clears bits 7..4 to 0 → 0b${fullBits} (${badVal}).`,
    },
    {
      title: "Step 3 · Buggy cast: static_cast<int8_t>(nibble)",
      desc:
        signedVal < 0
          ? `Bit 7 is 0, so int8_t reads +${badVal} instead of ${signedVal}!`
          : `Bit 7 is 0, so non-negative ${signedVal} happens to read +${badVal}.`,
    },
  ];

  return (
    <div className="my-6 rounded-2xl border border-rose-200 bg-rose-50/40 p-5 dark:border-rose-900/50 dark:bg-rose-950/15">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
            Interactive Bug Trace · Why -1 becomes +15
          </p>
          <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
            Pick a signed INT4 value and watch bits 7–4 during naive masking
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[-8, -1, 0, 7].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setSignedVal(preset);
                setStep(2);
              }}
              className={`rounded-lg border px-2.5 py-1 font-mono text-xs font-bold transition ${
                signedVal === preset
                  ? "border-rose-500 bg-rose-600 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-rose-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-gray-200"
              }`}
            >
              {preset >= 0 ? `+${preset}` : preset}
            </button>
          ))}
        </div>
      </div>

      {/* Step selector pills */}
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {steps.map((s, idx) => (
          <button
            key={s.title}
            type="button"
            onClick={() => setStep(idx)}
            className={`rounded-xl border px-3 py-2 text-left text-xs transition-all ${
              step === idx
                ? "border-rose-400 bg-white font-semibold text-gray-900 shadow-sm dark:border-rose-700 dark:bg-zinc-950 dark:text-white"
                : "border-transparent bg-white/50 text-gray-500 hover:bg-white/80 dark:bg-zinc-900/40 dark:text-gray-400"
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Animated 8-bit register */}
      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="grid grid-cols-8 gap-1.5">
          {fullBits.split("").map((bit, idx) => {
            const isUpper = idx < 4;
            const isBit7 = idx === 0;
            const isBit3 = idx === 4;
            const displayBit = step === 0 && isUpper ? "?" : bit;

            return (
              <div
                key={idx}
                className={`rounded-lg border p-2 text-center transition-all duration-300 ${
                  step >= 1 && isUpper
                    ? signedVal < 0
                      ? "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
                      : "border-gray-200 bg-gray-50 text-gray-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300"
                    : isBit3
                      ? "border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                      : "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-200"
                } ${step === 2 && isBit7 ? "ring-2 ring-rose-500" : ""}`}
              >
                <span className="block font-mono text-[10px] text-gray-400">
                  b{7 - idx}
                </span>
                <span className="mt-0.5 block font-mono text-base font-black">
                  {displayBit}
                </span>
                <span className="block text-[9px] font-semibold opacity-75">
                  {isBit7 ? "int8 sign" : isBit3 ? "int4 sign" : isUpper ? "zeroed" : "data"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <p className="text-gray-600 dark:text-gray-300">{steps[step].desc}</p>
          <span
            className={`rounded-full px-3 py-1 font-mono font-bold ${
              signedVal < 0
                ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
            }`}
          >
            Result: {badVal >= 0 ? `+${badVal}` : badVal}{" "}
            {signedVal < 0 ? `(expected ${signedVal})` : "(ok)"}
          </span>
        </div>
      </div>
    </div>
  );
}

function InteractiveNibblePacker() {
  const [val0, setVal0] = useState<number>(-1);
  const [val1, setVal1] = useState<number>(5);

  const lowNibble = val0 & 0x0f;
  const highNibble = val1 & 0x0f;
  const packedByte = lowNibble | (highNibble << 4);

  const toBits = (value: number, width: number) =>
    (value & ((1 << width) - 1)).toString(2).padStart(width, "0");

  const lowBits = toBits(lowNibble, 4);
  const highBits = toBits(highNibble, 4);
  const packedBits = toBits(packedByte, 8);

  // Buggy cast: treats 4-bit two's-complement nibble as unsigned int8_t
  const buggyVal0 = lowNibble;
  const buggyVal1 = highNibble;

  // Branchless sign extension: (int8_t)(nibble << 4) >> 4
  const shiftedLeft0 = ((lowNibble << 4) << 24) >> 24;
  const fixedVal0 = shiftedLeft0 >> 4;
  const shiftedLeft1 = ((highNibble << 4) << 24) >> 24;
  const fixedVal1 = shiftedLeft1 >> 4;

  return (
    <section className="relative left-1/2 my-10 w-[min(92vw,1200px)] max-w-none -translate-x-1/2 overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-lg dark:border-blue-900/40 dark:bg-zinc-950">
      <div className="border-b border-gray-100 p-5 dark:border-zinc-800 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Visual 01 · sub-byte packing
            </p>
            <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
              Pack two INT4 weights into one byte and sign-extend on unpack
            </h3>
            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Adjust both signed 4-bit integers in [-8, 7] to see how bit 3
              behaves during naive masking versus arithmetic shift sign
              extension.
            </p>
          </div>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 font-mono text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300">
            2 × INT4 → 1 × uint8_t
          </span>
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[270px_minmax(0,1fr)]">
        <aside className="space-y-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="int4-val0"
                className="text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                Low nibble (val0)
              </label>
              <output
                htmlFor="int4-val0"
                className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400"
              >
                {val0 >= 0 ? `+${val0}` : val0}
              </output>
            </div>
            <input
              id="int4-val0"
              type="range"
              min="-8"
              max="7"
              step="1"
              value={val0}
              onChange={(e) => setVal0(parseInt(e.target.value, 10))}
              className="w-full cursor-pointer accent-blue-600"
            />
            <div className="mt-1 flex justify-between text-[11px] text-gray-400">
              <span>-8</span>
              <span>0</span>
              <span>+7</span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-5 dark:border-zinc-800">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="int4-val1"
                className="text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                High nibble (val1)
              </label>
              <output
                htmlFor="int4-val1"
                className="font-mono text-sm font-bold text-purple-600 dark:text-purple-400"
              >
                {val1 >= 0 ? `+${val1}` : val1}
              </output>
            </div>
            <input
              id="int4-val1"
              type="range"
              min="-8"
              max="7"
              step="1"
              value={val1}
              onChange={(e) => setVal1(parseInt(e.target.value, 10))}
              className="w-full cursor-pointer accent-purple-600"
            />
            <div className="mt-1 flex justify-between text-[11px] text-gray-400">
              <span>-8</span>
              <span>0</span>
              <span>+7</span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 dark:border-zinc-800">
            <p className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
              Quick presets
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setVal0(-1);
                  setVal1(5);
                }}
                className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-300 hover:text-blue-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-gray-300 dark:hover:text-blue-300"
              >
                (-1, +5)
              </button>
              <button
                type="button"
                onClick={() => {
                  setVal0(-8);
                  setVal1(7);
                }}
                className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-300 hover:text-blue-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-gray-300 dark:hover:text-blue-300"
              >
                Extremes (-8, +7)
              </button>
              <button
                type="button"
                onClick={() => {
                  setVal0(-3);
                  setVal1(-6);
                }}
                className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-300 hover:text-blue-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-gray-300 dark:hover:text-blue-300"
              >
                Both negative
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-5" aria-live="polite">
          {/* Packed byte layout */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                Packed byte in memory (uint8_t)
              </p>
              <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                0x{packedByte.toString(16).toUpperCase().padStart(2, "0")} ·{" "}
                {packedByte}
              </span>
            </div>

            <div className="grid grid-cols-8 gap-1.5">
              {packedBits.split("").map((bit, idx) => {
                const isHigh = idx < 4;
                const isSignBit = idx === 0 || idx === 4;
                return (
                  <div
                    key={idx}
                    className={`rounded-xl border p-2 text-center ${
                      isHigh
                        ? "border-purple-300 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/40"
                        : "border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/40"
                    }`}
                  >
                    <span className="block text-[10px] text-gray-500 dark:text-gray-400">
                      b{7 - idx}
                    </span>
                    <span
                      className={`mt-1 block font-mono text-base font-black ${
                        isHigh
                          ? "text-purple-700 dark:text-purple-300"
                          : "text-blue-700 dark:text-blue-300"
                      }`}
                    >
                      {bit}
                    </span>
                    <span className="mt-0.5 block text-[9px] font-semibold text-gray-500 dark:text-gray-400">
                      {isSignBit ? "sign" : isHigh ? "hi" : "lo"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-purple-100/70 px-3 py-2 font-mono text-purple-900 dark:bg-purple-950/40 dark:text-purple-200">
                High nibble: 0b{highBits} (target: {val1})
              </div>
              <div className="rounded-lg bg-blue-100/70 px-3 py-2 font-mono text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                Low nibble: 0b{lowBits} (target: {val0})
              </div>
            </div>
          </div>

          {/* Buggy vs Fixed comparison */}
          <div className="grid gap-4 md:grid-cols-2">
            <div
              className={`rounded-2xl border p-4 ${
                val0 < 0 || val1 < 0
                  ? "border-rose-300 bg-rose-50/70 dark:border-rose-900/60 dark:bg-rose-950/25"
                  : "border-gray-200 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900/50"
              }`}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-rose-700 dark:text-rose-300">
                Naive mask & cast (buggy)
              </p>
              <p className="mt-2 font-mono text-xs text-gray-600 dark:text-gray-400">
                static_cast&lt;int8_t&gt;(packed &amp; 0x0F)
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
                  <p className="text-[11px] text-gray-500">val0 decoded</p>
                  <p
                    className={`mt-1 font-mono text-2xl font-black ${
                      buggyVal0 !== val0
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {buggyVal0 >= 0 ? `+${buggyVal0}` : buggyVal0}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-gray-500">
                    0b{toBits(buggyVal0, 8)}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
                  <p className="text-[11px] text-gray-500">val1 decoded</p>
                  <p
                    className={`mt-1 font-mono text-2xl font-black ${
                      buggyVal1 !== val1
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {buggyVal1 >= 0 ? `+${buggyVal1}` : buggyVal1}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-gray-500">
                    0b{toBits(buggyVal1, 8)}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-gray-600 dark:text-gray-400">
                {val0 < 0 || val1 < 0
                  ? "Upper 4 bits stay 0, so negative weights silently turn into [8, 15]."
                  : "Non-negative values happen to match because bit 3 is 0."}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-300 bg-emerald-50/70 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/25">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
                Branchless sign extension (fixed)
              </p>
              <p className="mt-2 font-mono text-xs text-gray-600 dark:text-gray-400">
                static_cast&lt;int8_t&gt;(nibble &lt;&lt; 4) &gt;&gt; 4
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-emerald-200 bg-white p-3 dark:border-emerald-900/60 dark:bg-zinc-950">
                  <p className="text-[11px] text-gray-500">val0 decoded</p>
                  <p className="mt-1 font-mono text-2xl font-black text-emerald-700 dark:text-emerald-300">
                    {fixedVal0 >= 0 ? `+${fixedVal0}` : fixedVal0}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-gray-500">
                    &lt;&lt;4: {toBits(shiftedLeft0, 8)}
                  </p>
                  <p className="font-mono text-[11px] text-emerald-700 dark:text-emerald-300">
                    &gt;&gt;4: {toBits(fixedVal0, 8)}
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-white p-3 dark:border-emerald-900/60 dark:bg-zinc-950">
                  <p className="text-[11px] text-gray-500">val1 decoded</p>
                  <p className="mt-1 font-mono text-2xl font-black text-emerald-700 dark:text-emerald-300">
                    {fixedVal1 >= 0 ? `+${fixedVal1}` : fixedVal1}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-gray-500">
                    &lt;&lt;4: {toBits(shiftedLeft1, 8)}
                  </p>
                  <p className="font-mono text-[11px] text-emerald-700 dark:text-emerald-300">
                    &gt;&gt;4: {toBits(fixedVal1, 8)}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-gray-600 dark:text-gray-400">
                Shifting left by 4 moves bit 3 into the int8_t sign bit;
                arithmetic right shift copies it back across bits 4..7.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Dp4aAccumulatorVisual() {
  const [aVals, setAVals] = useState<[number, number, number, number]>([
    -128, -128, 64, -32,
  ]);
  const [bVals, setBVals] = useState<[number, number, number, number]>([
    -128, -128, 40, 16,
  ]);
  const [scaleA, setScaleA] = useState<number>(0.02);
  const [scaleB, setScaleB] = useState<number>(0.05);

  const products = aVals.map((a, i) => a * bVals[i]);
  const int32Acc = products.reduce((sum, p) => sum + p, 0);
  const floatResult = int32Acc * (scaleA * scaleB);

  const overflowsInt8 = products.some((p) => p < -128 || p > 127);
  const overflowsInt16 = int32Acc < -32768 || int32Acc > 32767;

  const updateA = (idx: number, value: number) => {
    const next = [...aVals] as [number, number, number, number];
    next[idx] = value;
    setAVals(next);
  };

  const updateB = (idx: number, value: number) => {
    const next = [...bVals] as [number, number, number, number];
    next[idx] = value;
    setBVals(next);
  };

  return (
    <section className="my-10 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-gray-100 p-5 dark:border-zinc-800 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">
              Visual 02 · __dp4a &amp; widened accumulation
            </p>
            <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
              Four INT8 multiplies in one instruction, accumulated in INT32
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
              Edit the four packed INT8 lanes inside a single 32-bit register.
              Watch why INT8 and INT16 overflow while INT32 accumulates safely,
              and why scales are factored out until the end.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setAVals([-128, -128, 64, -32]);
                setBVals([-128, -128, 40, 16]);
              }}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-purple-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-200"
            >
              Worst-case (-128 × -128)
            </button>
            <button
              type="button"
              onClick={() => {
                setAVals([12, -25, 48, -9]);
                setBVals([10, 15, -6, -20]);
              }}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-purple-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-200"
            >
              Typical weights
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((lane) => (
            <div
              key={lane}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60"
            >
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Lane {lane}
              </p>
              <div className="mt-3 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor={`dp4a-a-${lane}`}
                    className="font-mono text-xs text-blue-700 dark:text-blue-300"
                  >
                    a[{lane}]
                  </label>
                  <input
                    id={`dp4a-a-${lane}`}
                    type="number"
                    min={-128}
                    max={127}
                    value={aVals[lane]}
                    onChange={(e) =>
                      updateA(
                        lane,
                        Math.max(
                          -128,
                          Math.min(127, parseInt(e.target.value, 10) || 0)
                        )
                      )
                    }
                    className="w-20 rounded-lg border border-gray-300 bg-white px-2 py-1 text-right font-mono text-sm font-bold dark:border-zinc-700 dark:bg-zinc-950"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor={`dp4a-b-${lane}`}
                    className="font-mono text-xs text-purple-700 dark:text-purple-300"
                  >
                    b[{lane}]
                  </label>
                  <input
                    id={`dp4a-b-${lane}`}
                    type="number"
                    min={-128}
                    max={127}
                    value={bVals[lane]}
                    onChange={(e) =>
                      updateB(
                        lane,
                        Math.max(
                          -128,
                          Math.min(127, parseInt(e.target.value, 10) || 0)
                        )
                      )
                    }
                    className="w-20 rounded-lg border border-gray-300 bg-white px-2 py-1 text-right font-mono text-sm font-bold dark:border-zinc-700 dark:bg-zinc-950"
                  />
                </div>
              </div>
              <div className="mt-3 border-t border-gray-200 pt-2.5 dark:border-zinc-800">
                <p className="text-[11px] text-gray-500">Product</p>
                <p className="font-mono text-base font-black text-gray-900 dark:text-white">
                  {products[lane].toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div
            className={`rounded-2xl border p-4 ${
              overflowsInt8
                ? "border-rose-300 bg-rose-50/70 dark:border-rose-900/60 dark:bg-rose-950/25"
                : "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/50 dark:bg-emerald-950/20"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              int8_t range [-128, 127]
            </p>
            <p
              className={`mt-2 text-lg font-black ${
                overflowsInt8
                  ? "text-rose-700 dark:text-rose-300"
                  : "text-emerald-700 dark:text-emerald-300"
              }`}
            >
              {overflowsInt8 ? "Overflow on product" : "Fits in int8_t"}
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              A single INT8 × INT8 product can reach +16,384.
            </p>
          </div>

          <div
            className={`rounded-2xl border p-4 ${
              overflowsInt16
                ? "border-rose-300 bg-rose-50/70 dark:border-rose-900/60 dark:bg-rose-950/25"
                : "border-amber-200 bg-amber-50/60 dark:border-amber-900/50 dark:bg-amber-950/20"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              int16_t range [-32,768, 32,767]
            </p>
            <p
              className={`mt-2 text-lg font-black ${
                overflowsInt16
                  ? "text-rose-700 dark:text-rose-300"
                  : "text-amber-700 dark:text-amber-300"
              }`}
            >
              {overflowsInt16 ? "Overflow on sum" : "Fits in int16_t (for 4 lanes)"}
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Just two (-128 × -128) terms sum to 32,768 and overflow int16_t.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-300 bg-emerald-50/70 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/25">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              int32_t accumulator
            </p>
            <p className="mt-2 font-mono text-2xl font-black text-emerald-700 dark:text-emerald-300">
              {int32Acc.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Safe for &gt;131,000 worst-case products before overflow.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <label className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200">
              s_a
              <input
                type="number"
                step="0.01"
                value={scaleA}
                onChange={(e) => setScaleA(parseFloat(e.target.value) || 0)}
                className="w-20 rounded-lg border border-gray-300 bg-white px-2 py-1 font-mono dark:border-zinc-700 dark:bg-zinc-950"
              />
            </label>
            <label className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200">
              s_b
              <input
                type="number"
                step="0.01"
                value={scaleB}
                onChange={(e) => setScaleB(parseFloat(e.target.value) || 0)}
                className="w-20 rounded-lg border border-gray-300 bg-white px-2 py-1 font-mono dark:border-zinc-700 dark:bg-zinc-950"
              />
            </label>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">
              Final dequantized dot product: (s_a × s_b) × acc
            </p>
            <p className="font-mono text-lg font-black text-gray-900 dark:text-white">
              ({scaleA} × {scaleB}) × {int32Acc.toLocaleString()} ={" "}
              <span className="text-blue-600 dark:text-blue-400">
                {floatResult.toFixed(4)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function GroupWiseScalingVisual() {
  const [outlier, setOutlier] = useState<number>(3.5);
  const baseWeights = [0.12, -0.18, 0.09, -0.14, 0.15, -0.08, 0.11, -0.19];

  // Group 0 contains the first 4 weights (normal), Group 1 contains the last 4 (with one outlier)
  const weights = baseWeights.map((w, i) => (i === 7 ? -outlier : w));

  const perRowScale = Math.max(...weights.map(Math.abs)) / 7;
  const group0Scale = Math.max(...weights.slice(0, 4).map(Math.abs)) / 7;
  const group1Scale = Math.max(...weights.slice(4, 8).map(Math.abs)) / 7;

  const quantizeInt4 = (w: number, scale: number) => {
    const q = Math.round(w / scale);
    return Math.max(-8, Math.min(7, q));
  };

  return (
    <section className="my-10 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-gray-100 p-5 dark:border-zinc-800 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              Visual 03 · group-wise scaling at 4 bits
            </p>
            <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
              Why one outlier crushes a 4-bit row and how groups fix it
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
              INT4 has only 16 codes ([-8, 7]). Increase the outlier in Group 1
              and compare the quantized codes in Group 0 under per-row vs
              group-wise scaling.
            </p>
          </div>
          <output className="rounded-full bg-emerald-100 px-3 py-1.5 font-mono text-sm font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            Outlier: -{outlier.toFixed(1)}
          </output>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <label
            htmlFor="outlier-slider"
            className="text-sm font-semibold text-gray-700 dark:text-gray-200"
          >
            Outlier magnitude
          </label>
          <input
            id="outlier-slider"
            type="range"
            min="0.2"
            max="5.0"
            step="0.1"
            value={outlier}
            onChange={(e) => setOutlier(parseFloat(e.target.value))}
            className="min-w-[160px] flex-1 cursor-pointer accent-emerald-600"
          />
          <span className="font-mono text-xs text-gray-500">0.2 → 5.0</span>
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-2">
        {/* Per-row scaling */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 dark:border-rose-900/50 dark:bg-rose-950/15">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-rose-900 dark:text-rose-200">
              Per-row scaling (1 shared scale)
            </p>
            <span className="font-mono text-xs text-rose-700 dark:text-rose-300">
              scale = {perRowScale.toFixed(3)}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {weights.map((w, i) => {
              const q = quantizeInt4(w, perRowScale);
              const crushed = i < 7 && q === 0;
              return (
                <div
                  key={i}
                  className={`rounded-xl border p-2.5 text-center ${
                    i === 7
                      ? "border-rose-300 bg-white dark:border-rose-800 dark:bg-zinc-950"
                      : crushed
                        ? "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
                        : "border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
                  }`}
                >
                  <p className="text-[10px] text-gray-400">w[{i}]</p>
                  <p className="font-mono text-xs text-gray-700 dark:text-gray-300">
                    {w.toFixed(2)}
                  </p>
                  <p
                    className={`mt-1 font-mono text-base font-black ${
                      crushed
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    q={q}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs leading-5 text-gray-600 dark:text-gray-400">
            Because the single scale stretches to fit -{outlier.toFixed(1)},
            small weights collapse to 0 or ±1.
          </p>
        </div>

        {/* Group-wise scaling */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/15">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
              Group-wise scaling (2 groups)
            </p>
            <span className="font-mono text-xs text-emerald-700 dark:text-emerald-300">
              s0={group0Scale.toFixed(3)} · s1={group1Scale.toFixed(3)}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {weights.map((w, i) => {
              const s = i < 4 ? group0Scale : group1Scale;
              const q = quantizeInt4(w, s);
              return (
                <div
                  key={i}
                  className={`rounded-xl border p-2.5 text-center ${
                    i < 4
                      ? "border-emerald-300 bg-white dark:border-emerald-800 dark:bg-zinc-950"
                      : "border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
                  }`}
                >
                  <p className="text-[10px] text-gray-400">
                    G{i < 4 ? 0 : 1} · w[{i}]
                  </p>
                  <p className="font-mono text-xs text-gray-700 dark:text-gray-300">
                    {w.toFixed(2)}
                  </p>
                  <p className="mt-1 font-mono text-base font-black text-emerald-700 dark:text-emerald-300">
                    q={q}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs leading-5 text-gray-600 dark:text-gray-400">
            Group 0 keeps its own tight scale ({group0Scale.toFixed(3)}),
            preserving full 4-bit resolution across [-8, 7] even when Group 1
            has a large outlier.
          </p>
        </div>
      </div>
    </section>
  );
}

function GemvTrafficVisual() {
  const [shapeIdx, setShapeIdx] = useState<number>(1);

  const shapes = [
    {
      label: "4096 × 4096",
      variants: [
        {
          name: "1. Baseline FP32 GEMV",
          dramBytes: 4.0,
          latency: "0.2089 ms",
          bw: "321.36 GB/s",
          speedup: "1.00×",
          barPct: (4.0 / 8.5) * 100,
          color: "bg-blue-500",
          note: "Streams 4 B/weight cleanly",
        },
        {
          name: "2. Two-Pass Unfused Dequant",
          dramBytes: 8.5,
          latency: "0.5766 ms",
          bw: "247.31 GB/s",
          speedup: "0.36×",
          barPct: 100,
          color: "bg-rose-500",
          note: "Reads 0.5B + writes 4B + reads 4B",
        },
        {
          name: "3. Scalar Byte-by-Byte",
          dramBytes: 0.5,
          latency: "0.2987 ms",
          bw: "28.20 GB/s",
          speedup: "0.70×",
          barPct: (0.5 / 8.5) * 100,
          color: "bg-amber-500",
          note: "1-byte loads + integer division stall",
        },
        {
          name: "4. Fused Vectorized uint4",
          dramBytes: 0.5,
          latency: "0.0861 ms",
          bw: "97.79 GB/s",
          speedup: "2.43×",
          barPct: (0.5 / 8.5) * 100,
          color: "bg-emerald-500",
          note: "128-bit uint4 + float4 + bit-shift",
        },
      ],
    },
    {
      label: "4096 × 11008",
      variants: [
        {
          name: "1. Baseline FP32 GEMV",
          dramBytes: 4.0,
          latency: "0.5504 ms",
          bw: "327.78 GB/s",
          speedup: "1.00×",
          barPct: (4.0 / 8.5) * 100,
          color: "bg-blue-500",
          note: "Streams 4 B/weight cleanly",
        },
        {
          name: "2. Two-Pass Unfused Dequant",
          dramBytes: 8.5,
          latency: "1.3366 ms",
          bw: "286.73 GB/s",
          speedup: "0.41×",
          barPct: 100,
          color: "bg-rose-500",
          note: "Reads 0.5B + writes 4B + reads 4B",
        },
        {
          name: "3. Scalar Byte-by-Byte",
          dramBytes: 0.5,
          latency: "0.6892 ms",
          bw: "32.80 GB/s",
          speedup: "0.80×",
          barPct: (0.5 / 8.5) * 100,
          color: "bg-amber-500",
          note: "1-byte loads + integer division stall",
        },
        {
          name: "4. Fused Vectorized uint4",
          dramBytes: 0.5,
          latency: "0.2086 ms",
          bw: "108.38 GB/s",
          speedup: "2.64×",
          barPct: (0.5 / 8.5) * 100,
          color: "bg-emerald-500",
          note: "128-bit uint4 + float4 + bit-shift",
        },
      ],
    },
    {
      label: "8192 × 4096",
      variants: [
        {
          name: "1. Baseline FP32 GEMV",
          dramBytes: 4.0,
          latency: "0.4152 ms",
          bw: "323.39 GB/s",
          speedup: "1.00×",
          barPct: (4.0 / 8.5) * 100,
          color: "bg-blue-500",
          note: "Streams 4 B/weight cleanly",
        },
        {
          name: "2. Two-Pass Unfused Dequant",
          dramBytes: 8.5,
          latency: "1.0057 ms",
          bw: "283.60 GB/s",
          speedup: "0.41×",
          barPct: 100,
          color: "bg-rose-500",
          note: "Reads 0.5B + writes 4B + reads 4B",
        },
        {
          name: "3. Scalar Byte-by-Byte",
          dramBytes: 0.5,
          latency: "0.5182 ms",
          bw: "32.47 GB/s",
          speedup: "0.80×",
          barPct: (0.5 / 8.5) * 100,
          color: "bg-amber-500",
          note: "1-byte loads + integer division stall",
        },
        {
          name: "4. Fused Vectorized uint4",
          dramBytes: 0.5,
          latency: "0.1589 ms",
          bw: "105.88 GB/s",
          speedup: "2.61×",
          barPct: (0.5 / 8.5) * 100,
          color: "bg-emerald-500",
          note: "128-bit uint4 + float4 + bit-shift",
        },
      ],
    },
  ];

  const active = shapes[shapeIdx];

  return (
    <section className="my-10 overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
            Visual 04 · DRAM traffic vs wall-clock speedup
          </p>
          <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
            Compare DRAM bytes per weight and RTX 3060 latency
          </h3>
        </div>
        <div className="flex flex-wrap rounded-xl border border-gray-200 bg-white p-1 text-xs dark:border-zinc-700 dark:bg-zinc-950">
          {shapes.map((s, idx) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setShapeIdx(idx)}
              className={`rounded-lg px-3 py-1.5 font-mono font-semibold transition ${
                shapeIdx === idx
                  ? "bg-cyan-600 text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {active.variants.map((v) => (
          <div key={v.name} className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {v.name}
                </span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  {v.note}
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-gray-500">{v.dramBytes} B/w</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {v.latency}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 font-bold ${
                    v.speedup.startsWith("2.")
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : v.speedup.startsWith("0.")
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                  }`}
                >
                  {v.speedup}
                </span>
              </div>
            </div>

            <div className="h-5 w-full overflow-hidden rounded-full bg-gray-200/80 p-1 dark:bg-zinc-800">
              <div
                className={`${v.color} h-full min-w-2 rounded-full transition-all duration-300`}
                style={{ width: `${v.barPct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs leading-5 text-gray-500 dark:text-gray-400">
        Bar width shows DRAM weight traffic per element (out of 8.5 B/weight for
        two-pass unfused dequantization). Cutting DRAM traffic to 0.5 B/weight
        only yields a speedup once instruction and division bottlenecks are
        removed.
      </p>
    </section>
  );
}

function PackUnpackBenchmarkTable() {
  const rows = [
    ["INT4 Pack (INT8 → INT4)", "0.1375 ms", "183.03 GB/s"],
    ["INT4 Unpack (Scalar)", "0.1360 ms", "184.98 GB/s"],
    ["INT4 Unpack (Vectorized uint32)", "0.1234 ms", "203.90 GB/s"],
  ];

  return (
    <div className="my-8 overflow-x-auto rounded-2xl border border-gray-200 shadow-sm dark:border-zinc-800">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 dark:bg-zinc-900 dark:text-gray-400">
          <tr>
            <th className="px-4 py-3">Operation (N = 16,777,216)</th>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Bandwidth</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
          {rows.map(([op, time, bw]) => (
            <tr
              key={op}
              className="bg-white transition-colors hover:bg-gray-50 dark:bg-black dark:hover:bg-zinc-900/50"
            >
              <td className="whitespace-nowrap px-4 py-3 font-medium">{op}</td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-blue-600 dark:text-blue-400">
                {time}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-mono">{bw}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GemvBenchmarkTable() {
  const rows = [
    ["4096 × 4096", "1. Baseline FP32 GEMV", "0.2089 ms", "321.36 GB/s", "1.00×"],
    ["4096 × 4096", "2. Two-Pass Unfused Dequant", "0.5766 ms", "247.31 GB/s", "0.36×"],
    ["4096 × 4096", "3. Scalar Byte-by-Byte", "0.2987 ms", "28.20 GB/s", "0.70×"],
    ["4096 × 4096", "4. Fused Vectorized uint4", "0.0861 ms", "97.79 GB/s", "2.43×"],
    ["4096 × 11008", "1. Baseline FP32 GEMV", "0.5504 ms", "327.78 GB/s", "1.00×"],
    ["4096 × 11008", "2. Two-Pass Unfused Dequant", "1.3366 ms", "286.73 GB/s", "0.41×"],
    ["4096 × 11008", "3. Scalar Byte-by-Byte", "0.6892 ms", "32.80 GB/s", "0.80×"],
    ["4096 × 11008", "4. Fused Vectorized uint4", "0.2086 ms", "108.38 GB/s", "2.64×"],
    ["8192 × 4096", "1. Baseline FP32 GEMV", "0.4152 ms", "323.39 GB/s", "1.00×"],
    ["8192 × 4096", "2. Two-Pass Unfused Dequant", "1.0057 ms", "283.60 GB/s", "0.41×"],
    ["8192 × 4096", "3. Scalar Byte-by-Byte", "0.5182 ms", "32.47 GB/s", "0.80×"],
    ["8192 × 4096", "4. Fused Vectorized uint4", "0.1589 ms", "105.88 GB/s", "2.61×"],
  ];

  return (
    <div className="my-8 overflow-x-auto rounded-2xl border border-gray-200 shadow-sm dark:border-zinc-800">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 dark:bg-zinc-900 dark:text-gray-400">
          <tr>
            <th className="px-4 py-3">Matrix shape (M × K)</th>
            <th className="px-4 py-3">Kernel implementation</th>
            <th className="px-4 py-3">Latency</th>
            <th className="px-4 py-3">Effective GB/s</th>
            <th className="px-4 py-3">Speedup vs FP32</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
          {rows.map(([shape, kernel, latency, bw, speedup]) => {
            const isBest = kernel.startsWith("4.");
            return (
              <tr
                key={`${shape}-${kernel}`}
                className={`transition-colors hover:bg-gray-50 dark:hover:bg-zinc-900/50 ${
                  isBest ? "bg-emerald-50/40 dark:bg-emerald-950/15" : "bg-white dark:bg-black"
                }`}
              >
                <td className="whitespace-nowrap px-4 py-3 font-medium">{shape}</td>
                <td className="whitespace-nowrap px-4 py-3">{kernel}</td>
                <td
                  className={`whitespace-nowrap px-4 py-3 font-mono ${
                    isBest
                      ? "font-bold text-emerald-700 dark:text-emerald-300"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {latency}
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-mono">{bw}</td>
                <td
                  className={`whitespace-nowrap px-4 py-3 font-mono ${
                    isBest ? "font-bold text-emerald-700 dark:text-emerald-300" : ""
                  }`}
                >
                  {speedup}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function LowPrecisionAndPackingPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-12 text-gray-900 dark:bg-black dark:text-gray-100 sm:px-8 lg:px-12">
      <article className="mx-auto max-w-4xl">
        <div className="mb-10 flex items-center justify-between gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          <Link href="/" className="transition-colors hover:text-black dark:hover:text-white">
            ← Back to portfolio
          </Link>
          <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-zinc-900">
            CUDA · Low Precision &amp; Packing
          </span>
        </div>

        <header className="mb-12 border-b border-gray-200 pb-10 dark:border-zinc-800">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
            GPU Kernel Engineering · Part 02
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            The Hidden Cost of{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              4-Bit Weights
            </span>
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-relaxed text-gray-600 dark:text-gray-400">
            From sub-byte packing and branchless sign extension to INT8 __dp4a
            dot products and fused W4A16 GEMV kernels on real GPU hardware.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <span className="rounded-full border border-gray-200 px-3 py-1 dark:border-zinc-800">
              CUDA
            </span>
            <span className="rounded-full border border-gray-200 px-3 py-1 dark:border-zinc-800">
              INT4 Packing
            </span>
            <span className="rounded-full border border-gray-200 px-3 py-1 dark:border-zinc-800">
              __dp4a
            </span>
            <span className="rounded-full border border-gray-200 px-3 py-1 dark:border-zinc-800">
              W4A16 GEMV
            </span>
            <BlogViewCount path="/blog/low-precision-and-packing" />
          </div>
        </header>

        <figure className="my-12">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <Image
              src="/blog/low-precision-and-packing/Inference Acceleration.png"
              alt="The Hidden Cost of 4-Bit Weights: sub-byte packing, sign extension, and fused W4A16 GEMV"
              width={1600}
              height={900}
              className="h-auto w-full"
              priority
            />
          </div>
          <figcaption className="mt-3 text-center text-sm leading-6 text-gray-500">
            Sub-byte INT4 packing, branchless sign extension, and fused vectorized streaming on an RTX 3060.
          </figcaption>
        </figure>

        <div className="space-y-10 text-lg leading-8 text-gray-700 dark:text-gray-300">
          <section>
            <p>
              In{" "}
              <Link
                href="/blog/quantization-fundamentals"
                className="font-semibold text-blue-600 underline underline-offset-4 dark:text-blue-400"
              >
                Part 01
              </Link>
              , we followed a single FP32 value through a CUDA kernel: load four
              bytes, scale, round, clamp, and store one signed INT8 byte.
            </p>
            <p className="mt-4">
              That leaves a natural next question. If 8 bits is good, why not
              use 4 bits or even 2 bits and cut memory traffic even further? And
              once values are stored in 8 bits or 4 bits, how does a GPU
              actually do math with them?
            </p>
            <p className="mt-4">
              Modern GPUs do not have 4-bit pointers, and they cannot address
              half a byte in global memory. At the same time, simply shrinking
              weights to 4 bits does not automatically make a kernel faster. In
              fact, if you unpack those weights the wrong way, the kernel can
              end up <strong>2.7× slower</strong> than running in plain FP32.
            </p>
            <p className="mt-4">
              In this second installment, we move from single-element conversion
              to <strong>low-precision arithmetic and sub-byte packing</strong>.
              We will cover INT8 multiplication and widened accumulation (
              <code>__dp4a</code>), how 4-bit and 2-bit values are packed into
              bytes and sign-extended without corrupting negative numbers, and
              how weight-only quantization (W4A16) behaves on real GPU hardware.
              We will still stop before full tiled INT8 matrix multiplication
              and Tensor Core <code>mma</code> instructions those come in Part
              03.
            </p>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-6 shadow-sm dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
              The experiment
            </p>
            <div className="mt-5 grid gap-6 sm:grid-cols-3">
              <div>
                <p className="text-4xl font-black text-blue-600 dark:text-blue-400">
                  4 → 0.5
                </p>
                <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Bytes per weight: FP32 down to packed INT4
                </p>
              </div>
              <div>
                <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
                  32
                </p>
                <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  INT4 weights loaded per thread in a single 128-bit{" "}
                  <code>uint4</code> instruction
                </p>
              </div>
              <div>
                <p className="text-4xl font-black text-purple-600 dark:text-purple-400">
                  4
                </p>
                <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  GEMV kernel variants compared on an RTX 3060 Laptop GPU
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              1. Storing 4-Bit Numbers Inside an 8-Bit Byte
            </h2>
            <p>
              GPU global memory is byte-addressable. The smallest unit a thread
              can point to or read from memory is{" "}
              <strong>1 byte (8 bits)</strong>. There is no{" "}
              <code>int4_t*</code> in C++ or CUDA, and no hardware instruction
              that loads half a byte from a memory address.
            </p>
            <p className="mt-4">
              So if we want to store 4-bit integers (INT4) or 2-bit integers
              (INT2), we have to pack multiple values into a single{" "}
              <code>uint8_t</code> byte ourselves:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                <strong>INT4 (2 values per byte):</strong> Element{" "}
                <code>2*i</code> goes into the lower 4 bits (the low nibble),
                and element <code>2*i + 1</code> goes into the upper 4 bits (the
                high nibble).
              </li>
              <li>
                <strong>INT2 (4 values per byte):</strong> Four 2-bit values sit
                side by side at bit offsets <code>0</code>, <code>2</code>,{" "}
                <code>4</code>, and <code>6</code>.
              </li>
            </ul>
            <BytePackingLayoutVisual />
            <p>Packing two INT4 values into one byte is straightforward:</p>
            <CodeBlock>{`uint8_t low  = static_cast<uint8_t>(val0) & 0x0F;
uint8_t high = static_cast<uint8_t>(val1) & 0x0F;
uint8_t packed = low | (high << 4);`}</CodeBlock>

            <h3 className="mt-8 mb-4 text-xl font-bold text-gray-900 dark:text-white">
              The Sign Trap When Unpacking
            </h3>
            <p>
              Unpacking looks just as simple until negative numbers appear. In
              signed 4-bit two's-complement arithmetic, the representable range
              is <code>[-8, 7]</code>. Bit 3 is the sign bit:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6 font-mono text-base">
              <li>0b0111 = +7</li>
              <li>0b0000 = 0</li>
              <li>0b1111 = -1</li>
              <li>0b1000 = -8</li>
            </ul>
            <p className="mt-4">
              Suppose <code>packed</code> holds <code>-1</code> (
              <code>0b1111</code>) in its low nibble. If you extract it with a
              bitmask and cast it straight to <code>int8_t</code>:
            </p>
            <SignTrapVisual />
            <p>
              Because the upper 4 bits of <code>nibble</code> are zeros,{" "}
              <code>int8_t</code> sees <code>+15</code> instead of{" "}
              <code>-1</code>. Every negative weight in <code>[-8, -1]</code>{" "}
              silently turns into a positive number in <code>[8, 15]</code>.
            </p>

            <h3 className="mt-8 mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Fixing It Without Branches: Sign Extension
            </h3>
            <p>
              To recover the original negative value, bit 3 (the 4-bit sign bit)
              has to be copied into bits 4 through 7 of the 8-bit integer. We
              can do this without any <code>if</code> branches using two shifts:
            </p>
            <CodeBlock>{`__host__ __device__ __forceinline__ int8_t sign_extend_int4(uint8_t nibble) {
    int8_t val = static_cast<int8_t>(nibble << 4);
    return static_cast<int8_t>(val >> 4);
}`}</CodeBlock>
            <p>
              Tracing <code>-1</code> (<code>0b00001111</code>):
            </p>
            <ol className="mt-3 list-decimal space-y-2 pl-6">
              <li>
                <code>nibble &lt;&lt; 4</code> moves bit 3 into bit 7 (the 8-bit
                sign bit): <code>0b11110000</code> (<code>-16</code> in{" "}
                <code>int8_t</code>).
              </li>
              <li>
                <code>val &gt;&gt; 4</code> is an arithmetic right shift on a
                signed <code>int8_t</code>, so it fills the upper bits with
                copies of the sign bit: <code>0b11111111</code> (<code>-1</code>
                ).
              </li>
            </ol>
            <p className="mt-4">
              For a positive value like <code>+5</code> (<code>0b00000101</code>
              ), <code>val &lt;&lt; 4</code> is <code>0b01010000</code>, the
              sign bit is <code>0</code>, and <code>val &gt;&gt; 4</code>{" "}
              produces <code>0b00000101</code> (<code>+5</code>). The exact same
              trick works for signed INT2 (<code>[-2, 1]</code>) by shifting
              left by 6 and right by 6.
            </p>

            <InteractiveNibblePacker />
          </section>

          <section>
            <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              2. INT8 Arithmetic, Overflow, and Widened Accumulation
            </h2>
            <p>
              Once values are stored as 8-bit integers, the next question is how
              to compute with them. Take the simplest building block of linear
              layers and attention: a dot product between two quantized vectors{" "}
              <code>a</code> and <code>b</code> of length <code>K</code>.
            </p>

            <h3 className="mt-8 mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Why INT8 × INT8 Cannot Stay in INT8 (or INT16)
            </h3>
            <p>
              In Part 01, signed INT8 values lived in <code>[-128, 127]</code>.
              The moment you multiply two INT8 values together, the result no
              longer fits in 8 bits:
            </p>
            <CodeBlock>{`(-128) × (-128) = +16,384   (far outside [-128, 127])`}</CodeBlock>
            <p>
              Even a 16-bit integer (<code>int16_t</code>, max{" "}
              <code>32,767</code>) is not safe once you start summing products.
              If just two elements in the dot product are{" "}
              <code>-128 × -128</code>, their sum is <code>32,768</code>, which
              already overflows <code>int16_t</code>.
            </p>
            <p className="mt-4">
              For a realistic LLM hidden dimension like <code>K = 4096</code>,
              the worst-case sum is:
            </p>
            <CodeBlock>{`4096 × (-128 × -128) = 67,108,864`}</CodeBlock>
            <p>
              That fits comfortably inside a signed 32-bit integer (
              <code>int32_t</code>, max <code>2,147,483,647</code>), which can
              safely accumulate over <strong>131,000</strong> worst-case INT8
              products before overflowing. This is why GPU quantized kernels
              follow a strict rule:{" "}
              <strong>8-bit inputs, 32-bit integer accumulator</strong>.
            </p>

            <h3 className="mt-8 mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Factoring the Scale Out of the Inner Loop
            </h3>
            <p>
              Suppose vector <code>a</code> was quantized symmetrically with
              scale <code>s_a</code>, and vector <code>b</code> with scale{" "}
              <code>s_b</code>. Their dequantized approximations are{" "}
              <code>a_hat[i] = s_a * q_a[i]</code> and{" "}
              <code>b_hat[i] = s_b * q_b[i]</code>.
            </p>
            <p className="mt-4">
              If we compute the dot product in floating point naively, every
              single element requires two dequantizations and a floating-point
              multiply-add. Instead, we can factor both constant scales outside
              the sum:
            </p>
            <CodeBlock>{`sum(a_hat[i] * b_hat[i]) = (s_a * s_b) * sum(q_a[i] * q_b[i])`}</CodeBlock>
            <p>
              This separation is what makes integer arithmetic fast on a GPU:
            </p>
            <ol className="mt-3 list-decimal space-y-2 pl-6">
              <li>
                <strong>Inside the loop:</strong> Pure integer multiply-adds (
                <code>int8 × int8 → int32</code>), with no floating-point
                conversions and no scale lookups.
              </li>
              <li>
                <strong>At the end of the reduction:</strong> Cast the final{" "}
                <code>int32_t</code> sum to <code>float</code> once and multiply
                by <code>(scale_a * scale_b)</code>.
              </li>
            </ol>

            <h3 className="mt-8 mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Packing Four Products into One Instruction: <code>__dp4a</code>
            </h3>
            <p>
              If a CUDA thread reads one <code>int8_t</code> at a time,
              multiplies, and adds to an <code>int32_t</code>, it wastes both
              memory bandwidth and instruction issue slots.
            </p>
            <p className="mt-4">
              Starting with Pascal (<code>sm_61</code>, and available on our RTX
              3060 <code>sm_86</code>), NVIDIA GPUs include a hardware
              instruction specifically for this pattern:{" "}
              <strong>
                <code>__dp4a</code>
              </strong>{" "}
              (4-way 8-bit integer dot product and accumulate).
            </p>
            <p className="mt-4">
              Instead of loading 1 byte at a time, each thread reinterprets the{" "}
              <code>int8_t</code> array as <code>int32_t</code> loading{" "}
              <strong>4 packed INT8 values</strong> in a single 32-bit
              register and passes two 32-bit registers plus an accumulator to{" "}
              <code>__dp4a</code>:
            </p>
            <CodeBlock>{`const int32_t* a_i32 = reinterpret_cast<const int32_t*>(a);
const int32_t* b_i32 = reinterpret_cast<const int32_t*>(b);

int32_t thread_acc = 0;

for (size_t i = tid; i < num_elements / 4; i += stride) {
    // Computes: thread_acc += a0*b0 + a1*b1 + a2*b2 + a3*b3
    thread_acc = __dp4a(a_i32[i], b_i32[i], thread_acc);
}`}</CodeBlock>
            <p>
              One <code>__dp4a</code> instruction performs four signed 8-bit
              multiplications and accumulates all four products into{" "}
              <code>thread_acc</code> in a single cycle on the integer pipe. To
              handle tensor lengths that are not multiples of 4, a short scalar
              tail loop processes the remaining <code>0–3</code> elements. Then
              each warp reduces its <code>thread_acc</code> values using{" "}
              <code>__shfl_down_sync</code>, and only after the block-wide
              integer sum is complete do we convert to <code>float</code> and
              apply <code>scale_a * scale_b</code>.
            </p>

            <Dp4aAccumulatorVisual />
          </section>

          <section>
            <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              3. Weight-Only Quantization and Group-Wise Scaling
            </h2>
            <p>
              In Section 2, both inputs were quantized to INT8. In LLM
              inference especially during single-token generation (decode) a
              different pattern is often more practical:{" "}
              <strong>weight-only quantization</strong> (commonly written as{" "}
              <strong>W8A16</strong> or <strong>W4A16</strong>).
            </p>

            <h3 className="mt-8 mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Why Quantize Only the Weights?
            </h3>
            <p>
              When an LLM generates text one token at a time (
              <code>batch_size = 1</code>), each linear layer multiplies a large{" "}
              <code>M × K</code> weight matrix <code>W</code> by a single{" "}
              <code>K</code>-element activation vector <code>x</code>:
            </p>
            <CodeBlock>{`y = W * x`}</CodeBlock>
            <p>
              For every single output token, the GPU has to stream the entire
              weight matrix <code>W</code> from global memory (DRAM) just to
              perform one multiply-add per weight. The arithmetic intensity is
              less than 1 FLOP per byte moved. That means the GPU's compute
              units spend most of their time idle, waiting on memory bandwidth.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                <strong>Weights (W)</strong> dominate memory traffic, so
                compressing them from 32-bit or 16-bit floats down to{" "}
                <strong>INT4</strong> (0.5 bytes per weight) directly attacks
                the bottleneck.
              </li>
              <li>
                <strong>Activations (x)</strong> are just a single vector of
                length <code>K</code> (which easily fits in cache), and they
                often contain sharp outlier values that are harder to quantize
                cleanly. Keeping activations in floating point avoids
                activation-quantization error while still cutting the weight
                traffic by 4× to 8×.
              </li>
            </ul>

            <h3 className="mt-8 mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Why Per-Tensor Scaling Breaks at 4 Bits
            </h3>
            <p>
              With INT8, you have 256 discrete levels, so a single scale factor
              for an entire matrix (or row) is often tolerable. With INT4, you
              only have <strong>16 discrete levels</strong> (
              <code>[-8, 7]</code>).
            </p>
            <p className="mt-4">
              If one weight row contains a few large outlier values alongside
              many small weights, a single per-row scale has to stretch across
              the outlier crushing all the smaller weights into just 1 or 2
              integer codes near zero.
            </p>
            <p className="mt-4">
              The standard fix is <strong>group-wise scaling</strong>. Instead
              of one scale for the entire row of length <code>K</code>, we split
              the row into small contiguous groups typically{" "}
              <code>group_size = 32</code>, <code>64</code>, or <code>128</code>
               and store one scale factor per group:
            </p>
            <CodeBlock>{`Row of K = 4096 INT4 weights (group_size = 128):

[ Group 0: 128 weights ] [ Group 1: 128 weights ] ... [ Group 31: 128 weights ]
        scale[0]                 scale[1]                     scale[31]`}</CodeBlock>
            <p>
              With <code>group_size = 128</code>, 128 weights share one 4-byte
              FP32 (or 2-byte FP16) scale adding less than <code>0.03</code>{" "}
              bytes of metadata per weight while keeping the 4-bit range tightly
              fitted to local values.
            </p>
            <p className="mt-4">
              The kernel's job for each element <code>col</code> in{" "}
              <code>row</code> is then:
            </p>
            <CodeBlock>{`float w = static_cast<float>(sign_extend_int4(nibble)) * row_scales[col / group_size];
sum += w * activations[col];`}</CodeBlock>
            <p>
              How and <em>when</em> the kernel performs that unpack and
              multiply whether in a separate pass through DRAM or fused inside
              registers makes the difference between a slowdown and a speedup.
            </p>

            <GroupWiseScalingVisual />
          </section>

          <section>
            <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              4. The Memory Bottleneck: Four GEMV Kernels Compared
            </h2>
            <p>
              Packing weights to 4 bits reduces their size in memory by 8×
              compared to FP32. It is tempting to assume the GEMV kernel will
              automatically run much faster. To test that assumption, we built
              four variants of the same matrix-vector multiplication (
              <code>y = Wx</code>, with one 32-thread warp assigned to each
              output row) and timed them on the same hardware.
            </p>

            <h3 className="mt-8 mb-4 text-xl font-bold text-gray-900 dark:text-white">
              1. Baseline: Standard FP32 GEMV
            </h3>
            <p>
              The baseline kernel streams uncompressed FP32 weights directly
              from global memory:
            </p>
            <CodeBlock>{`for (size_t col = lane; col < K; col += 32) {
    thread_sum += row_weights[col] * activations[col];
}`}</CodeBlock>
            <p>
              Each thread reads 4 bytes per weight and multiplies immediately. On
              a modern GPU, this saturates global memory bandwidth cleanly and
              serves as our reference point (<code>4.0 bytes/weight</code> of
              DRAM traffic).
            </p>

            <h3 className="mt-8 mb-4 text-xl font-bold text-gray-900 dark:text-white">
              2. Trap 1: Two-Pass Unfused Dequantization
            </h3>
            <p>
              A common mistake when adding quantization to an existing codebase
              is to keep the GEMV kernel untouched and insert a separate
              dequantization kernel in front of it:
            </p>
            <CodeBlock>{`// Pass 1: Unpack INT4 -> write full FP32 matrix to a temporary DRAM buffer
dequantize_w4_to_dram_fp32_kernel<<<...>>>(d_packed, d_scales, d_temp_fp32);

// Pass 2: Run the standard FP32 GEMV on the temporary buffer
gemv_fp32_baseline_kernel<<<...>>>(d_temp_fp32, d_activations, d_output);`}</CodeBlock>
            <p>
              Count the bytes that actually cross the DRAM bus per weight:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                Pass 1 <strong>reads</strong> <code>0.5</code> bytes of packed
                INT4.
              </li>
              <li>
                Pass 1 <strong>writes</strong> <code>4.0</code> bytes of
                dequantized FP32 back to DRAM.
              </li>
              <li>
                Pass 2 <strong>reads</strong> <code>4.0</code> bytes of FP32
                back into the GEMV kernel.
              </li>
            </ul>
            <p className="mt-4">
              Total DRAM traffic jumps from <code>4.0</code> bytes/weight to{" "}
              <strong>
                <code>8.5</code> bytes/weight
              </strong>
               more than double the traffic of running in plain FP32. Writing
              intermediate dequantized weights to DRAM completely erases the
              memory savings.
            </p>

            <h3 className="mt-8 mb-4 text-xl font-bold text-gray-900 dark:text-white">
              3. Trap 2: Scalar Byte-by-Byte Fused Unpack
            </h3>
            <p>
              The obvious fix is to fuse dequantization into the GEMV kernel so
              intermediate weights never touch DRAM. Each thread in the warp
              strides across the packed row one byte at a time, unpacks two
              nibbles, looks up the group scale, and accumulates:
            </p>
            <CodeBlock>{`for (size_t byte_col = lane; byte_col < packed_row_bytes; byte_col += 32) {
    uint8_t byte_val = row_packed[byte_col];
    int8_t w0 = sign_extend_int4(byte_val & 0x0F);
    int8_t w1 = sign_extend_int4((byte_val >> 4) & 0x0F);

    float s0 = row_scales[col0 / group_size];
    float s1 = row_scales[col1 / group_size];

    thread_sum += (static_cast<float>(w0) * s0) * activations[col0];
    thread_sum += (static_cast<float>(w1) * s1) * activations[col1];
}`}</CodeBlock>
            <p>
              DRAM weight traffic drops to <code>0.5</code> bytes/weight yet on
              our RTX 3060,{" "}
              <strong>this kernel still ran slower than the FP32 baseline</strong>
              . Why? We traded a memory bottleneck for an{" "}
              <strong>instruction bottleneck</strong>:
            </p>
            <ol className="mt-3 list-decimal space-y-2 pl-6">
              <li>
                <strong>Narrow memory transactions:</strong> Reading 1 byte per
                thread (<code>uint8_t</code>) issues far more load instructions
                than reading 16 bytes at a time.
              </li>
              <li>
                <strong>Integer division inside the loop:</strong>{" "}
                <code>col0 / group_size</code> and{" "}
                <code>col1 / group_size</code> compile into expensive integer
                division sequences on every pair of weights.
              </li>
              <li>
                <strong>Scalar activation loads and redundant scale multiplies:</strong>{" "}
                Every single element issues its own 32-bit activation load and
                its own scale multiplication.
              </li>
            </ol>

            <h3 className="mt-8 mb-4 text-xl font-bold text-gray-900 dark:text-white">
              4. Solution: Fused Vectorized <code>uint4</code> Streaming
            </h3>
            <p>
              To unlock the bandwidth savings of INT4 without stalling on ALU
              instructions, the kernel needs to match the width of the GPU's
              memory system and eliminate per-element overhead:
            </p>
            <ol className="mt-3 list-decimal space-y-2 pl-6">
              <li>
                <strong>128-bit weight loads (<code>uint4</code>):</strong> Each
                thread loads 16 bytes (<strong>32 INT4 weights</strong>) in a
                single instruction. Across a 32-thread warp, one step fetches{" "}
                <code>512</code> contiguous bytes.
              </li>
              <li>
                <strong>128-bit activation loads (<code>float4</code>):</strong>{" "}
                Activations are loaded four floats at a time instead of one
                float at a time.
              </li>
              <li>
                <strong>Bit-shift group indexing:</strong> Because{" "}
                <code>group_size</code> is a power of two (<code>32</code>,{" "}
                <code>64</code>, or <code>128</code>),{" "}
                <code>word_base_col / group_size</code> becomes a single
                right-shift (<code>word_base_col &gt;&gt; group_shift</code>).
              </li>
              <li>
                <strong>Factorized scaling:</strong> Since 8 consecutive weights
                within a <code>uint32_t</code> word belong to the same group, we
                look up <code>s</code> once for all 8 elements and factor it out
                of the inner dot product:
              </li>
            </ol>
            <CodeBlock>{`// Load 16 bytes (32 INT4 weights) in one instruction
uint4 packed_vec = row_packed_u4[u4_idx];

// Inside the 4-word unroll (8 weights per word):
const float4* act_f4 = reinterpret_cast<const float4*>(activations + word_base_col);
float4 act0 = act_f4[0];
float4 act1 = act_f4[1];

float s = row_scales[word_base_col >> group_shift];

thread_sum += (static_cast<float>(w0) * act0.x +
               static_cast<float>(w1) * act0.y +
               static_cast<float>(w2) * act0.z +
               static_cast<float>(w3) * act0.w +
               static_cast<float>(w4) * act1.x +
               static_cast<float>(w5) * act1.y +
               static_cast<float>(w6) * act1.z +
               static_cast<float>(w7) * act1.w) * s;`}</CodeBlock>
            <p>
              Only <code>0.5</code> bytes per weight cross DRAM, and the
              unpacking and scaling overhead stays small enough that memory
              savings finally translate into wall-clock speedup.
            </p>

            <GemvTrafficVisual />
          </section>

          <section>
            <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              5. CPU Reference vs CUDA Kernel Validation
            </h2>
            <p>
              When bit-shifting, sign extension, and vectorized pointer casts
              are involved, a bug rarely crashes the kernel it silently corrupts
              values. Before timing anything, every kernel is checked against an
              independent CPU reference (<code>packing_reference.hpp</code>).
            </p>
            <div className="my-8 overflow-x-auto rounded-2xl border border-gray-200 dark:border-zinc-800">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 dark:bg-zinc-900">
                  <tr>
                    <th className="px-4 py-3">Validation case</th>
                    <th className="px-4 py-3">What it checks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                  <tr>
                    <td className="px-4 py-3 font-medium">
                      Sign extension (INT4 and INT2)
                    </td>
                    <td className="px-4 py-3">
                      Boundary codes (0, 7, -1, -8 for INT4; 0, 1, -1, -2 for
                      INT2)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">
                      Pack / unpack (N = 256 and N = 100,003)
                    </td>
                    <td className="px-4 py-3">
                      Bit-exact match for aligned and odd, non-multiple-of-block
                      tensor sizes
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">
                      Vectorized uint32_t unpack
                    </td>
                    <td className="px-4 py-3">
                      Agreement between 32-bit word unpack, scalar unpack, and
                      CPU reference
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">
                      INT8 __dp4a dot product (N = 1,048,576)
                    </td>
                    <td className="px-4 py-3">
                      int32_t accumulation and final (scale_a * scale_b) scaling
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">
                      W4A16 GEMV (unfused, scalar, fused)
                    </td>
                    <td className="px-4 py-3">
                      All three quantized GEMV kernels match the CPU
                      group-scaled reference
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              For packing and unpacking, the expected mismatch count is{" "}
              <strong>zero</strong>: every byte and every sign-extended integer
              must match the CPU reference bit for bit. For the floating-point
              reductions (<code>__dp4a</code> and W4A16 GEMV), small
              floating-point accumulation order differences are expected and
              verified within tolerance.
            </p>
          </section>

          <section>
            <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              6. Benchmarking on the RTX 3060
            </h2>
            <p>
              All measurements below were collected on an{" "}
              <strong>NVIDIA GeForce RTX 3060 Laptop GPU</strong> (compute
              capability 8.6, CUDA 13.4, <code>-O3</code>,{" "}
              <code>-arch=sm_86</code>) using CUDA events around the kernel
              launches, with 10 warmup launches and 100 timed iterations.
              Allocation and host-to-device copies are outside the timed region.
              As in Part 01, these numbers are specific to this GPU, launch
              configuration, and benchmark harness they are not universal
              hardware guarantees.
            </p>

            <h3 className="mt-8 mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Standalone INT4 Pack and Unpack (N = 16,777,216 elements)
            </h3>
            <PackUnpackBenchmarkTable />
            <p>
              Reading 4 packed bytes at a time via <code>uint32_t</code>{" "}
              improves standalone unpack throughput from{" "}
              <code>184.98 GB/s</code> to <code>203.90 GB/s</code>.
            </p>

            <h3 className="mt-8 mb-4 text-xl font-bold text-gray-900 dark:text-white">
              The Four GEMV Kernels Across LLM Layer Shapes
            </h3>
            <GemvBenchmarkTable />
            <p>Three patterns stand out in the data:</p>
            <ol className="mt-4 list-decimal space-y-3 pl-6">
              <li>
                <strong>
                  Unfused dequantization is consistently 2.4×–2.8× slower than
                  FP32.
                </strong>{" "}
                Even though it achieves <code>247–287 GB/s</code> of DRAM
                throughput, it spends that bandwidth writing and re-reading an
                intermediate FP32 weight matrix.
              </li>
              <li>
                <strong>
                  Scalar in-kernel unpacking is still slower than FP32 (
                  <code>0.70×–0.80×</code>).
                </strong>{" "}
                Narrow 1-byte loads and integer divisions inside the loop stall
                the execution pipeline, leaving effective bandwidth around{" "}
                <code>30 GB/s</code>.
              </li>
              <li>
                <strong>
                  Fused vectorized <code>uint4</code> delivers a{" "}
                  <code>2.43×–2.64×</code> speedup.
                </strong>{" "}
                Notice that its effective weight-traffic bandwidth (
                <code>~98–108 GB/s</code>) is lower than the FP32 baseline's{" "}
                <code>~325 GB/s</code>, even though it finishes more than twice
                as fast. Because the kernel moves 8× fewer weight bytes,
                per-element unpacking shifts, <code>int8 → float</code> casts,
                and activation/scale reads now make up a larger share of the
                remaining <code>0.086 ms</code>.
              </li>
            </ol>
          </section>

          <section className="mt-12 rounded-2xl border border-blue-100 bg-blue-50/50 p-5 dark:border-blue-900/30 dark:bg-blue-950/20 sm:p-8">
            <h2 className="mt-0 text-xl font-bold text-blue-900 dark:text-blue-300">
              Summary
            </h2>
            <p className="mt-4 leading-7 text-blue-800 dark:text-blue-300">
              Moving below 8 bits changes both the arithmetic and the memory
              engineering of a CUDA kernel. Sub-byte values must be packed into
              bytes and sign-extended without branches on unpack; INT8 dot
              products must widen to <code>int32_t</code> accumulators before
              applying scale factors; and weight-only quantization only pays off
              when dequantization is fused into vectorized register loads rather
              than round-tripped through DRAM.
            </p>
            <p className="mt-4 leading-7 text-blue-800 dark:text-blue-300">
              In Part 03, we move from memory-bound GEMV to{" "}
              <strong>compute-bound Quantized GEMM</strong> covering zero-point
              correction terms, shared-memory tiling, and Tensor Core matrix
              instructions.
            </p>

            <div className="mt-6 border-t border-blue-200 pt-5 dark:border-blue-900/50">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                Explore the implementation
              </p>
              <a
                href="https://github.com/SRDdev/gpu-performance-lab/tree/master/GPU-Quantized-Kernels/02_Low_Precision_And_Packing"
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
                  GPU-Quantized-Kernels / 02_Low_Precision_And_Packing on GitHub
                </span>
                <span className="ml-auto shrink-0">↗</span>
              </a>
            </div>
          </section>

          <p>
            All interactive elements in this article were developed with the
            assistance of AI to enhance the learning experience.
          </p>
        </div>
      </article>
    </main>
  );
}
