import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Heart,
  Calendar,
  TrendingUp,
  Users,
  MessageSquare,
  Bell,
  Settings,
  Search,
  Filter,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Star,
  MapPin,
  Clock,
  DollarSign
} from 'lucide-react'
import './Dashboard.css'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    { icon: Heart, label: 'Favorite Pets', value: '24', change: '+3', color: '#e53e3e' },
    { icon: Calendar, label: 'Appointments', value: '8', change: '+2', color: '#38a169' },
    { icon: MessageSquare, label: 'Messages', value: '12', change: '+5', color: '#3182ce' },
    { icon: TrendingUp, label: 'Activity Score', value: '92%', change: '+8%', color: '#667eea' }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'favorite',
      title: 'Added Golden Retriever to favorites',
      time: '2 hours ago',
      icon: Heart,
      color: '#e53e3e'
    },
    {
      id: 2,
      type: 'appointment',
      title: 'Vet appointment scheduled for Max',
      time: '5 hours ago',
      icon: Calendar,
      color: '#38a169'
    },
    {
      id: 3,
      type: 'message',
      title: 'New message from Sarah about training tips',
      time: '1 day ago',
      icon: MessageSquare,
      color: '#3182ce'
    }
  ]

  const favoritePets = [
    {
      id: 1,
      name: 'Buddy',
      breed: 'Golden Retriever',
      age: '2 years',
      location: 'New York, NY',
      price: '$800',
      image: '🐕',
      rating: 4.9,
      shelter: 'Happy Tails Rescue'
    },
    {
      id: 2,
      name: 'Luna',
      breed: 'Persian Cat',
      age: '1 year',
      location: 'Los Angeles, CA',
      price: '$600',
      image: '🐱',
      rating: 4.8,
      shelter: 'Feline Friends'
    },
    {
      id: 3,
      name: 'Charlie',
      breed: 'Cockatiel',
      age: '6 months',
      location: 'Chicago, IL',
      price: '$150',
      image: '🐦',
      rating: 4.7,
      shelter: 'Bird Haven'
    }
  ]

  const upcomingAppointments = [
    {
      id: 1,
      title: 'Vet Checkup - Max',
      date: 'Tomorrow',
      time: '2:00 PM',
      type: 'Medical',
      location: 'Downtown Animal Clinic'
    },
    {
      id: 2,
      title: 'Grooming - Bella',
      date: 'Friday',
      time: '10:00 AM',
      type: 'Grooming',
      location: 'Pet Spa Plus'
    },
    {
      id: 3,
      title: 'Training Session - Rocky',
      date: 'Saturday',
      time: '3:00 PM',
      type: 'Training',
      location: 'Happy Paws Training'
    }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="tab-content">
            {/* Stats Cards */}
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="stat-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                    <stat.icon size={24} />
                  </div>
                  <div className="stat-info">
                    <h3>{stat.value}</h3>
                    <p>{stat.label}</p>
                    <span className="stat-change positive">{stat.change}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="dashboard-section">
              <h3 className="section-title">Recent Activity</h3>
              <div className="activity-list">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon" style={{ backgroundColor: activity.color }}>
                      <activity.icon size={16} />
                    </div>
                    <div className="activity-content">
                      <p>{activity.title}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'favorites':
        return (
          <div className="tab-content">
            <div className="section-header">
              <h3>Favorite Pets</h3>
              <div className="section-actions">
                <button className="btn-filter">
                  <Filter size={16} />
                  Filter
                </button>
                <button className="btn-search">
                  <Search size={16} />
                </button>
              </div>
            </div>

            <div className="pets-grid">
              {favoritePets.map((pet) => (
                <motion.div
                  key={pet.id}
                  className="pet-card"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="pet-image">
                    <span className="pet-emoji">{pet.image}</span>
                    <div className="pet-actions">
                      <button className="action-btn">
                        <Eye size={16} />
                      </button>
                      <button className="action-btn">
                        <Edit3 size={16} />
                      </button>
                      <button className="action-btn danger">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="pet-info">
                    <div className="pet-header">
                      <h4>{pet.name}</h4>
                      <div className="pet-rating">
                        <Star size={14} className="star-filled" />
                        {pet.rating}
                      </div>
                    </div>
                    <p className="pet-breed">{pet.breed}</p>
                    <div className="pet-details">
                      <span><Clock size={12} /> {pet.age}</span>
                      <span><MapPin size={12} /> {pet.location}</span>
                    </div>
                    <div className="pet-footer">
                      <span className="pet-price">{pet.price}</span>
                      <span className="pet-shelter">{pet.shelter}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )

      case 'appointments':
        return (
          <div className="tab-content">
            <div className="section-header">
              <h3>Upcoming Appointments</h3>
              <button className="btn-add">
                <Plus size={16} />
                New Appointment
              </button>
            </div>

            <div className="appointments-list">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-date">
                    <div className="date-text">{appointment.date}</div>
                    <div className="time-text">{appointment.time}</div>
                  </div>
                  <div className="appointment-info">
                    <h4>{appointment.title}</h4>
                    <p className="appointment-location">
                      <MapPin size={14} />
                      {appointment.location}
                    </p>
                    <span className={`appointment-type ${appointment.type.toLowerCase()}`}>
                      {appointment.type}
                    </span>
                  </div>
                  <div className="appointment-actions">
                    <button className="btn-edit">Edit</button>
                    <button className="btn-cancel">Cancel</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return <div className="tab-content">Coming Soon...</div>
    }
  }

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <div className="header-info">
            <h1>Welcome back, Pet Lover! 🐾</h1>
            <p>Manage your pets, appointments, and community activity</p>
          </div>
          <div className="header-actions">
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            <button className="settings-btn">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="dashboard-container">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <button
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <TrendingUp size={20} />
              Overview
            </button>
            <button
              className={`nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              <Heart size={20} />
              Favorites
              <span className="nav-badge">24</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
              onClick={() => setActiveTab('appointments')}
            >
              <Calendar size={20} />
              Appointments
              <span className="nav-badge">8</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              <MessageSquare size={20} />
              Messages
              <span className="nav-badge">12</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'community' ? 'active' : ''}`}
              onClick={() => setActiveTab('community')}
            >
              <Users size={20} />
              Community
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard