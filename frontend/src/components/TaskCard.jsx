import { Link } from "react-router-dom";

export default function TaskCard({
  task,
  processingId,
  onToggleComplete,
  onDelete,
}) {
  const isComplete = task.status === "Done";
  const isProcessing = processingId === task.id;

  return (
    <article className="task-card">
      <h2>{task.title}</h2>

      {task.description && (
        <p>{task.description}</p>
      )}

      <p>
        <strong>Status:</strong> {task.status}
      </p>

      <p>
        <strong>Priority:</strong> {task.priority}
      </p>

      <p>
        <strong>Due Date:</strong>{" "}
        {task.due_date || "Not set"}
      </p>

      <div className="task-actions">
        <Link to={`/tasks/${task.id}/edit`}>
          Edit Task
        </Link>

        <button
          type="button"
          disabled={processingId !== null}
          onClick={() => onToggleComplete(task.id)}
        >
          {isProcessing
            ? "Updating..."
            : isComplete
            ? "Mark as Incomplete"
            : "Mark as Complete"}
        </button>

        <button
          type="button"
          disabled={processingId !== null}
          onClick={() => onDelete(task.id)}
        >
          {isProcessing ? "Processing..." : "Delete"}
        </button>
      </div>
    </article>
  );
}