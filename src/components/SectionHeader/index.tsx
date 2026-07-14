import type { HTMLAttributes, ReactNode } from "react";

type SectionEyebrowProps = HTMLAttributes<HTMLParagraphElement> & {
  className?: string;
  children: ReactNode;
};

type SectionIntroProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  className: string;
  title: ReactNode;
  children: ReactNode;
};

export function SectionEyebrow({
  className,
  children,
  ...props
}: SectionEyebrowProps) {
  return (
    <p
      className={[className, "eyebrow", "mono"].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </p>
  );
}

export function SectionIntro({
  className,
  title,
  children,
  ...props
}: SectionIntroProps) {
  return (
    <div className={className} {...props}>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}
