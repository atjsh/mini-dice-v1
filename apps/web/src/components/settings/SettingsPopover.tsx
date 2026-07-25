import type { ButtonHTMLAttributes, ReactNode, RefObject } from 'react';
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

interface SettingsPopoverControls {
  close: (restoreFocus?: boolean) => void;
  focusFallback: () => void;
  restoreFocusIfUnclaimed: () => void;
}

interface SettingsPopoverTrigger {
  ref: RefObject<HTMLButtonElement | null>;
  props: ButtonHTMLAttributes<HTMLButtonElement>;
}

export function SettingsPopover({
  ariaLabel,
  busyStatus = '',
  children,
  layoutKey,
  panelClassName = 'w-72',
  trigger,
}: {
  ariaLabel: string;
  busyStatus?: string;
  children: (controls: SettingsPopoverControls) => ReactNode;
  layoutKey?: unknown;
  panelClassName?: string;
  trigger: (trigger: SettingsPopoverTrigger) => ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverLayout, setPopoverLayout] = useState({
    side: 'above' as 'above' | 'below',
    maxHeight: 320,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const focusFallbackRef = useRef<HTMLSpanElement>(null);
  const isTriggerPointerDownRef = useRef(false);
  const popoverId = useId();

  const close = useCallback((restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) {
      requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }, []);

  const focusFallback = useCallback(() => {
    focusFallbackRef.current?.focus();
  }, []);

  const restoreFocusIfUnclaimed = useCallback(() => {
    requestAnimationFrame(() => {
      const activeElement = document.activeElement;
      if (
        activeElement === document.body ||
        activeElement === document.documentElement ||
        activeElement === focusFallbackRef.current
      ) {
        triggerRef.current?.focus();
      }
    });
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    const updateLayout = () => {
      const triggerElement = triggerRef.current;
      const popoverElement = popoverRef.current;
      if (!triggerElement || !popoverElement) {
        return;
      }

      const viewportMargin = 16;
      const popoverGap = 8;
      const triggerRect = triggerElement.getBoundingClientRect();
      const spaceAbove = Math.max(
        0,
        triggerRect.top - viewportMargin - popoverGap,
      );
      const spaceBelow = Math.max(
        0,
        window.innerHeight - triggerRect.bottom - viewportMargin - popoverGap,
      );
      const side =
        spaceAbove >= popoverElement.scrollHeight || spaceAbove >= spaceBelow
          ? 'above'
          : 'below';
      const maxHeight = Math.floor(side === 'above' ? spaceAbove : spaceBelow);

      setPopoverLayout((currentLayout) => {
        if (
          currentLayout.side === side &&
          currentLayout.maxHeight === maxHeight
        ) {
          return currentLayout;
        }
        return { side, maxHeight };
      });
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    window.addEventListener('scroll', updateLayout, true);

    return () => {
      window.removeEventListener('resize', updateLayout);
      window.removeEventListener('scroll', updateLayout, true);
    };
  }, [isOpen, layoutKey]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        close(false);
        restoreFocusIfUnclaimed();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close(true);
      }
    };
    const handleFocusIn = (event: FocusEvent) => {
      if (!(event.target instanceof Node)) {
        return;
      }
      if (
        event.target === triggerRef.current &&
        isTriggerPointerDownRef.current
      ) {
        return;
      }
      if (!popoverRef.current?.contains(event.target)) {
        close(false);
      }
    };
    const focusFrame = requestAnimationFrame(() => {
      popoverRef.current
        ?.querySelector<HTMLElement>(
          'a[href], button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex="-1"])',
        )
        ?.focus();
    });

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, [close, isOpen, restoreFocusIfUnclaimed]);

  const triggerProps: ButtonHTMLAttributes<HTMLButtonElement> = {
    type: 'button',
    onClick: () => setIsOpen((open) => !open),
    onPointerDown: () => {
      isTriggerPointerDownRef.current = true;
      requestAnimationFrame(() => {
        isTriggerPointerDownRef.current = false;
      });
    },
    'aria-haspopup': 'dialog',
    'aria-expanded': isOpen,
    'aria-controls': popoverId,
  };

  return (
    <div ref={containerRef} className="relative inline-flex">
      {isOpen && (
        <div
          ref={popoverRef}
          id={popoverId}
          role="dialog"
          aria-label={ariaLabel}
          style={{ maxHeight: popoverLayout.maxHeight }}
          className={`absolute right-0 z-[100] max-w-[calc(100vw-2rem)] overflow-x-hidden overflow-y-auto rounded-xl bg-white p-1.5 shadow-xl dark:bg-zinc-900 ${panelClassName} ${
            popoverLayout.side === 'above'
              ? 'bottom-full mb-2'
              : 'top-full mt-2'
          }`}
        >
          {children({ close, focusFallback, restoreFocusIfUnclaimed })}
        </div>
      )}

      <span
        ref={focusFallbackRef}
        role={busyStatus ? 'status' : undefined}
        aria-live={busyStatus ? 'polite' : undefined}
        tabIndex={-1}
        className="sr-only"
      >
        {busyStatus}
      </span>

      {trigger({ ref: triggerRef, props: triggerProps })}
    </div>
  );
}
