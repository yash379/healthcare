import React from 'react';
import { EventProps } from 'react-big-calendar';
import moment from 'moment';
import styles from './customevent.module.scss';

export interface AppointmentEvent {
  title: string;
  patient: string;
  start: Date;
  end: Date;
}

interface CustomeventProps extends EventProps<AppointmentEvent> {}

const Customevent: React.FC<CustomeventProps> = ({ event }) => {
  return (
    <div className={styles['container']}>
      <strong>{event.title}</strong>
      <br />
      <span>Patient: {event.patient}</span>
      <br />
      <span>{`${moment(event.start).format('h:mm A')} - ${moment(event.end).format('h:mm A')}`}</span>
    </div>
  );
};

export default Customevent;
