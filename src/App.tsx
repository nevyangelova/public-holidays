import React from 'react';
import CalendarApp from './components/CalendarApp';
import './App.css';

const App: React.FC = () => {
    return (
        <div className='app-container'>
            <CalendarApp />
        </div>
    );
};

export default App;
