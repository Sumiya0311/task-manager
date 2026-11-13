import { useEffect, useRef } from "react";

export default function ConfirmDialog({
  isOpen,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this task?",
  onConfirm,
  onCancel,
  loading = false,
}) {
  const cancelButtonRef = useRef(null);
  const deleteButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Manage focus when the dialog opens and closes.
  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement;

    // Focus Cancel by default to prevent accidental deletion.
    cancelButtonRef.current?.focus();

    return () => {
      // Restore focus to the button that opened the dialog.
      const previousElement = previousFocusRef.current;

      if (previousElement?.isConnected) {
        previousElement.focus();
      }
    };
  }, [isOpen]);

  // Handle keyboard accessibility.
  useEffect(() => {
    if (!isOpen || loading) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
        return;
      }

      if (event.key === "Tab") {
        const cancelButton = cancelButtonRef.current;
        const deleteButton = deleteButtonRef.current;

        if (!cancelButton || !deleteButton) return;

        if (
          event.shiftKey &&
          document.activeElement === cancelButton
        ) {
          event.preventDefault();
          deleteButton.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === deleteButton
        ) {
          event.preventDefault();
          cancelButton.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen, loading, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="confirm-overlay">
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        <h2 id="confirm-title">{title}</h2>

        <p id="confirm-message">{message}</p>

        <div className="confirm-actions">
          <button
            ref={cancelButtonRef}
            type="button"
            className="confirm-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            ref={deleteButtonRef}
            type="button"
            className="confirm-delete"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}