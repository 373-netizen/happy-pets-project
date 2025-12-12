import React, { useState, useEffect } from 'react';
import { Calendar, Syringe, Bell, PawPrint, Plus, X, Save, Trash2, MapPin, CheckCircle, Home, Edit, Clock, Stethoscope, FileText, AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';
import './dashboard.css'
import { useNavigate } from "react-router-dom";
const API_URL = 'http://localhost:8000/api';

const api = {
  get: async (endpoint) => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('access');
    const response = await fetch(`${API_URL}${endpoint}`, { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  },
  post: async (endpoint, data) => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('access');
    const response = await fetch(`${API_URL}${endpoint}`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  },
  put: async (endpoint, data) => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('access');
    const response = await fetch(`${API_URL}${endpoint}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  },
  delete: async (endpoint) => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('access');
    const response = await fetch(`${API_URL}${endpoint}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  },
};

const BREEDS = {
  dog: ['Labrador', 'German Shepherd', 'Golden Retriever', 'Bulldog', 'Poodle', 'Beagle', 'Rottweiler', 'Dachshund', 'Boxer', 'Husky', 'Shih Tzu', 'Chihuahua', 'Doberman', 'Great Dane', 'Corgi', 'Pomeranian', 'Mixed', 'Other'],
  cat: ['Persian', 'Maine Coon', 'Siamese', 'Ragdoll', 'British Shorthair', 'Sphynx', 'Bengal', 'Scottish Fold', 'Domestic Shorthair', 'Birman', 'Russian Blue', 'Mixed', 'Other'],
  bird: ['Budgie', 'Cockatiel', 'Parrot', 'Macaw', 'Cockatoo', 'Finch', 'Canary', 'Lovebird', 'Parakeet', 'Conure', 'Other'],
  exotic: ['Rabbit', 'Guinea Pig', 'Hamster', 'Ferret', 'Hedgehog', 'Turtle', 'Snake', 'Lizard', 'Bearded Dragon', 'Chinchilla', 'Other']
};

const BREED_LIFESPAN = { dog: { max: 20 }, cat: { max: 25 }, bird: { max: 80 }, exotic: { max: 30 } };

const HEAT_CYCLE_DAYS = {
  dog: {
    'Labrador': 180,
    'German Shepherd': 180,
    'Golden Retriever': 180,
    'Bulldog': 210,
    'Poodle': 180,
    'Beagle': 180,
    'Rottweiler': 180,
    'Dachshund': 180,
    'Boxer': 180,
    'Husky': 180,
    'Shih Tzu': 180,
    'Chihuahua': 210,
    'Doberman': 180,
    'Great Dane': 180,
    'Corgi': 180,
    'Pomeranian': 210,
    'Mixed': 180,
    'Other': 180
  },
  cat: {
    'Persian': 21,
    'Maine Coon': 21,
    'Siamese': 21,
    'Ragdoll': 21,
    'British Shorthair': 21,
    'Sphynx': 21,
    'Bengal': 21,
    'Scottish Fold': 21,
    'Domestic Shorthair': 21,
    'Birman': 21,
    'Russian Blue': 21,
    'Mixed': 21,
    'Other': 21
  }
};

const calcAge = (dob) => {
  if (!dob) return 'Unknown';
  const birth = new Date(dob);
  const today = new Date();
  const years = today.getFullYear() - birth.getFullYear();
  const months = today.getMonth() - birth.getMonth();
  if (years === 0) return `${months <= 0 ? 0 : months} month${months !== 1 ? 's' : ''}`;
  return `${years} year${years !== 1 ? 's' : ''}`;
};

const calcNextHeatCycle = (lastHeatDate, species, breed) => {
  if (!lastHeatDate || !species || !breed) return null;
  const cycleData = HEAT_CYCLE_DAYS[species];
  if (!cycleData) return null;
  
  const cycleDays = cycleData[breed] || 180;
  const lastDate = new Date(lastHeatDate);
  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + cycleDays);
  
  return nextDate.toISOString().split('T')[0];
};

const getMaxDate = (species) => {
  const lifespan = BREED_LIFESPAN[species] || { max: 30 };
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - lifespan.max);
  return maxDate.toISOString().split('T')[0];
};

const Notification = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(notification.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [notification.id, onClose]);

  return (
    <div className={`notification notification-${notification.type}`}>
      <div className="notification-icon">
        {notification.type === 'appointment' && <Calendar size={20} />}
        {notification.type === 'vaccination' && <Syringe size={20} />}
        {notification.type === 'reminder' && <Bell size={20} />}
        {notification.type === 'heat_cycle' && <AlertCircle size={20} />}
      </div>
      <div className="notification-content">
        <h4>{notification.title}</h4>
        <p>{notification.message}</p>
      </div>
      <button className="notification-close" onClick={() => onClose(notification.id)}>
        <X size={16} />
      </button>
    </div>
  );
};

