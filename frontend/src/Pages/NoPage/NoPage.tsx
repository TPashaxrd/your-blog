export default function NoPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4 text-center relative">
      
      <h1 className="text-8xl sm:text-9xl font-extrabold text-purple-500 mb-6 animate-pulse drop-shadow-[0_0_20px_rgba(139,92,246,0.7)]">
        404
      </h1>

      <h2 className="text-3xl sm:text-5xl font-bold mb-4 text-white drop-shadow-md">
        Page Not Found
      </h2>

      <p className="text-gray-400 mb-6 max-w-md sm:text-lg">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>

      <button
        onClick={() => window.location.href = "/"}
        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold transition transform hover:-translate-y-1 hover:scale-105 shadow-lg"
      >
        Go Back Home
      </button>

      <img
        src="https://media.giphy.com/media/14uQ3cOFteDaU/giphy.gif"
        alt="Lost animation"
        className="w-64 sm:w-80 mt-10 rounded-xl shadow-[0_0_50px_rgba(139,92,246,0.7)]"
      />
    </div>
  );
}