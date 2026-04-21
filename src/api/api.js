import axios from "axios";

const BASE_URL = "https://t4e-testserver.onrender.com/api";

export const getToken = async (studentId, password, set) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/public/token`, {
      studentId,
      password,
      set,
    });
    console.log("Token response structure:", data);
    console.log("Token:", data.token);
    console.log("DataUrl:", data.dataUrl);
    return data;
  } catch (error) {
    console.error("Token Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getDataset = async (token, dataUrl) => {
  try {
    console.log("Raw dataUrl received:", dataUrl);
    
    // Try the exact dataUrl first (from token response), then fallback variations
    let endpoints = [
      dataUrl,      // Try the exact URL from token response FIRST
      `/public/setB`,
      `/setB`,
      `/private/setB`,
    ];
    
    let data = null;
    let lastError = null;
    
    for (const endpoint of endpoints) {
      try {
        console.log("Trying endpoint:", `${BASE_URL}${endpoint}`);
        
        const response = await axios.get(`${BASE_URL}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log("Success! Response:", response.data);
        data = response.data;
        break; // Success, exit loop
      } catch (error) {
        lastError = error;
        console.log(`Endpoint ${endpoint} failed:`, error.response?.status);
        continue; // Try next endpoint
      }
    }
    
    if (!data) {
      throw lastError || new Error("No endpoint returned data");
    }
    
    console.log("API Response full structure:", JSON.stringify(data, null, 2));
    
    // Handle different response structures
    let activities = [];
    
    // Check if data is already an array
    if (Array.isArray(data)) {
      activities = data;
    }
    // Check if data has a .data.activities property (nested)
    else if (data.data && data.data.activities && Array.isArray(data.data.activities)) {
      activities = data.data.activities;
    }
    // Check if data has a .data property with array
    else if (data.data && Array.isArray(data.data)) {
      activities = data.data;
    }
    // Check if data has an .activities property
    else if (data.activities && Array.isArray(data.activities)) {
      activities = data.activities;
    }
    // Check if data has a .results property
    else if (data.results && Array.isArray(data.results)) {
      activities = data.results;
    }
    // Try to find any array in the object
    else {
      for (const key in data) {
        if (Array.isArray(data[key]) && data[key].length > 0) {
          console.log(`Found array at data.${key}`);
          activities = data[key];
          break;
        }
      }
    }
    
    console.log("Extracted activities:", activities);
    return activities;
  } catch (error) {
    console.error("Dataset Error:", error.response?.data || error.message);
    console.error("Full error response:", error.response);
    throw error;
  }
};

export const validateActivity = (activity) => {
  if (!activity) return null;
  
  // Map API field names to our field names
  const cleaned = {
    activityid: (activity.activityid || activity.activityId || activity.id)?.toString().trim() || null,
    name: activity.name?.toString().trim() || null,
    steps: isNaN(parseInt(activity.steps)) ? 0 : parseInt(activity.steps),
    caloriesburned: isNaN(parseFloat(activity.caloriesburned || activity.caloriesBurned)) ? 0 : parseFloat(activity.caloriesburned || activity.caloriesBurned),
    workoutminutes: isNaN(parseInt(activity.workoutminutes || activity.workoutMinutes)) ? 0 : parseInt(activity.workoutminutes || activity.workoutMinutes),
    goalarchived: activity.goalarchived === true || activity.goalarchived === "true" || activity.goalarchived === 1 || activity.goalAchieved === true || activity.goalAchieved === "true" || activity.goalAchieved === 1,
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
