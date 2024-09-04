import React from 'react';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Customevent, { AppointmentEvent } from '../customevent/customevent';

const localizer = momentLocalizer(moment);

const DoctorAppointmentCalendar: React.FC = () => {
  const today = new Date();

  const appointments: AppointmentEvent[] = [
    {
      title: 'Root Canal',
      patient: 'Mr. Fox',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 7, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
    },
    {
      title: 'Consultation Meeting',
      patient: 'Mr. David',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 30),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0),
    },
    {
      title: 'Diabetes Control Appointment',
      patient: 'Mr. Rome',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0),
    },
    {
      title: 'Diagnostics Treatments - Mr. Scott',
      patient: 'Mr. Scott',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 0),
    },
    {
      title: 'Skin Treatment - Mrs. Wilson',
      patient: 'Mrs. Wilson',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0),
    },
  ];

  return (
    <div style={{ margin: '20px' }}>
      <h1 style={{ textAlign: 'center', fontFamily: 'Arial', marginBottom: '20px' }}>
        Doctor Appointment Calendar for {moment(today).format('MMMM Do YYYY')}
      </h1>
      
      <Calendar
        localizer={localizer}
        events={appointments as Event[]}
        startAccessor="start"
        endAccessor="end"
        defaultView="day"
        views={['day', 'week']}
        step={60}
        timeslots={1}
        defaultDate={today}
        style={{
          height: '600px',
          border: '1px solid #ccc',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
        }}
        components={{
          event: Customevent,
        }}
      />
    </div>
  );
};

export default DoctorAppointmentCalendar;
