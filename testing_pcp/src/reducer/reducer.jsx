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

export const ActivityReducer = (state, action) => {
  switch (action.type) {
    case "SET_ACTIVITIES":
      return {
        ...state,
        activities: action.payload,
        filteredActivities: action.payload,
        loading: false,
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case "ADD_ACTIVITY":
      return {
        ...state,
        activities: [...state.activities, action.payload],
        filteredActivities: [...state.filteredActivities, action.payload],
      };

    case "UPDATE_ACTIVITY":
      return {
        ...state,
        activities: state.activities.map((activity) =>
          activity.activityid === action.payload.activityid
            ? { ...activity, ...action.payload }
            : activity
        ),
        filteredActivities: state.filteredActivities.map((activity) =>
          activity.activityid === action.payload.activityid
            ? { ...activity, ...action.payload }
            : activity
        ),
      };

    case "DELETE_ACTIVITY":
      return {
        ...state,
        activities: state.activities.filter(
          (activity) => activity.activityid !== action.payload
        ),
        filteredActivities: state.filteredActivities.filter(
          (activity) => activity.activityid !== action.payload
        ),
      };

    case "SET_FILTERS":
      const updatedFilters = { ...state.filters, ...action.payload };
      
      const filtered = state.activities.filter((activity) => {
        const nameMatch = activity.name
          .toLowerCase()
          .includes(updatedFilters.name.toLowerCase());
        
        const goalMatch =
          updatedFilters.goalarchived === null ||
          activity.goalarchived === updatedFilters.goalarchived;
        
        const stepsMatch =
          activity.steps >= updatedFilters.minSteps &&
          activity.steps <= updatedFilters.maxSteps;
        
        const caloriesMatch =
          activity.caloriesburned >= updatedFilters.minCalories &&
          activity.caloriesburned <= updatedFilters.maxCalories;
        
        return nameMatch && goalMatch && stepsMatch && caloriesMatch;
      });

      return {
        ...state,
        filters: updatedFilters,
        filteredActivities: filtered,
      };

    case "RESET_FILTERS":
      return {
        ...state,
        filters: initialState.filters,
        filteredActivities: state.activities,
      };

    default:
      return state;
  }
};

export default ActivityReducer;
