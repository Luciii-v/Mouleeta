'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] text-[#1A1A1A] p-6 font-sans">
        <div className="max-w-md w-full bg-white p-8 md:p-12 shadow-2xl border border-stone-100 text-center">
          <h2 className="text-xl md:text-2xl font-medium tracking-widest uppercase mb-4">Something Went Wrong</h2>
          <p className="text-sm text-stone-500 mb-8 font-light leading-relaxed">
            A critical error occurred while loading the application layout. We apologize for the inconvenience.
          </p>
          <button
            onClick={() => reset()}
            className="w-full bg-[#1A1A1A] text-white text-xs uppercase tracking-[0.2em] py-4 hover:bg-stone-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
