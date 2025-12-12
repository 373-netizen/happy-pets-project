import "./FormSteps.css";

const StepEmergency = ({ formData, onChange }) => {
  return (
    <div className="form-step">
      <h3 className="step-heading">Emergency Contact</h3>
      <p className="step-description">Be prepared for any emergency situation</p>

      {/* Veterinarian Section */}
      <div className="section-divider">
        <h4 className="section-subtitle">🏥 Veterinarian Information</h4>
      </div>

      <div className="form-group">
        <label className="form-label">
          Vet Name
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g., Dr. Sarah Johnson"
          value={formData.vet_name}
          onChange={(e) => onChange("vet_name", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Vet Phone Number
        </label>
        <input
          type="tel"
          className="form-input"
          placeholder="+1 (555) 123-4567"
          value={formData.vet_phone}
          onChange={(e) => onChange("vet_phone", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Vet Clinic Address
        </label>
        <textarea
          className="form-textarea"
          placeholder="Full address of the veterinary clinic..."
          value={formData.vet_address}
          onChange={(e) => onChange("vet_address", e.target.value)}
          rows="2"
        />
      </div>

      {/* Emergency Contact Section */}
      <div className="section-divider">
        <h4 className="section-subtitle">📞 Emergency Contact Person</h4>
        <p className="section-description">Someone who can be reached if you're unavailable</p>
      </div>

      <div className="form-group">
        <label className="form-label">
          Contact Name
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g., John Doe (Friend/Family)"
          value={formData.emergency_contact_name}
          onChange={(e) => onChange("emergency_contact_name", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Contact Phone Number
        </label>
        <input
          type="tel"
          className="form-input"
          placeholder="+1 (555) 987-6543"
          value={formData.emergency_contact_phone}
          onChange={(e) => onChange("emergency_contact_phone", e.target.value)}
        />
      </div>

      <div className="emergency-banner">
        <div className="emergency-icon">🚨</div>
        <div>
          <p><strong>Emergency Preparedness</strong></p>
          <p className="small-text">Having this information readily available can save precious time in emergency situations.</p>
        </div>
      </div>

      <div className="completion-message">
        <p>✨ You're all set! Click "Finish" to add your pet to your paradise! 🐾</p>
      </div>
    </div>
  );
};

export default StepEmergency;