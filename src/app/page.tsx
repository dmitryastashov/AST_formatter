import { CodeSnapshot } from "@/components/code-snapshot";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 py-12 sm:p-8 md:p-12">
      <CodeSnapshot />
    </main>
  );
}
