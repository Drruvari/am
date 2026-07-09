import cursorDefault from "@/assets/cursor-svg/cursor-default.svg";
import cursorPointer from "@/assets/cursor-svg/cursor-pointer.svg";
import cursorText from "@/assets/cursor-svg/cursor-text.svg";
import { useCustomCursor } from "@/hooks/useCustomCursor";

export default function CustomCursor() {
  const { cursorRef, state, enabled } = useCustomCursor();

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor is-${state}`}
      id="cursor"
      aria-hidden="true"
    >
      <img
        className="custom-cursor__img custom-cursor__img--default is-active"
        data-cursor-state="default"
        src={cursorDefault}
        alt=""
        draggable={false}
      />
      <img
        className="custom-cursor__img custom-cursor__img--pointer"
        data-cursor-state="pointer"
        src={cursorPointer}
        alt=""
        draggable={false}
      />
      <img
        className="custom-cursor__img custom-cursor__img--text"
        data-cursor-state="text"
        src={cursorText}
        alt=""
        draggable={false}
      />
    </div>
  );
}
