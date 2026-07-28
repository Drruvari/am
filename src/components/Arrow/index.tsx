import type { CSSProperties, SVGAttributes } from "react";

export type ArrowSide =
  | "left"
  | "right"
  | "up"
  | "down"
  | "up-left"
  | "up-right"
  | "down-left"
  | "down-right"
  | "diagonal";

interface ArrowProps extends Omit<SVGAttributes<SVGSVGElement>, "children"> {
  side?: ArrowSide;
  borderThickness?: number;
  size?: CSSProperties["width"];
  title?: string;
}

const rotations: Record<ArrowSide, number> = {
  "down-right": 0,
  down: 45,
  "down-left": 90,
  left: 135,
  "up-left": 180,
  up: -135,
  "up-right": -90,
  right: -45,
  diagonal: -90,
};

export default function Arrow({
  side = "right",
  borderThickness = 1.5,
  size = "1em",
  title,
  style,
  ...props
}: ArrowProps) {
  const arrowStyle = {
    "--arrow-rotation": `${rotations[side]}deg`,
    width: size,
    height: size,
    flex: "0 0 auto",
    transform: "rotate(var(--arrow-rotation))",
    transformOrigin: "center",
    ...style,
  } as CSSProperties;

  return (
    <svg
      viewBox="0 0 17 17"
      fill="none"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      style={arrowStyle}
      {...props}
    >
      <path
        d="M0.53014 0.530407L15.2574 15.2577M15.4579 6.18539C14.149 7.96743 12.241 12.2413 15.08 15.0802C12.241 12.2413 7.96716 14.1492 6.18512 15.4581"
        stroke="currentColor"
        strokeWidth={borderThickness}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
