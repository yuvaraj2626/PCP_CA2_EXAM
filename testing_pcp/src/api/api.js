import axios from "axios";

const BASE_URL = "https://t4e-testserver.onrender.com/api";

export const getToken = async (studentId, password, set) => {
  const { data } = await axios.post(`${BASE_URL}/public/token`, {
    studentId,
    password,
    set,
  });

  return data;
};

export const getDataset = async (token, dataUrl) => {
  const { data } = await axios.get(`${BASE_URL}${dataUrl}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.data;
};

export const validateActivity = (activity) => {
  if (!activity) return null;
  
  const cleaned = {
    activityid: activity.activityid?.toString().trim() || null,
    name: activity.name?.toString().trim() || null,
    steps: isNaN(parseInt(activity.steps)) ? 0 : parseInt(activity.steps),
    caloriesburned: isNaN(parseFloat(activity.caloriesburned)) ? 0 : parseFloat(activity.caloriesburned),
    workoutminutes: isNaN(parseInt(activity.workoutminutes)) ? 0 : parseInt(activity.workoutminutes),
    goalarchived: activity.goalarchived === true || activity.goalarchived === "true" || activity.goalarchived === 1,
    date: activity.date?.toString().trim() || new Date().toISOString(),
  };
  

  if (!cleaned.activityid || !cleaned.name) return null;
  
  return cleaned;
};


export const cleanDataset = (activities) => {
  if (!Array.isArray(activities)) return [];
  return activities
    .map(validateActivity)
    .filter(activity => activity !== null);
};
