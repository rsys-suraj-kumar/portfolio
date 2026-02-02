"use client";

/**
 * Skip Link Component
 * Allows keyboard users to skip directly to main content
 * Only visible when focused (screen reader accessible)
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="
        sr-only 
        focus:not-sr-only 
        focus:fixed 
        focus:top-4 
        focus:left-4 
        focus:z-[10000] 
        focus:bg-black 
        focus:text-cyan-400 
        focus:px-6 
        focus:py-3 
        focus:rounded-lg 
        focus:border 
        focus:border-cyan-400
        focus:outline-none
        focus:ring-2
        focus:ring-cyan-400
        focus:ring-offset-2
        focus:ring-offset-black
        font-mono
        text-sm
        tracking-wider
        uppercase
      "
    >
      Skip to main content
    </a>
  );
}

/**
 * Accessible section heading with proper hierarchy
 */
interface SectionHeadingProps {
  level?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionHeading({ level = 2, children, className = "", id }: SectionHeadingProps) {
  const baseClass = `font-display font-bold tracking-tight ${className}`;
  
  switch (level) {
    case 1:
      return <h1 id={id} className={baseClass}>{children}</h1>;
    case 3:
      return <h3 id={id} className={baseClass}>{children}</h3>;
    case 4:
      return <h4 id={id} className={baseClass}>{children}</h4>;
    default:
      return <h2 id={id} className={baseClass}>{children}</h2>;
  }
}

/**
 * Visually hidden text for screen readers only
 */
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}

/**
 * Focus trap for modals and dialogs
 */
export function useFocusTrap(isActive: boolean, containerRef: React.RefObject<HTMLElement>) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isActive || !containerRef.current) return;
    
    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
    
    if (e.key === "Escape") {
      // Dispatch custom event that parent can listen to
      containerRef.current.dispatchEvent(new CustomEvent("escape"));
    }
  };
  
  if (typeof window !== "undefined" && isActive) {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }
}
