import { siteConfig } from "@/lib/config";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="font-serif text-4xl font-bold tracking-tight">
        {siteConfig.name}
      </h1>
      <p className="mt-4 max-w-lg text-center text-lg text-muted">
        {siteConfig.description}
      </p>
    </main>
  );
}
