import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Calendar, User, Weight, Trash2, Edit } from "lucide-react";
import "./PetCard.css";

const PetCard = ({ pet, index, onDelete }) => {
  const navigate = useNavigate();

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years === 0) {
      return `${months}m`;
    } else if (months === 0) {
      return `${years}y`;
    } else {
      return `${years}y ${months}m`;
    }
  };

  // Get pet emoji based on species
  const getPetEmoji = (species) => {
    const emojis = {
      dog: "🐕",
      cat: "🐱",
      bird: "🦜",
      rabbit: "🐰",
      hamster: "🐹",
      fish: "🐠",
      other: "🐾"
    };
    return emojis[species?.toLowerCase()] || "🐾";
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove ${pet.name}? 😢`)) {
      onDelete(pet.id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/pets/${pet.id}/edit`);
  };

  return (
    <motion.div
      className="pet-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      onClick={() => navigate(`/pets/${pet.id}`)}
    >
      <div className="pet-card-actions">
        <motion.button
          className="action-btn edit-btn"
          onClick={handleEdit}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Edit size={18} />
        </motion.button>
        <motion.button
          className="action-btn delete-btn"
          onClick={handleDelete}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 size={18} />
        </motion.button>
      </div>

      <div className="pet-image">
        {pet.photo ? (
          <img src={pet.photo} alt={pet.name} />
        ) : (
          <div className="pet-emoji">{getPetEmoji(pet.species)}</div>
        )}
      </div>

      <div className="pet-info">
        <h3>{pet.name}</h3>
        <div className="pet-breed">{pet.breed}</div>
        
        <div className="pet-details">
          <div className="detail-item">
            <Calendar size={16} />
            <span>{calculateAge(pet.date_of_birth)}</span>
          </div>
          <div className="detail-item">
            <User size={16} />
            <span>{pet.gender === 'male' ? '♂️ Male' : '♀️ Female'}</span>
          </div>
          {pet.weight && (
            <div className="detail-item">
              <Weight size={16} />
              <span>{pet.weight}kg</span>
            </div>
          )}
        </div>

        {pet.gender === 'female' && pet.last_heat_cycle && (
          <div className="heat-cycle-info">
            🔴 Last heat: {new Date(pet.last_heat_cycle).toLocaleDateString()}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PetCard;