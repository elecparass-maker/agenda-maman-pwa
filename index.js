import React, { useState, useEffect } from 'react';
import Head from 'next/head';

const AgendaApp = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '09:00',
    type: 'rdv',
    notes: '',
    important: false
  });
  const [currentView, setCurrentView] = useState('calendar');

  // Types d'événements avec emojis
  const eventTypes = {
    'rdv': { emoji: '🏥', label: 'Rendez-vous médical', color: 'bg-red-100 border-red-300' },
    'famille': { emoji: '👨‍👩‍👧‍👦', label: 'Famille', color: 'bg-blue-100 border-blue-300' },
    'courses': { emoji: '🛒', label: 'Courses', color: 'bg-green-100 border-green-300' },
    'loisir': { emoji: '🎨', label: 'Loisirs', color: 'bg-purple-100 border-purple-300' },
    'medicament': { emoji: '💊', label: 'Médicament', color: 'bg-yellow-100 border-yellow-300' },
    'autre': { emoji: '📝', label: 'Autre', color: 'bg-gray-100 border-gray-300' }
  };

  // Sauvegarde et chargement des événements
  useEffect(() => {
    // Charger les événements sauvegardés
    const savedEvents = localStorage.getItem('agenda-events');
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents).map(event => ({
          ...event,
          date: new Date(event.date)
        }));
        setEvents(parsedEvents);
      } catch (error) {
        console.error('Erreur chargement événements:', error);
        loadDefaultEvents();
      }
    } else {
      loadDefaultEvents();
    }
  }, []);

  const loadDefaultEvents = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const defaultEvents = [
      {
        id: 1,
        title: 'Dr. Martin - Contrôle',
        date: today,
        time: '14:30',
        type: 'rdv',
        notes: 'Apporter les analyses',
        important: true
      },
      {
        id: 2,
        title: 'Appel Marie',
        date: tomorrow,
        time: '16:00',
        type: 'famille',
        notes: 'Anniversaire petit-fils',
        important: false
      },
      {
        id: 3,
        title: 'Médicaments matin',
        date: today,
        time: '08:00',
        type: 'medicament',
        notes: 'Vitamine D + Tension',
        important: true
      }
    ];
    setEvents(defaultEvents);
  };

  // Sauvegarder automatiquement les événements
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('agenda-events', JSON.stringify(events));
    }
  }, [events]);

  // Fonctions utilitaires
  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDay = (date1, date2) => {
    return date1.toDateString() === date2.toDateString();
  };

  const getEventsForDate = (date) => {
    return events.filter(event => isSameDay(event.date, date))
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Jours du mois précédent
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date: date, isCurrentMonth: true });
    }
    
    // Compléter avec les jours du mois suivant
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return days;
  };

  const addEvent = () => {
    if (!newEvent.title.trim()) return;
    
    const eventToAdd = {
      id: Date.now(),
      title: newEvent.title,
      date: selectedDate,
      time: newEvent.time,
      type: newEvent.type,
      notes: newEvent.notes,
      important: newEvent.important
    };
    
    setEvents([...events, eventToAdd]);
    setNewEvent({
      title: '',
      time: '09:00',
      type: 'rdv',
      notes: '',
      important: false
    });
    setShowAddEvent(false);
  };

  const deleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Vue Calendrier
  const CalendarView = () => (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => navigateMonth(-1)}
            className="p-3 rounded-full bg-blue-500 hover:bg-blue-400 transition-colors"
          >
            <span className="text-2xl">‹</span>
          </button>
          <h1 className="text-2xl font-bold text-center">
            {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </h1>
          <button 
            onClick={() => navigateMonth(1)}
            className="p-3 rounded-full bg-blue-500 hover:bg-blue-400 transition-colors"
          >
            <span className="text-2xl">›</span>
          </button>
        </div>
        
        <div className="text-center">
          <p className="text-xl opacity-90">📅 Mon Agenda</p>
        </div>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 gap-1 p-4 bg-gray-50">
        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
          <div key={day} className="text-center py-2 font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Grille du calendrier */}
      <div className="grid grid-cols-7 gap-1 p-4 pb-32">
        {getDaysInMonth(currentDate).map((dayInfo, index) => {
          const dayEvents = getEventsForDate(dayInfo.date);
          const isSelected = isSameDay(dayInfo.date, selectedDate);
          const isCurrentDay = isToday(dayInfo.date);
          
          return (
            <button
              key={index}
              onClick={() => {
                setSelectedDate(dayInfo.date);
                setCurrentView('day');
              }}
              className={`
                p-4 min-h-[60px] rounded-xl border-2 transition-all relative
                ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                ${isCurrentDay ? 'bg-green-100 border-green-400' : ''}
                ${!dayInfo.isCurrentMonth ? 'opacity-30' : 'hover:bg-gray-50'}
                ${dayEvents.length > 0 ? 'bg-orange-50' : ''}
              `}
            >
              <span className={`
                text-lg font-semibold
                ${isCurrentDay ? 'text-green-800' : ''}
                ${!dayInfo.isCurrentMonth ? 'text-gray-400' : 'text-gray-800'}
              `}>
                {dayInfo.date.getDate()}
              </span>
              
              {/* Indicateurs d'événements */}
              {dayEvents.length > 0 && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="flex gap-1">
                    {dayEvents.slice(0, 3).map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className={`
                          w-2 h-2 rounded-full
                          ${event.important ? 'bg-red-500' : 'bg-blue-500'}
                        `}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-xs text-gray-600">+</span>
                    )}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bouton flottant pour ajouter */}
      <button
        onClick={() => setShowAddEvent(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center z-40"
      >
        <span className="text-3xl">+</span>
      </button>

      {/* Résumé rapide aujourd'hui */}
      <div className="fixed bottom-20 left-4 right-4 bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
        <h3 className="font-bold text-lg mb-2">🗓️ Aujourd'hui</h3>
        {getEventsForDate(new Date()).length === 0 ? (
          <p className="text-gray-500">Aucun événement prévu 😌</p>
        ) : (
          <div className="space-y-1">
            {getEventsForDate(new Date()).slice(0, 2).map(event => (
              <div key={event.id} className="flex items-center gap-2">
                <span>{eventTypes[event.type].emoji}</span>
                <span className="font-medium">{event.time}</span>
                <span className="flex-1 truncate">{event.title}</span>
              </div>
            ))}
            {getEventsForDate(new Date()).length > 2 && (
              <button 
                onClick={() => {
                  setSelectedDate(new Date());
                  setCurrentView('day');
                }}
                className="text-blue-600 text-sm font-medium"
              >
                Voir tout ({getEventsForDate(new Date()).length})
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Vue Jour
  const DayView = () => (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-purple-600 text-white p-6 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => setCurrentView('calendar')}
            className="p-2 rounded-full bg-purple-500 hover:bg-purple-400 transition-colors"
          >
            <span className="text-xl">←</span>
          </button>
          <h1 className="text-xl font-bold flex-1">
            {formatDate(selectedDate)}
          </h1>
          <button
            onClick={() => setShowAddEvent(true)}
            className="p-2 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
          >
            <span className="text-xl">+</span>
          </button>
        </div>
        
        {isToday(selectedDate) && (
          <div className="bg-green-500 rounded-xl p-3 text-center">
            <p className="font-semibold">📅 Aujourd'hui</p>
          </div>
        )}
      </div>

      {/* Liste des événements */}
      <div className="p-6 space-y-4">
        {getEventsForDate(selectedDate).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucun événement
            </h3>
            <p className="text-gray-500 mb-6">
              Profitez de cette journée libre !
            </p>
            <button
              onClick={() => setShowAddEvent(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              + Ajouter un événement
            </button>
          </div>
        ) : (
          getEventsForDate(selectedDate).map(event => (
            <div
              key={event.id}
              className={`
                p-6 rounded-2xl border-2 shadow-sm
                ${eventTypes[event.type].color}
                ${event.important ? 'ring-2 ring-red-400' : ''}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{eventTypes[event.type].emoji}</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {event.time}
                    </span>
                    {event.important && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        Important
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-2">
                    {eventTypes[event.type].label}
                  </p>
                  
                  {event.notes && (
                    <p className="text-gray-700 bg-white bg-opacity-50 p-3 rounded-lg">
                      💡 {event.notes}
                    </p>
                  )}
                </div>
                
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                >
                  <span className="text-xl">🗑️</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Modal d'ajout d'événement
  const AddEventModal = () => (
    showAddEvent && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              ➕ Nouvel événement
            </h2>
            <button
              onClick={() => setShowAddEvent(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {/* Date sélectionnée */}
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-blue-800 font-semibold">
                📅 {formatDate(selectedDate)}
              </p>
            </div>

            {/* Titre */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                📝 Titre de l'événement
              </label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:outline-none"
                placeholder="Ex: Rendez-vous médecin"
                autoFocus
              />
            </div>

            {/* Heure */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                🕐 Heure
              </label>
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                🏷️ Type d'événement
              </label>
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:outline-none"
              >
                {Object.entries(eventTypes).map(([key, type]) => (
                  <option key={key} value={key}>
                    {type.emoji} {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                💭 Notes (optionnel)
              </label>
              <textarea
                value={newEvent.notes}
                onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:outline-none"
                placeholder="Ex: Apporter les analyses, ne pas oublier..."
                rows="3"
              />
            </div>

            {/* Important */}
            <div>
              <label className="flex items-center gap-3 text-lg">
                <input
                  type="checkbox"
                  checked={newEvent.important}
                  onChange={(e) => setNewEvent({ ...newEvent, important: e.target.checked })}
                  className="w-6 h-6 text-red-500 border-2 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="font-semibold text-red-600">
                  🔴 Marquer comme important
                </span>
              </label>
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setShowAddEvent(false)}
                className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={addEvent}
                className="flex-1 py-4 px-6 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
              >
                ✅ Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <>
      <Head>
        <title>Mon Agenda - Maman</title>
        <meta name="description" content="Application d'agenda simple et intuitive pour Maman" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        
        {/* PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Mon Agenda" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#2563eb" />
        
        {/* Icons */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </Head>

      <div className="font-sans max-w-md mx-auto bg-gray-100 min-h-screen ios-safe-area">
        {currentView === 'calendar' && <CalendarView />}
        {currentView === 'day' && <DayView />}
        <AddEventModal />
      </div>

      <style jsx global>{`
        .ios-safe-area {
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
      `}</style>
    </>
  );
};

export default AgendaApp;