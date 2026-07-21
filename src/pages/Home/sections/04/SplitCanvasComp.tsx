import { useEffect, useRef, useState, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { imageSources } from "./content";
import {
  ImageTransitionFragment,
  ImageTransitionVertex,
} from "./imageTransition";

gsap.registerPlugin(ScrollTrigger);

type SplitCanvasCompProps = {
  wrapperRef: RefObject<HTMLDivElement | null>;
};

function loadImageAsCanvas(
  src: string,
  canvasWidth: number,
  canvasHeight: number,
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Canvas 2D context unavailable"));
        return;
      }

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      const scale = Math.max(
        canvasWidth / image.naturalWidth,
        canvasHeight / image.naturalHeight,
      );
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      context.drawImage(
        image,
        (canvasWidth - width) / 2,
        (canvasHeight - height) / 2,
        width,
        height,
      );
      resolve(canvas);
    };
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    image.src = src;
  });
}

export default function SplitCanvasComp({ wrapperRef }: SplitCanvasCompProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportKey, setViewportKey] = useState(0);

  useEffect(() => {
    let resizeTimer = 0;
    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        setViewportKey((key) => key + 1);
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const currentContainer = containerRef.current;
    const currentWrapper = wrapperRef.current;
    if (!currentContainer || !currentWrapper) return;

    const container = currentContainer;
    const wrapper = currentWrapper;

    let renderer: THREE.WebGLRenderer | undefined;
    let material: THREE.ShaderMaterial | undefined;
    let textures: THREE.CanvasTexture[] = [];
    let animationId = 0;
    let scrollTrigger: ScrollTrigger | undefined;
    let mounted = true;

    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth < 1024;
    const canvasWidth = isMobile
      ? Math.min(window.innerWidth - 48, 340)
      : isTablet
        ? Math.min(window.innerWidth * 0.46, 470)
        : Math.min(window.innerWidth * 0.36, 680);
    const canvasHeight = isMobile
      ? Math.min(window.innerHeight * 0.38, 390)
      : isTablet
        ? Math.min(window.innerHeight * 0.46, 520)
        : Math.min(window.innerHeight * 0.52, 660);

    async function init() {
      try {
        const canvases = await Promise.all(
          imageSources.map((src) =>
            loadImageAsCanvas(src, canvasWidth, canvasHeight),
          ),
        );
        if (!mounted) return;

        textures = canvases.map((canvas) => {
          const texture = new THREE.CanvasTexture(canvas);
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          return texture;
        });

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(canvasWidth, canvasHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.replaceChildren(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(
          -canvasWidth / 2,
          canvasWidth / 2,
          canvasHeight / 2,
          -canvasHeight / 2,
          -1,
          1,
        );
        material = new THREE.ShaderMaterial({
          uniforms: {
            u_texture1: { value: textures[0] },
            u_texture2: { value: textures[1] ?? textures[0] },
            u_progress: { value: 0 },
          },
          vertexShader: ImageTransitionVertex,
          fragmentShader: ImageTransitionFragment,
          transparent: true,
        });
        const geometry = new THREE.PlaneGeometry(canvasWidth, canvasHeight);
        scene.add(new THREE.Mesh(geometry, material));

        scrollTrigger = ScrollTrigger.create({
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            if (!material) return;

            const canvasRect = container.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const scrolled = self.progress * (wrapper.offsetHeight - viewportHeight);
            let transition = 0;
            let progress = 0;

            for (let index = 1; index < imageSources.length; index += 1) {
              const borderPosition = index * viewportHeight - scrolled;
              if (
                borderPosition <= canvasRect.bottom &&
                borderPosition >= canvasRect.top
              ) {
                transition = index - 1;
                progress =
                  (canvasRect.bottom - borderPosition) / canvasRect.height;
                break;
              }
              if (borderPosition < canvasRect.top) {
                transition = index - 1;
                progress = 1;
              }
            }

            transition = Math.max(0, Math.min(transition, textures.length - 2));
            progress = Math.max(0, Math.min(1, progress));
            const next = Math.min(transition + 1, textures.length - 1);

            if (progress >= 1) {
              material.uniforms.u_texture1.value = textures[next];
              material.uniforms.u_texture2.value =
                textures[Math.min(next + 1, textures.length - 1)];
              material.uniforms.u_progress.value = 0;
            } else {
              material.uniforms.u_texture1.value = textures[transition];
              material.uniforms.u_texture2.value = textures[next];
              material.uniforms.u_progress.value = progress;
            }
          },
        });

        const render = () => {
          if (!mounted || !renderer) return;
          renderer.render(scene, camera);
          animationId = window.requestAnimationFrame(render);
        };
        render();
        ScrollTrigger.refresh();
      } catch (error) {
        console.error("Selected works canvas failed to initialize", error);
      }
    }

    void init();

    return () => {
      mounted = false;
      window.cancelAnimationFrame(animationId);
      scrollTrigger?.kill();
      material?.dispose();
      textures.forEach((texture) => texture.dispose());
      renderer?.dispose();
      renderer?.forceContextLoss();
      container.replaceChildren();
    };
  }, [wrapperRef, viewportKey]);

  return (
    <div
      ref={containerRef}
      className="selected-works__canvas"
    />
  );
}
