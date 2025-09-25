import { useState } from 'react'
import { motion } from 'framer-motion'
import './PetCategories.css'

const PetCategories = () => {
  const [hoveredCard, setHoveredCard] = useState(null)

  const categories = [
    {
      id: 1,
      name: "Dogs",
      emoji: "🐕",
      breeds: "150+ Breeds",
      description: "Loyal, playful, and perfect companions for active families",
      color: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
    },
    {
      id: 2,
      name: "Cats",
      emoji: "🐱",
      breeds: "80+ Breeds",
      description: "Independent, graceful, and ideal for cozy homes",
      color: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
    },
    {
      id: 3,
      name: "Birds",
      emoji: "🐦",
      breeds: "40+ Species",
      description: "Colorful, intelligent, and bring music to your home",
      color: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
    },
    {
      id: 4,
      name: "Exotic",
      emoji: "🦎",
      breeds: "25+ Species",
      description: "Unique, fascinating, and perfect conversation starters",
      color: "linear-gradient(135deg, #a8e6cf 0%, #dcedc8 100%)"
    }
  ]

  return (
    <div className="pet-categories">
      {categories.map((category) => (
        <motion.div
          key={category.id}
          className="category-card"
          onMouseEnter={() => setHoveredCard(category.id)}
          onMouseLeave={() => setHoveredCard(null)}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`card-inner ${hoveredCard === category.id ? 'flipped' : ''}`}>
            {/* Front of card */}
            <div className="card-front" style={{ background: category.color }}>
              <div className="category-emoji">{category.emoji}</div>
              <h3 className="category-name">{category.name}</h3>
              <p className="category-breeds">{category.breeds}</p>
            </div>

            {/* Back of card */}
            <div className="card-back" style={{ background: category.color }}>
              <div className="back-content">
                <h3>{category.name}</h3>
                <p className="category-description">{category.description}</p>
                <motion.button
                  className="explore-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Breeds
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default PetCategories