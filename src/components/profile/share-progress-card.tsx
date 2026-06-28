"use client";

import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Share2, Download, Copy, Check, X, Loader2
} from "lucide-react";

interface ShareStats {
  name: string;
  level: number;
  levelLabel: string;
  totalXp: number;
  problemsSolved: number;
  streakDays: number;
  projectsCount: number;
  avatarUrl?: string;
}

interface ShareProgressCardProps {
  stats: ShareStats;
}

// Draws the share card onto a canvas and returns a data URL
async function drawCard(stats: ShareStats): Promise<string> {
  const W = 1080;
  const H = 566; // ~1.91:1 — ideal for LinkedIn, Twitter, WhatsApp

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // ── Background gradient ──────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#09090b");
  bg.addColorStop(0.6, "#0f0f14");
  bg.addColorStop(1, "#09090b");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle grid dots
  ctx.fillStyle = "rgba(99,102,241,0.07)";
  for (let x = 24; x < W; x += 36) {
    for (let y = 24; y < H; y += 36) {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Indigo glow top-left
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 460);
  glow.addColorStop(0, "rgba(99,102,241,0.18)");
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // ── Border ───────────────────────────────────────────────────────
  ctx.strokeStyle = "rgba(99,102,241,0.25)";
  ctx.lineWidth = 2;
  roundRect(ctx, 1, 1, W - 2, H - 2, 24);
  ctx.stroke();

  // ── Brand pill top-left ──────────────────────────────────────────
  ctx.fillStyle = "rgba(99,102,241,0.15)";
  roundRect(ctx, 48, 44, 160, 36, 18);
  ctx.fill();

  ctx.fillStyle = "#818cf8";
  ctx.font = "bold 15px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("⚡  Engineering OS", 66, 67);

  // ── Avatar circle ────────────────────────────────────────────────
  const AX = 80;
  const AY = 130;
  const AR = 48;

  ctx.save();
  ctx.beginPath();
  ctx.arc(AX + AR, AY + AR, AR, 0, Math.PI * 2);
  ctx.clip();

  if (stats.avatarUrl) {
    try {
      const img = await loadImage(stats.avatarUrl);
      ctx.drawImage(img, AX, AY, AR * 2, AR * 2);
    } catch {
      drawInitialsCircle(ctx, stats.name, AX + AR, AY + AR, AR);
    }
  } else {
    drawInitialsCircle(ctx, stats.name, AX + AR, AY + AR, AR);
  }
  ctx.restore();

  // Avatar ring
  ctx.strokeStyle = "#6366f1";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(AX + AR, AY + AR, AR + 4, 0, Math.PI * 2);
  ctx.stroke();

  // ── Name + level ─────────────────────────────────────────────────
  ctx.fillStyle = "#f4f4f5";
  ctx.font = "bold 40px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(stats.name || "Engineer", 192, 178);

  // Level badge
  ctx.fillStyle = "rgba(99,102,241,0.2)";
  roundRect(ctx, 192, 194, 220, 34, 17);
  ctx.fill();

  ctx.fillStyle = "#a5b4fc";
  ctx.font = "600 15px system-ui, sans-serif";
  ctx.fillText(`✦  Level ${stats.level}  ·  ${stats.levelLabel}`, 210, 216);

  // XP badge
  ctx.fillStyle = "rgba(245,158,11,0.15)";
  roundRect(ctx, 424, 194, 170, 34, 17);
  ctx.fill();
  ctx.fillStyle = "#fcd34d";
  ctx.fillText(`⚡  ${fmtNum(stats.totalXp)} XP`, 442, 216);

  // ── Divider ───────────────────────────────────────────────────────
  ctx.strokeStyle = "rgba(255,255,255,0.07)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(48, 270);
  ctx.lineTo(W - 48, 270);
  ctx.stroke();

  // ── Stat cards ────────────────────────────────────────────────────
  const statItems = [
    { label: "Problems Solved", value: String(stats.problemsSolved), color: "#34d399", icon: "✓" },
    { label: "Day Streak",      value: `${stats.streakDays}d`,       color: "#60a5fa", icon: "🔥" },
    { label: "Projects Built",  value: String(stats.projectsCount),  color: "#c084fc", icon: "🚀" },
    { label: "Total XP",        value: fmtNum(stats.totalXp),        color: "#fbbf24", icon: "⚡" },
  ];

  const cardW = (W - 96 - 36) / 4;
  const cardX0 = 48;
  const cardY = 294;
  const cardH = 180;

  statItems.forEach((s, i) => {
    const cx = cardX0 + i * (cardW + 12);

    // Card bg
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    roundRect(ctx, cx, cardY, cardW, cardH, 16);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    roundRect(ctx, cx, cardY, cardW, cardH, 16);
    ctx.stroke();

    // Bottom color bar
    ctx.fillStyle = s.color + "33";
    roundRect(ctx, cx, cardY + cardH - 6, cardW, 6, { tl: 0, tr: 0, br: 16, bl: 16 });
    ctx.fill();
    ctx.fillStyle = s.color;
    roundRect(ctx, cx, cardY + cardH - 4, cardW * 0.6, 4, { tl: 0, tr: 0, br: 4, bl: 4 });
    ctx.fill();

    // Icon
    ctx.font = "28px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(s.icon, cx + cardW / 2, cardY + 50);

    // Value
    ctx.fillStyle = s.color;
    ctx.font = `bold 38px system-ui, sans-serif`;
    ctx.fillText(s.value, cx + cardW / 2, cardY + 110);

    // Label
    ctx.fillStyle = "#71717a";
    ctx.font = "13px system-ui, sans-serif";
    ctx.fillText(s.label, cx + cardW / 2, cardY + 135);
  });

  // ── Footer ────────────────────────────────────────────────────────
  ctx.fillStyle = "#3f3f46";
  ctx.font = "13px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("engineering-os.vercel.app  ·  Built with Engineering OS", W / 2, H - 22);

  return canvas.toDataURL("image/png");
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawInitialsCircle(ctx: CanvasRenderingContext2D, name: string, cx: number, cy: number, r: number) {
  const grd = ctx.createRadialGradient(cx - r / 3, cy - r / 3, 0, cx, cy, r);
  grd.addColorStop(0, "#6366f1");
  grd.addColorStop(1, "#4338ca");
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  const parts = name.trim().split(" ");
  const initials = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  ctx.fillStyle = "white";
  ctx.font = `bold ${r * 0.75}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(initials.toUpperCase() || "E", cx, cy);
  ctx.textBaseline = "alphabetic";
}

type Radii = number | { tl: number; tr: number; br: number; bl: number };
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: Radii) {
  const tl = typeof r === "number" ? r : r.tl;
  const tr = typeof r === "number" ? r : r.tr;
  const br = typeof r === "number" ? r : r.br;
  const bl = typeof r === "number" ? r : r.bl;
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + tr);
  ctx.lineTo(x + w, y + h - br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
  ctx.lineTo(x + bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - bl);
  ctx.lineTo(x, y + tl);
  ctx.quadraticCurveTo(x, y, x + tl, y);
  ctx.closePath();
}

function fmtNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// ── Component ────────────────────────────────────────────────────────────────

export function ShareProgressCard({ stats }: ShareProgressCardProps) {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const previewRef = useRef<HTMLImageElement>(null);

  const shareText = `🚀 My Engineering OS Progress\n✦ Level ${stats.level} ${stats.levelLabel}\n✓ ${stats.problemsSolved} Problems Solved\n🔥 ${stats.streakDays} Day Streak\n⚡ ${stats.totalXp} XP\n\nTrack your engineering journey at engineering-os.vercel.app`;

  const generate = useCallback(async () => {
    setGenerating(true);
    try {
      const url = await drawCard(stats);
      setImageUrl(url);
    } finally {
      setGenerating(false);
    }
  }, [stats]);

  const handleOpen = async () => {
    setOpen(true);
    if (!imageUrl) await generate();
  };

  const downloadImage = () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `engineering-os-progress-${stats.name.replace(/\s+/g, "-").toLowerCase()}.png`;
    a.click();
  };

  const copyImage = async () => {
    if (!imageUrl) return;
    try {
      const blob = await (await fetch(imageUrl)).blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: copy text
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyShareText = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const twitterUrl  = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://engineering-os.vercel.app")}&summary=${encodeURIComponent(shareText)}`;

  // Web Share API (works great on mobile — native share sheet)
  const nativeShare = async () => {
    if (!navigator.share) return;
    try {
      if (imageUrl && navigator.canShare) {
        const blob = await (await fetch(imageUrl)).blob();
        const file = new File([blob], "progress.png", { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ title: "My Engineering OS Progress", text: shareText, files: [file] });
          return;
        }
      }
      await navigator.share({ title: "My Engineering OS Progress", text: shareText });
    } catch {}
  };

  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  if (!open) {
    return (
      <Button
        onClick={handleOpen}
        variant="outline"
        size="sm"
        className="border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-indigo-500/50 gap-2 text-xs"
      >
        <Share2 className="size-3.5" /> Share Progress
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div>
            <h2 className="font-bold text-zinc-100 text-base">Share Your Progress</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Download the card or share directly to your socials</p>
          </div>
          <Button variant="ghost" size="icon" className="size-8 text-zinc-500" onClick={() => setOpen(false)}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="p-5 space-y-5">
          {/* Preview */}
          <div className="relative rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 aspect-[1.91/1] flex items-center justify-center">
            {generating ? (
              <div className="flex flex-col items-center gap-2 text-zinc-500">
                <Loader2 className="size-6 animate-spin text-indigo-400" />
                <span className="text-xs">Generating card…</span>
              </div>
            ) : imageUrl ? (
              <img ref={previewRef} src={imageUrl} alt="Progress card" className="w-full h-full object-contain" />
            ) : null}
          </div>

          {/* Regenerate */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-zinc-700 text-zinc-400 hover:text-zinc-200 gap-2 text-xs"
              onClick={generate}
              disabled={generating}
            >
              {generating ? <Loader2 className="size-3.5 animate-spin" /> : "↻ Regenerate"}
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 gap-2 text-xs"
              onClick={downloadImage}
              disabled={!imageUrl}
            >
              <Download className="size-3.5" /> Download PNG
            </Button>
          </div>

          {/* Share buttons */}
          <div>
            <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider mb-3">Share to</p>
            <div className="grid grid-cols-2 gap-2">

              {/* WhatsApp */}
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button variant="outline" size="sm" className="w-full border-zinc-700 hover:border-green-500/50 hover:bg-green-500/5 gap-2 text-xs text-zinc-300">
                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </Button>
              </a>

              {/* Twitter / X */}
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button variant="outline" size="sm" className="w-full border-zinc-700 hover:border-sky-500/50 hover:bg-sky-500/5 gap-2 text-xs text-zinc-300">
                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Twitter / X
                </Button>
              </a>

              {/* LinkedIn */}
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button variant="outline" size="sm" className="w-full border-zinc-700 hover:border-blue-500/50 hover:bg-blue-500/5 gap-2 text-xs text-zinc-300">
                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </Button>
              </a>

              {/* Instagram — copy card for manual post */}
              <Button
                variant="outline"
                size="sm"
                className="w-full border-zinc-700 hover:border-pink-500/50 hover:bg-pink-500/5 gap-2 text-xs text-zinc-300"
                onClick={copyImage}
              >
                {copied ? (
                  <><Check className="size-4 text-green-400" /> Copied!</>
                ) : (
                  <>
                    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                    Instagram (Copy)
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Native share (mobile) */}
          {hasNativeShare && (
            <Button
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 gap-2 text-xs border border-zinc-700"
              size="sm"
              onClick={nativeShare}
            >
              <Share2 className="size-3.5" /> More options (native share)
            </Button>
          )}

          {/* Copy text fallback */}
          <div className="border border-zinc-800 rounded-xl p-3 bg-zinc-950">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">Share Text</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-zinc-500 hover:text-zinc-300 gap-1"
                onClick={copyShareText}
              >
                {copiedLink ? <><Check className="size-3 text-green-400" /> Copied</> : <><Copy className="size-3" /> Copy</>}
              </Button>
            </div>
            <p className="text-xs text-zinc-500 whitespace-pre-line leading-relaxed">{shareText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
