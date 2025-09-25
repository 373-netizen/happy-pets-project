import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './HeroCarousel.css'

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: "Find Your Perfect Dog Companion",
      subtitle: "From playful puppies to loyal adults",
      image: "🐕",
      gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
      description: "Discover amazing dog breeds perfect for your lifestyle"
    },
    {
      id: 2,
      title: "Loving Cats Waiting for You",
      subtitle: "Independent, affectionate, and adorable",
      image: "🐱",
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      description: "Find your purr-fect feline friend today"
    },
    {
      id: 3,
      title: "Colorful Birds & Exotic Pets",
      subtitle: "Unique companions for unique people",
      image: "🐦",
      gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      description: "Explore our collection of birds and exotic pets"
    },
    {
      id: 4,
      title: "Small Pets, Big Hearts",
      subtitle: "Rabbits, hamsters, and more",
      image: "🐰",
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      description: "Perfect companions for apartment living"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="hero-carousel">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="slide"
          style={{ background: slides[currentSlide].gradient }}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.5 }}
        >
          <div className="slide-content">
            <motion.div
              className="slide-image"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="emoji-large">{slides[currentSlide].image}</span>
            </motion.div>

            <motion.div
              className="slide-text"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h1 className="slide-title">{slides[currentSlide].title}</h1>
              <p className="slide-subtitle">{slides[currentSlide].subtitle}</p>
              <p className="slide-description">{slides[currentSlide].description}</p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button className="carousel-arrow prev" onClick={prevSlide}>
        <ChevronLeft size={24} />
      </button>
      <button className="carousel-arrow next" onClick={nextSlide}>
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="carousel-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroCarousel