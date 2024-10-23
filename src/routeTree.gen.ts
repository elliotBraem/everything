/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from "./routes/__root";
import { Route as LoginImport } from "./routes/login";
import { Route as LayoutImport } from "./routes/_layout";
import { Route as LayoutIndexImport } from "./routes/_layout/index";
import { Route as ProfileAccountIdImport } from "./routes/profile/$accountId";

// Create/Update Routes

const LoginRoute = LoginImport.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => rootRoute
} as any);

const LayoutRoute = LayoutImport.update({
  id: "/_layout",
  getParentRoute: () => rootRoute
} as any);

const LayoutIndexRoute = LayoutIndexImport.update({
  id: "/",
  path: "/",
  getParentRoute: () => LayoutRoute
} as any);

const ProfileAccountIdRoute = ProfileAccountIdImport.update({
  id: "/profile/$accountId",
  path: "/profile/$accountId",
  getParentRoute: () => rootRoute
} as any);

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/_layout": {
      id: "/_layout";
      path: "";
      fullPath: "";
      preLoaderRoute: typeof LayoutImport;
      parentRoute: typeof rootRoute;
    };
    "/login": {
      id: "/login";
      path: "/login";
      fullPath: "/login";
      preLoaderRoute: typeof LoginImport;
      parentRoute: typeof rootRoute;
    };
    "/profile/$accountId": {
      id: "/profile/$accountId";
      path: "/profile/$accountId";
      fullPath: "/profile/$accountId";
      preLoaderRoute: typeof ProfileAccountIdImport;
      parentRoute: typeof rootRoute;
    };
    "/_layout/": {
      id: "/_layout/";
      path: "/";
      fullPath: "/";
      preLoaderRoute: typeof LayoutIndexImport;
      parentRoute: typeof LayoutImport;
    };
  }
}

// Create and export the route tree

interface LayoutRouteChildren {
  LayoutIndexRoute: typeof LayoutIndexRoute;
}

const LayoutRouteChildren: LayoutRouteChildren = {
  LayoutIndexRoute: LayoutIndexRoute
};

const LayoutRouteWithChildren =
  LayoutRoute._addFileChildren(LayoutRouteChildren);

export interface FileRoutesByFullPath {
  "": typeof LayoutRouteWithChildren;
  "/login": typeof LoginRoute;
  "/profile/$accountId": typeof ProfileAccountIdRoute;
  "/": typeof LayoutIndexRoute;
}

export interface FileRoutesByTo {
  "/login": typeof LoginRoute;
  "/profile/$accountId": typeof ProfileAccountIdRoute;
  "/": typeof LayoutIndexRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRoute;
  "/_layout": typeof LayoutRouteWithChildren;
  "/login": typeof LoginRoute;
  "/profile/$accountId": typeof ProfileAccountIdRoute;
  "/_layout/": typeof LayoutIndexRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths: "" | "/login" | "/profile/$accountId" | "/";
  fileRoutesByTo: FileRoutesByTo;
  to: "/login" | "/profile/$accountId" | "/";
  id: "__root__" | "/_layout" | "/login" | "/profile/$accountId" | "/_layout/";
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  LayoutRoute: typeof LayoutRouteWithChildren;
  LoginRoute: typeof LoginRoute;
  ProfileAccountIdRoute: typeof ProfileAccountIdRoute;
}

const rootRouteChildren: RootRouteChildren = {
  LayoutRoute: LayoutRouteWithChildren,
  LoginRoute: LoginRoute,
  ProfileAccountIdRoute: ProfileAccountIdRoute
};

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_layout",
        "/login",
        "/profile/$accountId"
      ]
    },
    "/_layout": {
      "filePath": "_layout.tsx",
      "children": [
        "/_layout/"
      ]
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/profile/$accountId": {
      "filePath": "profile/$accountId.tsx"
    },
    "/_layout/": {
      "filePath": "_layout/index.tsx",
      "parent": "/_layout"
    }
  }
}
ROUTE_MANIFEST_END */
