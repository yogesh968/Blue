import React, { useState, useEffect } from 'react';
import { FileText, Plus, Calendar, User, Building2, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import './MedicalRecords.css';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    recordType: '',
    description: '',
    date: '',
    doctorName: '',
    hospitalName: ''
  });

  const mockRecords = [
    {
      id: 1,
      recordType: 'Consultation',
      description: 'Regular cardiac checkup. Blood pressure normal, ECG shows normal rhythm.',
      date: '2024-01-15',
      doctorName: 'Dr. Sarah Johnson',
      hospitalName: 'Apollo Hospital',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      recordType: 'Lab Report',
      description: 'Blood test results: Cholesterol levels slightly elevated. Recommended dietary changes.',
      date: '2024-01-10',
      doctorName: 'Dr. Michael Chen',
      hospitalName: 'Max Healthcare',
      createdAt: '2024-01-10T14:20:00Z'
    },
    {
      id: 3,
      recordType: 'Prescription',
      description: 'Prescribed medication for hypertension: Amlodipine 5mg once daily.',
      date: '2024-01-08',
      doctorName: 'Dr. Sarah Johnson',
      hospitalName: 'Apollo Hospital',
      createdAt: '2024-01-08T16:45:00Z'
    }
  ];

  useEffect(() => {
    setRecords(mockRecords);
  }, []);

  const handleAddRecord = (e) => {
    e.preventDefault();
    
    if (!newRecord.recordType || !newRecord.description) {
      toast.error('Please fill in required fields');
      return;
    }

    const record = {
      id: Date.now(),
      ...newRecord,
      date: newRecord.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    setRecords([record, ...records]);
    setNewRecord({
      recordType: '',
      description: '',
      date: '',
      doctorName: '',
      hospitalName: ''
    });
    setShowAddRecord(false);
    toast.success('Medical record added successfully!');
  };

  const downloadRecord = (record) => {
    toast.success(`Downloading ${record.recordType} record...`);
  };

  const getRecordIcon = (type) => {
    switch (type) {
      case 'Consultation': return '🩺';
      case 'Lab Report': return '🧪';
      case 'Prescription': return '💊';
      case 'X-Ray': return '📷';
      case 'Surgery': return '🏥';
      default: return '📄';
    }
  };

  return (
    <div className="medical-records">
      <div className="records-header">
        <div className="header-content">
          <FileText size={24} />
          <div>
            <h2>Medical Records</h2>
            <p>Your complete medical history and documents</p>
          </div>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowAddRecord(true)}
        >
          <Plus size={16} /> Add Record
        </button>
      </div>

      <div className="records-stats">
        <div className="stat-card">
          <span className="stat-number">{records.length}</span>
          <span className="stat-label">Total Records</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{records.filter(r => r.recordType === 'Consultation').length}</span>
          <span className="stat-label">Consultations</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{records.filter(r => r.recordType === 'Lab Report').length}</span>
          <span className="stat-label">Lab Reports</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{records.filter(r => r.recordType === 'Prescription').length}</span>
          <span className="stat-label">Prescriptions</span>
        </div>
      </div>

      <div className="records-list">
        {records.map(record => (
          <div key={record.id} className="record-card">
            <div className="record-header">
              <div className="record-type">
                <span className="record-icon">{getRecordIcon(record.recordType)}</span>
                <span className="record-type-text">{record.recordType}</span>
              </div>
              <div className="record-date">
                <Calendar size={16} />
                <span>{record.date}</span>
              </div>
            </div>
            
            <div className="record-content">
              <p className="record-description">{record.description}</p>
              
              <div className="record-details">
                {record.doctorName && (
                  <div className="detail-item">
                    <User size={14} />
                    <span>{record.doctorName}</span>
                  </div>
                )}
                {record.hospitalName && (
                  <div className="detail-item">
                    <Building2 size={14} />
                    <span>{record.hospitalName}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="record-actions">
              <button 
                className="btn-secondary"
                onClick={() => downloadRecord(record)}
              >
                <Download size={16} /> Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {records.length === 0 && (
        <div className="no-records">
          <FileText size={48} className="no-records-icon" />
          <h3>No Medical Records</h3>
          <p>Start by adding your first medical record</p>
          <button 
            className="btn-primary"
            onClick={() => setShowAddRecord(true)}
          >
            Add First Record
          </button>
        </div>
      )}

      {showAddRecord && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add Medical Record</h3>
              <button onClick={() => setShowAddRecord(false)}>×</button>
            </div>
            
            <form onSubmit={handleAddRecord}>
              <div className="form-group">
                <label>Record Type *</label>
                <select
                  value={newRecord.recordType}
                  onChange={(e) => setNewRecord({...newRecord, recordType: e.target.value})}
                  required
                >
                  <option value="">Select record type</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Lab Report">Lab Report</option>
                  <option value="Prescription">Prescription</option>
                  <option value="X-Ray">X-Ray</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={newRecord.description}
                  onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
                  placeholder="Describe the medical record details..."
                  rows={4}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={newRecord.date}
                    onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Doctor Name</label>
                  <input
                    type="text"
                    value={newRecord.doctorName}
                    onChange={(e) => setNewRecord({...newRecord, doctorName: e.target.value})}
                    placeholder="Doctor's name"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Hospital/Clinic Name</label>
                <input
                  type="text"
                  value={newRecord.hospitalName}
                  onChange={(e) => setNewRecord({...newRecord, hospitalName: e.target.value})}
                  placeholder="Hospital or clinic name"
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddRecord(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;