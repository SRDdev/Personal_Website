import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why Unused Data Makes GPU Kernels Fly | Shreyas Dixit",
  description:
    "A CUDA GEMM experiment on how changing only matrix A's physical row stride moved an RTX 3060 kernel across a performance cliff.",
};

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="my-6 overflow-x-auto rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm leading-7 text-gray-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-gray-200">
      <code>{children}</code>
    </pre>
  );
}

function Figure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="my-12">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <Image
          src={src}
          alt={alt}
          width={2752}
          height={1536}
          className="h-auto w-full"
        />
      </div>
      <figcaption className="mt-3 text-center text-sm leading-6 text-gray-500 dark:text-gray-500">
        {caption}
      </figcaption>
    </figure>
  );
}

function ResultTable() {
  const rows = [
    [0, 2048, "4096", "943.10", "1,013.76", "2.28"],
    [8, 2056, "4112", "667.65", "944.13", "3.22"],
    [16, 2064, "4128", "650.24", "657.38", "3.30"],
    [24, 2072, "4144", "653.31", "659.46", "3.29"],
    [32, 2080, "4160", "656.38", "660.48", "3.27"],
    [40, 2088, "4176", "650.24", "661.50", "3.30"],
    [48, 2096, "4192", "658.43", "661.50", "3.26"],
    [64, 2112, "4224", "657.41", "668.35", "3.27"],
    [96, 2144, "4288", "658.43", "661.50", "3.26"],
    [128, 2176, "4352", "658.43", "662.53", "3.26"],
  ];

  return (
    <div className="my-8 overflow-x-auto rounded-2xl border border-gray-200 dark:border-zinc-800">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 dark:bg-zinc-900 dark:text-gray-400">
          <tr>
            <th className="px-4 py-3">Padding</th>
            <th className="px-4 py-3">lda</th>
            <th className="px-4 py-3">Stride</th>
            <th className="px-4 py-3">Median us</th>
            <th className="px-4 py-3">P95 us</th>
            <th className="px-4 py-3">TFLOPS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
          {rows.map(([padding, lda, stride, median, p95, tflops]) => (
            <tr
              key={padding}
              className={
                padding === 0
                  ? "bg-red-50/60 dark:bg-red-950/20"
                  : padding === 16 || padding === 40
                    ? "bg-green-50/60 dark:bg-green-950/20"
                    : "bg-white dark:bg-black"
              }
            >
              <td className="whitespace-nowrap px-4 py-3 font-medium">{padding}</td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{lda}</td>
              <td className="whitespace-nowrap px-4 py-3">{stride} B</td>
              <td className="whitespace-nowrap px-4 py-3 font-mono">{median}</td>
              <td className="whitespace-nowrap px-4 py-3 font-mono">{p95}</td>
              <td className="whitespace-nowrap px-4 py-3 font-mono font-semibold">{tflops}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CudaPaddingExperimentPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-12 text-gray-900 dark:bg-black dark:text-gray-100 sm:px-8 lg:px-12">
      <article className="mx-auto max-w-4xl">
        <div className="mb-10 flex items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="underline underline-offset-4 hover:text-black dark:hover:text-white">
            ← Back to portfolio
          </Link>
          <span>Inference Engineering · CUDA</span>
        </div>

        <header className="mb-12 border-b border-gray-200 pb-10 dark:border-zinc-800">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-gray-500">
            GPU kernel deep dive
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Why Unused Data Makes GPU Kernels Fly
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-9 text-gray-600 dark:text-gray-400">
            How adding unused data to the end of every row moved a naive CUDA matrix
            multiplication from 943.10 us to 650.24 us on an RTX 3060 Laptop GPU.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <span className="rounded-full border border-gray-200 px-3 py-1 dark:border-zinc-800">CUDA</span>
            <span className="rounded-full border border-gray-200 px-3 py-1 dark:border-zinc-800">FP16 + FP32 accumulate</span>
            <span className="rounded-full border border-gray-200 px-3 py-1 dark:border-zinc-800">Memory systems</span>
          </div>
        </header>

        <Figure
          src="/blog/cuda-padding-experiment/title.png"
          alt="A visual summary of the CUDA row-stride experiment and its 31.1 percent speedup"
          caption="The experiment in one picture: the logical GEMM stays fixed while the physical row stride changes."
        />

        <div className="space-y-10 text-lg leading-8 text-gray-700 dark:text-gray-300">
          <section>
            <p>
              I recently came across Meta&apos;s $100,000 challenge to make Muse Spark run
              as fast as possible. The idea was simple and extremely tempting: write
              faster GPU kernels, measure them, and see how far the numbers could move.
            </p>
            <p className="mt-6">
              I started writing CUDA kernels for the workload and got a result that
              looked reasonable to me. Then I compared it with other implementations
              using the same logical matrix shapes and the same datatypes. Mine was
              slower. Not a little slower either - the gap was large enough that the
              usual first explanations did not seem sufficient.
            </p>
            <p className="mt-6">
              That sent me down the rabbit hole. I read kernel-optimization write-ups,
              checked coalescing rules, studied tiled GEMM implementations, and kept
              trying to explain where the missing time was going. Eventually I started
              looking less at the arithmetic and more at the addresses being generated.
            </p>
            <p className="mt-6">
              The useful clue was that one input matrix was being laid out with a very
              regular 4096-byte interval between rows. So I tried something deliberately
              boring: I added unused FP16 values to the end of every row.
            </p>
            <p className="mt-6">
              Before this test, I had already worked through several more conventional
              CUDA optimizations: coalesced global-memory access, shared-memory tiling,
              register blocking, and a vectorized subgroup-style kernel. That last
              version used a 16 x 16 block to compute a larger output tile and used
              <code>half2</code> to group adjacent FP16 memory operations while keeping
              FP32 accumulation.
            </p>
            <p className="mt-6">
              Those versions were useful because they improved data reuse. They also
              changed several things at once. For this experiment I went back to the
              simple kernel and changed only the physical row stride of <code>A</code>.
              The math, launch shape, logical dimensions, and datatypes all stayed fixed.
            </p>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
              The short version
            </p>
            <div className="mt-5 grid gap-6 sm:grid-cols-3">
              <div>
                <p className="text-3xl font-black text-red-600 dark:text-red-400">943.10 us</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">4096-byte row stride</p>
              </div>
              <div>
                <p className="text-3xl font-black text-green-600 dark:text-green-400">650.24 us</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">4128-byte row stride</p>
              </div>
              <div>
                <p className="text-3xl font-black text-blue-600 dark:text-blue-400">31.1%</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">lower median latency</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="article-heading">The problem stayed exactly the same</h2>
            <p>
              The kernel computes a fixed GEMM. The only variable in the primary
              experiment is the physical stride of matrix <code>A</code>.
            </p>
            <div className="my-6 overflow-x-auto rounded-2xl border border-gray-200 dark:border-zinc-800">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 dark:bg-zinc-900 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3">Matrix</th>
                    <th className="px-4 py-3">Shape</th>
                    <th className="px-4 py-3">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                  <tr><td className="px-4 py-3 font-mono">A</td><td className="px-4 py-3">256 x 2048</td><td className="px-4 py-3">FP16</td></tr>
                  <tr><td className="px-4 py-3 font-mono">B</td><td className="px-4 py-3">2048 x 2048</td><td className="px-4 py-3">FP16</td></tr>
                  <tr><td className="px-4 py-3 font-mono">C</td><td className="px-4 py-3">256 x 2048</td><td className="px-4 py-3">FP16 output</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              Every product is converted to FP32 before accumulation. There is no
              quantization, integer datatype, cuBLAS call, WMMA instruction, or
              cooperative-matrix API in the primary experiment.
            </p>
            <CodeBlock>{`float sum = 0.0f;
for (int k = 0; k < 2048; ++k) {
    sum += float(A[row * lda + k]) * float(B[k * 2048 + col]);
}
C[row * 2048 + col] = __float2half_rn(sum);`}</CodeBlock>
            <p>
              With no padding, <code>lda = 2048</code> and every row occupies 4096
              bytes. With 16 padding elements, <code>lda = 2064</code> and the row
              occupies 4128 bytes. The kernel still reads only the 2048 valid values.
            </p>
          </section>

          <Figure
            src="/blog/cuda-padding-experiment/unpadded-stride.png"
            alt="Diagram showing 4096-byte unpadded rows repeatedly landing on the same cache-set pattern"
            caption="With a 4096-byte stride, every row starts at the same power-of-two address phase. This is the bottleneck hypothesis, not a decoded cache map."
          />

          <section>
            <h2 className="article-heading">The padding sweep</h2>
            <p>
              I did not want to compare only 0 and 32 padding elements and then build a
              story around the result. The benchmark sweeps 0, 8, 16, 24, 32, 40, 48,
              64, 96, and 128 FP16 elements while keeping the logical work fixed.
            </p>
            <ResultTable />
            <p>
              Padding 16 is the best point in the supplied run, tied closely by padding
              40. The important shape is the drop after padding zero and the stable
              plateau afterward. That makes the result look like a stride-phase effect,
              not a universal rule that exactly 32 elements are magic.
            </p>
          </section>

          <Figure
            src="/blog/cuda-padding-experiment/latency-vs-padding.svg"
            alt="Line chart of CUDA GEMM median latency versus row padding"
            caption="The latency plot shows the 4096-byte baseline as an outlier and a broad lower-latency plateau after padding is introduced."
          />

          <Figure
            src="/blog/cuda-padding-experiment/gflops-vs-padding.svg"
            alt="Line chart of effective CUDA GEMM GFLOPS versus row padding"
            caption="Because the logical FLOP count is unchanged, the latency reduction appears as higher effective throughput."
          />

          <section>
            <h2 className="article-heading">Why would 16 unused values matter?</h2>
            <p>
              The valid payload of every row is still 4096 bytes. Padding does not make
              the current row more contiguous; it changes where the next row begins.
            </p>
            <CodeBlock>{`4096 bytes / 64 bytes  = 64 cache-line intervals
4096 bytes / 128 bytes = 32 sector-group intervals

4112 bytes / 64 bytes = 64.25 line intervals
4128 bytes / 64 bytes = 64.5  line intervals
4160 bytes / 64 bytes = 65    line intervals`}</CodeBlock>
            <p>
              If address bits used by a cache set, an L2 slice, or a memory partition
              repeat under the 4096-byte step, the rows can keep revisiting an
              unfavorable pattern. A 4112-, 4128-, or 4160-byte stride changes that
              phase on every row.
            </p>
            <p className="mt-6">
              The size of the gain is the surprising part. Sixteen FP16 values add only
              32 bytes to each row, or 8 KiB across the whole 256-row matrix. That is
              less than one percent more storage than the valid <code>A</code> payload,
              yet the median kernel time drops by 31.1%.
            </p>
            <p className="mt-6">
              If the cache hypothesis is right, this is probably not because the cache
              suddenly becomes perfectly balanced. A regular stride can make a subset of
              sets, slices, or memory partitions unusually hot. Warps then wait on the
              same overloaded path, and a small change in row phase can remove a much
              larger amount of serialization than the added bytes would suggest.
            </p>
            <p className="mt-6">
              That explanation is plausible, but it is not proof that cache sets alone
              produced the entire gain. Sector grouping, replacement, partition routing,
              and memory stalls may all contribute. I would describe the result as a
              stride-induced memory-system cliff until counters identify the mechanism.
            </p>
          </section>

          <Figure
            src="/blog/cuda-padding-experiment/padded-stride.png"
            alt="Diagram showing 4128-byte padded rows distributed across different cache phases"
            caption="The padded layout shifts each row start. The valid 4096-byte payload is unchanged; only the physical phase moves."
          />

          <section>
            <h2 className="article-heading">Cache conflict is a hypothesis, not a conclusion</h2>
            <p>
              The access pattern makes the hypothesis plausible. Threads in a warp
              usually compute neighboring columns, so their loads from <code>B</code>
              are contiguous. Loads from <code>A</code> are broadcast-like: threads
              computing neighboring columns for the same row request the same
              <code>A[row, k]</code> value.
            </p>
            <p className="mt-6">
              The simple kernel does not explicitly stage either operand in shared
              memory. It repeatedly relies on the cache hierarchy and the compiler&apos;s
              scheduling. That makes row placement and replacement pressure relevant,
              but it does not identify a specific set or partition.
            </p>
            <p className="mt-6">
              Other explanations are still possible: sector grouping, split
              transactions, L1 replacement, L2 slice routing, memory dependency
              stalls, clock state, or measurement noise. NVIDIA does not document every
              cache index and partition hash for this GPU generation.
            </p>
          </section>

          <section>
            <h2 className="article-heading">The engineering lesson</h2>
            <p>
              Padding is not a universal optimization. It increases the allocation,
              can hurt another access path, and may become irrelevant after replacing
              this naive kernel with a tiled or Tensor Core implementation.
            </p>
            <p className="mt-6">
              The useful lesson is broader: physical layout is a performance parameter,
              not merely an allocation detail. When a kernel shows an unexplained
              performance cliff, a small stride sweep can reveal address-dependent
              behavior that is invisible in the mathematical formulation.
            </p>
          </section>

          <section className="border-t border-gray-200 pt-10 dark:border-zinc-800">
            <h2 className="article-heading">Conclusion</h2>
            <p>
              Adding unused FP16 values to each row changed the speed of a fixed CUDA
              GEMM. The 4096-byte layout was the outlier at 943.10 microseconds. Strides
              from 4112 through 4352 bytes clustered near 650 to 658 microseconds, with
              padding 16 and 40 reaching 3.30 effective TFLOPS.
            </p>
            <p className="mt-6">
              I still would not write “padding fixes the cache” as the final answer.
              The defensible conclusion is that physical row stride can move a GPU
              kernel across a performance cliff. The cache-set and partition-camping
              explanation is a strong lead, and the next step is to validate it with
              counters rather than intuition.
            </p>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
            <h2 className="article-heading mt-0">Reproduce it</h2>
            <p>
              The complete CUDA source, CPU reference, padding sweep, Rich terminal
              runner, CSV, plots, and Nsight Compute commands live in the companion
              project.
            </p>
            <CodeBlock>{`cmake --build build --config Release
python scripts\\run_benchmark.py --kernel padded --padding all --warmup 10 --repetitions 100`}</CodeBlock>
            <Link
              href="https://github.com/SRDdev/Inference_Engg"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-black underline underline-offset-4 dark:text-white"
            >
              View the experiment repository ↗
            </Link>
          </section>
        </div>
      </article>
    </main>
  );
}
