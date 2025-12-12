import "./FormSteps.css";

const StepHealthInfo = ({ formData, onChange }) => {
  // Calculate next expected heat cycle (approximately 6 months)
  const calculateNextHeatCycle = (lastCycle) => {
    if (!lastCycle) return "";
    const lastDate = new Date(lastCycle);
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + 6);
    return nextDate.toLocaleDateString();
  };

  return (
    <div className="form-step">
      <h3 className="step-heading">Health Information</h3>
      <p className="step-description">Help us keep your pet healthy</p>

      {/* Spayed/Neutered */}
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.is_spayed_neutered}
            onChange={(e) => onChange("is_spayed_neutered", e.target.checked)}
          />
          <span>Spayed/Neutered</span>
        </label>
        <p className="field-hint">Check if your pet has been spayed or neutered</p>
      </div>

      {/* Heat Cycle (Only for Female) */}
      {formData.gender === 'female' && !formData.is_spayed_neutered && (
        <div className="form-group highlight-box">
          <label className="form-label">
            🔴 Last Heat Cycle Date
          </label>
          <input
            type="date"
            className="form-input"
            value={formData.last_heat_cycle}
            onChange={(e) => onChange("last_heat_cycle", e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
          {formData.last_heat_cycle && (
            <div className="info-box">
              <p><strong>Next Expected Heat Cycle:</strong></p>
              <p>📅 Around {calculateNextHeatCycle(formData.last_heat_cycle)}</p>
              <p className="small-text">Female pets typically go into heat every 6 months</p>
            </div>
          )}
        </div>
      )}

      {/* Weight */}
      <div className="form-group">
        <label className="form-label">
          Weight (kg)
        </label>
        <input
          type="number"
          className="form-input"
          placeholder="e.g., 15.5"
          value={formData.weight}
          onChange={(e) => onChange("weight", e.target.value)}
          step="0.1"
          min="0"
        />
        <p className="field-hint">Current weight of your pet</p>
      </div>

      {/* Microchip Number */}
      <div className="form-group">
        <label className="form-label">
          Microchip Number
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g., 123456789012345"
          value={formData.microchip_number}
          onChange={(e) => onChange("microchip_number", e.target.value)}
        />
        <p className="field-hint">If your pet has a microchip implanted</p>
      </div>

      {/* Blood Type */}
      <div className="form-group">
        <label className="form-label">
          Blood Type (Optional)
        </label>
        <select
          className="form-select"
          value={formData.blood_type}
          onChange={(e) => onChange("blood_type", e.target.value)}
        >
          <option value="">Select blood type</option>
          <option value="DEA 1.1+">DEA 1.1+ (Dog)</option>
          <option value="DEA 1.1-">DEA 1.1- (Dog)</option>
          <option value="A">Type A (Cat)</option>
          <option value="B">Type B (Cat)</option>
          <option value="AB">Type AB (Cat)</option>
          <option value="Unknown">Unknown</option>
        </select>
        <p className="field-hint">Important for emergency situations</p>
      </div>

      <div className="info-banner">
        <p>💡 <strong>Tip:</strong> Keeping health records up to date helps vets provide better care!</p>
      </div>
    </div>
  );
};

export default StepHealthInfo;