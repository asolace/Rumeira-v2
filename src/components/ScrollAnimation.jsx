import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 120;
const FRAME_PATH = "/frames";

const formatFrame = (n) => String(n).padStart(4, "0");
const frameUrl = (n) => `${FRAME_PATH}/frame_${formatFrame(n)}.webp`;

const STAGES = [
  {
    title: "Business analysis",
    body: "Deep audit of your business, channels, and all of your current digital presence.",
  },
  {
    title: "Website optimization",
    body: "Optimize a conversion-focused website built for SEO, user-journey, and trust.",
  },
  {
    title: "Marketing channels",
    body: "Search, local map pack, AI recommendations, social media, and paid ads",
  },
  {
    title: "AI workflows integration",
    body: "Project management, AI automation, content, and reporting on autopilot.",
  },
  {
    title: "We optimize and scale",
    body: "Continuous Social Media content creation with text, image and video to compound results.",
  },
];

export default function ScrollAnimation() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const rafRef = useRef(0);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const [stage, setStage] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Preload frames
  useEffect(() => {
    let cancelled = false;
    const images = new Array(TOTAL_FRAMES);
    let loadedCount = 0;

    const onDone = () => {
      if (cancelled) return;
      loadedCount += 1;
      if (loadedCount >= Math.min(12, TOTAL_FRAMES)) {
        setLoaded(true);
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.decoding = "async";
      img.loading = "eager";
      img.src = frameUrl(i + 1);
      img.onload = onDone;
      img.onerror = onDone;
      images[i] = img;
    }
    imagesRef.current = images;
    return () => {
      cancelled = true;
    };
  }, []);

  // Canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      drawFrame(currentFrameRef.current);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const drawFrame = (frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[Math.floor(frameIndex)];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = window.innerWidth;
    const ch = window.innerHeight;
    ctx.clearRect(0, 0, cw, ch);

    // cover-fit
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = cw / ch;
    let dw, dh, dx, dy;
    if (ir > cr) {
      dh = ch;
      dw = ch * ir;
      dx = (cw - dw) / 2;
      dy = 0;
    } else {
      dw = cw;
      dh = cw / ir;
      dx = 0;
      dy = (ch - dh) / 2;
    }
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  // Scroll handler
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = container.offsetHeight - vh;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = total > 0 ? scrolled / total : 0;

      targetFrameRef.current = progress * (TOTAL_FRAMES - 1);

      const stageIndex = Math.min(
        STAGES.length - 1,
        Math.floor(progress * STAGES.length),
      );
      setStage(stageIndex);
    };

    const tick = () => {
      const t = targetFrameRef.current;
      const c = currentFrameRef.current;
      // ease toward target for smoother frame updates
      const next = c + (t - c) * 0.18;
      if (Math.abs(next - c) > 0.01) {
        currentFrameRef.current = next;
        drawFrame(next);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [loaded]);

  return (
    <section
      id="story"
      ref={containerRef}
      className="relative bg-black text-white"
      style={{ height: "420vh" }}
      aria-label="How Rumeira builds your growth system"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        />

        {/* Vignette + grid */}
        <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-50 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black_85%)]"></div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70"></div>

        {/* Loading state */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-3 text-white/50">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#E0C67B]"></span>
              <span className="text-sm tracking-widest uppercase">
                Loading sequence
              </span>
            </div>
          </div>
        )}

        {/* Overlay text */}
        <div className="relative z-10 flex h-full items-start pt-24 md:pt-28">
          <div className="container-x w-full">
            <div className="max-w-md rounded-2xl border border-white/10 bg-black/85 p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-md md:max-w-lg md:p-10">
              <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-[#E0C67B]">
                <span>
                  Step {stage + 1} / {STAGES.length}
                </span>
                <span className="h-px w-12 bg-[#E0C67B]/60"></span>
              </div>

              {/* Animated text — keyed for crossfade */}
              <div className="relative min-h-[180px] md:min-h-[220px]">
                {STAGES.map((s, i) => (
                  <div
                    key={i}
                    className={`absolute inset-0 transition-all duration-700 ${
                      i === stage
                        ? "translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-3 opacity-0"
                    }`}
                  >
                    <h2 className="font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl">
                      {s.title}
                    </h2>
                    <p className="mt-5 max-w-xl text-base text-white/75 md:text-lg">
                      {s.body}
                    </p>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-10 flex items-center gap-1.5">
                {STAGES.map((_, i) => (
                  <span
                    key={i}
                    className={`h-[2px] flex-1 transition-colors duration-500 ${
                      i <= stage ? "bg-[#BC922C]" : "bg-white/15"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA button */}
        <div className="absolute bottom-6 right-6 hidden md:block">
          <a
            href="#cta"
            className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-7 py-4 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-[#BC922C] hover:bg-[#987622] hover:text-white"
          >
            Want animations on your website?
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 6h10m0 0L6 1m5 5L6 11"
                stroke="currentColor"
                stroke-width="1.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
