import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prefill vs. Decode | Shreyas Dixit",
  description:
    "A first-principles look at LLM prefill, decode, KV caching, and CUDA kernels.",
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
    <figure className="my-10">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <Image src={src} alt={alt} width={1536} height={1024} className="h-auto w-full" />
      </div>
      <figcaption className="mt-3 text-center text-sm leading-6 text-gray-500 dark:text-gray-500">
        {caption}
      </figcaption>
    </figure>
  );
}

export default function PrefillVsDecodePage() {
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
            GPU inference notes
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Prefill vs. Decode: What an LLM Is Really Doing on the GPU
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-9 text-gray-600 dark:text-gray-400">
            LLM inference looks like one call to <code>generate()</code>, but the GPU
            performs two very different jobs: processing the prompt in bulk and
            generating new tokens one at a time.
          </p>
        </header>

        <Figure
          src="/blog/prefill-vs-decode/prefill-vs-decode-overview.png"
          alt="A comparison of prefill and decode workloads with the KV cache"
          caption="A prompt is processed in bulk during prefill; generation then proceeds through repeated decode steps."
        />

        <div className="space-y-10 text-lg leading-8 text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="article-heading">A compact mental model</h2>
            <p>
              An autoregressive language model predicts the next token from the tokens
              it has seen. The loop is simple: prompt, next token, prompt plus next
              token, next token, and so on. The key performance detail is that the
              first iteration has an entire prompt available, while later iterations
              have only one newly arrived token.
            </p>
            <CodeBlock>prompt -&gt; next token -&gt; prompt + next token -&gt; next token -&gt; ...</CodeBlock>
          </section>

          <section>
            <h2 className="article-heading">From text to tensors</h2>
            <p>
              A tokenizer converts text into integer IDs. Those IDs index an embedding
              table with shape <code>[vocabulary_size, hidden_size]</code>. At the CUDA
              level, this is a gather rather than a matrix multiplication: threads copy
              rows from the embedding table into the output tensor.
            </p>
            <CodeBlock>
              {"prompt = \"How does GPU inference work?\"\ntoken_ids = tokenizer.encode(prompt)\nhidden = embedding_table[token_ids]  # [sequence_length, hidden_size]"}
            </CodeBlock>
            <p>
              Position information is added before or inside attention. Rotary position
              embeddings, or RoPE, apply position-dependent rotations to query and key
              vectors so attention can distinguish token order.
            </p>
          </section>

          <section>
            <h2 className="article-heading">What one transformer layer computes</h2>
            <p>
              A transformer layer mixes information across positions with attention and
              processes each position with a feed-forward network.
            </p>
            <CodeBlock>
              {"Q = hidden @ Wq\nK = hidden @ Wk\nV = hidden @ Wv\n\nscores = Q @ transpose(K)\nweights = softmax(scores / sqrt(head_dim))\nattention_output = weights @ V\n\nexpanded = hidden @ W_up\noutput = activation(expanded) @ W_down"}
            </CodeBlock>
            <p>
              These equations hide many kernels: QKV projections, masking, softmax,
              value aggregation, output projection, normalization, activation, and the
              feed-forward projections. Production runtimes fuse several operations to
              reduce intermediate memory traffic and kernel-launch overhead.
            </p>
          </section>

          <section>
            <h2 className="article-heading">Phase one: prefill</h2>
            <p>
              Prefill processes all prompt tokens before generation starts. With batch
              size <code>B</code>, prompt length <code>S</code>, and hidden size <code>H</code>,
              a projection has shapes similar to:
            </p>
            <CodeBlock>
              {"activations: [B * S, H]\nweights:     [H, H]\noutput:      [B * S, H]"}
            </CodeBlock>
            <p>
              The sequence dimension exposes many independent rows. A CUDA GEMM can
              divide the output into tiles, load activation and weight tiles into
              shared memory, accumulate products in registers, and write an output
              tile back to global memory. Tensor Cores are designed for this dense
              matrix-matrix work.
            </p>
            <CodeBlock>
              {"hidden = embed(prompt_ids)\nfor layer in layers:\n    q, k, v = layer.project_qkv(hidden)       # many tokens at once\n    hidden = layer.attend_prefill(q, k, v)\n    hidden = layer.feed_forward(hidden)\n    kv_cache[layer].write(k, v)\nfirst_token = sample(lm_head(hidden[:, -1, :]))"}
            </CodeBlock>
            <p>
              Prefill is often associated with <strong>time to first token (TTFT)</strong>.
              It frequently has enough parallel work to drive high GPU utilization,
              although attention strategy, memory traffic, and prompt length still matter.
            </p>
          </section>

          <section>
            <h2 className="article-heading">Phase two: decode</h2>
            <p>
              Decode generates one token per iteration. The new query attends to keys
              and values for the complete context, but old keys and values do not need
              to be recomputed.
            </p>
            <CodeBlock>
              {"activations: [B, 1, H]\nweights:     [H, H]\noutput:      [B, 1, H]"}
            </CodeBlock>
            <p>
              This is closer to a matrix-vector operation than a large matrix-matrix
              operation. Each step performs less arithmetic per request, but still
              reads model weights and relevant KV-cache entries.
            </p>
            <CodeBlock>
              {"while not finished:\n    hidden = embed(next_token)\n    for layer in layers:\n        q, k_new, v_new = layer.project_qkv(hidden)\n        kv_cache[layer].append(k_new, v_new)\n        hidden = layer.attend_decode(q, kv_cache[layer])\n        hidden = layer.feed_forward(hidden)\n    next_token = sample(lm_head(hidden))\n    yield next_token"}
            </CodeBlock>
            <p>
              The user-visible metric is usually <strong>inter-token latency (ITL)</strong>:
              the gap between generated tokens. Decode can have unused arithmetic
              capacity while waiting on memory movement or synchronization.
            </p>
          </section>

          <section>
            <h2 className="article-heading">Why the bottleneck changes</h2>
            <p>
              A useful first approximation is arithmetic intensity: operations performed
              divided by bytes moved. Large prefill GEMMs reuse weight tiles across many
              prompt tokens, which can expose compute throughput. Decode has less work
              per request and repeatedly moves large weights plus an expanding cache, so
              memory bandwidth and launch overhead become more visible.
            </p>
            <p>
              “Prefill is compute-bound and decode is memory-bound” is a hypothesis,
              not a law. Batching multiple decode requests can restore larger GEMMs, and
              an inefficient prefill kernel can still be bandwidth-limited. The answer
              comes from measurements.
            </p>
          </section>

          <Figure
            src="/blog/prefill-vs-decode/tiled-attention-kernel.png"
            alt="Tiled attention kernel using shared memory, registers, and running softmax statistics"
            caption="An IO-aware attention kernel keeps Q, K, and V tiles close to the compute units while maintaining running softmax statistics."
          />

          <section>
            <h2 className="article-heading">Attention kernels and IO</h2>
            <p>
              Naive attention materializes a score matrix with shape
              <code> [query_tokens, key_tokens]</code>. For long prompts, writing and
              rereading that intermediate can dominate memory traffic. Tiled,
              memory-efficient attention processes blocks of Q, K, and V, keeps partial
              results close to the compute units, and maintains the running statistics
              needed by softmax.
            </p>
            <CodeBlock>
              {"scores = Q @ K.transpose(-2, -1)\nprobabilities = softmax(scores)\noutput = probabilities @ V"}
            </CodeBlock>
            <p>
              FlashAttention is a well-known example of this IO-aware approach. The
              attention result is mathematically the same; the schedule reduces global
              memory traffic. During decode, a one-token query scans cached keys and
              values, making cache layout and coalesced access especially important.
            </p>
          </section>

          <section>
            <h2 className="article-heading">The KV cache: optimization and memory cost</h2>
            <p>
              Without a KV cache, every generated token would recompute keys and values
              for all previous tokens. The cache stores them once per layer, commonly in
              a layout resembling:
            </p>
            <CodeBlock>
              {"K cache: [batch, kv_heads, context_length, head_dim]\nV cache: [batch, kv_heads, context_length, head_dim]"}
            </CodeBlock>
            <p>
              Layout determines whether neighboring threads read adjacent addresses,
              whether updates are contiguous, and how efficiently requests with different
              sequence lengths can share a batch. Production systems preallocate space,
              use blocks or pages, and track which physical blocks belong to each request.
            </p>
            <p>
              Grouped-query attention and multi-query attention reduce the number of K/V
              heads. Cache quantization reduces bytes per element. Sliding windows limit
              history reads. Each technique changes a different point in the memory and
              accuracy trade-off.
            </p>
          </section>

          <Figure
            src="/blog/prefill-vs-decode/cuda-tiled-matmul.png"
            alt="CUDA tiled matrix multiplication using thread blocks, shared memory, and registers"
            caption="A CUDA thread block reuses matrix tiles through shared memory and keeps partial results in registers before writing the output tile."
          />

          <section>
            <h2 className="article-heading">A practical CUDA checklist</h2>
            <p>When investigating a slow kernel, ask:</p>
            <ul className="list-disc space-y-3 pl-6">
              <li>What output tile and reduction dimension does each block own?</li>
              <li>Where do operands live: global memory, shared memory, or registers?</li>
              <li>Are neighboring threads reading neighboring addresses?</li>
              <li>How much synchronization is necessary?</li>
              <li>Is decode launch overhead visible across layers and tokens?</li>
            </ul>
            <p className="mt-6">
              CUDA Graphs, operator fusion, persistent kernels, and better batching can
              reduce overhead, but their value depends on how stable request shapes are.
              Kernel optimization starts with understanding the tile, the data movement,
              and the synchronization schedule.
            </p>
          </section>

          <section>
            <h2 className="article-heading">Measuring the two phases correctly</h2>
            <p>
              CUDA launches are asynchronous from the CPU perspective, so timing only a
              Python call can measure launch submission rather than GPU execution. Use
              CUDA events around warmed-up work:
            </p>
            <CodeBlock>
              {"start = torch.cuda.Event(enable_timing=True)\nend = torch.cuda.Event(enable_timing=True)\n\nfor _ in range(warmup):\n    run_step()\n\ntorch.cuda.synchronize()\nstart.record()\nrun_step()\nend.record()\nend.synchronize()\nmilliseconds = start.elapsed_time(end)"}
            </CodeBlock>
            <p>
              Record the GPU, driver, PyTorch/CUDA versions, tensor shapes, dtype,
              warm-up count, repetitions, and whether transfers or sampling are included.
            </p>
          </section>

          <section>
            <h2 className="article-heading">What to ask when inference feels slow</h2>
            <ul className="list-disc space-y-3 pl-6">
              <li>Slow first token: inspect queueing, input transfers, and prefill kernels.</li>
              <li>Slow streaming: inspect decode arithmetic intensity, cache bandwidth, and launch overhead.</li>
              <li>High GPU utilization is not proof of efficient memory behavior.</li>
              <li>Longer context affects compute and cache capacity, reducing concurrency.</li>
            </ul>
          </section>

          <section className="border-t border-gray-200 pt-10 dark:border-zinc-800">
            <h2 className="article-heading">Conclusion</h2>
            <p>
              Prefill and decode are two phases of one request, but they are not the same
              workload. Prefill rewards broad parallelism and high-throughput matrix
              kernels. Decode rewards efficient memory movement, cache management,
              batching, and low launch overhead.
            </p>
            <p>
              The transformer equations are only the beginning. Inference performance is
              decided by how those equations are tiled, fused, quantized, scheduled, and
              connected to memory. That is the thread this project will follow: from
              equations, to tensor shapes, to CUDA kernels, to measurements.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}

