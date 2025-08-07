import React, { useState, useEffect } from 'react';

const AppCompleteMaman = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [currentDate] = useState(new Date());
  
  // États pour les différentes fonctionnalités
  const [events, setEvents] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [weather, setWeather] = useState(null);
  const [userSettings, setUserSettings] = useState({
    city: 'Paris',
    name: 'Maman'
  });

  // Chargement des données sauvegardées
  useEffect(() => {
    loadDefaultData();
  }, []);

  const loadDefaultData = () => {
    // Contacts par défaut
    const defaultContacts = [
      { id: 1, name: 'Pierre', relation: 'Fils', phone: '06.12.34.56.78', emoji: '👨', urgent: false },
      { id: 2, name: 'Marie', relation: 'Fille', phone: '06.87.65.43.21', emoji: '👩', urgent: false },
      { id: 3, name: 'Dr. Martin', relation: 'Médecin', phone: '01.23.45.67.89', emoji: '👨‍⚕️', urgent: true }
    ];
    setContacts(defaultContacts);

    // Médicaments par défaut
    const defaultMedicines = [
      { id: 1, name: 'Vitamine D', time: '08:00', taken: false, color: 'jaune', notes: 'Au petit-déjeuner' },
      { id: 2, name: 'Tension', time: '14:30', taken: false, color: 'blanche', notes: 'Après le repas' },
      { id: 3, name: 'Calcium', time: '20:00', taken: false, color: 'blanche', notes: 'Au dîner' }
    ];
    setMedicines(defaultMedicines);

    // Météo par défaut
    setWeather({
      temperature: 22,
      condition: 'ensoleillé',
      emoji: '☀️',
      advice: 'Parfait pour sortir ! Une veste légère suffira.',
      city: 'Paris'
    });

    // Événements
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    setEvents([
      { id: 1, title: 'Dr. Martin', time: '14:30', date: today, type: 'medical', important: true },
      { id: 2, title: 'Appel Marie', time: '16:00', date: tomorrow, type: 'family', important: false }
    ]);

    // Liste de courses
    setShoppingList([
      { id: 1, item: 'Pain', checked: false, category: 'Boulangerie' },
      { id: 2, item: 'Lait', checked: false, category: 'Frais' },
      { id: 3, item: 'Pommes', checked: false, category: 'Fruits' }
    ]);
  };

  // Navigation
  const goToScreen = (screen) => setCurrentScreen(screen);
  const goHome = () => setCurrentScreen('home');

  // Fonctions utilitaires
  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Composant Bouton Large
  const BigButton = ({ onClick, children, color = 'blue', urgent = false }) => (
    <button
      onClick={onClick}
      className={`
        w-full p-6 rounded-3xl text-2xl font-bold transition-all shadow-lg border-none cursor-pointer
        ${urgent ? 'bg-red-500 text-white ring-4 ring-red-300' : ''}
        ${color === 'blue' && !urgent ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
        ${color === 'green' && !urgent ? 'bg-green-500 text-white hover:bg-green-600' : ''}
        ${color === 'purple' && !urgent ? 'bg-purple-500 text-white hover:bg-purple-600' : ''}
        ${color === 'orange' && !urgent ? 'bg-orange-500 text-white hover:bg-orange-600' : ''}
        ${color === 'white' ? 'bg-white text-gray-800 border-4 border-gray-300 hover:bg-gray-50' : ''}
        active:scale-95
      `}
    >
      {children}
    </button>
  );

  // Composant Header
  const Header = ({ title, onBack = null, onEdit = null }) => (
    <div className="bg-blue-600 text-white p-6 pb-8 rounded-b-3xl shadow-lg mb-6">
      <div className="flex items-center justify-between">
        {onBack && (
          <button 
            onClick={onBack}
            className="p-4 rounded-full bg-blue-500 hover:bg-blue-400 transition-colors"
          >
            <span className="text-3xl">←</span>
          </button>
        )}
        <div className="flex-1 text-center">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-xl opacity-90 mt-2">{formatDate(currentDate)}</p>
        </div>
        {onEdit && (
          <button 
            onClick={onEdit}
            className="p-4 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
          >
            <span className="text-2xl">✏️</span>
          </button>
        )}
        {onBack && !onEdit && <div className="w-16"></div>}
      </div>
    </div>
  );

  // ÉCRAN DE MODIFICATION MÉTÉO
  const EditWeatherScreen = () => {
    const [tempWeather, setTempWeather] = useState({ ...weather });
    
    const weatherOptions = [
      { emoji: '☀️', condition: 'ensoleillé', advice: 'Parfait pour sortir ! Vêtements légers.' },
      { emoji: '⛅', condition: 'nuageux', advice: 'Temps mitigé, une petite veste sera bien.' },
      { emoji: '🌧️', condition: 'pluvieux', advice: 'Pensez à prendre un parapluie !' },
      { emoji: '❄️', condition: 'neigeux', advice: 'Il fait très froid ! Manteau et gants.' },
      { emoji: '🌫️', condition: 'brumeux', advice: 'Visibilité réduite, soyez prudente.' }
    ];

    const saveWeather = () => {
      setWeather(tempWeather);
      setCurrentScreen('home');
      alert('Météo mise à jour ! ✅');
    };

    return (
      <div className="bg-white min-h-screen">
        <Header title="🌤️ Modifier la Météo" onBack={goHome} />
        
        <div className="px-6 space-y-6">
          {/* Ville */}
          <div className="bg-blue-50 rounded-3xl p-6 border-2 border-blue-300">
            <label className="block text-2xl font-bold text-blue-800 mb-4">
              📍 Ma Ville :
            </label>
            <input
              type="text"
              value={tempWeather.city || ''}
              onChange={(e) => setTempWeather({ ...tempWeather, city: e.target.value })}
              className="w-full p-4 border-2 border-blue-200 rounded-xl text-xl focus:border-blue-500 focus:outline-none"
              placeholder="Ex: Paris, Lyon, Marseille..."
            />
          </div>

          {/* Température */}
          <div className="bg-orange-50 rounded-3xl p-6 border-2 border-orange-300">
            <label className="block text-2xl font-bold text-orange-800 mb-4">
              🌡️ Température :
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="-10"
                max="40"
                value={tempWeather.temperature || 20}
                onChange={(e) => setTempWeather({ ...tempWeather, temperature: parseInt(e.target.value) })}
                className="flex-1 h-4"
              />
              <span className="text-3xl font-bold text-orange-800 min-w-[80px]">
                {tempWeather.temperature}°C
              </span>
            </div>
          </div>

          {/* Conditions météo */}
          <div className="bg-green-50 rounded-3xl p-6 border-2 border-green-300">
            <label className="block text-2xl font-bold text-green-800 mb-4">
              🌤️ Temps qu'il fait :
            </label>
            <div className="grid grid-cols-1 gap-3">
              {weatherOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setTempWeather({
                    ...tempWeather,
                    emoji: option.emoji,
                    condition: option.condition,
                    advice: option.advice
                  })}
                  className={`p-4 rounded-2xl border-2 transition-all text-left ${
                    tempWeather.condition === option.condition
                      ? 'bg-green-200 border-green-500 ring-2 ring-green-400'
                      : 'bg-white border-green-200 hover:bg-green-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{option.emoji}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 capitalize">{option.condition}</h3>
                      <p className="text-lg text-gray-600">{option.advice}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Aperçu */}
          <div className="bg-purple-50 rounded-3xl p-6 border-2 border-purple-300">
            <h3 className="text-2xl font-bold text-purple-800 mb-4">👁️ Aperçu :</h3>
            <div className="bg-white rounded-2xl p-4 text-center">
              <div className="text-4xl mb-2">{tempWeather.emoji}</div>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {tempWeather.temperature}°C à {tempWeather.city}
              </div>
              <p className="text-lg text-gray-700 capitalize mb-2">{tempWeather.condition}</p>
              <p className="text-base text-gray-600 bg-blue-50 p-3 rounded-lg">
                💡 {tempWeather.advice}
              </p>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="space-y-4 pb-8">
            <BigButton onClick={saveWeather} color="green">
              ✅ Enregistrer la Météo
            </BigButton>
            <BigButton onClick={goHome} color="white">
              ❌ Annuler
            </BigButton>
          </div>
        </div>
      </div>
    );
  };

  // ÉCRAN DE MODIFICATION CONTACTS
  const EditContactsScreen = () => {
    const addNewContact = () => {
      const name = prompt('Nom du contact :');
      const relation = prompt('Relation (Ex: Fils, Fille, Ami...) :');
      const phone = prompt('Numéro de téléphone :');
      
      if (name && phone) {
        const newContact = {
          id: Date.now(),
          name: name,
          relation: relation || 'Contact',
          phone: phone,
          emoji: relation && relation.toLowerCase().includes('fils') ? '👨' : 
                 relation && relation.toLowerCase().includes('fille') ? '👩' :
                 relation && relation.toLowerCase().includes('médecin') ? '👨‍⚕️' : '👤',
          urgent: relation && (relation.toLowerCase().includes('médecin') || relation.toLowerCase().includes('urgence'))
        };
        setContacts([...contacts, newContact]);
        alert('Contact ajouté ! ✅');
      }
    };

    const editContact = (contact) => {
      const newName = prompt('Nouveau nom :', contact.name);
      const newRelation = prompt('Nouvelle relation :', contact.relation);
      const newPhone = prompt('Nouveau téléphone :', contact.phone);
      
      if (newName !== null) {
        setContacts(contacts.map(c => 
          c.id === contact.id 
            ? {
                ...c, 
                name: newName || contact.name,
                relation: newRelation || contact.relation,
                phone: newPhone || contact.phone
              }
            : c
        ));
        alert('Contact modifié ! ✅');
      }
    };

    const deleteContact = (contactId) => {
      if (window.confirm('Êtes-vous sûre de vouloir supprimer ce contact ?')) {
        setContacts(contacts.filter(c => c.id !== contactId));
        alert('Contact supprimé ! ✅');
      }
    };

    return (
      <div className="bg-white min-h-screen">
        <Header title="📞 Modifier Contacts" onBack={() => setCurrentScreen('contacts')} />
        
        <div className="px-6 space-y-4">
          {/* Bouton ajouter */}
          <BigButton onClick={addNewContact} color="green">
            ➕ Ajouter un nouveau contact
          </BigButton>

          {/* Liste des contacts */}
          <div className="space-y-4">
            {contacts.map(contact => (
              <div
                key={contact.id}
                className={`p-6 rounded-3xl shadow-lg border-2 ${
                  contact.urgent ? 'bg-red-50 border-red-300' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{contact.emoji}</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">{contact.name}</h3>
                    <p className="text-lg text-gray-600">{contact.relation}</p>
                    <p className="text-lg text-blue-600 font-mono">{contact.phone}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => editContact(contact)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 text-sm"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={() => deleteContact(contact.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 text-sm"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ÉCRAN DE MODIFICATION MÉDICAMENTS  
  const EditMedicinesScreen = () => {
    const addNewMedicine = () => {
      const name = prompt('Nom du médicament :');
      const time = prompt('Heure de prise (ex: 08:00) :');
      const color = prompt('Couleur de la pilule :');
      const notes = prompt('Notes (optionnel) :');
      
      if (name && time) {
        const newMedicine = {
          id: Date.now(),
          name: name,
          time: time,
          color: color || 'blanche',
          notes: notes || '',
          taken: false
        };
        setMedicines([...medicines, newMedicine]);
        alert('Médicament ajouté ! ✅');
      }
    };

    const editMedicine = (medicine) => {
      const newName = prompt('Nouveau nom :', medicine.name);
      const newTime = prompt('Nouvelle heure :', medicine.time);
      const newColor = prompt('Nouvelle couleur :', medicine.color);
      const newNotes = prompt('Nouvelles notes :', medicine.notes);
      
      if (newName !== null) {
        setMedicines(medicines.map(m => 
          m.id === medicine.id 
            ? {
                ...m,
                name: newName || medicine.name,
                time: newTime || medicine.time,
                color: newColor || medicine.color,
                notes: newNotes || medicine.notes
              }
            : m
        ));
        alert('Médicament modifié ! ✅');
      }
    };

    const deleteMedicine = (medicineId) => {
      if (window.confirm('Êtes-vous sûre de vouloir supprimer ce médicament ?')) {
        setMedicines(medicines.filter(m => m.id !== medicineId));
        alert('Médicament supprimé ! ✅');
      }
    };

    return (
      <div className="bg-white min-h-screen">
        <Header title="💊 Modifier Médicaments" onBack={() => setCurrentScreen('health')} />
        
        <div className="px-6 space-y-4">
          {/* Bouton ajouter */}
          <BigButton onClick={addNewMedicine} color="green">
            ➕ Ajouter un médicament
          </BigButton>

          {/* Liste des médicaments */}
          <div className="space-y-4">
            {medicines.map(medicine => (
              <div
                key={medicine.id}
                className="p-6 rounded-3xl shadow-lg border-2 bg-yellow-50 border-yellow-300"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">💊</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">{medicine.name}</h3>
                    <p className="text-lg text-blue-600">⏰ {medicine.time}</p>
                    <p className="text-base text-gray-600">Pilule {medicine.color}</p>
                    {medicine.notes && (
                      <p className="text-sm text-gray-500 italic">📝 {medicine.notes}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => editMedicine(medicine)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 text-sm"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={() => deleteMedicine(medicine.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 text-sm"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ÉCRAN DE PARAMÈTRES GÉNÉRAUX
  const SettingsScreen = () => {
    const [tempSettings, setTempSettings] = useState({ ...userSettings });
    
    const saveSettings = () => {
      setUserSettings(tempSettings);
      setCurrentScreen('home');
      alert('Paramètres sauvegardés ! ✅');
    };

    return (
      <div className="bg-white min-h-screen">
        <Header title="⚙️ Mes Paramètres" onBack={goHome} />
        
        <div className="px-6 space-y-6">
          {/* Nom */}
          <div className="bg-purple-50 rounded-3xl p-6 border-2 border-purple-300">
            <label className="block text-2xl font-bold text-purple-800 mb-4">
              👤 Mon Prénom :
            </label>
            <input
              type="text"
              value={tempSettings.name || ''}
              onChange={(e) => setTempSettings({ ...tempSettings, name: e.target.value })}
              className="w-full p-4 border-2 border-purple-200 rounded-xl text-xl focus:border-purple-500 focus:outline-none"
              placeholder="Ex: Marie, Françoise, Jeanne..."
            />
          </div>

          {/* Ville */}
          <div className="bg-blue-50 rounded-3xl p-6 border-2 border-blue-300">
            <label className="block text-2xl font-bold text-blue-800 mb-4">
              🏠 Ma Ville :
            </label>
            <input
              type="text"
              value={tempSettings.city || ''}
              onChange={(e) => setTempSettings({ ...tempSettings, city: e.target.value })}
              className="w-full p-4 border-2 border-blue-200 rounded-xl text-xl focus:border-blue-500 focus:outline-none"
              placeholder="Ex: Paris, Lyon, Marseille..."
            />
          </div>

          {/* Boutons d'action */}
          <div className="space-y-4 pb-8">
            <BigButton onClick={saveSettings} color="green">
              ✅ Enregistrer les Paramètres
            </BigButton>
            <BigButton onClick={goHome} color="white">
              ❌ Annuler
            </BigButton>
          </div>
        </div>
      </div>
    );
  };

  // ÉCRAN D'ACCUEIL
  const HomeScreen = () => (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <Header 
        title={`🏠 Bonjour ${userSettings.name || 'Maman'}`} 
        onEdit={() => setCurrentScreen('settings')} 
      />
      
      <div className="px-6 space-y-4 mb-8">
        {/* Heure et météo */}
        <div className="bg-white rounded-3xl p-6 shadow-lg relative">
          <button
            onClick={() => setCurrentScreen('edit-weather')}
            className="absolute top-4 right-4 p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
          >
            <span className="text-lg">✏️</span>
          </button>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {getCurrentTime()}
            </div>
            {weather && (
              <div>
                <div className="text-3xl mb-2">{weather.emoji} {weather.temperature}°C</div>
                <p className="text-xl text-gray-700">{weather.condition} à {weather.city}</p>
                <p className="text-lg text-gray-600 mt-2 bg-blue-50 p-3 rounded-xl">
                  💡 {weather.advice}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Résumé du jour */}
        <div className="bg-green-50 rounded-3xl p-6 shadow-lg border-2 border-green-200">
          <h2 className="text-2xl font-bold text-green-800 mb-4">📅 Aujourd'hui</h2>
          <div className="space-y-3">
            {events.filter(e => e.date.toDateString() === currentDate.toDateString()).length === 0 ? (
              <p className="text-xl text-green-700">Aucun rendez-vous prévu 😌</p>
            ) : (
              events
                .filter(e => e.date.toDateString() === currentDate.toDateString())
                .map(event => (
                  <div key={event.id} className="flex items-center gap-4 p-3 bg-white rounded-xl">
                    <span className="text-3xl">{event.type === 'medical' ? '🏥' : '👨‍👩‍👧‍👦'}</span>
                    <div className="flex-1">
                      <span className="text-xl font-bold text-blue-600">{event.time}</span>
                      <span className="text-xl ml-3">{event.title}</span>
                    </div>
                    {event.important && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Important
                      </span>
                    )}
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Médicaments */}
        <div className="bg-yellow-50 rounded-3xl p-6 shadow-lg border-2 border-yellow-200 relative">
          <button
            onClick={() => setCurrentScreen('edit-medicines')}
            className="absolute top-4 right-4 p-2 bg-yellow-100 rounded-full hover:bg-yellow-200 transition-colors"
          >
            <span className="text-lg">✏️</span>
          </button>
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">💊 Mes Médicaments</h2>
          <div className="space-y-3">
            {medicines.map(med => (
              <div key={med.id} className={`flex items-center gap-4 p-3 rounded-xl ${med.taken ? 'bg-green-100' : 'bg-white'}`}>
                <span className="text-3xl">{med.taken ? '✅' : '💊'}</span>
                <div className="flex-1">
                  <span className="text-xl font-bold text-blue-600">{med.time}</span>
                  <span className="text-xl ml-3">{med.name}</span>
                  <span className="ml-2 text-sm text-gray-600">(pilule {med.color})</span>
                </div>
                {!med.taken && (
                  <button 
                    className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-600"
                    onClick={() => {
                      setMedicines(medicines.map(m => 
                        m.id === med.id ? { ...m, taken: true } : m
                      ));
                    }}
                  >
                    ✅ Pris
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu principal */}
      <div className="px-6 space-y-4 pb-8">
        <BigButton onClick={() => goToScreen('contacts')} color="blue">
          📞 Téléphone & Famille
        </BigButton>
        
        <BigButton onClick={() => goToScreen('calendar')} color="purple">
          📅 Mon Agenda
        </BigButton>
        
        <BigButton onClick={() => goToScreen('health')} color="green">
          🏥 Ma Santé
        </BigButton>
        
        <BigButton onClick={() => goToScreen('shopping')} color="orange">
          🛒 Liste de Courses
        </BigButton>
        
        <BigButton onClick={() => goToScreen('photos')} color="white">
          📸 Photos Famille
        </BigButton>
        
        <BigButton onClick={() => goToScreen('emergency')} urgent={true}>
          🚨 URGENCE
        </BigButton>
      </div>
    </div>
  );

  // AUTRES ÉCRANS (versions simplifiées)
  const ContactsScreen = () => (
    <div className="bg-white min-h-screen">
      <Header 
        title="📞 Mes Contacts" 
        onBack={goHome} 
        onEdit={() => setCurrentScreen('edit-contacts')} 
      />
      
      <div className="px-6 space-y-4">
        <p className="text-xl text-gray-600 text-center mb-6">
          Appuyez sur un nom pour appeler directement
        </p>
        
        {contacts.map(contact => (
          <div
            key={contact.id}
            className={`p-6 rounded-3xl shadow-lg border-2 ${
              contact.urgent ? 'bg-red-50 border-red-300' : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-center gap-6">
              <span className="text-5xl">{contact.emoji}</span>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800">{contact.name}</h3>
                <p className="text-xl text-gray-600">{contact.relation}</p>
                <p className="text-lg text-blue-600 font-mono">{contact.phone}</p>
              </div>
              <button 
                onClick={() => window.location.href = `tel:${contact.phone.replace(/[.\s]/g, '')}`}
                className={`px-6 py-4 rounded-2xl font-bold text-xl ${
                  contact.urgent 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                📞 Appeler
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const HealthScreen = () => (
    <div className="bg-white min-h-screen">
      <Header 
        title="🏥 Ma Santé" 
        onBack={goHome} 
        onEdit={() => setCurrentScreen('edit-medicines')} 
      />
      
      <div className="px-6 space-y-6">
        <div className="bg-yellow-50 rounded-3xl p-6 border-2 border-yellow-300">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">💊 Mes Médicaments</h2>
          {medicines.map(med => (
            <div key={med.id} className="bg-white rounded-2xl p-4 mb-3 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{med.name}</h3>
                  <p className="text-lg text-gray-600">⏰ {med.time}</p>
                  <p className="text-sm text-gray-500">Pilule {med.color}</p>
                  {med.notes && <p className="text-sm text-gray-400 italic">📝 {med.notes}</p>}
                </div>
                <button 
                  className={`px-6 py-3 rounded-xl text-xl font-bold ${
                    med.taken 
                      ? 'bg-green-500 text-white' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  onClick={() => {
                    setMedicines(medicines.map(m => 
                      m.id === med.id ? { ...m, taken: !m.taken } : m
                    ));
                  }}
                >
                  {med.taken ? '✅ Pris' : '💊 Marquer pris'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-4">
          <BigButton onClick={() => window.location.href = 'tel:15'} urgent={true}>
            🚑 Appeler SAMU (15)
          </BigButton>
        </div>
      </div>
    </div>
  );

  const ShoppingScreen = () => (
    <div className="bg-white min-h-screen">
      <Header title="🛒 Mes Courses" onBack={goHome} />
      <div className="px-6">
        <div className="bg-green-50 rounded-3xl p-6 border-2 border-green-300">
          <h2 className="text-2xl font-bold text-green-800 mb-4">📝 Ma Liste</h2>
          <div className="space-y-3">
            {shoppingList.map(item => (
              <div 
                key={item.id} 
                className={`flex items-center gap-4 p-4 rounded-xl ${
                  item.checked ? 'bg-green-100 border-green-300' : 'bg-white border-gray-200'
                } border-2`}
              >
                <button
                  onClick={() => {
                    setShoppingList(shoppingList.map(i => 
                      i.id === item.id ? { ...i, checked: !i.checked } : i
                    ));
                  }}
                  className={`w-8 h-8 rounded-full border-4 text-2xl flex items-center justify-center ${
                    item.checked 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-gray-400 hover:border-green-500'
                  }`}
                >
                  {item.checked ? '✓' : ''}
                </button>
                <div className="flex-1">
                  <span className={`text-xl font-semibold ${
                    item.checked ? 'line-through text-gray-500' : 'text-gray-800'
                  }`}>
                    {item.item}
                  </span>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            className="w-full mt-6 p-4 bg-blue-500 text-white rounded-2xl text-xl font-bold hover:bg-blue-600"
            onClick={() => {
              const newItem = prompt('Quel article ajouter ?');
              if (newItem) {
                const item = {
                  id: Date.now(),
                  item: newItem,
                  checked: false,
                  category: 'Personnel'
                };
                setShoppingList([...shoppingList, item]);
              }
            }}
          >
            ➕ Ajouter un article
          </button>
        </div>
      </div>
    </div>
  );

  const PhotosScreen = () => (
    <div className="bg-white min-h-screen">
      <Header title="📸 Photos Famille" onBack={goHome} />
      <div className="px-6">
        <div className="text-center text-xl text-gray-600 mb-6">
          Vos plus beaux souvenirs de famille
        </div>
        <BigButton onClick={() => alert('Fonctionnalité bientôt disponible ! 📷')} color="purple">
          📷 Prendre une nouvelle photo
        </BigButton>
      </div>
    </div>
  );

  const EmergencyScreen = () => (
    <div className="bg-red-50 min-h-screen">
      <div className="bg-red-600 text-white p-6 pb-8 rounded-b-3xl shadow-lg mb-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={goHome} 
            className="p-4 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
          >
            <span className="text-3xl">←</span>
          </button>
          <h1 className="text-3xl font-bold">🚨 URGENCE</h1>
          <div className="w-16"></div>
        </div>
      </div>
      <div className="px-6 space-y-6">
        <div className="text-center">
          <div className="text-8xl mb-4">🚨</div>
          <p className="text-2xl font-bold text-red-800 mb-6">
            Choisissez le type d'aide dont vous avez besoin
          </p>
        </div>
        <div className="space-y-4">
          <button 
            onClick={() => window.location.href = 'tel:15'}
            className="w-full p-8 bg-red-500 text-white rounded-3xl text-2xl font-bold hover:bg-red-600 shadow-lg"
          >
            🚑 SAMU - Urgence Médicale (15)
          </button>
          <button 
            onClick={() => window.location.href = 'tel:18'}
            className="w-full p-8 bg-orange-500 text-white rounded-3xl text-2xl font-bold hover:bg-orange-600 shadow-lg"
          >
            🚒 Pompiers - Accident/Incendie (18)
          </button>
          <button 
            onClick={() => window.location.href = 'tel:17'}
            className="w-full p-8 bg-blue-500 text-white rounded-3xl text-2xl font-bold hover:bg-blue-600 shadow-lg"
          >
            👮 Police - Sécurité (17)
          </button>
        </div>
      </div>
    </div>
  );

  const CalendarScreen = () => (
    <div className="bg-white min-h-screen">
      <Header title="📅 Mon Agenda" onBack={goHome} />
      <div className="px-6">
        <div className="bg-blue-50 rounded-3xl p-6 border-2 border-blue-300 mb-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">📋 Mes Rendez-vous</h2>
          <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="bg-white rounded-2xl p-4 shadow">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">
                    {event.type === 'medical' ? '🏥' : '👨‍👩‍👧‍👦'}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{event.title}</h3>
                    <p className="text-lg text-blue-600">{formatDate(event.date)}</p>
                    <p className="text-lg font-bold text-gray-800">⏰ {event.time}</p>
                  </div>
                  {event.important && (
                    <span className="bg-red-500 text-white px-3 py-2 rounded-full text-sm font-bold">
                      Important
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <BigButton 
            onClick={() => {
              const title = prompt('Quel rendez-vous ajouter ?');
              const time = prompt('À quelle heure ? (ex: 14:30)');
              if (title && time) {
                const newEvent = {
                  id: Date.now(),
                  title: title,
                  time: time,
                  date: new Date(),
                  type: 'other',
                  important: false
                };
                setEvents([...events, newEvent]);
                alert('Rendez-vous ajouté ! ✅');
              }
            }} 
            color="green"
          >
            ➕ Ajouter un rendez-vous
          </BigButton>
        </div>
      </div>
    </div>
  );

  // Rendu principal avec tous les écrans
  return (
    <div className="font-sans max-w-md mx-auto bg-gray-100 min-h-screen">
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'contacts' && <ContactsScreen />}
      {currentScreen === 'health' && <HealthScreen />}
      {currentScreen === 'shopping' && <ShoppingScreen />}
      {currentScreen === 'photos' && <PhotosScreen />}
      {currentScreen === 'emergency' && <EmergencyScreen />}
      {currentScreen === 'calendar' && <CalendarScreen />}
      {currentScreen === 'edit-weather' && <EditWeatherScreen />}
      {currentScreen === 'edit-contacts' && <EditContactsScreen />}
      {currentScreen === 'edit-medicines' && <EditMedicinesScreen />}
      {currentScreen === 'settings' && <SettingsScreen />}
    </div>
  );
};

export default AppCompleteMaman;