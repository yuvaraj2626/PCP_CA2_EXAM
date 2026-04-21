import { useActivity } from "../context/context";
import { Link } from "react-router-dom";
import "./Activities.css";

export default function Activities() {
  const { filteredActivities, loading, error } = useActivity();

  if (loading) return <div className="loading">Loading activities...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="activities-container">
      <h1>Activities</h1>
      {filteredActivities.length === 0 ? (
        <p>No activities found</p>
      ) : (
        <div className="activities-list">
          {filteredActivities.map((activity) => (
            <div
              key={activity.activityid}
              className="activities-item"
              data-testid="activities-item"
            >
              <div className="activity-card">
                <h3>{activity.name}</h3>
                <p>
                  <strong>Steps:</strong> {activity.steps}
                </p>
                <p>
                  <strong>Calories:</strong> {activity.caloriesburned}
                </p>
                <p>
                  <strong>Workout Minutes:</strong> {activity.workoutminutes}
                </p>
                <p>
                  <strong>Goal Achieved:</strong>{" "}
                  {activity.goalarchived ? "✓ Yes" : "✗ No"}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(activity.date).toLocaleDateString()}
                </p>
                <Link to={`/activities/${activity.activityid}`} className="view-btn">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
