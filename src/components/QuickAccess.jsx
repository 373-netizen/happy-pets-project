import { motion } from 'framer-motion'
import { Calendar, ShoppingCart, PlayCircle, MessageCircle } from 'lucide-react'
import './QuickAccess.css'

const QuickAccess = () => {
  const shortcuts = [
    {
      id: 1,
      icon: Calendar,
      title: "Pet Reminders",
      description: "Vet appointments & feeding schedules",
      color: "#ff6b6b"
    },
    {
      id: 2,
      icon: ShoppingCart,
      title: "Products & Services",
      description: "Food, toys, grooming & more",
      color: "#4ecdc4"
    },
    {
      id: 3,
      icon: PlayCircle,
      title: "Play Quiz",
      description: "Test your pet knowledge",
      color: "#45b7d1"
    },
    {
      id: 4,
      icon: MessageCircle,
      title: "Community Chat",
      description: "Connect with pet lovers",
      color: "#96ceb4"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <section className="quick-access">
      <div className="container">
        <motion.div
          className="quick-access-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {shortcuts.map((shortcut) => (
            <motion.div
              key={shortcut.id}
              className="quick-access-card"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="icon-container" style={{ backgroundColor: shortcut.color }}>
                <shortcut.icon size={24} />
              </div>
              <div className="quick-access-content">
                <h4 className="quick-access-title">{shortcut.title}</h4>
                <p className="quick-access-description">{shortcut.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default QuickAccess