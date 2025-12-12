import "./FormSteps.css";

const StepAdditionalInfo = ({ formData, onChange }) => {
  return (
    <div className="form-step">
      <h3 className="step-heading">Additional Details</h3>
      <p className="step-description">Tell us more about your pet's personality and needs</p>

      {/* Color/Markings */}
      <div className="form-group">
        <label className="form-label">
          Color & Markings
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g., Golden with white chest, Brown tabby"
          value={formData.color_markings}
          onChange={(e) => onChange("color_markings", e.target.value)}
        />
        <p className="field-hint">Describe your pet's appearance</p>
      </div>

      {/* Medical Conditions */}
      <div className="form-group">
        <label className="form-label">
          Medical Conditions
        </label>
        <textarea
          className="form-textarea"
          placeholder="List any medical conditions, chronic illnesses, or special needs..."
          value={formData.medical_conditions}
          onChange={(e) => onChange("medical_conditions", e.target.value)}
          rows="3"
        />
        <p className="field-hint">Important for vet visits and emergencies</p>
      </div>

      {/* Allergies */}
      <div className="form-group">
        <label className="form-label">
          Allergies
        </label>
        <textarea
          className="form-textarea"
          placeholder="Food allergies, medication allergies, environmental allergies..."
          value={formData.allergies}
          onChange={(e) => onChange("allergies", e.target.value)}
          rows="3"
        />
        <p className="field-hint">Help us keep your pet safe</p>
      </div>

      {/* Favorite Food */}
      <div className="form-group">
        <label className="form-label">
          🍖 Favorite Food
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g., Chicken, Salmon, Carrots"
          value={formData.favorite_food}
          onChange={(e) => onChange("favorite_food", e.target.value)}
        />
      </div>

      {/* Favorite Toy */}
      <div className="form-group">
        <label className="form-label">
          🎾 Favorite Toy
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g., Tennis ball, Feather wand, Squeaky duck"
          value={formData.favorite_toy}
          onChange={(e) => onChange("favorite_toy", e.target.value)}
        />
      </div>

      <div className="fun-fact-box">
        <p>🎨 <strong>Fun Fact:</strong> These details help pet sitters and boarding facilities provide personalized care!</p>
      </div>
    </div>
  );
};

export default StepAdditionalInfo;