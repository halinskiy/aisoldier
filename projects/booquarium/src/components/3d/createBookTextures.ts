"use client";

import * as THREE from "three";

// ─── spread loader ────────────────────────────────────────────────────────────
// Loads /covers/spread.png once (cached) and updates a canvas texture with the
// correct crop. Fires after the procedural fallback has already painted the canvas,
// so R3F shows something immediately and the real image swaps in when ready.

let _spreadPromise: Promise<HTMLImageElement> | null = null;

function loadSpread(): Promise<HTMLImageElement> {
  if (!_spreadPromise) {
    _spreadPromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
      img.src = `${base}/covers/spread.png`;
    });
  }
  return _spreadPromise;
}

function applySpreadCrop(
  texture: THREE.CanvasTexture,
  canvas: HTMLCanvasElement,
  side: "front" | "back" | "spine"
) {
  loadSpread().then((img) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    if (side === "front") {
      const srcX = Math.round(img.width * 0.52);
      const srcW = img.width - srcX;
      ctx.drawImage(img, srcX, 0, srcW, img.height, 0, 0, W, H);
      // Black shadow on left (spine) edge
      const edgeW = 150;
      const edgeGrad = ctx.createLinearGradient(0, 0, edgeW, 0);
      edgeGrad.addColorStop(0, "rgba(0,0,0,1)");
      edgeGrad.addColorStop(0.6, "rgba(0,0,0,0.55)");
      edgeGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = edgeGrad;
      ctx.fillRect(0, 0, edgeW, H);
      // Black shadow on right (outer) edge — 100px
      const rEdgeW = 200;
      const rEdgeGrad = ctx.createLinearGradient(W, 0, W - rEdgeW, 0);
      rEdgeGrad.addColorStop(0, "rgba(0,0,0,1)");
      rEdgeGrad.addColorStop(0.5, "rgba(0,0,0,0.7)");
      rEdgeGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rEdgeGrad;
      ctx.fillRect(W - rEdgeW, 0, rEdgeW, H);
    } else if (side === "back") {
      const srcW = Math.round(img.width * 0.40);
      ctx.drawImage(img, 0, 0, srcW, img.height, 0, 0, W, H);
    } else {
      // Spine: middle strip ~40-52%
      const srcX = Math.round(img.width * 0.40);
      const srcW = Math.round(img.width * 0.12);
      ctx.drawImage(img, srcX, 0, srcW, img.height, 0, 0, W, H);
    }

    texture.needsUpdate = true;
  }).catch(() => {});
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function grain(ctx: CanvasRenderingContext2D, w: number, h: number, alpha = 0.04) {
  for (let i = 0; i < 7000; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = Math.random() * 0.9 + 0.1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * alpha})`;
    ctx.fill();
  }
}

function vignette(ctx: CanvasRenderingContext2D, w: number, h: number, opacity = 0.7) {
  const g = ctx.createRadialGradient(w / 2, h / 2, h * 0.18, w / 2, h / 2, h * 0.9);
  g.addColorStop(0, "transparent");
  g.addColorStop(1, `rgba(0,0,0,${opacity})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function goldBorder(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.strokeStyle = "#C9A84C";
  ctx.lineWidth = 2;
  ctx.strokeRect(14, 14, w - 28, h - 28);
  ctx.strokeStyle = "rgba(201,168,76,0.3)";
  ctx.lineWidth = 1;
  ctx.strokeRect(24, 24, w - 48, h - 48);
}

function cornerDiamond(ctx: CanvasRenderingContext2D, x: number, y: number, s = 7) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = "#C9A84C";
  ctx.fillRect(-s / 2, -s / 2, s, s);
  ctx.restore();
}

