'use client'
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useService } from '../context/serviceContext';
import { useAuth } from '../context/authContext';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import styles from './calendar.module.css';

const CalendarComponent = () => {
    const [services, setServices] = useState([]);
    const [dates, setDates] = useState([]);
    const router = useRouter();

    const { user, loginToken } = useAuth();
    const { getAllServices } = useService();

    useEffect(() => {
        const fetchData = async () => {
            const token = Cookies.get("token");
            if (!token) {
                router.push("/LogIn");
                return;
            }

            try {
                const allServices = await getAllServices(user.id, loginToken);
                setServices(allServices);
                const finishDates = allServices.map(service => new Date(service.finishDate));
                setDates(finishDates);
            } catch (err) {
                console.error('Error fetching services:', err);
            }
        };

        fetchData();
    }, [loginToken, router, getAllServices, user]);

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            if (dates.find(d => d.toDateString() === date.toDateString())) {
                return styles.highlight;
            }
        }
        return null;
    };

    return (
        <div className={styles.container}>
            <div className={styles.calendarContainer}>
                <Calendar
                    tileClassName={tileClassName}
                />
            </div>
        </div>
    );
};

export default CalendarComponent;
