import { useEffect } from "react";
import { useActivity } from "../context/context";
import "./Stats.css";

export default function Stats() {
  const {
    activities,
    loading,
    error,
    getTotalSteps,
    getTotalCalories,
    getTotalWorkoutMinutes,
    getGoalAchievedCount,
    getGoalNotAchievedCount,
    getAverageSteps,
  } = useActivity();

  // Update window.appState on component mount
  useEffect(() => {
    const totalActivities = activities.length;
    const goalAchievedCount = getGoalAchievedCount();

    window.appState = {
      totalActivities,
      goalAchievedCount,
    };
  }, [activities, getGoalAchievedCount]);

  if (loading) return <div className="loading">Loading statistics...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const totalActivities = activities.length;
  const goalAchieved = getGoalAchievedCount();
  const goalNotAchieved = getGoalNotAchievedCount();
  const totalSteps = getTotalSteps();
  const totalCalories = getTotalCalories();
  const totalWorkoutMinutes = getTotalWorkoutMinutes();
  const averageSteps = getAverageSteps();

  return (
    <div className="stats-container">
      <h1>Activity Statistics</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Activities</h3>
          <p className="stat-value" data-testid="total-activities">
            {totalActivities}
          </p>
        </div>

        <div className="stat-card">
          <h3>Goal Achieved</h3>
          <p className="stat-value" data-testid="goal-achieved">
            {goalAchieved}
          </p>
        </div>

        <div className="stat-card">
          <h3>Goal Not Achieved</h3>
          <p className="stat-value" data-testid="goal-not-achieved">
            {goalNotAchieved}
          </p>
        </div>

        <div className="stat-card">
          <h3>Total Steps</h3>
          <p className="stat-value">{totalSteps}</p>
        </div>

        <div className="stat-card">
          <h3>Average Steps</h3>
          <p className="stat-value">{averageSteps}</p>
        </div>

        <div className="stat-card">
          <h3>Total Calories Burned</h3>
          <p className="stat-value">{totalCalories.toFixed(2)} kcal</p>
        </div>

        <div className="stat-card">
          <h3>Total Workout Minutes</h3>
          <p className="stat-value">{totalWorkoutMinutes} min</p>
        </div>

        <div className="stat-card">
          <h3>Success Rate</h3>
          <p className="stat-value">
            {totalActivities === 0
              ? "0%"
              : `${Math.round((goalAchieved / totalActivities) * 100)}%`}
          </p>
        </div>
      </div>

      <div className="window-state-info">
        <h3>Global State (window.appState):</h3>
        <pre>
          {JSON.stringify(window.appState, null, 2)}
        </pre>
      </div>
    </div>
  );
}