function compassRose(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number
) {
  const gold = "#C9A84C";
  const goldFade = "rgba(201,168,76,0.45)";

  // Outer ring
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = gold;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Middle ring
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Inner dot ring
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.13, 0, Math.PI * 2);
  ctx.lineWidth = 1;
  ctx.stroke();

  // 8 radiating lines
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4 - Math.PI / 2;
    const isCardinal = i % 2 === 0;
    const len = isCardinal ? r * 0.96 : r * 0.72;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * r * 0.16, cy + Math.sin(angle) * r * 0.16);
    ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
    ctx.strokeStyle = isCardinal ? gold : goldFade;
    ctx.lineWidth = isCardinal ? 1.5 : 0.8;
    ctx.stroke();
  }

  // Diamond tips on cardinal points
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2 - Math.PI / 2;
    const tipX = cx + Math.cos(angle) * r * 0.96;
    const tipY = cy + Math.sin(angle) * r * 0.96;
    const base = r * 0.62;
    const bx = cx + Math.cos(angle) * base;
    const by = cy + Math.sin(angle) * base;
    const px = Math.cos(angle + Math.PI / 2) * r * 0.11;
    const py = Math.sin(angle + Math.PI / 2) * r * 0.11;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(bx + px, by + py);
    ctx.lineTo(bx - px, by - py);
    ctx.closePath();
    ctx.fillStyle = gold;
    ctx.fill();
  }

  // Decorative cross lines between cardinal points
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2 - Math.PI / 2 + Math.PI / 4;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * r * 0.55, cy + Math.sin(angle) * r * 0.55);
    ctx.lineTo(cx + Math.cos(angle) * r * 0.72, cy + Math.sin(angle) * r * 0.72);
    ctx.strokeStyle = goldFade;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Center fill
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = gold;
  ctx.fill();
}

function hRule(
  ctx: CanvasRenderingContext2D,
  y: number,
  x1: number,
  x2: number,
  color = "rgba(201,168,76,0.5)",
  w = 1
) {
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.stroke();
}

function barcode(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const bars = 42;
  const barW = w / bars;
  for (let i = 0; i < bars; i++) {
    const thick = Math.random() > 0.65 ? 2 : 1;
    if (Math.random() > 0.3) {
      ctx.fillStyle = "rgba(248,243,233,0.85)";
      ctx.fillRect(x + i * barW, y, barW * thick * 0.55, h);
    }
  }
  ctx.fillStyle = "rgba(248,243,233,0.5)";
  ctx.font = "9px monospace";
  ctx.textAlign = "center";
  ctx.fillText("978-0-00-000000-0", x + w / 2, y + h + 14);
}

// ─── SPINE COVER ─────────────────────────────────────────────────────────────

export function createSpineTexture(): THREE.CanvasTexture {
  const W = 128, H = 720;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, W, H);
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  applySpreadCrop(tex, canvas, "spine");
  return tex;
}

// ─── FRONT COVER ─────────────────────────────────────────────────────────────

export function createFrontCoverTexture(): THREE.CanvasTexture {
  const W = 1024, H = 1440;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0d1b2a");
  bg.addColorStop(0.5, "#122438");
  bg.addColorStop(1, "#0a1520");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  grain(ctx, W, H, 0.045);
  vignette(ctx, W, H, 0.65);
  goldBorder(ctx, W, H);

  cornerDiamond(ctx, 14, 14);
  cornerDiamond(ctx, W - 14, 14);
  cornerDiamond(ctx, 14, H - 14);
  cornerDiamond(ctx, W - 14, H - 14);

  // Compass rose at centre (slightly above mid)
  compassRose(ctx, W / 2, H * 0.41, 104);

  // Top badge
  ctx.fillStyle = "rgba(201,168,76,0.75)";
  ctx.font = "600 11px 'Times New Roman', Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("A  N O V E L", W / 2, 70);
  hRule(ctx, 80, 80, W - 80, "rgba(201,168,76,0.35)");

  // Title block
  hRule(ctx, H * 0.66, 44, W - 44, "rgba(201,168,76,0.45)");

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(201,168,76,0.85)";
  ctx.font = "italic 21px 'Times New Roman', Georgia, serif";
  ctx.fillText("The", W / 2, H * 0.695);

  ctx.fillStyle = "#F8F3E9";
  ctx.font = "500 30px 'Times New Roman', Georgia, serif";
  ctx.fillText("Cartographer's", W / 2, H * 0.745);
  ctx.fillText("Daughter", W / 2, H * 0.793);

  hRule(ctx, H * 0.815, 44, W - 44, "rgba(201,168,76,0.45)");

  // Crimson accent bar
  ctx.fillStyle = "#B8322C";
  ctx.fillRect(W / 2 - 36, H - 128, 72, 2);

  // Author
  ctx.fillStyle = "rgba(248,243,233,0.82)";
  ctx.font = "600 13px 'Times New Roman', Georgia, serif";
  ctx.fillText("ELENA  VOSS", W / 2, H - 100);

  // Bottom ornament dot
  ctx.beginPath();
  ctx.arc(W / 2, H - 68, 3, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(201,168,76,0.6)";
  ctx.fill();

  // Black shadow on left (spine) edge
  const edgeFallbackW = 150;
  const edgeFallbackGrad = ctx.createLinearGradient(0, 0, edgeFallbackW, 0);
  edgeFallbackGrad.addColorStop(0, "rgba(0,0,0,1)");
  edgeFallbackGrad.addColorStop(0.6, "rgba(0,0,0,0.55)");
  edgeFallbackGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = edgeFallbackGrad;
  ctx.fillRect(0, 0, edgeFallbackW, H);
  // Black shadow on right (outer) edge
  const rFallbackW = 200;
  const rFallbackGrad = ctx.createLinearGradient(W, 0, W - rFallbackW, 0);
  rFallbackGrad.addColorStop(0, "rgba(0,0,0,1)");
  rFallbackGrad.addColorStop(0.5, "rgba(0,0,0,0.7)");
  rFallbackGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = rFallbackGrad;
  ctx.fillRect(W - rFallbackW, 0, rFallbackW, H);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  applySpreadCrop(tex, canvas, "front");
  return tex;
}

// ─── BACK COVER ──────────────────────────────────────────────────────────────

export function createBackCoverTexture(blurb: string, sourceLabel: string, synopsis: string): THREE.CanvasTexture {
  const W = 1024, H = 1440;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0a1520");
  bg.addColorStop(1, "#0d1b2a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  grain(ctx, W, H, 0.04);
  vignette(ctx, W, H, 0.5);

  // Simple single border
  ctx.strokeStyle = "#C9A84C";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(14, 14, W - 28, H - 28);

  cornerDiamond(ctx, 14, 14, 5);
  cornerDiamond(ctx, W - 14, 14, 5);
  cornerDiamond(ctx, 14, H - 14, 5);
  cornerDiamond(ctx, W - 14, H - 14, 5);

  // Opening quote
  ctx.fillStyle = "rgba(201,168,76,0.6)";
  ctx.font = "italic 52px 'Times New Roman', Georgia, serif";
  ctx.textAlign = "left";
  ctx.fillText("\u201C", 40, 96);

  // Blurb text — word-wrap helper
  const wrapText = (text: string, x: number, y: number, maxW: number, lineH: number, style: string, color: string) => {
    ctx.font = style;
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    const words = text.split(" ");
    let line = "";
    let curY = y;
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, x, curY);
        line = word;
        curY += lineH;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, x, curY);
    return curY + lineH;
  };

  let y = 106;
  y = wrapText(blurb, 44, y, W - 90, 24, "italic 15px 'Times New Roman', Georgia, serif", "rgba(248,243,233,0.88)");

  // Source attribution
  ctx.fillStyle = "#C9A84C";
  ctx.font = "600 11px 'Times New Roman', Georgia, serif";
  ctx.textAlign = "left";
  ctx.fillText(`\u2014 ${sourceLabel.toUpperCase()}`, 56, y + 8);
  y += 42;

  hRule(ctx, y, 40, W - 40, "rgba(201,168,76,0.3)");
  y += 24;

  // Synopsis
  wrapText(synopsis, 40, y, W - 80, 22, "15px 'Times New Roman', Georgia, serif", "rgba(248,243,233,0.68)");

  // Barcode (bottom right)
  barcode(ctx, W - 148, H - 96, 110, 52);

  // Publisher line (bottom left)
  ctx.fillStyle = "rgba(201,168,76,0.55)";
  ctx.font = "600 10px 'Times New Roman', Georgia, serif";
  ctx.textAlign = "left";
  ctx.fillText("BOOQUARIUM PRESS", 40, H - 44);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  applySpreadCrop(tex, canvas, "back");
  return tex;
}

