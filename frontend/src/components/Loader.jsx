export default function Loader({
  message = "Loading...",
}) {
  return (
    <div
      className="loader-container"
      role="status"
      aria-live="polite"
    >
      <div
        className="loader-spinner"
        aria-hidden="true"
      />
      <p>{message}</p>
    </div>
  );
}