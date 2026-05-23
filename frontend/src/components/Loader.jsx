export default function Loader({ fullScreen = false, label = 'Loading...' }) {
  return (
    <div className={`flex items-center justify-center ${fullScreen ? 'min-h-[50vh]' : 'py-10'}`}>
      <div className="inline-flex items-center gap-3 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
        {label}
      </div>
    </div>
  );
}
