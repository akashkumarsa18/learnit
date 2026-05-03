export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-[#080818] via-[#0d0b2b] to-[#080818]" />
      <div className="blob absolute -top-48 -left-48 w-[500px] h-[500px] rounded-full bg-purple-700/20 blur-[120px]" />
      <div className="blob blob-delay-1 absolute top-1/4 -right-32 w-[550px] h-[550px] rounded-full bg-blue-700/15 blur-[130px]" />
      <div className="blob blob-delay-2 absolute bottom-0 left-1/3 w-[450px] h-[450px] rounded-full bg-pink-600/15 blur-[110px]" />
      <div className="blob blob-delay-3 absolute top-2/3 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-600/10 blur-[100px]" />
    </div>
  )
}
