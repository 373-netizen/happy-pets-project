import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowRight, Calendar, ShoppingCart, PlayCircle, MessageCircle, Heart, Star, TrendingUp } from 'lucide-react'
import HeroCarousel from '../components/HeroCarousel'
import PetCategories from '../components/PetCategories'
import QuickAccess from '../components/QuickAccess'
import TrendingSection from '../components/TrendingSection'
import FunFacts from '../components/FunFacts'
import MiniQuiz from '../components/MiniQuiz'
import CommunityPreview from '../components/CommunityPreview'
import './HomePage.css'

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)

  const searchSuggestions = [
    '🐕 Golden Retriever',
    '🐱 Persian Cat',
    '🐦 Parakeet',
    '🐰 Holland Lop Rabbit',
    '🐢 Red-eared Slider'
  ]

  return (
    <div className="homepage">
      {/* Floating Paw Prints */}
      <div className="floating-paws">
        <div className="floating-paw">🐾</div>
        <div className="floating-paw">🐾</div>
        <div className="floating-paw">🐾</div>
        <div className="floating-paw">🐾</div>
        <div className="floating-paw">🐾</div>
      </div>

      {/* Hero Section with Carousel */}
      <section className="hero-section">
        <div className="hero-carousel-wrapper">
          <HeroCarousel />
        </div>

        {/* Animated Search Bar */}
        <motion.div
          className="search-container"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="search-bar">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search for your perfect pet companion..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
            />
            <motion.button
              className="search-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Find Pet
            </motion.button>
          </div>

          <AnimatePresence>
            {showSearchSuggestions && (
              <motion.div
                className="search-suggestions"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {searchSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => {
                      setSearchQuery(suggestion)
                      setShowSearchSuggestions(false)
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Quick Access Row */}
      <QuickAccess />

      {/* Pet Categories */}
      <section className="section">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Explore Pet Categories
          </motion.h2>
          <PetCategories />
        </div>
      </section>

      {/* Trending Section */}
      <section className="section trending-bg">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            🔥 Trending Now
          </motion.h2>
          <TrendingSection />
        </div>
      </section>

      {/* Fun Facts Sidebar */}
      <FunFacts />

      {/* Mini Quiz Section */}
      <section className="section">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            🎮 Daily Pet Quiz
          </motion.h2>
          <MiniQuiz />
        </div>
      </section>

      {/* Community Preview */}
      <section className="section community-bg">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            💬 Pet Community
          </motion.h2>
          <CommunityPreview />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Happy Pets</h3>
              <p>Find your perfect companion and join our loving community of pet enthusiasts.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <div className="footer-links">
                <a href="#about">About 🐾 </a>
                <a href="#contact">Contact 🐾 </a>
                <a href="#privacy">Privacy 🐾 </a>
                <a href="#terms">Terms</a>
              </div>
            </div>
            <div className="footer-section">
              <h4>Pet Categories</h4>
              <div className="footer-links">
                <a href="#dogs">Dogs 🐕</a>
                <a href="#cats">Cats 🐱</a>
                <a href="#birds">Birds 🐦</a>
                <a href="#exotic">Exotic 🦎</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Happy Pets. Made with ❤️ for pet lovers everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage