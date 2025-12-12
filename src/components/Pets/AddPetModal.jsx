import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Check } from "lucide-react";
import axios from "axios";
import StepBasicInfo from "./StepBasicInfo";
import StepHealthInfo from "./StepHealthInfo";
import StepAdditionalInfo from "./StepAdditionalInfo";
import StepEmergency from "./StepEmergency";
import "./AddPetModal.css";

const AddPetModal = ({ onClose, onAdd }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    photo: null,
    photoPreview: null,
    name: "",
    species: "dog",
    breed: "",
    date_of_birth: "",
    gender: "male",
    
    // Step 2: Health Info
    is_spayed_neutered: false,
    last_heat_cycle: "",
    weight: "",
    microchip_number: "",
    blood_type: "",
    
    // Step 3: Additional Info
    color_markings: "",
    medical_conditions: "",
    allergies: "",
    favorite_food: "",
    favorite_toy: "",
    
    // Step 4: Emergency
    vet_name: "",
    vet_phone: "",
    vet_address: "",
    emergency_contact_name: "",
    emergency_contact_phone: ""
  });

  const steps = [
    { number: 1, label: "Basic Info" },
    { number: 2, label: "Health" },
    { number: 3, label: "Details" },
    { number: 4, label: "Emergency" }
  ];

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          photo: file,
          photoPreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.breed && formData.date_of_birth;
      case 2:
        return true; // Health info is optional
      case 3:
        return true; // Additional info is optional
      case 4:
        return true; // Emergency info is optional
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    } else {
      alert("Please fill in all required fields");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem("access") || sessionStorage.getItem("access");
      
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'photo' && formData.photo) {
          submitData.append('photo', formData.photo);
        } else if (key !== 'photo' && key !== 'photoPreview' && formData[key]) {
          submitData.append(key, formData[key]);
        }
      });

      const response = await axios.post(
        "http://127.0.0.1:8000/api/pets/",
        submitData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      console.log("Pet added successfully:", response.data);
      onAdd(response.data.pet);
      onClose();
    } catch (error) {
      console.error("Error adding pet:", error);
      alert("Failed to add pet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepBasicInfo
            formData={formData}
            onChange={handleChange}
            onPhotoChange={handlePhotoChange}
          />
        );
      case 2:
        return (
          <StepHealthInfo
            formData={formData}
            onChange={handleChange}
          />
        );
      case 3:
        return (
          <StepAdditionalInfo
            formData={formData}
            onChange={handleChange}
          />
        );
      case 4:
        return (
          <StepEmergency
            formData={formData}
            onChange={handleChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">Add New Pet 🐾</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Steps Indicator */}
        <div className="steps-indicator">
          {steps.map((step, index) => (
            <div key={step.number} className="step-wrapper">
              <div className={`step ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}>
                <div className="step-circle">
                  {currentStep > step.number ? (
                    <Check size={20} />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="step-label">{step.label}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`step-line ${currentStep > step.number ? 'completed' : ''}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="modal-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button
            className="btn-secondary"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ChevronLeft size={20} />
            Back
          </button>
          
          <div className="step-counter">
            Step {currentStep} of {steps.length}
          </div>
          
          <button
            className="btn-primary"
            onClick={handleNext}
            disabled={loading}
          >
            {loading ? (
              "Saving..."
            ) : currentStep === 4 ? (
              <>
                <Check size={20} />
                Finish
              </>
            ) : (
              <>
                Next
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddPetModal;