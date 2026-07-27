import { useEffect, useRef } from "react";
import {
  Color,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Timer,
  Vector2,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import "./style.scss";

type DitherProps = {
  waveColor?: [number, number, number];
  disableAnimation?: boolean;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
  colorNum?: number;
  pixelSize?: number;
  waveAmplitude?: number;
  waveFrequency?: number;
  waveSpeed?: number;
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const waveFragmentShader = `
  precision highp float;
  uniform vec2 resolution;
  uniform float time;
  uniform float waveSpeed;
  uniform float waveFrequency;
  uniform float waveAmplitude;
  uniform vec3 waveColor;
  uniform vec2 mousePos;
  uniform float mouseRadius;
  uniform int enableMouseInteraction;

  vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

  float cnoise(vec2 P) {
    vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
    Pi = mod289(Pi);
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x, gy.x);
    vec2 g10 = vec2(gx.y, gy.y);
    vec2 g01 = vec2(gx.z, gy.z);
    vec2 g11 = vec2(gx.w, gy.w);
    vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
    g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
  }

  const int OCTAVES = 4;
  float fbm(vec2 p) {
    float value = 0.0;
    float amp = 1.0;
    float freq = waveFrequency;
    for (int i = 0; i < OCTAVES; i++) {
      value += amp * abs(cnoise(p));
      p *= freq;
      amp *= waveAmplitude;
    }
    return value;
  }

  float pattern(vec2 p) {
    vec2 p2 = p - time * waveSpeed;
    return fbm(p + fbm(p2));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv -= 0.5;
    uv.x *= resolution.x / resolution.y;
    float f = pattern(uv);
    if (enableMouseInteraction == 1) {
      vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
      mouseNDC.x *= resolution.x / resolution.y;
      float dist = length(uv - mouseNDC);
      float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
      f -= 0.5 * effect;
    }
    vec3 col = mix(vec3(0.0), waveColor, f);
    gl_FragColor = vec4(col, 1.0);
  }
`;

const ditherFragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D inputBuffer;
  uniform vec2 resolution;
  uniform float colorNum;
  uniform float pixelSize;
  const float bayerMatrix8x8[64] = float[64](
    0.0/64.0,48.0/64.0,12.0/64.0,60.0/64.0,3.0/64.0,51.0/64.0,15.0/64.0,63.0/64.0,
    32.0/64.0,16.0/64.0,44.0/64.0,28.0/64.0,35.0/64.0,19.0/64.0,47.0/64.0,31.0/64.0,
    8.0/64.0,56.0/64.0,4.0/64.0,52.0/64.0,11.0/64.0,59.0/64.0,7.0/64.0,55.0/64.0,
    40.0/64.0,24.0/64.0,36.0/64.0,20.0/64.0,43.0/64.0,27.0/64.0,39.0/64.0,23.0/64.0,
    2.0/64.0,50.0/64.0,14.0/64.0,62.0/64.0,1.0/64.0,49.0/64.0,13.0/64.0,61.0/64.0,
    34.0/64.0,18.0/64.0,46.0/64.0,30.0/64.0,33.0/64.0,17.0/64.0,45.0/64.0,29.0/64.0,
    10.0/64.0,58.0/64.0,6.0/64.0,54.0/64.0,9.0/64.0,57.0/64.0,5.0/64.0,53.0/64.0,
    42.0/64.0,26.0/64.0,38.0/64.0,22.0/64.0,41.0/64.0,25.0/64.0,37.0/64.0,21.0/64.0
  );

  vec3 dither(vec2 uv, vec3 color) {
    vec2 scaledCoord = floor(uv * resolution / pixelSize);
    int x = int(mod(scaledCoord.x, 8.0));
    int y = int(mod(scaledCoord.y, 8.0));
    float threshold = bayerMatrix8x8[y * 8 + x] - 0.25;
    float stepSize = 1.0 / (colorNum - 1.0);
    color += threshold * stepSize;
    color = clamp(color - 0.2, 0.0, 1.0);
    return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
  }

  void main() {
    vec2 normalizedPixelSize = pixelSize / resolution;
    vec2 uvPixel = normalizedPixelSize * floor(vUv / normalizedPixelSize);
    vec4 color = texture2D(inputBuffer, uvPixel);
    color.rgb = dither(vUv, color.rgb);
    gl_FragColor = color;
  }
`;

export default function Dither({
  waveColor = [0.5, 0.5, 0.5],
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1,
  colorNum = 4,
  pixelSize = 2,
  waveAmplitude = 0.3,
  waveFrequency = 3,
  waveSpeed = 0.05,
}: DitherProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const renderer = new WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    const scene = new Scene();
    const camera = new OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
    const geometry = new PlaneGeometry(1, 1);
    const material = new ShaderMaterial({
      fragmentShader: waveFragmentShader,
      vertexShader,
      uniforms: {
        resolution: { value: new Vector2(1, 1) },
        time: { value: 0 },
        waveSpeed: { value: waveSpeed },
        waveFrequency: { value: waveFrequency },
        waveAmplitude: { value: waveAmplitude },
        waveColor: { value: new Color(...waveColor) },
        mousePos: { value: new Vector2(0, 0) },
        mouseRadius: { value: mouseRadius },
        enableMouseInteraction: { value: enableMouseInteraction ? 1 : 0 },
      },
    });
    const mesh = new Mesh(geometry, material);
    const renderTarget = new WebGLRenderTarget(1, 1);
    const postScene = new Scene();
    const postMaterial = new ShaderMaterial({
      fragmentShader: ditherFragmentShader,
      vertexShader,
      uniforms: {
        inputBuffer: { value: renderTarget.texture },
        resolution: { value: new Vector2(1, 1) },
        colorNum: { value: colorNum },
        pixelSize: { value: pixelSize },
      },
    });
    const postMesh = new Mesh(geometry, postMaterial);
    const timer = new Timer();
    let frame = 0;
    let interactionStrength = 1;
    let targetInteractionStrength = 1;

    camera.position.z = 1;
    scene.add(mesh);
    postScene.add(postMesh);
    renderer.setPixelRatio(1);
    container.appendChild(renderer.domElement);
    timer.connect(document);

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height, false);
      renderTarget.setSize(width, height);
      material.uniforms.resolution.value.set(width, height);
      postMaterial.uniforms.resolution.value.set(width, height);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!enableMouseInteraction) return;
      const rect = renderer.domElement.getBoundingClientRect();
      material.uniforms.mousePos.value.set(
        event.clientX - rect.left,
        event.clientY - rect.top,
      );
    };

    const handlePointerDown = () => {
      targetInteractionStrength = 2;
    };

    const handlePointerUp = () => {
      targetInteractionStrength = 1;
    };

    const render = (time?: number) => {
      timer.update(time);
      interactionStrength +=
        (targetInteractionStrength - interactionStrength) * 0.06;
      material.uniforms.mouseRadius.value = mouseRadius * interactionStrength;
      material.uniforms.waveAmplitude.value =
        waveAmplitude * (1 + (interactionStrength - 1) * 0.35);
      if (!disableAnimation && !reducedMotion) {
        material.uniforms.time.value += timer.getDelta();
      }
      renderer.setRenderTarget(renderTarget);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      renderer.render(postScene, camera);
      if (!disableAnimation && !reducedMotion) {
        frame = window.requestAnimationFrame(render);
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    window.addEventListener("blur", handlePointerUp);
    resize();
    render();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("blur", handlePointerUp);
      timer.dispose();
      geometry.dispose();
      material.dispose();
      postMaterial.dispose();
      renderTarget.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [
    colorNum,
    disableAnimation,
    enableMouseInteraction,
    mouseRadius,
    pixelSize,
    waveAmplitude,
    waveColor,
    waveFrequency,
    waveSpeed,
  ]);

  return <div className="dither-container" ref={containerRef} />;
}
