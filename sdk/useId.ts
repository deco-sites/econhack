import { useId as usePreactId, useMemo } from "preact/hooks";

export const useId = () =>
  useMemo(() => `${usePreactId()}${Math.trunc(Math.random() * 1e6)}`, []);
