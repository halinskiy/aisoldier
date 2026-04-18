"use client";

import {
  createContext,
  useContext,
  useRef,
  useCallback,
  type MutableRefObject,
  type ReactNode,
} from "react";

export type BookState = {
  x: number;          // world X — negative = left, positive = right
  scale: number;      // uniform scale (0 = hidden)
  coverAngle: number; // radians: 0 = closed, OPEN_ANGLE = open
  bookRotY: number;   // radians: 0 = front cover, Math.PI = back cover
  pageIndex: number;  // 0–3 — reserved for page-turn planes
};

export const OPEN_ANGLE = -2.1;

const INITIAL: BookState = {
  x: -0.8,
  scale: 1.0,
  coverAngle: 0,
  bookRotY: 0,
  pageIndex: 0,
};

type Ctx = {
  stateRef: MutableRefObject<BookState>;
  setBookState: (patch: Partial<BookState>) => void;
};

const BookCtx = createContext<Ctx | null>(null);

export function BookProvider({ children }: { children: ReactNode }) {
  const stateRef = useRef<BookState>({ ...INITIAL });
  const setBookState = useCallback((patch: Partial<BookState>) => {
    Object.assign(stateRef.current, patch);
  }, []);
  return <BookCtx.Provider value={{ stateRef, setBookState }}>{children}</BookCtx.Provider>;
}

export function useBookContext() {
  const ctx = useContext(BookCtx);
  if (!ctx) throw new Error("useBookContext must be inside <BookProvider>");
  return ctx;
}
