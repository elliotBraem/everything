import { Suspense, lazy } from 'react';

const ViteApp = lazy(() => import('viteRemote/App'));

export default function Button() {
  return (
    <div>
      rust host
      <hr />
      <Suspense fallback={<div>Loading...</div>}>
        <ViteApp />
      </Suspense>
    </div>
  );
}
