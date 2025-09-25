import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, TrendingUp } from 'lucide-react'
import './TrendingSection.css'

const TrendingSection = () => {
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollContainerRef = useRef(null)

  const trendingItems = [
    {
      id: 1,
      title: "Golden Retriever Puppies",
      price: "$800 - $1,200",
      rating: 4.9,
      image: "🐕",
      tag: "Most Popular",
      description: "Friendly, intelligent, devoted"
    },
    {
      id: 2,
      title: "Persian Cat",
      price: "$500 - $900",
      rating: 4.8,
      image: "🐱",
      tag: "Premium",
      description: "Quiet, affectionate, sweet"
    },
    {
      id: 3,
      title: "Cockatiel",
      price: "$100 - $250",
      rating: 4.7,
      image: "🐦",
      tag: "Beginner Friendly",
      description: "Social, intelligent, vocal"
    },
    {
      id: 4,
      title: "Holland Lop Rabbit",
      price: "$75 - $150",
      rating: 4.6,
      image: "🐰",
      tag: "Low Maintenance",
      description: "Gentle, calm, friendly"
    },
    {
      id: 5,
      title: "Bearded Dragon",
      price: "$300 - $600",
      rating: 4.5,
      image: "🦎",
      tag: "Exotic",
      description: "Docile, easy care, unique"
    },
    {
      id: 6,
      title: "Maine Coon Cat",
      price: "$600 - $1,000",
      rating: 4.9,
      image: "🐱",
      tag: "Large Breed",
      description: "Gentle giant, playful, smart"
    }
  ]

  const scroll = (direction) => {
    const container = scrollContainerRef.current
    const scrollAmount = 300

    if (container) {
      const newPosition = direction === 'left'
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount)

      container.scrollTo({ left: newPosition, behavior: 'smooth' })
      setScrollPosition(newPosition)
    }
  }

  return (
    <div className="trending-section">
      <div className="trending-header">
        <div className="trending-controls">
          <button
            className="scroll-arrow left"
            onClick={() => scroll('left')}
            disabled={scrollPosition <= 0}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="scroll-arrow right"
            onClick={() => scroll('right')}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        className="trending-carousel"
        ref={scrollContainerRef}
        onScroll={(e) => setScrollPosition(e.target.scrollLeft)}
      >
        {trendingItems.map((item, index) => (
          <motion.div
            key={item.id}
            className="trending-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{
              scale: 1.05,
              rotateY: 5,
              boxShadow: "0 25px 50px rgba(0,0,0,0.2)"
            }}
            viewport={{ once: true }}
          >
            <div className="card-tag">
              <TrendingUp size={14} />
              {item.tag}
            </div>

            <div className="card-image">
              <span className="pet-emoji">{item.image}</span>
            </div>

            <div className="card-content">
              <h3 className="card-title">{item.title}</h3>
              <p className="card-description">{item.description}</p>

              <div className="card-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(item.rating) ? 'filled' : 'empty'}
                    />
                  ))}
                  <span className="rating-number">{item.rating}</span>
                </div>
              </div>

              <div className="card-price">{item.price}</div>

              <motion.button
                className="card-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default TrendingSection