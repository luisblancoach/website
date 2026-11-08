"use client";

import { lazy, Suspense, useSyncExternalStore } from "react";
import { EDITORIAL_DEV } from "@/lib/editorial/config";
import { useEditorial } from "./store";

// The editor's chrome (bar, Changes panel, editing guards, its styles) is a
// separate chunk, loaded only when it can show something: always in local
// development (the "Edit copy" button), and in an opt-in build only once the
// mode is on (?editorial=1, then remembered in this browser until Exit). An
// ordinary visitor never downloads it. Nothing renders on the server, so the
// published HTML is unchanged.
const EditorialMode = lazy(() => import("./EditorialMode"));
const noSubscription = () => () => {};

export default function EditorialEntry() {
  const mounted = useSyncExternalStore(noSubscription, () => true, () => false);
  const { active } = useEditorial();
  if (!mounted || !(active || EDITORIAL_DEV)) return null;
  return <Suspense fallback={null}><EditorialMode /></Suspense>;
}
