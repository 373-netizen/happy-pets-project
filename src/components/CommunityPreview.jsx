import { motion } from 'framer-motion'
import { MessageCircle, Users, ArrowRight, Heart } from 'lucide-react'
import './CommunityPreview.css'

const CommunityPreview = () => {
  const recentMessages = [
    {
      id: 1,
      user: "Sarah M.",
      avatar: "👩‍🦰",
      message: "Just adopted a Golden Retriever puppy! Any training tips?",
      time: "2 min ago",
      likes: 12,
      replies: 5
    },
    {
      id: 2,
      user: "Mike Chen",
      avatar: "👨‍💼",
      message: "My cat learned to open doors... Should I be concerned? 😅",
      time: "15 min ago",
      likes: 8,
      replies: 3
    },
    {
      id: 3,
      user: "Emma K.",
      avatar: "👩‍🎓",
      message: "Looking for a good vet in downtown area. Recommendations?",
      time: "1 hour ago",
      likes: 6,
      replies: 7
    }
  ]

  const communityStats = [
    { icon: Users, label: "Members", value: "15.2K" },
    { icon: MessageCircle, label: "Posts Today", value: "247" },
    { icon: Heart, label: "Pets Adopted", value: "1,853" }
  ]

  return (
    <div className="community-preview">
      <div className="community-stats">
        {communityStats.map((stat, index) => (
          <motion.div
            key={index}
            className="stat-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <stat.icon className="stat-icon" />
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="community-content">
        <div className="messages-preview">
          <div className="preview-header">
            <h3>Recent Community Activity</h3>
            <div className="live-indicator">
              <div className="live-dot"></div>
              Live
            </div>
          </div>

          <div className="messages-list">
            {recentMessages.map((msg, index) => (
              <motion.div
                key={msg.id}
                className="message-item"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, x: 10 }}
              >
                <div className="message-avatar">{msg.avatar}</div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="username">{msg.user}</span>
                    <span className="timestamp">{msg.time}</span>
                  </div>
                  <p className="message-text">{msg.message}</p>
                  <div className="message-stats">
                    <span className="stat">
                      <Heart size={14} /> {msg.likes}
                    </span>
                    <span className="stat">
                      <MessageCircle size={14} /> {msg.replies}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            className="join-community-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join the Community
            <ArrowRight size={20} />
          </motion.button>
        </div>

        <div className="community-features">
          <h4>What You'll Get</h4>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">💬</span>
              <div>
                <strong>Expert Advice</strong>
                <p>Get tips from veterinarians and experienced pet owners</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🤝</span>
              <div>
                <strong>Local Meetups</strong>
                <p>Find pet playdates and events in your area</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <div>
                <strong>Adoption Support</strong>
                <p>Connect with shelters and find your perfect match</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityPreview