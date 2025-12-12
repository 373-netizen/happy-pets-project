import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, X } from 'lucide-react'
import './FunFacts.css'

const FunFacts = () => {
  const [currentFact, setCurrentFact] = useState(0)
  const [visible, setVisible] = useState(true)   // NEW for cancel button

  const facts = [
    { emoji: "🐱", text: "Cats sleep 70% of their lives - that's 13-16 hours a day!" },
    { emoji: "🐕", text: "A dog's sense of smell is 10,000 times stronger than humans" },
    { emoji: "🐦", text: "Parrots can live over 100 years and learn 1000+ words" },
    { emoji: "🐰", text: "Rabbits can jump nearly 3 feet high and 10 feet long" },
    { emoji: "🦎", text: "Chameleons can move their eyes independently in all directions" }
  ]

  const quotes = [
    "\"Animals are such agreeable friends—they ask no questions; they pass no criticisms.\" - George Eliot",
    "\"The greatness of a nation can be judged by the way its animals are treated.\" - Mahatma Gandhi",
    "\"Until one has loved an animal, a part of one's soul remains unawakened.\" - Anatole France"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % facts.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  if (!visible) return null   // Hides component after cancel

  return (
    <motion.div
      className="fun-facts-sticky"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.6 }}
    >
      <div className="fun-facts-header">
        <Lightbulb className="bulb-icon" />
        <h4>Did You Know?</h4>

        {/* CANCEL BUTTON */}
        <button className="cancel-btn" onClick={() => setVisible(false)}>
          <X size={16} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentFact}
          className="fact-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="fact-emoji">{facts[currentFact].emoji}</div>
          <p className="fact-text">{facts[currentFact].text}</p>
        </motion.div>
      </AnimatePresence>

      <div className="quote-section">
        <div className="quote-text">
          {quotes[currentFact % quotes.length]}
        </div>
      </div>

      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>
    </motion.div>
  )
}

export default FunFacts
