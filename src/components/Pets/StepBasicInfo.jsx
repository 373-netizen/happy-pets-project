import { Camera } from "lucide-react";
import "./FormSteps.css";

const StepBasicInfo = ({ formData, onChange, onPhotoChange }) => {
  const dogBreeds = [
    "Golden Retriever", "Labrador Retriever", "German Shepherd", "Bulldog",
    "Beagle", "Poodle", "Rottweiler", "Yorkshire Terrier", "Boxer",
    "Dachshund", "Siberian Husky", "Great Dane", "Doberman", "Shih Tzu"
  ];

  const catBreeds = [
    "Persian", "Maine Coon", "Siamese", "Ragdoll", "Bengal",
    "British Shorthair", "Abyssinian", "Scottish Fold", "Sphynx",
    "American Shorthair", "Russian Blue", "Birman"
  ];

  const birdBreeds = [
    "Budgie", "Cockatiel", "African Grey", "Macaw", "Cockatoo",
    "Lovebird", "Canary", "Finch", "Parakeet"
  ];

  const otherBreeds = [
    "Rabbit", "Hamster", "Guinea Pig", "Fish", "Turtle", "Ferret"
  ];

  const getBreedOptions = () => {
    switch (formData.species) {
      case "dog":
        return dogBreeds;
      case "cat":
        return catBreeds;
      case "bird":
        return birdBreeds;
      case "other":
        return otherBreeds;
      default:
        return [];
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return "";
    
    const birthDate = new Date(dob);
    const today = new Date();
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''} old`;
    } else if (months === 0) {
      return `${years} year${years !== 1 ? 's' : ''} old`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''} and ${months} month${months !== 1 ? 's' : ''} old`;
    }
  };

  return (
    <div className="form-step">
      <h3 className="step-heading">Basic Information</h3>
      <p className="step-description">Let's start with the basics about your pet</p>

      {/* Photo Upload */}
      <div className="form-group photo-upload-group">
        <label className="photo-upload-label">
          <input
            type="file"
            accept="image/*"
            onChange={onPhotoChange}
            style={{ display: "none" }}
          />
          <div className="photo-upload-box">
            {formData.photoPreview ? (
              <img src={formData.photoPreview} alt="Pet preview" className="photo-preview" />
            ) : (
              <>
                <Camera size={40} />
                <p>Click to upload pet photo</p>
                <span className="photo-hint">JPG, PNG up to 5MB</span>
              </>
            )}
          </div>
        </label>
      </div>

      {/* Pet Name */}
      <div className="form-group">
        <label className="form-label">
          Pet Name <span className="required">*</span>
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g., Max, Luna, Kiwi"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          required
        />
      </div>

      {/* Species */}
      <div className="form-group">
        <label className="form-label">
          Species <span className="required">*</span>
        </label>
        <select
          className="form-select"
          value={formData.species}
          onChange={(e) => {
            onChange("species", e.target.value);
            onChange("breed", ""); // Reset breed when species changes
          }}
          required
        >
          <option value="dog">🐕 Dog</option>
          <option value="cat">🐱 Cat</option>
          <option value="bird">🦜 Bird</option>
          <option value="other">🐾 Other</option>
        </select>
      </div>

      {/* Breed */}
      <div className="form-group">
        <label className="form-label">
          Breed <span className="required">*</span>
        </label>
        <select
          className="form-select"
          value={formData.breed}
          onChange={(e) => onChange("breed", e.target.value)}
          required
        >
          <option value="">Select a breed</option>
          {getBreedOptions().map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>
      </div>

      {/* Date of Birth */}
      <div className="form-group">
        <label className="form-label">
          Date of Birth <span className="required">*</span>
        </label>
        <input
          type="date"
          className="form-input"
          value={formData.date_of_birth}
          onChange={(e) => onChange("date_of_birth", e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          required
        />
        {formData.date_of_birth && (
          <div className="age-display">
            🎂 Age: {calculateAge(formData.date_of_birth)}
          </div>
        )}
      </div>

      {/* Gender */}
      <div className="form-group">
        <label className="form-label">
          Gender <span className="required">*</span>
        </label>
        <div className="radio-group">
          <label className={`radio-option ${formData.gender === 'male' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === 'male'}
              onChange={(e) => onChange("gender", e.target.value)}
            />
            <span className="radio-label">♂️ Male</span>
          </label>
          <label className={`radio-option ${formData.gender === 'female' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === 'female'}
              onChange={(e) => onChange("gender", e.target.value)}
            />
            <span className="radio-label">♀️ Female</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default StepBasicInfo;