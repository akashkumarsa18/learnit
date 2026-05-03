'use client'

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[#0a0a1a]" />

      {/* Blobs */}
      <div
        className="blob absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full"
        style={{
          background: 'rgba(102, 126, 234, 0.25)',
          filter: 'blur(100px)',
        }}
      />
      <div
        className="blob blob-delay-1 absolute top-[20%] right-[-15%] w-[600px] h-[600px] rounded-full"
        style={{
          background: 'rgba(118, 75, 162, 0.2)',
          filter: 'blur(120px)',
        }}
      />
      <div
        className="blob blob-delay-2 absolute bottom-[-10%] left-[20%] w-[450px] h-[450px] rounded-full"
        style={{
          background: 'rgba(236, 72, 153, 0.15)',
          filter: 'blur(90px)',
        }}
      />
      <div
        className="blob blob-delay-3 absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full"
        style={{
          background: 'rgba(6, 182, 212, 0.15)',
          filter: 'blur(80px)',
        }}
      />

      {/* Star dots */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 2 + 1 + 'px',
            height: Math.random() * 2 + 1 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            opacity: Math.random() * 0.5 + 0.1,
          }}
        />
      ))}
    </div>
  )
}
