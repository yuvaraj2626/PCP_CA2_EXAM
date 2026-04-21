import { useParams, useNavigate } from "react-router-dom";
import { useActivity } from "../context/context";
import "./ActivityDetail.css";

export default function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getActivityById, deleteActivity, loading, error } = useActivity();

  const activity = getActivityById(id);

  if (loading) return <div className="loading">Loading activity...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!activity)
    return (
      <div className="not-found">
        <p>Activity not found</p>
        <button onClick={() => navigate("/activities")}>
          Back to Activities
        </button>
      </div>
    );

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this activity?")) {
      deleteActivity(id);
      navigate("/activities");
    }
  };

  return (
    <div className="activity-detail-container">
      <div className="detail-header">
        <button onClick={() => navigate("/activities")} className="back-btn">
          ← Back
        </button>
        <h1>{activity.name}</h1>
      </div>

      <div className="detail-content">
        <div className="detail-card">
          <div className="detail-item">
            <label>Activity ID:</label>
            <p>{activity.activityid}</p>
          </div>

          <div className="detail-item">
            <label>Steps:</label>
            <p>{activity.steps}</p>
          </div>

          <div className="detail-item">
            <label>Calories Burned:</label>
            <p>{activity.caloriesburned} kcal</p>
          </div>

          <div className="detail-item">
            <label>Workout Minutes:</label>
            <p>{activity.workoutminutes} minutes</p>
          </div>

          <div className="detail-item">
            <label>Goal Achieved:</label>
            <p>{activity.goalarchived ? "✓ Yes" : "✗ No"}</p>
          </div>

          <div className="detail-item">
            <label>Date:</label>
            <p>{new Date(activity.date).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="actions">
          <button onClick={handleDelete} className="delete-btn">
            Delete Activity
          </button>
        </div>
      </div>
    </div>
  );
}
