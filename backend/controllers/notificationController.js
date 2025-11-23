const { prisma } = require('../db/config');

const sendAppointmentNotification = async (appointmentId, type) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } }
      }
    });

    if (!appointment) return;

    const notifications = [];
    
    // Create notification for patient
    notifications.push({
      userId: appointment.patient.userId,
      title: getNotificationTitle(type, 'patient'),
      message: getNotificationMessage(type, appointment, 'patient'),
      type: 'APPOINTMENT',
      read: false
    });

    // Create notification for doctor
    notifications.push({
      userId: appointment.doctor.userId,
      title: getNotificationTitle(type, 'doctor'),
      message: getNotificationMessage(type, appointment, 'doctor'),
      type: 'APPOINTMENT',
      read: false
    });

    // In a real app, you would save these to a notifications table
    // and send via email/SMS
    console.log('Notifications sent:', notifications);
    
    return notifications;
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};

const getNotificationTitle = (type, userRole) => {
  const titles = {
    CONFIRMED: {
      patient: 'Appointment Confirmed',
      doctor: 'New Appointment Confirmed'
    },
    CANCELLED: {
      patient: 'Appointment Cancelled',
      doctor: 'Appointment Cancelled'
    },
    REMINDER: {
      patient: 'Appointment Reminder',
      doctor: 'Upcoming Appointment'
    }
  };
  
  return titles[type]?.[userRole] || 'Appointment Update';
};

const getNotificationMessage = (type, appointment, userRole) => {
  const date = new Date(appointment.appointmentDate).toLocaleDateString();
  const time = new Date(appointment.appointmentDate).toLocaleTimeString();
  
  const messages = {
    CONFIRMED: {
      patient: `Your appointment with ${appointment.doctor.user.name} on ${date} at ${time} has been confirmed.`,
      doctor: `New appointment with ${appointment.patient.user.name} on ${date} at ${time} has been confirmed.`
    },
    CANCELLED: {
      patient: `Your appointment with ${appointment.doctor.user.name} on ${date} at ${time} has been cancelled.`,
      doctor: `Appointment with ${appointment.patient.user.name} on ${date} at ${time} has been cancelled.`
    },
    REMINDER: {
      patient: `Reminder: You have an appointment with ${appointment.doctor.user.name} tomorrow at ${time}.`,
      doctor: `Reminder: You have an appointment with ${appointment.patient.user.name} tomorrow at ${time}.`
    }
  };
  
  return messages[type]?.[userRole] || 'Appointment update';
};

module.exports = { sendAppointmentNotification };