export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
