export default function NoPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4 text-center">
      <h1 className="text-7xl sm:text-9xl font-bold text-purple-500 mb-6 animate-pulse">
        404
      </h1>
      <h2 className="text-2xl sm:text-4xl font-bold mb-4">
        Page Not Found
      </h2>
      <p className="text-gray-600 mb-6 max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>

      <button
        onClick={() => window.location.href = "/"}
        className="px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors font-semibold"
      >
        Go Back Home
      </button>

      <img
        src="https://media.giphy.com/media/14uQ3cOFteDaU/giphy.gif"
        alt="Lost animation"
        className="w-64 mt-10 sm:w-80 rounded-xl shadow-lg"
      />
    </div>
  );
}
