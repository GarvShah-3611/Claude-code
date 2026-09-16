"use client";

import { useEffect, useState } from "react";

/**
 * A hash router, deliberately.
 *
 * The site is exported as static files and served from a subdirectory
 * (inside an artifact frame, from a CDN folder, or straight off disk), so
 * real paths like /ground cannot be relied on: a refresh would ask a server
 * that may not exist for a route it does not know. A hash keeps every page
 * reachable, bookmarkable and back-button-able with no server at all.
 */

export const ROUTES = [
  "home",
  "about",
  "ground",
  "watch",
  "feed",
  "voices",
  "write",
] as const;

export type Route = (typeof ROUTES)[number];

const DEFAULT: Route = "home";

function parse(hash: string): Route {
  const id = hash.replace(/^#\/?/, "").split("?")[0];
  return (ROUTES as readonly string[]).includes(id) ? (id as Route) : DEFAULT;
}

export function hrefFor(route: Route) {
  return route === DEFAULT ? "#/" : `#/${route}`;
}

export function useRoute(): [Route, (r: Route) => void] {
  // Server and first client render must agree, so both start at the
  // default and the real hash is adopted in an effect.
  const [route, setRoute] = useState<Route>(DEFAULT);

  useEffect(() => {
    const sync = () => setRoute(parse(window.location.hash));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const go = (next: Route) => {
    if (next === parse(window.location.hash)) return;
    window.location.hash = hrefFor(next);
  };

  return [route, go];
}
