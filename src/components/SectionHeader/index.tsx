import type { ReactNode } from "react";

type SectionEyebrowProps = {
  className?: string;
  children: ReactNode;
};

type SectionIntroProps = {
  className: string;
  title: ReactNode;
  children: ReactNode;
};

export function SectionEyebrow({
  className,
  children,
}: SectionEyebrowProps) {
  return (
    <p className={[className, "eyebrow", "mono"].filter(Boolean).join(" ")}>
      {children}
    </p>
  );
}

export function SectionIntro({
  className,
  title,
  children,
}: SectionIntroProps) {
  return (
    <div className={className}>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}
