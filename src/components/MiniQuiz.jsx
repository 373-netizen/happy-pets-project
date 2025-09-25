import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, CheckCircle, XCircle } from 'lucide-react'
import './MiniQuiz.css'

const MiniQuiz = () => {
  const [isRevealed, setIsRevealed] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)

  const quiz = {
    question: "Which dog breed is known as the 'Gentle Giant'?",
    emoji: "🐕",
    options: [
      { id: 'a', text: 'Chihuahua', correct: false },
      { id: 'b', text: 'Great Dane', correct: true },
      { id: 'c', text: 'Pomeranian', correct: false },
      { id: 'd', text: 'Beagle', correct: false }
    ],
    explanation: "Great Danes are called 'Gentle Giants' because despite their massive size, they're known for being friendly, patient, and gentle with children!"
  }

  const handleReveal = () => {
    setIsRevealed(true)
  }

  const handleAnswerSelect = (answerId) => {
    if (showResult) return
    setSelectedAnswer(answerId)
    setShowResult(true)
  }

  const resetQuiz = () => {
    setIsRevealed(false)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const isCorrect = selectedAnswer === quiz.options.find(opt => opt.correct)?.id

  return (
    <div className="mini-quiz-container">
      <motion.div
        className={`quiz-card ${isRevealed ? 'revealed' : 'mystery'}`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {!isRevealed ? (
          <motion.div
            className="mystery-box"
            onClick={handleReveal}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="mystery-content">
              <div className="mystery-emoji">🎭</div>
              <h3>Mystery Quiz</h3>
              <p>Click to reveal today's pet question!</p>
              <HelpCircle className="mystery-icon" />
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              className="quiz-content"
              initial={{ opacity: 0, rotateY: 180 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="quiz-header">
                <div className="quiz-emoji">{quiz.emoji}</div>
                <h3 className="quiz-question">{quiz.question}</h3>
              </div>

              <div className="quiz-options">
                {quiz.options.map((option) => (
                  <motion.button
                    key={option.id}
                    className={`option-btn ${
                      selectedAnswer === option.id ? 'selected' : ''
                    } ${
                      showResult
                        ? option.correct
                          ? 'correct'
                          : selectedAnswer === option.id
                          ? 'incorrect'
                          : 'disabled'
                        : ''
                    }`}
                    onClick={() => handleAnswerSelect(option.id)}
                    whileHover={showResult ? {} : { scale: 1.02 }}
                    whileTap={showResult ? {} : { scale: 0.98 }}
                    disabled={showResult}
                  >
                    <span className="option-letter">{option.id.toUpperCase()}</span>
                    <span className="option-text">{option.text}</span>
                    {showResult && option.correct && <CheckCircle className="result-icon correct-icon" />}
                    {showResult && selectedAnswer === option.id && !option.correct && (
                      <XCircle className="result-icon incorrect-icon" />
                    )}
                  </motion.button>
                ))}
              </div>

              {showResult && (
                <motion.div
                  className="quiz-result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className={`result-header ${isCorrect ? 'correct' : 'incorrect'}`}>
                    {isCorrect ? '🎉 Correct!' : '❌ Oops! Try Again'}
                  </div>
                  <p className="explanation">{quiz.explanation}</p>
                  <button className="reset-btn" onClick={resetQuiz}>
                    Try Another Question
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>

      <div className="quiz-progress">
        <div className="progress-item completed">Day 1</div>
        <div className="progress-item current">Day 2</div>
        <div className="progress-item">Day 3</div>
        <div className="progress-item">Day 4</div>
        <div className="progress-item">Day 5</div>
      </div>
    </div>
  )
}

export default MiniQuiz