// ─── PAGE SPREAD (two pages visible when book is open) ────────────────────────

export function createPageSpreadTexture(): THREE.CanvasTexture {
  const W = 1024, H = 720;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Paper background
  const paperGrad = ctx.createLinearGradient(0, 0, W, 0);
  paperGrad.addColorStop(0, "#ece9e0");
  paperGrad.addColorStop(0.48, "#f5f2e8");
  paperGrad.addColorStop(0.5, "#e8e4db"); // centre crease
  paperGrad.addColorStop(0.52, "#f5f2e8");
  paperGrad.addColorStop(1, "#ece9e0");
  ctx.fillStyle = paperGrad;
  ctx.fillRect(0, 0, W, H);

  // Subtle grain on paper
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    ctx.beginPath();
    ctx.arc(x, y, 0.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(100,80,60,${Math.random() * 0.04})`;
    ctx.fill();
  }

  // Spine shadow
  const spineGrad = ctx.createLinearGradient(W / 2 - 12, 0, W / 2 + 12, 0);
  spineGrad.addColorStop(0, "transparent");
  spineGrad.addColorStop(0.4, "rgba(0,0,0,0.12)");
  spineGrad.addColorStop(0.6, "rgba(0,0,0,0.08)");
  spineGrad.addColorStop(1, "transparent");
  ctx.fillStyle = spineGrad;
  ctx.fillRect(W / 2 - 12, 0, 24, H);

  // Margins
  const ML = 44, MR = 44, MT = 52, MB = 52;
  const HW = W / 2; // half width
  const pageW = HW - ML - MR;

  // ── LEFT PAGE ──
  const LX = ML;
  let LY = MT;

  // Running header (small caps)
  ctx.fillStyle = "#888070";
  ctx.font = "10px 'Times New Roman', Georgia, serif";
  ctx.textAlign = "left";
  ctx.fillText("ELENA VOSS", LX, LY);
  hRule(ctx, LY + 6, LX, HW - MR, "rgba(100,80,60,0.2)");
  LY += 28;

  // Chapter ornament
  const ornX = LX + pageW / 2;
  hRule(ctx, LY, LX, HW - MR, "rgba(100,80,60,0.25)");
  LY += 14;
  ctx.fillStyle = "#C9A84C";
  ctx.font = "600 10px 'Times New Roman', Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("✦  ONE  ✦", ornX, LY);
  LY += 14;
  hRule(ctx, LY, LX, HW - MR, "rgba(100,80,60,0.25)");
  LY += 24;

  // Chapter title
  ctx.fillStyle = "#2a2218";
  ctx.font = "italic 20px 'Times New Roman', Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("The Map Room", ornX, LY);
  LY += 36;

  // Drop cap + body text
  ctx.textAlign = "left";
  const bodyStyle = "15px 'Times New Roman', Georgia, serif";
  const bodyColor = "#2a2218";

  // Drop cap "T"
  ctx.fillStyle = "#B8322C";
  ctx.font = "bold 54px 'Times New Roman', Georgia, serif";
  ctx.fillText("T", LX, LY + 40);
  const dropCapW = ctx.measureText("T").width + 4;

  // First line continues after drop cap
  ctx.fillStyle = bodyColor;
  ctx.font = bodyStyle;
  const firstLineParts = [
    { text: "he maps covered every wall of the flat.", x: LX + dropCapW, y: LY + 2 },
    { text: "They had been there, Mara assumed, for", x: LX + dropCapW, y: LY + 20 },
    { text: "decades — some of them curling at the", x: LX + dropCapW, y: LY + 38 },
  ];
  for (const p of firstLineParts) ctx.fillText(p.text, p.x, p.y);
  LY += 62;

  const leftLines = [
    "corners, their colours faded to the amber",
    "tones of old photographs. She stood in the",
    "doorway with her coat still on and her keys",
    "in her hand, unable to step inside, as though",
    "the flat knew she did not belong there.",
    "",
    "The smell of the place — cedar and cold ash",
    "and something metallic she could not name —",
    "pressed itself against her face like a held-back",
    "apology. Her father had left her the flat in his",
    "will, along with the maps and a key to a safety-",
    "deposit box she had not yet opened.",
  ];
  for (const line of leftLines) {
    ctx.fillText(line, LX, LY);
    LY += 20;
  }

  // Page number
  ctx.fillStyle = "#888070";
  ctx.font = "12px 'Times New Roman', Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("1", LX + pageW / 2, H - MB + 12);

  // ── RIGHT PAGE ──
  const RX = HW + ML;
  let RY = MT;

  // Running header
  ctx.fillStyle = "#888070";
  ctx.font = "10px 'Times New Roman', Georgia, serif";
  ctx.textAlign = "right";
  ctx.fillText("THE CARTOGRAPHER'S DAUGHTER", HW + pageW + MR, RY);
  hRule(ctx, RY + 6, RX, HW + pageW + MR, "rgba(100,80,60,0.2)");
  RY += 28;

  const rightLines = [
    "Her father had not said, in any of his letters,",
    "that he kept maps. He had written about the",
    "weather in Edinburgh. About the quality of",
    "the light in November. About a particular stone",
    "bridge he could see from the window. He had",
    "never written about the maps.",
    "",
    "He had never written about her mother.",
    "",
    "He had never written about the eight hundred",
    "miles of sea and time that had grown between",
    "them like a geography no cartographer had yet",
    "agreed to chart.",
    "",
    "Mara set her keys on the windowsill, because",
    "that seemed like the thing to do, and began",
    "to look more carefully at the walls.",
  ];
  ctx.fillStyle = bodyColor;
  ctx.font = bodyStyle;
  ctx.textAlign = "left";
  for (const line of rightLines) {
    ctx.fillText(line, RX, RY);
    RY += 20;
  }

  // Page number
  ctx.fillStyle = "#888070";
  ctx.font = "12px 'Times New Roman', Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("2", RX + pageW / 2, H - MB + 12);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ─── PAGE EDGE TEXTURE (sides of the pages block) ────────────────────────────

export function createPageEdgeTexture(): THREE.CanvasTexture {
  const W = 128, H = 32;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#ece9e0";
  ctx.fillRect(0, 0, W, H);

  // Horizontal page lines
  for (let y = 0; y < H; y += 2) {
    const shade = 180 + Math.random() * 20;
    ctx.fillStyle = `rgb(${shade},${shade - 10},${shade - 20})`;
    ctx.fillRect(0, y, W, 1);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 1);
  tex.needsUpdate = true;
  return tex;
}

// ─── INSIDE COVER (seen when front cover is open) ────────────────────────────

export function createInsideCoverTexture(): THREE.CanvasTexture {
  const W = 512, H = 720;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#ede8de";
  ctx.fillRect(0, 0, W, H);

  // Subtle marbled texture
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(100,80,50,${Math.random() * 0.04})`;
    ctx.fill();
  }

  // Bookplate — small centred ornament
  compassRose(ctx, W / 2, H * 0.35, 60);

  ctx.fillStyle = "rgba(100,80,50,0.45)";
  ctx.font = "italic 13px 'Times New Roman', Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("From the library of", W / 2, H * 0.56);

  // Blank line for owner's name
  hRule(ctx, H * 0.59, W / 2 - 80, W / 2 + 80, "rgba(100,80,50,0.35)");

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}
