"use client";

import dynamic from "next/dynamic";

const ResumeBuilder = dynamic(() => import("./resume-builder"), {
  ssr: false,
  loading: () => (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="h-10 w-64 rounded bg-white/10" />
      <div className="mt-4 h-24 w-full max-w-2xl rounded bg-white/5" />
    </div>
  ),
});

export default function ResumeBuilderLazy() {
  return <ResumeBuilder />;
}
