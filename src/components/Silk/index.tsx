import { useEffect, useRef } from "react";
import {
  Color,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Timer,
  WebGLRenderer,
} from "three";
import "./style.scss";

type SilkProps = {
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
  scale?: number;
  speed?: number;
};

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;
const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2 r = G * sin(G * texCoord);
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2 rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd = noise(gl_FragCoord.xy);
  vec2 uv = rotateUvs(vUv * uScale, uRotation);
  vec2 tex = uv * uScale;
  float tOffset = uSpeed * uTime;
  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);
  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                            sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));
  vec4 col = vec4(uColor, 1.0) * vec4(pattern) -
             rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`;

export default function Silk({
  speed = 5,
  scale = 1,
  color = "#d1d1c7",
  noiseIntensity = 1.5,
  rotation = 0,
}: SilkProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.style.background = `linear-gradient(145deg, ${color} 0%, #5c5852 45%, #1c1b19 100%)`;

    const isTouchUi = window.matchMedia(
      "(hover: none), (pointer: coarse)",
    ).matches;
    if (isTouchUi) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isCompactViewport = window.matchMedia("(max-width: 768px)").matches;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        alpha: false,
        antialias: !isCompactViewport,
        powerPreference: isCompactViewport ? "low-power" : "high-performance",
      });
    } catch {
      return;
    }

    if (!renderer.getContext()) {
      renderer.dispose();
      return;
    }

    const scene = new Scene();
    const camera = new OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
    const geometry = new PlaneGeometry(1, 1);
    const material = new ShaderMaterial({
      fragmentShader,
      uniforms: {
        uSpeed: { value: speed },
        uScale: { value: scale },
        uNoiseIntensity: { value: noiseIntensity },
        uColor: { value: new Color(color) },
        uRotation: { value: rotation },
        uTime: { value: 0 },
      },
      vertexShader,
    });
    const mesh = new Mesh(geometry, material);
    const timer = new Timer();
    let frame = 0;

    camera.position.z = 1;
    scene.add(mesh);
    renderer.setClearColor(new Color(color), 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isCompactViewport ? 1.5 : 2));
    container.appendChild(renderer.domElement);
    timer.connect(document);

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height, false);
      mesh.scale.set(1, 1, 1);
    };

    const render = (time?: number) => {
      timer.update(time);
      material.uniforms.uTime.value += 0.1 * timer.getDelta();
      renderer.render(scene, camera);
      if (!reducedMotion) frame = window.requestAnimationFrame(render);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    render();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      timer.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [color, noiseIntensity, rotation, scale, speed]);

  return <div className="silk-canvas" ref={containerRef} />;
}