const Modal = ({ type, item, pets, onClose, onSave }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (item) {
      setFormData(item);
      if (item.photo) setPhotoPreview(item.photo);
    }
    else if (type === 'pets') setFormData({ species: 'dog', gender: 'male', is_active: true });
    else if (type === 'appointments') setFormData({ type: 'checkup' });
    else if (type === 'vaccinations') setFormData({ completed: false });
    else if (type === 'reminders') setFormData({ completed: false });
    else if (type === 'health') setFormData({ type: 'checkup' });
  }, [item, type]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, photo: 'Image must be less than 5MB' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData({ ...formData, photo: reader.result });
        setErrors({ ...errors, photo: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (type === 'pets') {
      if (!formData.name?.trim()) newErrors.name = 'Name is required';
      if (!formData.species) newErrors.species = 'Species is required';
      if (!formData.breed) newErrors.breed = 'Breed is required';
      if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
      else {
        const dob = new Date(formData.date_of_birth);
        const today = new Date();
        const maxDate = new Date(getMaxDate(formData.species));
        if (dob > today) newErrors.date_of_birth = 'Cannot be a future date';
        else if (dob < maxDate) {
          const lifespan = BREED_LIFESPAN[formData.species]?.max || 30;
          newErrors.date_of_birth = `Age exceeds maximum lifespan (${lifespan} years)`;
        }
      }
      if (formData.gender === 'female' && formData.last_heat_date) {
        const heatDate = new Date(formData.last_heat_date);
        const today = new Date();
        if (heatDate > today) newErrors.last_heat_date = 'Cannot be a future date';
      }
    }
    
    if (type === 'appointments') {
      if (!formData.title?.trim()) newErrors.title = 'Title is required';
      if (!formData.pet) newErrors.pet = 'Pet is required';
      if (!formData.date) newErrors.date = 'Date is required';
      else {
        const aptDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 2);
        if (aptDate < today) newErrors.date = 'Cannot schedule appointments in the past';
        else if (aptDate > maxDate) newErrors.date = 'Cannot schedule more than 2 years ahead';
      }
      if (!formData.time) newErrors.time = 'Time is required';
      if (!formData.location?.trim()) newErrors.location = 'Location is required';
    }
    
    if (type === 'vaccinations') {
      if (!formData.vaccine_name?.trim()) newErrors.vaccine_name = 'Vaccine name is required';
      if (!formData.pet) newErrors.pet = 'Pet is required';
      if (!formData.due_date) newErrors.due_date = 'Due date is required';
    }
    
    if (type === 'reminders') {
      if (!formData.title?.trim()) newErrors.title = 'Title is required';
      if (!formData.remind_at) newErrors.remind_at = 'Date/time is required';
    }
    
    if (type === 'health') {
      if (!formData.title?.trim()) newErrors.title = 'Title is required';
      if (!formData.pet) newErrors.pet = 'Pet is required';
      if (!formData.date) newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const submitData = { ...formData };
      if (type === 'pets' && formData.gender === 'female' && formData.last_heat_date && formData.species && formData.breed) {
        submitData.next_heat_date = calcNextHeatCycle(formData.last_heat_date, formData.species, formData.breed);
      }
      onSave(submitData);
    }
  };

  const renderField = (name, label, inputType = 'text', options = null, required = false) => (
    <div className="form-group">
      <label>
        {label} {required && <span className="required">*</span>}
        {errors[name] && <span className="error-inline"> ({errors[name]})</span>}
      </label>
      {inputType === 'select' ? (
        <select 
          value={formData[name] || ''} 
          onChange={(e) => {
            const newData = { ...formData, [name]: e.target.value };
            if (name === 'species') {
              newData.breed = '';
            }
            if (name === 'gender' && e.target.value === 'male') {
              delete newData.last_heat_date;
              delete newData.next_heat_date;
            }
            setFormData(newData);
            setErrors({ ...errors, [name]: '' });
          }}
          className={errors[name] ? 'error' : ''}
        >
          <option value="">Select {label}</option>
          {options.map(opt => <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>)}
        </select>
      ) : inputType === 'textarea' ? (
        <textarea 
          value={formData[name] || ''} 
          onChange={(e) => { setFormData({ ...formData, [name]: e.target.value }); setErrors({ ...errors, [name]: '' }); }}
          rows={3}
          className={errors[name] ? 'error' : ''}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      ) : inputType === 'date' && name === 'date_of_birth' ? (
        <input 
          type="date" 
          value={formData[name] || ''} 
          onChange={(e) => { setFormData({ ...formData, [name]: e.target.value }); setErrors({ ...errors, [name]: '' }); }}
          max={new Date().toISOString().split('T')[0]}
          min={getMaxDate(formData.species || 'dog')}
          className={errors[name] ? 'error' : ''}
        />
      ) : inputType === 'number' ? (
        <input 
          type="number" 
          value={formData[name] || ''} 
          onChange={(e) => { setFormData({ ...formData, [name]: e.target.value }); setErrors({ ...errors, [name]: '' }); }}
          className={errors[name] ? 'error' : ''}
          placeholder={`Enter ${label.toLowerCase()}`}
          min="0"
          step="0.1"
        />
      ) : (
        <input 
          type={inputType} 
          value={formData[name] || ''} 
          onChange={(e) => { setFormData({ ...formData, [name]: e.target.value }); setErrors({ ...errors, [name]: '' }); }}
          className={errors[name] ? 'error' : ''}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      )}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{item ? 'Edit' : 'Add'} {type === 'pets' ? 'Pet' : type === 'appointments' ? 'Appointment' : type === 'vaccinations' ? 'Vaccination' : type === 'reminders' ? 'Reminder' : 'Health Record'}</h2>
          <button className="btn-close" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {type === 'pets' && (
              <>
                <div className="form-group">
                  <label>Pet Photo</label>
                  <div className="photo-upload">
                    {photoPreview ? (
                      <div className="photo-preview">
                        <img src={photoPreview} alt="Pet preview" />
                        <button type="button" className="photo-remove" onClick={() => { setPhotoPreview(null); setFormData({ ...formData, photo: null }); }}>
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="photo-upload-label">
                        <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                        <div className="photo-upload-area">
                          <ImageIcon size={32} />
                          <p>Click to upload photo</p>
                          <span>Max size: 5MB</span>
                        </div>
                      </label>
                    )}
                  </div>
                  {errors.photo && <span className="error-inline">{errors.photo}</span>}
                </div>
                {renderField('name', 'Pet Name', 'text', null, true)}
                {renderField('species', 'Species', 'select', [
                  { value: 'dog', label: 'Dog' },
                  { value: 'cat', label: 'Cat' },
                  { value: 'bird', label: 'Bird' },
                  { value: 'exotic', label: 'Exotic' }
                ], true)}
                {formData.species && renderField('breed', 'Breed', 'select', BREEDS[formData.species] || [], true)}
                {renderField('date_of_birth', 'Date of Birth', 'date', null, true)}
                {renderField('gender', 'Gender', 'select', [
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' }
                ], true)}
                {formData.gender === 'female' && (formData.species === 'dog' || formData.species === 'cat') && (
                  <>
                    <div className="form-group">
                      <label>
                        Last Heat Cycle Date
                        {errors.last_heat_date && <span className="error-inline"> ({errors.last_heat_date})</span>}
                      </label>
                      <input 
                        type="date" 
                        value={formData.last_heat_date || ''} 
                        onChange={(e) => { 
                          const newData = { ...formData, last_heat_date: e.target.value };
                          if (e.target.value && formData.species && formData.breed) {
                            newData.next_heat_date = calcNextHeatCycle(e.target.value, formData.species, formData.breed);
                          }
                          setFormData(newData); 
                          setErrors({ ...errors, last_heat_date: '' }); 
                        }}
                        max={new Date().toISOString().split('T')[0]}
                        className={errors.last_heat_date ? 'error' : ''}
                      />
                    </div>
                    {formData.last_heat_date && formData.next_heat_date && (
                      <div className="info-box">
                        <AlertCircle size={16} />
                        <span>Next heat cycle estimated: {formData.next_heat_date}</span>
                      </div>
                    )}
                  </>
                )}
                {renderField('color', 'Color', 'text')}
                {renderField('weight', 'Weight (kg)', 'number')}
                {renderField('microchip_id', 'Microchip ID', 'text')}
              </>
            )}
            
            {type === 'appointments' && (
              <>
                {renderField('title', 'Title', 'text', null, true)}
                {renderField('pet', 'Pet', 'select', pets.map(p => ({ value: p.id, label: p.name })), true)}
                <div className="form-group">
                  <label>
                    Date <span className="required">*</span>
                    {errors.date && <span className="error-inline"> ({errors.date})</span>}
                  </label>
                  <input 
                    type="date" 
                    value={formData.date || ''} 
                    onChange={(e) => { setFormData({ ...formData, date: e.target.value }); setErrors({ ...errors, date: '' }); }}
                    min={new Date().toISOString().split('T')[0]}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0]}
                    className={errors.date ? 'error' : ''}
                  />
                </div>
                {renderField('time', 'Time', 'time', null, true)}
                {renderField('location', 'Location', 'text', null, true)}
                {renderField('veterinarian_name', 'Veterinarian Name')}
                {renderField('type', 'Type', 'select', ['checkup', 'vaccination', 'surgery', 'emergency', 'dental', 'grooming', 'other'])}
                {renderField('notes', 'Notes', 'textarea')}
              </>
            )}
            
            {type === 'vaccinations' && (
              <>
                {renderField('vaccine_name', 'Vaccine Name', 'text', null, true)}
                {renderField('pet', 'Pet', 'select', pets.map(p => ({ value: p.id, label: p.name })), true)}
                {renderField('due_date', 'Due Date', 'date', null, true)}
                {renderField('vaccine_type', 'Vaccine Type')}
                <div className="form-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={formData.completed || false}
                      onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
                    />
                    <span>Completed</span>
                  </label>
                </div>
              </>
            )}
            
            {type === 'reminders' && (
              <>
                {renderField('title', 'Title', 'text', null, true)}
                {renderField('description', 'Description', 'textarea')}
                {renderField('remind_at', 'Remind At', 'datetime-local', null, true)}
                {renderField('pet', 'Pet (Optional)', 'select', [{ value: '', label: 'None' }, ...pets.map(p => ({ value: p.id, label: p.name }))])}
                <div className="form-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={formData.completed || false}
                      onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
                    />
                    <span>Completed</span>
                  </label>
                </div>
              </>
            )}
            
            {type === 'health' && (
              <>
                {renderField('title', 'Title', 'text', null, true)}
                {renderField('pet', 'Pet', 'select', pets.map(p => ({ value: p.id, label: p.name })), true)}
                {renderField('date', 'Date', 'date', null, true)}
                {renderField('type', 'Type', 'select', ['checkup', 'diagnosis', 'treatment', 'surgery', 'lab_results', 'prescription', 'other'])}
                {renderField('description', 'Description', 'textarea')}
                {renderField('veterinarian_name', 'Veterinarian Name')}
              </>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary"><Save size={18} /> Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AuthScreen = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('access', data.access);
      if (data.refresh) {
        localStorage.setItem('refresh_token', data.refresh);
      }

      window.location.reload();
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-hero">
        <div className="auth-hero-content">
          <div className="hero-badge">
            <PawPrint size={32} />
          </div>
          <h1 className="hero-title">Welcome to PetCare</h1>
          <p className="hero-subtitle">Your comprehensive pet management platform</p>
          
          <div className="hero-features">
            <div className="hero-feature">
              <div className="feature-icon"><Calendar size={24} /></div>
              <div>
                <h3>Appointment Management</h3>
                <p>Never miss a vet visit again</p>
              </div>
            </div>
            <div className="hero-feature">
              <div className="feature-icon"><Syringe size={24} /></div>
              <div>
                <h3>Vaccination Tracking</h3>
                <p>Keep your pets healthy and up-to-date</p>
              </div>
            </div>
            <div className="hero-feature">
              <div className="feature-icon"><FileText size={24} /></div>
              <div>
                <h3>Health Records</h3>
                <p>Complete medical history at your fingertips</p>
              </div>
            </div>
            <div className="hero-feature">
              <div className="feature-icon"><Bell size={24} /></div>
              <div>
                <h3>Smart Reminders</h3>
                <p>Get notified for important tasks</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-icon" onClick={() => navigate("/login")}style={{ cursor: "pointer" }}  ><PawPrint size={40} /></div>
            <h2>Sign In to continue</h2>
            
          </div>
          
          
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [isAuth, setIsAuth] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => { checkAuth(); }, []);

  useEffect(() => {
    if (isAuth) {
      const interval = setInterval(() => {
        checkForNotifications();
      }, 60000); // Check every minute
      checkForNotifications(); // Check immediately on load
      return () => clearInterval(interval);
    }
  }, [isAuth, appointments, vaccinations, reminders, pets]);

  const checkForNotifications = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // Check appointments
    appointments.forEach(apt => {
      const aptDate = new Date(apt.date);
      if (aptDate.toDateString() === tomorrow.toDateString()) {
        addNotification({
          type: 'appointment',
          title: 'Appointment Tomorrow',
          message: `${apt.title} for ${apt.pet_name} at ${apt.time}`
        });
      }
    });

    // Check vaccinations
    vaccinations.forEach(vac => {
      if (!vac.completed) {
        const dueDate = new Date(vac.due_date);
        if (dueDate <= nextWeek && dueDate >= now) {
          addNotification({
            type: 'vaccination',
            title: 'Vaccination Due',
            message: `${vac.vaccine_name} for ${vac.pet_name} due on ${vac.due_date}`
          });
        }
      }
    });

    // Check reminders
    reminders.forEach(rem => {
      if (!rem.completed) {
        const remindDate = new Date(rem.remind_at);
        if (remindDate <= now) {
          addNotification({
            type: 'reminder',
            title: 'Reminder',
            message: rem.title
          });
        }
      }
    });

    // Check heat cycles
    pets.forEach(pet => {
      if (pet.gender === 'female' && pet.next_heat_date) {
        const nextHeatDate = new Date(pet.next_heat_date);
        const daysUntil = Math.floor((nextHeatDate - now) / (1000 * 60 * 60 * 24));
        if (daysUntil >= 0 && daysUntil <= 7) {
          addNotification({
            type: 'heat_cycle',
            title: 'Heat Cycle Approaching',
            message: `${pet.name}'s next heat cycle is in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`
          });
        }
      }
    });
  };

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = { ...notification, id };
    setNotifications(prev => {
      // Check if similar notification already exists
      const exists = prev.some(n => 
        n.type === notification.type && 
        n.message === notification.message
      );
      if (exists) return prev;
      return [newNotification, ...prev];
    });
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('access');
    if (!token) { setIsAuth(false); setLoading(false); return; }
    try {
      await api.get('/dashboard/stats/');
      setIsAuth(true);
      loadData();
    } catch { setIsAuth(false); setLoading(false); }
  };

  const loadData = async () => {
    try {
      const [statsRes, petsRes, apptsRes, vaccRes, remRes, hrRes] = await Promise.all([
        api.get('/dashboard/stats/'), api.get('/pets/'), api.get('/appointments/'),
        api.get('/vaccinations/'), api.get('/reminders/'), api.get('/health-records/')
      ]);
      setStats(statsRes);
      setPets((petsRes.pets || petsRes || []).map(p => ({ ...p, age: calcAge(p.date_of_birth) })));
      setAppointments(apptsRes.appointments || apptsRes || []);
      setVaccinations(vaccRes.vaccinations || vaccRes || []);
      setReminders(remRes.reminders || remRes || []);
      setHealthRecords(hrRes.health_records || hrRes || []);
    } catch (error) { console.error('Load error:', error); }
    finally { setLoading(false); }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try { await api.delete(`/${type}/${id}/`); loadData(); }
    catch (error) { console.error('Delete error:', error); alert('Failed to delete item'); }
  };

  const openModal = (type, item = null) => { setModalType(type); setEditItem(item); setShowModal(true); };

  if (loading) return <div className="loading"><div className="spinner"></div><p>Loading PetCare...</p></div>;
  if (!isAuth) return <AuthScreen />;

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon"><Icon size={32} /></div>
      <div className="stat-info"><p className="stat-title">{title}</p><p className="stat-value">{value || 0}</p></div>
    </div>
  );

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('access');
      localStorage.removeItem('refresh_token');
      window.location.reload();
    }
  };

  return (
    <div className="app">
      <div className="notification-container">
        {notifications.map(notification => (
          <Notification 
            key={notification.id} 
            notification={notification} 
            onClose={removeNotification}
          />
        ))}
      </div>

      <aside className="sidebar">
        <div className="sidebar-logo"><PawPrint size={32} /><span>PetCare</span></div>
        <nav className="sidebar-nav">
          {[
            { id: 'dashboard', icon: Home, label: 'Dashboard' },
            { id: 'pets', icon: PawPrint, label: 'My Pets' },
            { id: 'appointments', icon: Calendar, label: 'Appointments' },
            { id: 'vaccinations', icon: Syringe, label: 'Vaccinations' },
            { id: 'reminders', icon: Bell, label: 'Reminders' },
            { id: 'health', icon: FileText, label: 'Health Records' }
          ].map(item => (
            <button key={item.id} className={`nav-btn ${currentPage === item.id ? 'active' : ''}`} onClick={() => setCurrentPage(item.id)}>
              <item.icon size={20} /><span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            <X size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="container">
          {currentPage === 'dashboard' && (
            <>
              <div className="page-header"><h1>Dashboard Overview</h1><p>Welcome back! Here's your pet management summary</p></div>
              <div className="stats-grid">
                <StatCard icon={PawPrint} title="Total Pets" value={stats?.total_pets} color="blue" />
                <StatCard icon={Calendar} title="Upcoming Appointments" value={stats?.appointments_upcoming} color="green" />
                <StatCard icon={Syringe} title="Vaccines Due" value={stats?.vaccines_due} color="purple" />
                <StatCard icon={Bell} title="Active Reminders" value={stats?.pending_reminders} color="orange" />
              </div>
              <div className="dashboard-widgets">
                <div className="widget">
                  <div className="widget-header"><h3><PawPrint size={20} /> Recent Pets</h3><button className="btn-text" onClick={() => setCurrentPage('pets')}>View All</button></div>
                  {pets.length === 0 ? (
                    <div className="empty-widget"><PawPrint size={48} /><p>No pets yet</p><button className="btn-primary" onClick={() => openModal('pets')}><Plus size={18} /> Add Your First Pet</button></div>
                  ) : (
                    <div className="pet-list-mini">{pets.slice(0, 3).map(pet => (
                      <div key={pet.id} className="pet-item-mini">
                        <div className="pet-avatar-mini">
                          {pet.photo ? <img src={pet.photo} alt={pet.name} /> : <PawPrint size={24} />}
                        </div>
                        <div className="pet-info-mini"><h4>{pet.name}</h4><p>{pet.breed} • {pet.age}</p></div>
                      </div>
                    ))}</div>
                  )}
                </div>
                <div className="widget">
                  <div className="widget-header"><h3><Calendar size={20} /> Upcoming Appointments</h3></div>
                  {appointments.length === 0 ? (<p className="empty-text">No upcoming appointments</p>) : (
                    <div className="appointment-list-mini">{appointments.slice(0, 3).map(apt => (<div key={apt.id} className="appointment-item-mini"><div className="apt-date"><Calendar size={16} />{apt.date}</div><div><h4>{apt.title}</h4><p>{apt.pet_name}</p></div></div>))}</div>
                  )}
                </div>
              </div>
            </>
          )}

          {currentPage === 'pets' && (
            <>
              <div className="page-header">
                <div><h1><PawPrint size={28} /> My Pets</h1><p>Manage all your beloved pets</p></div>
                <button className="btn-primary" onClick={() => openModal('pets')}><Plus size={20} /> Add Pet</button>
              </div>
              {pets.length === 0 ? (
                <div className="empty-state"><PawPrint size={80} /><h2>No Pets Yet</h2><p>Add your first pet to start tracking their health and appointments</p><button className="btn-primary-lg" onClick={() => openModal('pets')}><Plus size={24} /> Add Your First Pet</button></div>
              ) : (
                <div className="pets-grid">{pets.map(pet => (
                  <div key={pet.id} className="pet-card">
                    <div className="pet-card-header">
                      <div className="pet-avatar-lg">
                        {pet.photo ? <img src={pet.photo} alt={pet.name} /> : <PawPrint size={40} />}
                      </div>
                      <div className="pet-actions">
                        <button className="btn-icon" onClick={() => openModal('pets', pet)}><Edit size={18} /></button>
                        <button className="btn-icon-danger" onClick={() => handleDelete('pets', pet.id)}><Trash2 size={18} /></button>
                      </div>
                    </div>
                    <div className="pet-card-body">
                      <h3>{pet.name}</h3>
                      <div className="pet-meta">
                        <span className="pet-species">{pet.species}</span>
                        <span className="pet-age">{pet.age}</span>
                      </div>
                      <div className="pet-details">
                        <div className="detail-row"><span>Breed</span><strong>{pet.breed}</strong></div>
                        <div className="detail-row"><span>Gender</span><strong>{pet.gender}</strong></div>
                        {pet.weight && (<div className="detail-row"><span>Weight</span><strong>{pet.weight} kg</strong></div>)}
                        {pet.gender === 'female' && pet.next_heat_date && (
                          <div className="detail-row heat-cycle">
                            <span>Next Heat Cycle</span>
                            <strong>{pet.next_heat_date}</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}</div>
              )}
            </>
          )}

          {currentPage === 'appointments' && (
            <>
              <div className="page-header">
                <div><h1><Calendar size={28} /> Appointments</h1><p>Schedule and manage vet appointments</p></div>
                <button className="btn-primary" onClick={() => openModal('appointments')}><Plus size={20} /> Add Appointment</button>
              </div>
              {appointments.length === 0 ? (
                <div className="empty-state"><Calendar size={80} /><h2>No Appointments</h2><p>Schedule your pet's first appointment</p><button className="btn-primary-lg" onClick={() => openModal('appointments')}><Plus size={24} /> Schedule Appointment</button></div>
              ) : (
                <div className="items-list">{appointments.map(apt => (
                  <div key={apt.id} className="item-card">
                    <div className="item-content">
                      <div className="item-header"><h3>{apt.title}</h3><span className={`badge badge-${apt.type}`}>{apt.type}</span></div>
                      <div className="item-details">
                        <div className="detail"><Calendar size={16} /> {apt.date} at {apt.time}</div>
                        <div className="detail"><PawPrint size={16} /> {apt.pet_name}</div>
                        <div className="detail"><MapPin size={16} /> {apt.location}</div>
                        {apt.veterinarian_name && <div className="detail"><Stethoscope size={16} /> Dr. {apt.veterinarian_name}</div>}
                      </div>
                      {apt.notes && <p className="item-notes">{apt.notes}</p>}
                    </div>
                    <div className="item-actions">
                      <button className="btn-icon" onClick={() => openModal('appointments', apt)}><Edit size={18} /></button>
                      <button className="btn-icon-danger" onClick={() => handleDelete('appointments', apt.id)}><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}</div>
              )}
            </>
          )}

          {currentPage === 'vaccinations' && (
            <>
              <div className="page-header">
                <div><h1><Syringe size={28} /> Vaccinations</h1><p>Track vaccination schedules</p></div>
                <button className="btn-primary" onClick={() => openModal('vaccinations')}><Plus size={20} /> Add Vaccination</button>
              </div>
              {vaccinations.length === 0 ? (
                <div className="empty-state"><Syringe size={80} /><h2>No Vaccinations</h2><p>Track your pet's vaccination schedule</p><button className="btn-primary-lg" onClick={() => openModal('vaccinations')}><Plus size={24} /> Add Vaccination</button></div>
              ) : (
                <div className="items-list">{vaccinations.map(vac => (
                  <div key={vac.id} className={`item-card ${vac.completed ? 'completed' : ''}`}>
                    <div className="item-content">
                      <div className="item-header">
                        <h3>{vac.vaccine_name}</h3>
                        {vac.completed ? <span className="badge badge-success"><CheckCircle size={14} /> Completed</span> : <span className="badge badge-warning">Due</span>}
                      </div>
                      <div className="item-details">
                        <div className="detail"><PawPrint size={16} /> {vac.pet_name}</div>
                        <div className="detail"><Calendar size={16} /> Due: {vac.due_date}</div>
                        {vac.vaccine_type && <div className="detail">Type: {vac.vaccine_type}</div>}
                      </div>
                    </div>
                    <div className="item-actions">
                      <button className="btn-icon" onClick={() => openModal('vaccinations', vac)}><Edit size={18} /></button>
                      <button className="btn-icon-danger" onClick={() => handleDelete('vaccinations', vac.id)}><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}</div>
              )}
            </>
          )}

          {currentPage === 'reminders' && (
            <>
              <div className="page-header">
                <div><h1><Bell size={28} /> Reminders</h1><p>Never miss important tasks</p></div>
                <button className="btn-primary" onClick={() => openModal('reminders')}><Plus size={20} /> Add Reminder</button>
              </div>
              {reminders.length === 0 ? (
                <div className="empty-state"><Bell size={80} /><h2>No Reminders</h2><p>Create reminders for pet care tasks</p><button className="btn-primary-lg" onClick={() => openModal('reminders')}><Plus size={24} /> Create Reminder</button></div>
              ) : (
                <div className="items-list">{reminders.map(rem => (
                  <div key={rem.id} className={`item-card ${rem.completed ? 'completed' : ''}`}>
                    <div className="item-content">
                      <div className="item-header">
                        <h3><Bell size={18} /> {rem.title}</h3>
                        {rem.completed && <span className="badge badge-success"><CheckCircle size={14} /> Done</span>}
                      </div>
                      {rem.description && <p className="item-description">{rem.description}</p>}
                      <div className="item-details">
                        <div className="detail"><Clock size={16} /> {rem.remind_at}</div>
                        {rem.pet_name && <div className="detail"><PawPrint size={16} /> {rem.pet_name}</div>}
                      </div>
                    </div>
                    <div className="item-actions">
                      {!rem.completed && (
                        <button className="btn-icon-success" onClick={async () => { await api.put(`/reminders/${rem.id}/complete/`, {}); loadData(); }} title="Mark as complete">
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button className="btn-icon" onClick={() => openModal('reminders', rem)}><Edit size={18} /></button>
                      <button className="btn-icon-danger" onClick={() => handleDelete('reminders', rem.id)}><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}</div>
              )}
            </>
          )}

          {currentPage === 'health' && (
            <>
              <div className="page-header">
                <div><h1><FileText size={28} /> Health Records</h1><p>Medical history and records</p></div>
                <button className="btn-primary" onClick={() => openModal('health')}><Plus size={20} /> Add Record</button>
              </div>
              {healthRecords.length === 0 ? (
                <div className="empty-state"><FileText size={80} /><h2>No Health Records</h2><p>Keep track of medical history</p><button className="btn-primary-lg" onClick={() => openModal('health')}><Plus size={24} /> Add Record</button></div>
              ) : (
                <div className="items-list">{healthRecords.map(hr => (
                  <div key={hr.id} className="item-card">
                    <div className="item-content">
                      <div className="item-header"><h3>{hr.title}</h3><span className="badge badge-info">{hr.type}</span></div>
                      <div className="item-details">
                        <div className="detail"><PawPrint size={16} /> {hr.pet_name}</div>
                        <div className="detail"><Calendar size={16} /> {hr.date}</div>
                        {hr.veterinarian_name && <div className="detail"><Stethoscope size={16} /> Dr. {hr.veterinarian_name}</div>}
                      </div>
                      {hr.description && <p className="item-description">{hr.description}</p>}
                    </div>
                    <div className="item-actions">
                      <button className="btn-icon" onClick={() => openModal('health', hr)}><Edit size={18} /></button>
                      <button className="btn-icon-danger" onClick={() => handleDelete('health-records', hr.id)}><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}</div>
              )}
            </>
          )}
        </div>
      </main>

      {showModal && (<Modal type={modalType} item={editItem} pets={pets} onClose={() => { setShowModal(false); setEditItem(null); }} onSave={async (data) => { try { if (editItem) { await api.put(`/${modalType}/${editItem.id}/`, data); } else { await api.post(`/${modalType}/`, data); } loadData(); setShowModal(false); setEditItem(null); } catch (error) { alert('Failed to save. Please try again.'); } }} />)}

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif; 
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
        }
        
        .app { display: flex; min-height: 100vh; }
        
        .notification-container {
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 2000;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 400px;
        }
        
        .notification {
          background: #fff;
          border-radius: 0.75rem;
          padding: 1rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          animation: slideInRight 0.3s ease-out;
          border-left: 4px solid #667eea;
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .notification-appointment { border-left-color: #10b981; }
        .notification-vaccination { border-left-color: #8b5cf6; }
        .notification-reminder { border-left-color: #f59e0b; }
        .notification-heat_cycle { border-left-color: #ec4899; }
        
        .notification-icon {
          width: 40px;
          height: 40px;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .notification-appointment .notification-icon { background: #d1fae5; color: #059669; }
        .notification-vaccination .notification-icon { background: #ede9fe; color: #7c3aed; }
        .notification-reminder .notification-icon { background: #fef3c7; color: #d97706; }
        .notification-heat_cycle .notification-icon { background: #fce7f3; color: #db2777; }
        
        .notification-content {
          flex: 1;
        }
        
        .notification-content h4 {
          color: #0f172a;
          font-size: 0.95rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        
        .notification-content p {
          color: #64748b;
          font-size: 0.85rem;
          line-height: 1.4;
        }
        
        .notification-close {
          width: 24px;
          height: 24px;
          border-radius: 0.25rem;
          border: none;
          background: #f1f5f9;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        
        .notification-close:hover {
          background: #e2e8f0;
          color: #0f172a;
        }
        
        .sidebar {
          width: 260px;
          background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
          box-shadow: 2px 0 20px rgba(102, 126, 234, 0.08);
          position: fixed;
          height: 100vh;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(102, 126, 234, 0.1);
          z-index: 100;
        }
        
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.5rem;
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          border-bottom: 1px solid rgba(102, 126, 234, 0.1);
        }
        
        .sidebar-logo svg { 
          color: #667eea;
          filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.2));
        }
        
        .sidebar-nav {
          flex: 1;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          overflow-y: auto;
        }
        
        .nav-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1rem;
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 0.95rem;
          font-weight: 500;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: left;
          position: relative;
          overflow: hidden;
        }
        
        .nav-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          opacity: 0;
          transition: opacity 0.3s;
          z-index: -1;
        }
        
        .nav-btn:hover {
          color: #667eea;
          transform: translateX(4px);
        }
        
        .nav-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .nav-btn.active::before { opacity: 1; }
        
        .main-content {
          margin-left: 260px;
          flex: 1;
          padding: 2rem;
          padding-top: 6rem;
          animation: fadeIn 0.5s ease-in;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .container { max-width: 1200px; margin: 0 auto; }
        
        .page-header {
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          animation: slideDown 0.5s ease-out;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .page-header > div {
          flex: 1;
          min-width: 250px;
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .page-header h1 {
          font-size: 2rem;
          color: #0f172a;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .page-header p {
          color: #64748b;
          font-size: 1.05rem;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .stat-card {
          background: #fff;
          border-radius: 1rem;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(102, 126, 234, 0.1);
          position: relative;
          overflow: hidden;
        }
        
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
        }
        
        .stat-card:hover::before { opacity: 1; }
        
        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .stat-blue .stat-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .stat-green .stat-icon {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #fff;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        
        .stat-purple .stat-icon {
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          color: #fff;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }
        
        .stat-orange .stat-icon {
          background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
          color: #fff;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }
        
        .stat-info { flex: 1; }
        
        .stat-title {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #0f172a;
        }
        
        .dashboard-widgets {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
        }
        
        .widget {
          background: #fff;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(102, 126, 234, 0.1);
        }
        
        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f1f5f9;
        }
        
        .widget-header h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #0f172a;
          font-size: 1.1rem;
        }
        
        .empty-widget {
          text-align: center;
          padding: 2rem 1rem;
        }
        
        .empty-widget svg {
          color: #cbd5e1;
          margin-bottom: 1rem;
        }
        
        .empty-widget p {
          color: #94a3b8;
          margin-bottom: 1rem;
        }
        
        .empty-text {
          text-align: center;
          color: #94a3b8;
          padding: 2rem;
        }
        
        .pet-list-mini, .appointment-list-mini {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .pet-item-mini, .appointment-item-mini {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 0.75rem;
          transition: all 0.2s;
        }
        
        .pet-item-mini:hover, .appointment-item-mini:hover {
          background: #f1f5f9;
          transform: translateX(4px);
        }
        
        .pet-avatar-mini {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
          overflow: hidden;
        }
        
        .pet-avatar-mini img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .pet-info-mini h4 {
          color: #0f172a;
          margin-bottom: 0.25rem;
          font-size: 0.95rem;
        }
        
        .pet-info-mini p {
          color: #64748b;
          font-size: 0.85rem;
        }
        
        .appointment-item-mini {
          gap: 1.5rem;
        }
        
        .apt-date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #667eea;
          font-weight: 600;
          font-size: 0.9rem;
          min-width: 120px;
        }
        
        .appointment-item-mini h4 {
          color: #0f172a;
          margin-bottom: 0.25rem;
          font-size: 0.95rem;
        }
        
        .appointment-item-mini p {
          color: #64748b;
          font-size: 0.85rem;
        }
        
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: #fff;
          border-radius: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        
        .empty-state svg {
          color: #cbd5e1;
          margin-bottom: 1.5rem;
        }
        
        .empty-state h2 {
          color: #0f172a;
          margin-bottom: 0.75rem;
          font-size: 1.5rem;
        }
        
        .empty-state p {
          color: #64748b;
          margin-bottom: 2rem;
          font-size: 1.05rem;
        }
        
        .pets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .pet-card {
          background: #fff;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(102, 126, 234, 0.1);
        }
        
        .pet-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
        }
        
        .pet-card-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .pet-avatar-lg {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          border: 3px solid rgba(255, 255, 255, 0.3);
          overflow: hidden;
        }
        
        .pet-avatar-lg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .pet-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .pet-card-body {
          padding: 1.5rem;
        }
        
        .pet-card-body h3 {
          color: #0f172a;
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }
        
        .pet-meta {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        
        .pet-species {
          padding: 0.375rem 0.75rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          border-radius: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: capitalize;
        }
        
        .pet-age {
          padding: 0.375rem 0.75rem;
          background: #f1f5f9;
          color: #64748b;
          border-radius: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
        }
        
        .pet-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .detail-row.heat-cycle {
          background: #fef3c7;
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid #fde68a;
          border-bottom: 1px solid #fde68a;
        }
        
        .detail-row span {
          color: #64748b;
          font-size: 0.9rem;
        }
        
        .detail-row strong {
          color: #0f172a;
          font-weight: 600;
          text-transform: capitalize;
        }
        
        .items-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .item-card {
          background: #fff;
          border-radius: 1rem;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(102, 126, 234, 0.1);
        }
        
        .item-card:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.12);
        }
        
        .item-card.completed {
          opacity: 0.7;
          background: #f8fafc;
        }
        
        .item-content {
          flex: 1;
        }
        
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .item-header h3 {
          color: #0f172a;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .item-details {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .detail {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          font-size: 0.9rem;
        }
        
        .detail svg {
          color: #667eea;
        }
        
        .item-notes, .item-description {
          color: #64748b;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #f1f5f9;
        }
        
        .item-actions {
          display: flex;
          gap: 0.5rem;
          flex-shrink: 0;
          margin-left: 1rem;
        }
        
        .badge {
          padding: 0.375rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
        }
        
        .badge-checkup { background: #dbeafe; color: #1e40af; }
        .badge-vaccination { background: #fce7f3; color: #9f1239; }
        .badge-surgery { background: #fee2e2; color: #991b1b; }
        .badge-emergency { background: #fef3c7; color: #92400e; }
        .badge-dental { background: #e0e7ff; color: #3730a3; }
        .badge-grooming { background: #d1fae5; color: #065f46; }
        .badge-other { background: #f3f4f6; color: #374151; }
        .badge-success { background: #d1fae5; color: #065f46; }
        .badge-warning { background: #fef3c7; color: #92400e; }
        .badge-info { background: #dbeafe; color: #1e40af; }
        .badge-diagnosis { background: #fce7f3; color: #9f1239; }
        .badge-treatment { background: #e0e7ff; color: #3730a3; }
        .badge-lab_results { background: #dbeafe; color: #1e40af; }
        .badge-prescription { background: #fef3c7; color: #92400e; }
        
        .btn-primary, .btn-primary-lg {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          border: none;
          border-radius: 0.75rem;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          white-space: nowrap;
        }
        
        .btn-primary:hover, .btn-primary-lg:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        
        .btn-primary-lg {
          padding: 1rem 2rem;
          font-size: 1.05rem;
        }
        
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #f1f5f9;
          color: #64748b;
          border: none;
          border-radius: 0.75rem;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-secondary:hover {
          background: #e2e8f0;
          color: #475569;
        }
        
        .btn-text {
          background: none;
          border: none;
          color: #667eea;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.9rem;
          transition: color 0.2s;
        }
        
        .btn-text:hover {
          color: #764ba2;
        }
        
        .btn-icon, .btn-icon-danger, .btn-icon-success {
          width: 36px;
          height: 36px;
          border-radius: 0.5rem;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-icon {
          background: #f1f5f9;
          color: #64748b;
        }
        
        .btn-icon:hover {
          background: #667eea;
          color: #fff;
        }
        
        .btn-icon-danger {
          background: #fee2e2;
          color: #dc2626;
        }
        
        .btn-icon-danger:hover {
          background: #dc2626;
          color: #fff;
        }
        
        .btn-icon-success {
          background: #d1fae5;
          color: #059669;
        }
        
        .btn-icon-success:hover {
          background: #059669;
          color: #fff;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s;
        }
        
        .modal {
          background: #fff;
          border-radius: 1rem;
          width: 90%;
          max-width: 600px;
          max-height: 85vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .modal-header {
          padding: 1.5rem;
          border-bottom: 2px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .modal-header h2 {
          color: #fff;
          font-size: 1.25rem;
        }
        
        .btn-close {
          width: 32px;
          height: 32px;
          border-radius: 0.5rem;
          border: none;
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-close:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .modal-body {
          padding: 1.5rem;
          overflow-y: auto;
          flex: 1;
          max-height: calc(85vh - 180px);
        }
        
        .modal-footer {
          padding: 1.5rem;
          border-top: 2px solid #f1f5f9;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }
        
        .form-group {
          margin-bottom: 1.25rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #0f172a;
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        .error-inline {
          color: #dc2626;
          font-weight: 500;
          font-size: 0.85rem;
        }
        
        .required {
          color: #dc2626;
          font-weight: 700;
        }
        
        .form-group input, .form-group select, .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 0.95rem;
          transition: all 0.2s;
          font-family: inherit;
        }
        
        .form-group input::placeholder, .form-group textarea::placeholder {
          color: #94a3b8;
        }
        
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .form-group input.error, .form-group select.error, .form-group textarea.error {
          border-color: #dc2626;
        }
        
        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          font-weight: 500;
          color: #0f172a;
        }
        
        .checkbox-label input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
          accent-color: #667eea;
        }
        
        .photo-upload {
          margin-top: 0.5rem;
        }
        
        .photo-upload-label {
          display: block;
          cursor: pointer;
        }
        
        .photo-upload-area {
          border: 2px dashed #cbd5e1;
          border-radius: 0.75rem;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s;
          background: #f8fafc;
        }
        
        .photo-upload-area:hover {
          border-color: #667eea;
          background: #f1f5f9;
        }
        
        .photo-upload-area svg {
          color: #94a3b8;
          margin-bottom: 1rem;
        }
        
        .photo-upload-area p {
          color: #64748b;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .photo-upload-area span {
          color: #94a3b8;
          font-size: 0.85rem;
        }
        
        .photo-preview {
          position: relative;
          width: 200px;
          height: 200px;
          margin: 0 auto;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .photo-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .photo-remove {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: rgba(220, 38, 38, 0.9);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .photo-remove:hover {
          background: #dc2626;
          transform: scale(1.1);
        }
        
        .info-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem;
          background: #fef3c7;
          border: 1px solid #fde68a;
          border-radius: 0.5rem;
          color: #92400e;
          font-size: 0.9rem;
          margin-top: -0.5rem;
        }
        
        .info-box svg {
          flex-shrink: 0;
        }
        
        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        
        .spinner {
          width: 60px;
          height: 60px;
          border: 4px solid #e2e8f0;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .loading p {
          margin-top: 1.5rem;
          color: #64748b;
          font-size: 1.1rem;
          font-weight: 600;
        }
        
        .auth-screen {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .auth-hero {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: #fff;
        }
        
        .auth-hero-content {
          max-width: 600px;
        }
        
        .hero-badge {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        
        .hero-subtitle {
          font-size: 1.25rem;
          opacity: 0.95;
          margin-bottom: 3rem;
        }
        
        .hero-features {
          display: grid;
          gap: 1.5rem;
        }
        
        .hero-feature {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 1.5rem;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s;
        }
        
        .hero-feature:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateX(8px);
        }
        
        .feature-icon {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .hero-feature h3 {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        
        .hero-feature p {
          font-size: 0.95rem;
          opacity: 0.9;
        }
        
        .auth-form-container {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          padding: 2rem;
        }
        
        .auth-card {
          background: #fff;
          border-radius: 1.5rem;
          padding: 2.5rem;
          max-width: 420px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
        }
        
        .auth-card-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .auth-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
        }
        
        .auth-card-header h2 {
          color: #0f172a;
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }
        
        .auth-card-header p {
          color: #64748b;
          font-size: 0.95rem;
        }
        
        .login-form {
          margin-top: 2rem;
        }
        
        .auth-error {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: #fee2e2;
          border: 1px solid #fca5a5;
          border-radius: 0.5rem;
          color: #991b1b;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
        
        .btn-login {
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          border: none;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .btn-login:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        
        .btn-login:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid rgba(102, 126, 234, 0.1);
        }
        
        .btn-logout {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 0.75rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-logout:hover {
          background: #dc2626;
          color: #fff;
        }
        
        @media (max-width: 1024px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
        
        @media (max-width: 768px) {
          .notification-container {
            max-width: 90%;
            right: 5%;
          }
          
          .sidebar {
            width: 200px;
          }
          
          .main-content {
            margin-left: 200px;
            padding: 1.5rem;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .dashboard-widgets {
            grid-template-columns: 1fr;
          }
          
          .pets-grid {
            grid-template-columns: 1fr;
          }
          
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .modal {
            width: 95%;
            max-height: 90vh;
          }
          
          .modal-body {
            max-height: calc(90vh - 180px);
          }
          
          .auth-screen {
            grid-template-columns: 1fr;
          }
          
          .auth-hero {
            display: none;
          }
          
          .hero-title {
            font-size: 2rem;
          }
        }
        
        @media (max-width: 640px) {
          .notification-container {
            top: 0.5rem;
            right: 0.5rem;
            left: 0.5rem;
            max-width: none;
          }
          
          .notification {
            padding: 0.875rem;
          }
          
          .notification-icon {
            width: 36px;
            height: 36px;
          }
          
          .notification-content h4 {
            font-size: 0.9rem;
          }
          
          .notification-content p {
            font-size: 0.8rem;
          }
          
          .sidebar {
            position: fixed;
            left: -260px;
            z-index: 999;
            transition: left 0.3s;
          }
          
          .main-content {
            margin-left: 0;
            padding: 1rem;
             padding-top: 6rem;  
          }
          
          .stat-card {
            flex-direction: column;
            text-align: center;
          }
          
          .item-card {
            flex-direction: column;
            gap: 1rem;
          }
          
          .item-actions {
            margin-left: 0;
            width: 100%;
            justify-content: flex-end;
          }
          
          .pet-card-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
          
          .item-details {
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .modal {
            width: 95%;
            max-height: 95vh;
            margin: 1rem;
          }
          
          .modal-body {
            max-height: calc(95vh - 180px);
            padding: 1rem;
          }
          
          .modal-header {
            padding: 1rem;
          }
          
          .modal-header h2 {
            font-size: 1.1rem;
          }
          
          .modal-footer {
            padding: 1rem;
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .modal-footer button {
            width: 100%;
          }
          
          .auth-screen {
            grid-template-columns: 1fr;
            padding: 1rem;
          }
          
          .auth-hero {
            display: none;
          }
          
          .auth-form-container {
            padding: 1rem;
          }
          
          .auth-card {
            padding: 1.5rem;
          }
          
          .page-header h1 {
            font-size: 1.5rem;
          }
          
          .page-header p {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default App;