
import React, { useState, useEffect } from 'react';
import App_en from './App_en';
import App_ar from './App_ar';

const App: React.FC = () => {
  const [language, setLanguage] = useState('ar');

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  useEffect(() => {
    if (language === 'ar') {
      document.documentElement.lang = 'ar';
      document.documentElement.dir = 'rtl';
      document.body.classList.add('font-cairo');
    } else {
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
      document.body.classList.remove('font-cairo');
    }
  }, [language]);

  return language === 'en' ? (
    <App_en onToggleLanguage={toggleLanguage} />
  ) : (
    <App_ar onToggleLanguage={toggleLanguage} />
  );
};

export default App;
