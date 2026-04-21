import { createContext, useContext, useReducer, useEffect } from "react";
import ActivityReducer from "../reducer/reducer";
import { getToken, getDataset, cleanDataset } from "../api/api";

const initialState = {
  activities: [],
  filteredActivities: [],
  loading: true,
  error: null,
  filters: {
    name: "",
    goalarchived: null,
    minSteps: 0,
    maxSteps: Infinity,
    minCalories: 0,
    maxCalories: Infinity,
  },
};

export const ActivityContext = createContext();

export const ActivityProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ActivityReducer, initialState);

  // Fetch activities from server
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        
        // Step 1: Get Token
        const tokenRes = await getToken("20084016", "311850", "activities");

        // Step 2: Fetch dataset
        const rawData = await getDataset(tokenRes.token, tokenRes.dataUrl);

        // Step 3: Clean and validate data
        const cleanedActivities = cleanDataset(rawData);

        dispatch({ type: "SET_ACTIVITIES", payload: cleanedActivities });
      } catch (err) {
        console.error("Error fetching activities:", err.message);
        dispatch({ type: "SET_ERROR", payload: err.message });
      }
    };

    fetchActivities();
  }, []);

  // Update window.appState for testing
  useEffect(() => {
    const totalActivities = state.activities.length;
    const goalAchievedCount = state.activities.reduce(
      (count, activity) => (activity.goalarchived ? count + 1 : count),
      0
    );
    
    window.appState = {
      totalActivities,
      goalAchievedCount,
    };
  }, [state.activities]);

  // Helper methods using map, filter, reduce
  const getActivityById = (id) => {
    return state.activities.find((activity) => activity.activityid === id) || null;
  };

  const getTotalSteps = () => {
    return state.activities.reduce((sum, activity) => sum + activity.steps, 0);
  };

  const getTotalCalories = () => {
    return state.activities.reduce(
      (sum, activity) => sum + activity.caloriesburned,
      0
    );
  };

  const getTotalWorkoutMinutes = () => {
    return state.activities.reduce(
      (sum, activity) => sum + activity.workoutminutes,
      0
    );
  };

  const getGoalAchievedCount = () => {
    return state.activities.filter((activity) => activity.goalarchived).length;
  };

  const getGoalNotAchievedCount = () => {
    return state.activities.filter((activity) => !activity.goalarchived).length;
  };

  const getAverageSteps = () => {
    if (state.activities.length === 0) return 0;
    return Math.round(getTotalSteps() / state.activities.length);
  };

  const addActivity = (activity) =>
    dispatch({ type: "ADD_ACTIVITY", payload: activity });

  const updateActivity = (activity) =>
    dispatch({ type: "UPDATE_ACTIVITY", payload: activity });

  const deleteActivity = (id) =>
    dispatch({ type: "DELETE_ACTIVITY", payload: id });

  const setFilters = (filters) =>
    dispatch({ type: "SET_FILTERS", payload: filters });

  const resetFilters = () => dispatch({ type: "RESET_FILTERS" });

  return (
    <ActivityContext.Provider
      value={{
        activities: state.activities,
        filteredActivities: state.filteredActivities,
        loading: state.loading,
        error: state.error,
        filters: state.filters,
        // Methods
        getActivityById,
        getTotalSteps,
        getTotalCalories,
        getTotalWorkoutMinutes,
        getGoalAchievedCount,
        getGoalNotAchievedCount,
        getAverageSteps,
        addActivity,
        updateActivity,
        deleteActivity,
        setFilters,
        resetFilters,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivity must be used within ActivityProvider");
  }
  return context;
};
