import { useEffect, useRef, useState, type ReactNode, type ElementType, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  y?: number;
};

export function Reveal({ children, as: Tag = "div", delay = 0, className, y = 24 }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style: CSSProperties = {
    transitionDelay: `${delay}ms`,
    transform: shown ? "none" : `translateY(${y}px)`,
  };

  return (
    <Tag
      ref={ref as never}
      style={style}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform",
        shown ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
