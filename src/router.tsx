import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { BASE_PATH } from "./lib/site-config";

export const getRouter = () =>
  createRouter({
    routeTree,
    basepath: BASE_PATH || "/",
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });
