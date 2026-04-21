import { useState } from "react";
import { useActivity } from "../context/context";
import "./Filters.css";

export default function Filters() {
  const { filters, setFilters, resetFilters } = useActivity();
  const [localFilters, setLocalFilters] = useState(filters);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: checked ? true : false,
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
    if (name === "goalarchived") {
      parsedValue = value === "null" ? null : value === "true";
    } else if (name === "minSteps" || name === "maxSteps") {
      parsedValue = value === "" ? (name === "maxSteps" ? Infinity : 0) : parseInt(value);
    } else if (name === "minCalories" || name === "maxCalories") {
      parsedValue = value === "" ? (name === "maxCalories" ? Infinity : 0) : parseFloat(value);
    }
    setLocalFilters((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleApplyFilters = () => {
    setFilters(localFilters);
  };

  const handleResetFilters = () => {
    resetFilters();
    setLocalFilters({
      name: "",
      goalarchived: null,
      minSteps: 0,
      maxSteps: Infinity,
      minCalories: 0,
      maxCalories: Infinity,
    });
  };

  return (
    <div className="filters-container">
      <h1>Filter Activities</h1>

      <div className="filters-form">
        <div className="form-group">
          <label htmlFor="name">Activity Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={localFilters.name}
            onChange={handleInputChange}
            placeholder="Search by name..."
            data-testid="filter-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="goalarchived">Goal Status:</label>
          <select
            id="goalarchived"
            name="goalarchived"
            value={
              localFilters.goalarchived === null
                ? "null"
                : localFilters.goalarchived.toString()
            }
            onChange={handleSelectChange}
          >
            <option value="null">All</option>
            <option value="true">Goal Achieved</option>
            <option value="false">Goal Not Achieved</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="minSteps">Min Steps:</label>
            <input
              type="number"
              id="minSteps"
              name="minSteps"
              value={localFilters.minSteps === 0 ? "" : localFilters.minSteps}
              onChange={handleSelectChange}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="maxSteps">Max Steps:</label>
            <input
              type="number"
              id="maxSteps"
              name="maxSteps"
              value={localFilters.maxSteps === Infinity ? "" : localFilters.maxSteps}
              onChange={handleSelectChange}
              placeholder="Unlimited"
              min="0"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="minCalories">Min Calories:</label>
            <input
              type="number"
              id="minCalories"
              name="minCalories"
              value={localFilters.minCalories === 0 ? "" : localFilters.minCalories}
              onChange={handleSelectChange}
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="maxCalories">Max Calories:</label>
            <input
              type="number"
              id="maxCalories"
              name="maxCalories"
              value={
                localFilters.maxCalories === Infinity
                  ? ""
                  : localFilters.maxCalories
              }
              onChange={handleSelectChange}
              placeholder="Unlimited"
              min="0"
              step="0.1"
            />
          </div>
        </div>

        <div className="form-actions">
          <button onClick={handleApplyFilters} className="apply-btn">
            Apply Filters
          </button>
          <button onClick={handleResetFilters} className="reset-btn">
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
