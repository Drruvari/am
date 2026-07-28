import { type CSSProperties, useEffect, useRef } from "react";
import * as THREE from "three";
import "./style.scss";

const MAX_COLORS = 8;

const fragmentShader = `
#define MAX_COLORS ${MAX_COLORS}
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer;
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
uniform int uIterations;
uniform float uIntensity;
uniform float uBandWidth;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  vec2 toward = uPointer - rp;
  q += toward * uMouseInfluence * 0.2;

  for (int j = 0; j < 5; j++) {
    if (j >= uIterations - 1) break;
    vec2 rr = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
    q += (rr - q) * 0.15;
  }

  vec3 col = vec3(0.0);
  float a = 1.0;

  if (uColorCount > 0) {
    vec2 s = q;
    vec3 sumCol = vec3(0.0);
    float cover = 0.0;
    for (int i = 0; i < MAX_COLORS; ++i) {
      if (i >= uColorCount) break;
      s -= 0.01;
      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
      float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
      float kBelow = clamp(uWarpStrength, 0.0, 1.0);
      float kMix = pow(kBelow, 0.3);
      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
      vec2 disp = (r - s) * kBelow;
      vec2 warped = s + disp * gain;
      float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
      float m = mix(m0, m1, kMix);
      float w = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
      sumCol += uColors[i] * w;
      cover = max(cover, w);
    }
    col = clamp(sumCol, 0.0, 1.0);
    a = uTransparent > 0 ? cover : 1.0;
  }

  col *= uIntensity;

  if (uNoise > 0.0001) {
    float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
    col += (n - 0.5) * uNoise;
    col = clamp(col, 0.0, 1.0);
  }

  vec3 rgb = uTransparent > 0 ? col * a : col;
  gl_FragColor = vec4(rgb, a);
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

type ColorBendsProps = {
  autoRotate?: number;
  bandWidth?: number;
  className?: string;
  color?: string;
  colors?: readonly string[];
  frequency?: number;
  intensity?: number;
  iterations?: number;
  mouseInfluence?: number;
  noise?: number;
  parallax?: number;
  rotation?: number;
  scale?: number;
  speed?: number;
  style?: CSSProperties;
  transparent?: boolean;
  warpStrength?: number;
};

export default function ColorBends({
  autoRotate = 0,
  bandWidth = 6,
  className = "",
  colors = [],
  frequency = 1,
  intensity = 1.5,
  iterations = 1,
  mouseInfluence = 1,
  noise = 0.15,
  parallax = 0.5,
  rotation = 90,
  scale = 1,
  speed = 0.2,
  style,
  transparent = true,
  warpStrength = 1,
}: ColorBendsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rotationRef = useRef(rotation);
  const autoRotateRef = useRef(autoRotate);
  const pointerTargetRef = useRef(new THREE.Vector2());
  const pointerCurrentRef = useRef(new THREE.Vector2());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const colorUniforms = Array.from(
      { length: MAX_COLORS },
      () => new THREE.Vector3(),
    );
    const colorValues = colors
      .filter(Boolean)
      .slice(0, MAX_COLORS)
      .map((value) => new THREE.Color(value));
    colorValues.forEach((value, index) => {
      colorUniforms[index].set(value.r, value.g, value.b);
    });

    const material = new THREE.ShaderMaterial({
      fragmentShader,
      premultipliedAlpha: true,
      transparent: true,
      uniforms: {
        uBandWidth: { value: bandWidth },
        uCanvas: { value: new THREE.Vector2(1, 1) },
        uColorCount: { value: colorValues.length },
        uColors: { value: colorUniforms },
        uFrequency: { value: frequency },
        uIntensity: { value: intensity },
        uIterations: { value: iterations },
        uMouseInfluence: { value: mouseInfluence },
        uNoise: { value: noise },
        uParallax: { value: parallax },
        uPointer: { value: new THREE.Vector2() },
        uRot: { value: new THREE.Vector2(1, 0) },
        uScale: { value: scale },
        uSpeed: { value: speed },
        uTime: { value: 0 },
        uTransparent: { value: transparent ? 1 : 0 },
        uWarpStrength: { value: warpStrength },
      },
      vertexShader,
    });
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    const mesh = new THREE.Mesh(geometry, material);
    const timer = new THREE.Timer();
    let frame = 0;

    scene.add(mesh);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, transparent ? 0 : 1);
    container.appendChild(renderer.domElement);

    const resize = () => {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      renderer.setSize(width, height, false);
      material.uniforms.uCanvas.value.set(width, height);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect();
      pointerTargetRef.current.set(
        ((event.clientX - bounds.left) / Math.max(bounds.width, 1)) * 2 - 1,
        -(((event.clientY - bounds.top) / Math.max(bounds.height, 1)) * 2 - 1),
      );
    };

    const render = (time?: number) => {
      timer.update(time);
      const delta = timer.getDelta();
      const elapsed = timer.getElapsed();
      material.uniforms.uTime.value = elapsed;

      const degrees =
        (rotationRef.current % 360) + autoRotateRef.current * elapsed;
      const radians = (degrees * Math.PI) / 180;
      material.uniforms.uRot.value.set(
        Math.cos(radians),
        Math.sin(radians),
      );
      pointerCurrentRef.current.lerp(
        pointerTargetRef.current,
        Math.min(1, delta * 8),
      );
      material.uniforms.uPointer.value.copy(pointerCurrentRef.current);
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    container.addEventListener("pointermove", handlePointerMove);
    resize();
    render();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      container.removeEventListener("pointermove", handlePointerMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [
    bandWidth,
    colors,
    frequency,
    intensity,
    iterations,
    mouseInfluence,
    noise,
    parallax,
    scale,
    speed,
    transparent,
    warpStrength,
  ]);

  useEffect(() => {
    rotationRef.current = rotation;
    autoRotateRef.current = autoRotate;
  }, [autoRotate, rotation]);

  return (
    <div
      ref={containerRef}
      className={`color-bends-container ${className}`.trim()}
      style={style}
    />
  );
}
