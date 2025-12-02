import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const DoctorSchedule = () => {
  const [schedules, setSchedules] = useState([
    { id: 1, dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00', locationId: 1, location: { name: 'Apollo Hospital' } },
    { id: 2, dayOfWeek: 'TUESDAY', startTime: '10:00', endTime: '18:00', locationId: 2, location: { name: 'City Clinic' } },
  ]);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [newSlot, setNewSlot] = useState({
    dayOfWeek: 'MONDAY',
    startTime: '09:00',
    endTime: '17:00',
    locationId: ''
  });

  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const dayLabels = {
    MONDAY: 'Monday',
    TUESDAY: 'Tuesday', 
    WEDNESDAY: 'Wednesday',
    THURSDAY: 'Thursday',
    FRIDAY: 'Friday',
    SATURDAY: 'Saturday',
    SUNDAY: 'Sunday'
  };

  const locations = [
    { id: 1, name: 'Apollo Hospital' },
    { id: 2, name: 'City Clinic' }
  ];

  const handleAddSlot = () => {
    const selectedLocation = locations.find(loc => loc.id === parseInt(newSlot.locationId));
    const slot = {
      id: Date.now(),
      ...newSlot,
      locationId: parseInt(newSlot.locationId),
      location: selectedLocation
    };
    setSchedules([...schedules, slot]);
    setNewSlot({ dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00', locationId: '' });
    setShowAddSlot(false);
    toast.success('Schedule updated successfully!');
  };

  const handleEditSlot = (slot) => {
    setEditingSlot({ ...slot });
  };

  const handleSaveEdit = () => {
    const selectedLocation = locations.find(loc => loc.id === editingSlot.locationId);
    setSchedules(schedules.map(slot => 
      slot.id === editingSlot.id 
        ? { ...editingSlot, location: selectedLocation }
        : slot
    ));
    setEditingSlot(null);
    toast.success('Schedule updated successfully!');
  };

  const handleDeleteSlot = (slotId) => {
    setSchedules(schedules.filter(slot => slot.id !== slotId));
    toast.success('Schedule updated successfully!');
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const groupedSchedules = daysOfWeek.reduce((acc, day) => {
    acc[day] = schedules.filter(schedule => schedule.dayOfWeek === day);
    return acc;
  }, {});

  const styles = {
    container: {
      background: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem'
    },
    title: {
      margin: 0,
      color: '#2c3e50'
    },
    addButton: {
      background: '#3498db',
      color: 'white',
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    weeklyGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '1rem'
    },
    dayCard: {
      background: 'white',
      borderRadius: '8px',
      border: '2px solid #e9ecef',
      overflow: 'hidden',
      minHeight: '200px'
    },
    dayCardAvailable: {
      borderColor: '#27ae60'
    },
    dayCardUnavailable: {
      borderColor: '#e74c3c'
    },
    dayHeader: {
      padding: '0.75rem',
      background: 'linear-gradient(135deg, #3498db, #2980b9)',
      color: 'white',
      textAlign: 'center'
    },
    dayName: {
      fontWeight: 600,
      fontSize: '0.9rem',
      marginBottom: '0.25rem'
    },
    availableBadge: {
      fontSize: '0.7rem',
      padding: '0.2rem 0.5rem',
      borderRadius: '10px',
      fontWeight: 500,
      textTransform: 'uppercase',
      background: 'rgba(39, 174, 96, 0.2)',
      color: '#27ae60'
    },
    unavailableBadge: {
      fontSize: '0.7rem',
      padding: '0.2rem 0.5rem',
      borderRadius: '10px',
      fontWeight: 500,
      textTransform: 'uppercase',
      background: 'rgba(231, 76, 60, 0.2)',
      color: '#e74c3c'
    },
    daySlots: {
      padding: '0.75rem',
      minHeight: '140px'
    },
    timeSlot: {
      background: '#f8f9fa',
      border: '1px solid #e9ecef',
      borderRadius: '6px',
      padding: '0.75rem',
      marginBottom: '0.5rem'
    },
    slotInfo: {
      marginBottom: '0.5rem'
    },
    slotLocation: {
      fontWeight: 500,
      color: '#2c3e50',
      fontSize: '0.85rem',
      marginBottom: '0.25rem'
    },
    slotTime: {
      color: '#6c757d',
      fontSize: '0.8rem'
    },
    slotActions: {
      display: 'flex',
      gap: '0.25rem',
      justifyContent: 'center'
    },
    actionButton: {
      background: 'white',
      border: '1px solid #dee2e6',
      borderRadius: '4px',
      padding: '0.4rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    noSlots: {
      textAlign: 'center',
      color: '#6c757d',
      fontStyle: 'italic',
      padding: '2rem 0.5rem',
      fontSize: '0.85rem'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: 'white',
      borderRadius: '12px',
      padding: '2rem',
      width: '90%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem'
    },
    formGroup: {
      marginBottom: '1rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      color: '#2c3e50',
      fontWeight: 500
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '1rem',
      boxSizing: 'border-box'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem'
    },
    modalActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '1rem',
      marginTop: '2rem'
    },
    secondaryButton: {
      background: '#6c757d',
      color: 'white',
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '1rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>My Schedule</h2>
        <button 
          style={styles.addButton}
          onClick={() => setShowAddSlot(true)}
        >
          <Plus size={16} /> Add Time Slot
        </button>
      </div>

      <div style={styles.weeklyGrid}>
        {daysOfWeek.map(day => {
          const daySchedules = groupedSchedules[day];
          const isDayAvailable = daySchedules.length > 0;
          
          return (
            <div key={day} style={{
              ...styles.dayCard,
              ...(isDayAvailable ? styles.dayCardAvailable : styles.dayCardUnavailable)
            }}>
              <div style={styles.dayHeader}>
                <div style={styles.dayName}>{dayLabels[day]}</div>
                <div style={isDayAvailable ? styles.availableBadge : styles.unavailableBadge}>
                  {isDayAvailable ? 'Available' : 'Unavailable'}
                </div>
              </div>
              
              <div style={styles.daySlots}>
                {daySchedules.length === 0 ? (
                  <div style={styles.noSlots}>No time slots</div>
                ) : (
                  daySchedules.map(slot => (
                    <div key={slot.id} style={styles.timeSlot}>
                      {editingSlot && editingSlot.id === slot.id ? (
                        <div>
                          <select 
                            value={editingSlot.locationId}
                            onChange={(e) => setEditingSlot({...editingSlot, locationId: parseInt(e.target.value)})}
                            style={{...styles.input, marginBottom: '0.5rem'}}
                          >
                            {locations.map(loc => (
                              <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                          </select>
                          <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem'}}>
                            <input 
                              type="time" 
                              value={editingSlot.startTime}
                              onChange={(e) => setEditingSlot({...editingSlot, startTime: e.target.value})}
                              style={{...styles.input, width: 'auto'}}
                            />
                            <span>to</span>
                            <input 
                              type="time" 
                              value={editingSlot.endTime}
                              onChange={(e) => setEditingSlot({...editingSlot, endTime: e.target.value})}
                              style={{...styles.input, width: 'auto'}}
                            />
                          </div>
                          <div style={styles.slotActions}>
                            <button onClick={handleSaveEdit} style={styles.actionButton}>
                              <Save size={14} />
                            </button>
                            <button onClick={() => setEditingSlot(null)} style={styles.actionButton}>
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div style={styles.slotInfo}>
                            <div style={styles.slotLocation}>{slot.location?.name}</div>
                            <div style={styles.slotTime}>
                              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                            </div>
                          </div>
                          <div style={styles.slotActions}>
                            <button onClick={() => handleEditSlot(slot)} style={styles.actionButton}>
                              <Edit size={14} />
                            </button>
                            <button onClick={() => handleDeleteSlot(slot.id)} style={styles.actionButton}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showAddSlot && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3>Add Time Slot</h3>
              <button onClick={() => setShowAddSlot(false)} style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer'}}>×</button>
            </div>
            <div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Day of Week</label>
                <select 
                  value={newSlot.dayOfWeek}
                  onChange={(e) => setNewSlot({...newSlot, dayOfWeek: e.target.value})}
                  style={styles.input}
                >
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>{dayLabels[day]}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Location</label>
                <select 
                  value={newSlot.locationId}
                  onChange={(e) => setNewSlot({...newSlot, locationId: e.target.value})}
                  style={styles.input}
                  required
                >
                  <option value="">Select Location</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>{location.name}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Start Time</label>
                  <input 
                    type="time" 
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>End Time</label>
                  <input 
                    type="time" 
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
                    style={styles.input}
                  />
                </div>
              </div>
            </div>
            <div style={styles.modalActions}>
              <button onClick={() => setShowAddSlot(false)} style={styles.secondaryButton}>
                Cancel
              </button>
              <button 
                onClick={handleAddSlot} 
                style={styles.addButton}
                disabled={!newSlot.locationId}
              >
                Add Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorSchedule;