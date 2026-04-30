// Animated mesh visualization for the hero canvas. Vanilla JS port of
// the React MeshViz component from the design handoff — no React, no
// preact, just requestAnimationFrame + a 2D canvas.
//
// Triggered automatically by the inline <script type="module"> at the
// bottom of index.astro, which calls initMeshViz() once the DOM is
// ready.

export function initMeshViz(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;

  let W = 0;
  let H = 0;
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    W = r.width;
    H = r.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // 1 hub + ring of peers. Labels mirror the kinds of nodes a real
  // openZro mesh hosts — edges, databases, k8s clusters, office, mobile.
  const peers = 9;
  const labels = [
    "edge-sa",
    "edge-eu",
    "edge-us",
    "db-prim",
    "db-repl",
    "k8s-prod",
    "k8s-stg",
    "office",
    "mobile",
  ];
  const peerLinks = [
    [1, 2],
    [2, 3],
    [4, 5],
    [6, 7],
    [1, 8],
    [3, 9],
  ];

  const nodes = [{ x: 0, y: 0, r: 14, hub: true, label: "gateway" }];
  for (let i = 0; i < peers; i++) {
    const a = (i / peers) * Math.PI * 2 - Math.PI / 2;
    nodes.push({
      x: 0,
      y: 0,
      r: 7,
      hub: false,
      label: labels[i],
      baseAngle: a,
      phase: Math.random() * Math.PI * 2,
    });
  }

  const packets = [];
  const spawn = () => {
    const fromHub = Math.random() < 0.7;
    let a;
    let b;
    if (fromHub) {
      a = 0;
      b = 1 + Math.floor(Math.random() * (nodes.length - 1));
      if (Math.random() < 0.4) [a, b] = [b, a];
    } else {
      const link = peerLinks[Math.floor(Math.random() * peerLinks.length)];
      [a, b] = Math.random() < 0.5 ? link : [link[1], link[0]];
    }
    packets.push({ a, b, t: 0, speed: 0.004 + Math.random() * 0.006 });
  };
  let spawnTimer = 0;

  const start = performance.now();
  let raf = 0;

  const tick = (now) => {
    const t = (now - start) / 1000;
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;
    const radius = Math.min(W, H) * 0.36;

    nodes.forEach((n, i) => {
      if (i === 0) {
        n.x = cx;
        n.y = cy;
        return;
      }
      const wob = Math.sin(t * 0.6 + n.phase) * 4;
      const a = n.baseAngle + Math.sin(t * 0.2 + n.phase) * 0.04;
      n.x = cx + Math.cos(a) * (radius + wob);
      n.y = cy + Math.sin(a) * (radius + wob);
    });

    // Hub→peer edges with violet gradient.
    ctx.lineWidth = 1;
    for (let i = 1; i < nodes.length; i++) {
      const n = nodes[i];
      const grad = ctx.createLinearGradient(nodes[0].x, nodes[0].y, n.x, n.y);
      grad.addColorStop(0, "rgba(139,92,246,0.45)");
      grad.addColorStop(1, "rgba(139,92,246,0.08)");
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);
      ctx.lineTo(n.x, n.y);
      ctx.stroke();
    }

    // Peer↔peer dashed links.
    ctx.strokeStyle = "rgba(167,139,250,0.18)";
    ctx.setLineDash([3, 4]);
    peerLinks.forEach(([a, b]) => {
      ctx.beginPath();
      ctx.moveTo(nodes[a].x, nodes[a].y);
      ctx.lineTo(nodes[b].x, nodes[b].y);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Animated packets — glowing white head + violet tail.
    spawnTimer += 16;
    if (spawnTimer > 280) {
      spawn();
      spawnTimer = 0;
    }
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      p.t += p.speed * 16;
      if (p.t >= 1) {
        packets.splice(i, 1);
        continue;
      }
      const A = nodes[p.a];
      const B = nodes[p.b];
      const x = A.x + (B.x - A.x) * p.t;
      const y = A.y + (B.y - A.y) * p.t;
      const tailX = A.x + (B.x - A.x) * Math.max(0, p.t - 0.08);
      const tailY = A.y + (B.y - A.y) * Math.max(0, p.t - 0.08);
      const grd = ctx.createLinearGradient(tailX, tailY, x, y);
      grd.addColorStop(0, "rgba(196,181,253,0)");
      grd.addColorStop(1, "rgba(255,255,255,0.95)");
      ctx.strokeStyle = grd;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.shadowColor = "#a78bfa";
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Nodes.
    nodes.forEach((n, i) => {
      const pulse = i === 0 ? 1 + Math.sin(t * 2) * 0.06 : 1;
      const haloR = (i === 0 ? 32 : 18) * pulse;
      const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, haloR);
      halo.addColorStop(
        0,
        i === 0 ? "rgba(167,139,250,0.6)" : "rgba(139,92,246,0.4)",
      );
      halo.addColorStop(1, "rgba(139,92,246,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(n.x, n.y, haloR, 0, Math.PI * 2);
      ctx.fill();

      if (i === 0) {
        const g = ctx.createLinearGradient(
          n.x - n.r,
          n.y - n.r,
          n.x + n.r,
          n.y + n.r,
        );
        g.addColorStop(0, "#a78bfa");
        g.addColorStop(1, "#5b21b6");
        ctx.fillStyle = g;
      } else {
        ctx.fillStyle = "#0f0a1f";
      }
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
      ctx.fill();
      if (i !== 0) {
        ctx.strokeStyle = "rgba(167,139,250,0.6)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = "#a78bfa";
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(n.x - 5, n.y);
        ctx.lineTo(n.x + 5, n.y);
        ctx.moveTo(n.x, n.y - 5);
        ctx.lineTo(n.x, n.y + 5);
        ctx.stroke();
      }

      if (i !== 0) {
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = "center";
        ctx.fillText(n.label, n.x, n.y + n.r + 14);
      }
    });

    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
  };
}
