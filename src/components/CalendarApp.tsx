import React, {useState, useEffect} from 'react';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import Select from './Select';
import {Typography, Button, CircularProgress} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers';
import Calendar, {Holiday} from './Calendar';

const CalendarApp: React.FC = () => {
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [country, setCountry] = useState('');
    const [year, setYear] = useState<number | null>(2023);
    const [month, setMonth] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (country && year) {
            fetchHolidays(country, year, month);
        }
    }, [year]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const {latitude, longitude} = position.coords;
                    getCountryFromGeoLocation(latitude, longitude);
                },
                (error) => {
                    console.error('Error getting user geolocation:', error);
                    setCountry('US');
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            setCountry('US');
        }
    }, []);

    const getCountryFromGeoLocation = async (
        latitude: number,
        longitude: number
    ) => {
        try {
            const response = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${process.env.REACT_APP_OPENCAGE_API_KEY}`
            );
            const data = await response.json();
            const country = data.results[0]?.components?.country_code;
            if (country) {
                setCountry(country);
            }
        } catch (error) {
            console.error('Error getting country from geolocation:', error);
            setCountry('US');
        }
    };

    const handleYearChange = (value: Date | null) => {
        if (value) {
            setYear(value.getFullYear());
        } else {
            setYear(null);
        }
    };

    const handleMonthChange = (value: Date | null) => {
        if (value) {
            setMonth(value.getMonth() + 1);
        } else {
            setMonth(null);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (country && year) {
            fetchHolidays(country, year, month);
        }
    };

    const fetchHolidays = async (
        country: string,
        year: number | null,
        month?: number | null
    ) => {
        try {
            setLoading(true);
            let url = `https://calendarific.com/api/v2/holidays?api_key=${process.env.REACT_APP_HOLIDAY_API_KEY}&country=${country}&year=${year}`;
            if (month) {
                url += `&month=${month}`;
            }
            const response = await fetch(url);
            const data = await response.json();
            setHolidays(data.response.holidays);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching holidays:', error);
            setLoading(false);
        }
    };

    const handleCountryChange = (value: string) => {
        setCountry(value);
    };

    const getMonthName = (monthNumber: number) => {
        const date = new Date();
        date.setMonth(monthNumber - 1);

        return date.toLocaleString('en-US', {month: 'long'});
    }

    countries.registerLocale(enLocale);
    const countryObj = countries.getNames('en', {select: 'official'});
    const countryArr = Object.entries(countryObj).map(([key, value]) => {
        return {
            label: value,
            value: key,
        };
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div>
                <Typography variant='h4'>Public Holidays Calendar</Typography>
                <form onSubmit={handleSubmit}>
                    <Select
                        list={countryArr}
                        callback={handleCountryChange}
                        value={country.toUpperCase()}
                    />

                    <DatePicker
                        views={['year']}
                        label='Year'
                        value={year ? new Date(year, 0) : null}
                        onChange={handleYearChange}
                    />

                    <DatePicker
                        views={['month']}
                        label='Month (optional)'
                        value={month ? new Date(year || 0, month - 1) : null}
                        onChange={handleMonthChange}
                        disabled={!year}
                    />

                    <Button type='submit' variant='contained' color='primary'>
                        Fetch Holidays
                    </Button>
                </form>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <Typography variant='h5'>
                            Public Holidays for {month && getMonthName(month)} {year} in{' '}
                            {countryObj[country.toUpperCase()]}:
                        </Typography>
                        <Calendar holidays={holidays} />
                    </>
                )}
            </div>
        </LocalizationProvider>
    );
};

export default CalendarApp;
