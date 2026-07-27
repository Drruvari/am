import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CSSProperties } from "react";
import "./style.scss";

type Point = { x: number; y: number };

type TextPressureProps = {
  alpha?: boolean;
  characterClassName?: string;
  className?: string;
  flex?: boolean;
  fontFamily?: string;
  fontUrl?: string;
  italic?: boolean;
  minFontSize?: number;
  scale?: boolean;
  stroke?: boolean;
  strokeColor?: string;
  text?: string;
  textColor?: string;
  weight?: boolean;
  width?: boolean;
};

const distanceBetween = (a: Point, b: Point) =>
  Math.hypot(b.x - a.x, b.y - a.y);

const getAttributeValue = (
  distance: number,
  maxDistance: number,
  minValue: number,
  maxValue: number,
) => {
  const value =
    maxValue - Math.abs((maxValue * distance) / Math.max(maxDistance, 1));

  return Math.max(minValue, value + minValue);
};

export default function TextPressure({
  text = "Compressa",
  fontFamily = "Roboto Flex",
  fontUrl = "https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap",
  width = true,
  weight = true,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  scale = false,
  textColor = "#fff",
  strokeColor = "#f00",
  characterClassName = "",
  className = "",
  minFontSize = 24,
}: TextPressureProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const spansRef = useRef<Array<HTMLSpanElement | null>>([]);
  const pointerRef = useRef<Point>({ x: 0, y: 0 });
  const cursorRef = useRef<Point>({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);
  const characters = useMemo(() => Array.from(text), [text]);

  const setSize = useCallback(() => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds?.width || !bounds.height) return;

    const widthBasedSize = bounds.width / (characters.length / 2);
    setFontSize(Math.max(widthBasedSize, minFontSize));
    setScaleY(1);
    setLineHeight(1);

    window.requestAnimationFrame(() => {
      const title = titleRef.current;
      const container = containerRef.current;
      if (!title || !container || !scale) return;

      const titleHeight = title.getBoundingClientRect().height;
      if (titleHeight <= 0) return;

      const nextScale = container.getBoundingClientRect().height / titleHeight;
      setScaleY(nextScale);
      setLineHeight(nextScale);
    });
  }, [characters.length, minFontSize, scale]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const bounds = container.getBoundingClientRect();
    const center = {
      x: bounds.left + bounds.width / 2,
      y: bounds.top + bounds.height / 2,
    };
    pointerRef.current = center;
    cursorRef.current = center;

    const handlePointerEnter = (event: PointerEvent) => {
      isHoveringRef.current = true;
      pointerRef.current = { x: event.clientX, y: event.clientY };
      cursorRef.current = { x: event.clientX, y: event.clientY };
    };
    const handlePointerMove = (event: PointerEvent) => {
      cursorRef.current.x = event.clientX;
      cursorRef.current.y = event.clientY;
    };
    const handlePointerLeave = () => {
      isHoveringRef.current = false;
      spansRef.current.forEach((span) => {
        if (!span) return;
        span.style.fontVariationSettings =
          "'wght' 400, 'wdth' 100, 'ital' 0";
        if (alpha) span.style.opacity = "1";
      });
    };
    const observer = new ResizeObserver(setSize);

    observer.observe(container);
    container.addEventListener("pointerenter", handlePointerEnter);
    container.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    container.addEventListener("pointerleave", handlePointerLeave);
    setSize();

    return () => {
      observer.disconnect();
      container.removeEventListener("pointerenter", handlePointerEnter);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [alpha, setSize]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const animate = () => {
      if (!isHoveringRef.current) {
        frame = window.requestAnimationFrame(animate);
        return;
      }

      pointerRef.current.x +=
        (cursorRef.current.x - pointerRef.current.x) / 15;
      pointerRef.current.y +=
        (cursorRef.current.y - pointerRef.current.y) / 15;

      const title = titleRef.current;
      if (title) {
        const maxDistance = title.getBoundingClientRect().width / 2;

        spansRef.current.forEach((span) => {
          if (!span) return;

          const bounds = span.getBoundingClientRect();
          const distance = distanceBetween(pointerRef.current, {
            x: bounds.x + bounds.width / 2,
            y: bounds.y + bounds.height / 2,
          });
          const widthValue = width
            ? Math.floor(getAttributeValue(distance, maxDistance, 5, 200))
            : 100;
          const weightValue = weight
            ? Math.floor(getAttributeValue(distance, maxDistance, 100, 900))
            : 400;
          const italicValue = italic
            ? getAttributeValue(distance, maxDistance, 0, 1).toFixed(2)
            : "0";

          span.style.fontVariationSettings =
            `'wght' ${weightValue}, 'wdth' ${widthValue}, 'ital' ${italicValue}`;

          if (alpha) {
            span.style.opacity = getAttributeValue(
              distance,
              maxDistance,
              0,
              1,
            ).toFixed(2);
          }
        });
      }

      frame = window.requestAnimationFrame(animate);
    };

    animate();
    return () => window.cancelAnimationFrame(frame);
  }, [alpha, italic, weight, width]);

  const titleStyle = {
    "--text-pressure-color": textColor,
    "--text-pressure-stroke": strokeColor,
    color: textColor,
    fontFamily,
    fontSize,
    lineHeight: scale ? lineHeight : undefined,
    transform: `scale(1, ${scaleY})`,
  } as CSSProperties;

  return (
    <div className="text-pressure" ref={containerRef}>
      <link
        href={fontUrl}
        rel="stylesheet"
      />
      <h1
        className={[
          "text-pressure__title",
          flex ? "text-pressure__title--flex" : "",
          stroke ? "text-pressure__title--stroke" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        ref={titleRef}
        style={titleStyle}
      >
        {characters.map((character, index) => (
          <span
            className={`text-pressure__char ${characterClassName}`}
            data-char={character}
            key={`${character}-${index}`}
            ref={(element) => {
              spansRef.current[index] = element;
            }}
          >
            {character}
          </span>
        ))}
      </h1>
    </div>
  );
}
