/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'
import { Route as InventoryImport } from './routes/inventory'
import { Route as LayoutImport } from './routes/_layout'
import { Route as ProfileAccountIdImport } from './routes/profile/$accountId'
import { Route as LayoutPagesImport } from './routes/_layout/_pages'
import { Route as LayoutPagesIndexImport } from './routes/_layout/_pages/index'

// Create/Update Routes

const LoginRoute = LoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const InventoryRoute = InventoryImport.update({
  id: '/inventory',
  path: '/inventory',
  getParentRoute: () => rootRoute,
} as any)

const LayoutRoute = LayoutImport.update({
  id: '/_layout',
  getParentRoute: () => rootRoute,
} as any)

const ProfileAccountIdRoute = ProfileAccountIdImport.update({
  id: '/profile/$accountId',
  path: '/profile/$accountId',
  getParentRoute: () => rootRoute,
} as any)

const LayoutPagesRoute = LayoutPagesImport.update({
  id: '/_pages',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutPagesIndexRoute = LayoutPagesIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => LayoutPagesRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_layout': {
      id: '/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutImport
      parentRoute: typeof rootRoute
    }
    '/inventory': {
      id: '/inventory'
      path: '/inventory'
      fullPath: '/inventory'
      preLoaderRoute: typeof InventoryImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/_layout/_pages': {
      id: '/_layout/_pages'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutPagesImport
      parentRoute: typeof LayoutImport
    }
    '/profile/$accountId': {
      id: '/profile/$accountId'
      path: '/profile/$accountId'
      fullPath: '/profile/$accountId'
      preLoaderRoute: typeof ProfileAccountIdImport
      parentRoute: typeof rootRoute
    }
    '/_layout/_pages/': {
      id: '/_layout/_pages/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof LayoutPagesIndexImport
      parentRoute: typeof LayoutPagesImport
    }
  }
}

// Create and export the route tree

interface LayoutPagesRouteChildren {
  LayoutPagesIndexRoute: typeof LayoutPagesIndexRoute
}

const LayoutPagesRouteChildren: LayoutPagesRouteChildren = {
  LayoutPagesIndexRoute: LayoutPagesIndexRoute,
}

const LayoutPagesRouteWithChildren = LayoutPagesRoute._addFileChildren(
  LayoutPagesRouteChildren,
)

interface LayoutRouteChildren {
  LayoutPagesRoute: typeof LayoutPagesRouteWithChildren
}

const LayoutRouteChildren: LayoutRouteChildren = {
  LayoutPagesRoute: LayoutPagesRouteWithChildren,
}

const LayoutRouteWithChildren =
  LayoutRoute._addFileChildren(LayoutRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof LayoutPagesRouteWithChildren
  '/inventory': typeof InventoryRoute
  '/login': typeof LoginRoute
  '/profile/$accountId': typeof ProfileAccountIdRoute
  '/': typeof LayoutPagesIndexRoute
}

export interface FileRoutesByTo {
  '': typeof LayoutRouteWithChildren
  '/inventory': typeof InventoryRoute
  '/login': typeof LoginRoute
  '/profile/$accountId': typeof ProfileAccountIdRoute
  '/': typeof LayoutPagesIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_layout': typeof LayoutRouteWithChildren
  '/inventory': typeof InventoryRoute
  '/login': typeof LoginRoute
  '/_layout/_pages': typeof LayoutPagesRouteWithChildren
  '/profile/$accountId': typeof ProfileAccountIdRoute
  '/_layout/_pages/': typeof LayoutPagesIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '' | '/inventory' | '/login' | '/profile/$accountId' | '/'
  fileRoutesByTo: FileRoutesByTo
  to: '' | '/inventory' | '/login' | '/profile/$accountId' | '/'
  id:
    | '__root__'
    | '/_layout'
    | '/inventory'
    | '/login'
    | '/_layout/_pages'
    | '/profile/$accountId'
    | '/_layout/_pages/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  LayoutRoute: typeof LayoutRouteWithChildren
  InventoryRoute: typeof InventoryRoute
  LoginRoute: typeof LoginRoute
  ProfileAccountIdRoute: typeof ProfileAccountIdRoute
}

const rootRouteChildren: RootRouteChildren = {
  LayoutRoute: LayoutRouteWithChildren,
  InventoryRoute: InventoryRoute,
  LoginRoute: LoginRoute,
  ProfileAccountIdRoute: ProfileAccountIdRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_layout",
        "/inventory",
        "/login",
        "/profile/$accountId"
      ]
    },
    "/_layout": {
      "filePath": "_layout.tsx",
      "children": [
        "/_layout/_pages"
      ]
    },
    "/inventory": {
      "filePath": "inventory.tsx"
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/_layout/_pages": {
      "filePath": "_layout/_pages.tsx",
      "parent": "/_layout",
      "children": [
        "/_layout/_pages/"
      ]
    },
    "/profile/$accountId": {
      "filePath": "profile/$accountId.tsx"
    },
    "/_layout/_pages/": {
      "filePath": "_layout/_pages/index.tsx",
      "parent": "/_layout/_pages"
    }
  }
}
ROUTE_MANIFEST_END */
