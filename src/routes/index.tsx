import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage
});

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl py-12">
        <h1>Hi</h1>
      </div>
    </div>
  );
}
