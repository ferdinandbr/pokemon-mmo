// Ground Decal & Battle Residue System for Pokemon Arena 2D
// Keeps the arena dynamically marked with scorches, blast craters, fissures, and stains
// Provides persistent combat wear with progressive fade-out & high 60 FPS performance

export class DecalSystem {
  constructor(maxDecals = 50) {
    this.decals = [];
    this.maxDecals = maxDecals;
  }

  reset() {
    this.decals = [];
  }

  /**
   * Add a ground decal at (x, y)
   * Types: 'scorch' (fire/explosion), 'crack' (physical/earth shock),
   *        'zap_burn' (electric bolt), 'wet' (water puddle), 'shadow' (ghost stain)
   */
  addDecal(x, y, type = 'scorch', radius = 24, duration = 10.0) {
    // Generate pre-calculated pixel clusters / jagged geometry so rendering at 60 FPS is fast
    const points = this.generateDecalShape(type, radius);

    const decal = {
      x: Math.round(x),
      y: Math.round(y),
      type,
      radius,
      duration,
      time: 0,
      fadeDuration: 3.5, // Fades out smoothly in last 3.5 seconds
      alpha: 1.0,
      points,
    };

    this.decals.push(decal);

    // Limit maximum active decals to prevent memory overhead or frame drops
    if (this.decals.length > this.maxDecals) {
      // Accelerate fade of oldest decals
      const oldest = this.decals[0];
      oldest.time = Math.max(oldest.time, oldest.duration - 1.0);
    }
  }

  generateDecalShape(type, radius) {
    const points = [];
    const pixelSize = 3;

    if (type === 'scorch') {
      // Irregular charred oval with perimeter pixel splatter
      const numBlocks = Math.floor(radius * 1.6);
      for (let i = 0; i < numBlocks; i++) {
        const ang = Math.random() * Math.PI * 2;
        const dist = Math.sqrt(Math.random()) * radius;
        // Squish slightly along Y for isometric top-down perspective (0.65)
        const px = Math.round(Math.cos(ang) * dist / pixelSize) * pixelSize;
        const py = Math.round(Math.sin(ang) * dist * 0.65 / pixelSize) * pixelSize;
        const shade = Math.random() < 0.6 ? '#110d0c' : (Math.random() < 0.8 ? '#1f1614' : '#2b1b15');
        const sz = Math.random() < 0.4 ? pixelSize * 2 : pixelSize;
        points.push({ x: px, y: py, size: sz, color: shade });
      }
    } else if (type === 'crack') {
      // Jagged fracture cracks branching from epicenter
      const numBranches = 4 + Math.floor(Math.random() * 3);
      for (let b = 0; b < numBranches; b++) {
        const baseAng = (b / numBranches) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        let curX = 0;
        let curY = 0;
        const length = radius * (0.7 + Math.random() * 0.5);
        const steps = Math.floor(length / (pixelSize * 1.5));

        for (let s = 0; s < steps; s++) {
          const stepAng = baseAng + (Math.random() - 0.5) * 0.7;
          curX += Math.cos(stepAng) * pixelSize * 1.4;
          curY += Math.sin(stepAng) * pixelSize * 1.4 * 0.65;
          const px = Math.round(curX / pixelSize) * pixelSize;
          const py = Math.round(curY / pixelSize) * pixelSize;
          points.push({ x: px, y: py, size: pixelSize, color: '#0d131a' });

          // Occasional gravel debris
          if (Math.random() < 0.25) {
            points.push({
              x: px + (Math.random() > 0.5 ? pixelSize : -pixelSize),
              y: py + (Math.random() > 0.5 ? pixelSize : -pixelSize),
              size: pixelSize,
              color: '#37474f',
            });
          }
        }
      }
    } else if (type === 'zap_burn') {
      // Starburst scorched lightning strike
      const rays = 6;
      for (let r = 0; r < rays; r++) {
        const ang = (r / rays) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const dist = radius * (0.6 + Math.random() * 0.5);
        for (let d = 0; d < dist; d += pixelSize) {
          const px = Math.round(Math.cos(ang) * d / pixelSize) * pixelSize;
          const py = Math.round(Math.sin(ang) * d * 0.65 / pixelSize) * pixelSize;
          points.push({ x: px, y: py, size: pixelSize, color: '#16130b' });
        }
      }
      // Amber/yellow scorched core dots
      for (let i = 0; i < 8; i++) {
        const ang = Math.random() * Math.PI * 2;
        const d = Math.random() * (radius * 0.35);
        points.push({
          x: Math.round(Math.cos(ang) * d / pixelSize) * pixelSize,
          y: Math.round(Math.sin(ang) * d * 0.65 / pixelSize) * pixelSize,
          size: pixelSize,
          color: '#ff8f00',
        });
      }
    } else if (type === 'wet') {
      // Water splash puddle with specular sheen
      const numBlocks = Math.floor(radius * 1.2);
      for (let i = 0; i < numBlocks; i++) {
        const ang = Math.random() * Math.PI * 2;
        const dist = Math.sqrt(Math.random()) * radius;
        const px = Math.round(Math.cos(ang) * dist / pixelSize) * pixelSize;
        const py = Math.round(Math.sin(ang) * dist * 0.6 / pixelSize) * pixelSize;
        const shade = Math.random() < 0.7 ? 'rgba(2, 136, 209, 0.45)' : 'rgba(128, 216, 255, 0.75)';
        points.push({ x: px, y: py, size: pixelSize * 1.5, color: shade });
      }
    } else if (type === 'shadow') {
      // Ethereal dark void stain
      const numBlocks = Math.floor(radius * 1.3);
      for (let i = 0; i < numBlocks; i++) {
        const ang = Math.random() * Math.PI * 2;
        const dist = Math.sqrt(Math.random()) * radius;
        const px = Math.round(Math.cos(ang) * dist / pixelSize) * pixelSize;
        const py = Math.round(Math.sin(ang) * dist * 0.65 / pixelSize) * pixelSize;
        const shade = Math.random() < 0.6 ? '#120024' : '#28004d';
        points.push({ x: px, y: py, size: pixelSize * 1.5, color: shade });
      }
    }

    return points;
  }

  update(dt) {
    for (let i = this.decals.length - 1; i >= 0; i--) {
      const d = this.decals[i];
      d.time += dt;

      if (d.time >= d.duration) {
        this.decals.splice(i, 1);
        continue;
      }

      // Smooth progressive fade-out in remaining time
      const remaining = d.duration - d.time;
      if (remaining <= d.fadeDuration) {
        d.alpha = Math.max(0, remaining / d.fadeDuration);
      } else {
        d.alpha = 1.0;
      }
    }
  }

  render(ctx) {
    if (this.decals.length === 0) return;

    ctx.save();
    for (const d of this.decals) {
      ctx.save();
      ctx.globalAlpha = d.alpha * 0.85;
      ctx.translate(d.x, d.y);

      for (const pt of d.points) {
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
      }
      ctx.restore();
    }
    ctx.restore();
  }
}
