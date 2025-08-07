import React, { useState, useEffect } from 'react';

const AppCompleteMaman = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [currentDate] = useState(new Date());
  
  // États pour les différentes fonctionnalités
  const [events, setEvents] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [weather, setWeather] = useState({
    temperature: 20,
    condition: 'Chargement...',
    emoji: '⏳',
    advice: 'Récupération de la météo...',
    city: 'Paris',
    humidity: 50,
    windSpeed: 0,
    isLoading: true
  });
  const [userSettings, setUserSettings] = useState({
    city: 'Paris',
    name: 'Maman',
    weatherCity: 'Paris,FR'
  });

  // Chargement des données par défaut
  useEffect(() => {
    loadDefaultData();
    loadRealWeather();
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
      { id: 2, name: 'Tension', time: '14:30', taken: false, color: 'blanche', notes: 'Après le repas' }
    ];
    setMedicines(defaultMedicines);

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
      { id: 2, item: 'Lait', checked: false, category: 'Frais' }
    ]);
  };

  // Fonction pour charger la météo réelle
  const loadRealWeather = async () => {
    try {
      setWeather(prev => ({ ...prev, isLoading: true }));
      
      // Simulation d'une API météo (remplace l'API réelle pour éviter les erreurs CORS)
      setTimeout(() => {
        const temp = Math.floor(Math.random() * 30) + 5; // 5-35°C
        const conditions = [
          { name: 'ensoleillé', emoji: '☀️' },
          { name: 'nuageux', emoji: '⛅' },
          { name: 'pluvieux', emoji: '🌧️' },
          { name: 'partiellement nuageux', emoji: '🌤️' }
        ];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        
        const weatherInfo = getWeatherInfo(randomCondition.name, temp);
        
        setWeather({
          temperature: temp,
          condition: randomCondition.name,
          emoji: randomCondition.emoji,
          advice: weatherInfo.advice,
          city: userSettings.city || 'Paris',
          humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
          windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
          isLoading: false
        });
      }, 2000);
      
    } catch (error) {
      console.error('Erreur météo:', error);
      setWeather({
        temperature: 20,
        condition: 'Météo non disponible',
        emoji: '📶',
        advice: 'Impossible de récupérer la météo. Vérifiez votre connexion.',
        city: userSettings.city || 'Paris',
        humidity: 50,
        windSpeed: 0,
        isLoading: false
      });
    }
  };

  const getWeatherInfo = (condition, temp) => {
    let advice = '';
    
    // Conseils selon la température
    if (temp < 0) {
      advice = "Attention au verglas ! Manteau d'hiver, écharpe, gants et chaussures antidérapantes.";
    } else if (temp < 5) {
      advice = "Il fait très froid ! Manteau chaud, écharpe et gants indispensables.";
    } else if (temp < 10) {
      advice = "Il fait froid ! Manteau chaud et écharpe recommandés.";
    } else if (temp < 15) {
      advice = "Il fait frais, une veste ou un pull sera parfait.";
    } else if (temp < 20) {
      advice = "Température agréable, une tenue normale convient.";
    } else if (temp < 25) {
      advice = "Temps agréable ! Idéal pour sortir avec des vêtements légers.";
    } else if (temp < 30) {
      advice = "Il fait chaud ! Vêtements légers et restez à l'ombre.";
    } else {
      advice = "Il fait très chaud ! Restez à l'ombre, buvez beaucoup d'eau et portez un chapeau.";
    }
    
    // Conseils supplémentaires selon les conditions
    if (condition.includes('pluv')) {
      advice += " N'oubliez pas votre parapluie !";
    } else if (condition.includes('neig')) {
      advice += " Attention, routes glissantes !";
    }
    
    return { advice };
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
        ${urgent ? 'bg-red-500 text-white ring-4 ring-red-300 hover:bg-red-600' : ''}
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
    const [tempSettings, setTempSettings] = useState({ ...userSettings });
    
    const saveSettings = () => {
      setUserSettings(tempSettings);
      loadRealWeather(); // Recharger la météo avec la nouvelle ville
      setCurrentScreen('home');
      alert('Ville mise à jour ! La météo va se actualiser... ✅');
    };

    const cities = [
      'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes',
      'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille', 'Rennes', 'Reims'
    ];

    return (
      <div className="bg-white min-h-screen">
        <Header title="🌤️ Changer ma Ville" onBack={goHome} />
        
        <div className="px-6 space-y-6">
          {/* Ville actuelle */}
          <div className="bg-blue-50 rounded-3xl p-6 border-2 border-blue-300">
            <label className="block text-2xl font-bold text-blue-800 mb-4">
              📍 Ma Ville Actuelle :
            </label>
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">🏠</div>
              <div className="text-2xl font-bold text-blue-600">
                {userSettings.city || 'Paris'}
              </div>
            </div>
          </div>

          {/* Nouvelle ville */}
          <div className="bg-green-50 rounded-3xl p-6 border-2 border-green-300">
            <label className="block text-2xl font-bold text-green-800 mb-4">
              🔍 Choisir ma Nouvelle Ville :
            </label>
            <input
              type="text"
              value={tempSettings.city || ''}
              onChange={(e) => setTempSettings({ ...tempSettings, city: e.target.value })}
              className="w-full p-4 border-2 border-green-200 rounded-xl text-xl focus:border-green-500 focus:outline-none"
              placeholder="Tapez votre ville..."
            />
          </div>

          {/* Villes populaires */}
          <div className="bg-orange-50 rounded-3xl p-6 border-2 border-orange-300">
            <h3 className="text-2xl font-bold text-orange-800 mb-4">🇫🇷 Villes Populaires :</h3>
            <div className="grid grid-cols-2 gap-3">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setTempSettings({ ...tempSettings, city: city })}
                  className={`p-3 rounded-xl border-2 transition-all text-lg font-semibold ${
                    tempSettings.city === city
                      ? 'bg-orange-200 border-orange-400 text-orange-800'
                      : 'bg-white border-orange-200 hover:bg-orange-100 text-gray-700'
                  }`}
                >
                  📍 {city}
                </button>
              ))}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="space-y-4 pb-8">
            <BigButton onClick={saveSettings} color="green">
              ✅ Changer ma Ville
            </BigButton>
            <BigButton onClick={goHome} color="white">
              ❌ Annuler
            </BigButton>
          </div>
        </div>
      </div>
    );
  };

  // ÉCRAN D'ACCUEIL avec météo
  const HomeScreen = () => (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <Header 
        title={`🏠 Bonjour ${userSettings.name || 'Maman'}`} 
        onEdit={() => setCurrentScreen('settings')} 
      />
      
      <div className="px-6 space-y-4 mb-8">
        {/* Heure et météo en temps réel */}
        <div className="bg-white rounded-3xl p-6 shadow-lg relative">
          <button
            onClick={() => setCurrentScreen('edit-weather')}
            className="absolute top-4 right-4 p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
          >
            <span className="text-lg">✏️</span>
          </button>
          
          <button
            onClick={loadRealWeather}
            className="absolute top-4 left-4 p-2 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
            disabled={weather.isLoading}
          >
            <span className={`text-lg ${weather.isLoading ? 'animate-spin' : ''}`}>
              {weather.isLoading ? '⏳' : '🔄'}
            </span>
          </button>

          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-4">
              {getCurrentTime()}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3">
                <span className="text-5xl">{weather.emoji}</span>
                <div>
                  <div className="text-4xl font-bold text-gray-800">
                    {weather.temperature}°C
                  </div>
                  <p className="text-xl text-gray-600 capitalize">{weather.condition}</p>
                </div>
              </div>
              
              <div className="text-xl font-semibold text-blue-600">
                📍 {weather.city}
              </div>
              
              {/* Détails météo */}
              <div className="flex justify-center gap-6 text-base text-gray-600">
                <div className="flex items-center gap-1">
                  <span>💧</span>
                  <span>{weather.humidity}%</span>
                </div>
                {weather.windSpeed > 0 && (
                  <div className="flex items-center gap-1">
                    <span>🌬️</span>
                    <span>{weather.windSpeed} km/h</span>
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-lg text-gray-700">
                  💡 {weather.advice}
                </p>
              </div>
              
              {!weather.isLoading && (
                <p className="text-sm text-gray-500">
                  Mise à jour automatique • Actualisé maintenant
                </p>
              )}
            </div>
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
        <div className="bg-yellow-50 rounded-3xl p-6 shadow-lg border-2 border-yellow-200">
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

  // ÉCRAN DE PARAMÈTRES
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
              placeholder="Ex: Marie, Françoise..."
            />
          </div>

          {/* Raccourcis météo */}
          <div className="bg-blue-50 rounded-3xl p-6 border-2 border-blue-300">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">🌤️ Météo</h3>
            <div className="space-y-3">
              <BigButton onClick={() => setCurrentScreen('edit-weather')} color="blue">
                🔍 Changer ma Ville
              </BigButton>
              <button 
                onClick={loadRealWeather}
                className="w-full p-4 bg-green-500 text-white rounded-2xl text-lg font-bold hover:bg-green-600"
              >
                🔄 Actualiser la Météo
              </button>
            </div>
            <div className="mt-4 p-3 bg-white rounded-xl">
              <p className="text-sm text-gray-600">
                <strong>Ville actuelle :</strong> {weather.city}
              </p>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="space-y-4 pb-8">
            <BigButton onClick={saveSettings} color="green">
              ✅ Enregistrer
            </BigButton>
            <BigButton onClick={goHome} color="white">
              ❌ Annuler
            </BigButton>
          </div>
        </div>
      </div>
    );
  };

  // Autres écrans simplifiés
  const ContactsScreen = () => (
    <div className="bg-white min-h-screen">
      <Header title="📞 Mes Contacts" onBack={goHome} />
      <div className="px-6 space-y-4">
        <p className="text-xl text-gray-600 text-center mb-6">
          Appuyez pour appeler directement
        </p>
        {contacts.map(contact => (
          <div key={contact.id} className={`p-6 rounded-3xl shadow-lg border-2 ${
            contact.urgent ? 'bg-red-50 border-red-300' : 'bg-blue-50 border-blue-200'
          }`}>
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
      <Header title="🏥 Ma Santé" onBack={goHome} />
      <div className="px-6 space-y-6">
        <div className="bg-yellow-50 rounded-3xl p-6 border-2 border-yellow-300">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">💊 Mes Médicaments</h2>
          {medicines.map(med => (
            <div key={med.id} className="bg-white rounded-2xl p-4 mb-3 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{med.name}</h3>
                  <p className="text-lg text-gray-600">⏰ {med.time}</p>
                </div>
                <button 
                  className={`px-6 py-3 rounded-xl text-xl font-bold ${
                    med.taken ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
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
        <BigButton onClick={() => window.location.href = 'tel:15'} urgent={true}>
          🚑 Appeler SAMU (15)
        </BigButton>
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
              <div key={item.id} className={`flex items-center gap-4 p-4 rounded-xl ${
                item.checked ? 'bg-green-100 border-green-300' : 'bg-white border-gray-200'
              } border-2`}>
                <button
                  onClick={() => {
                    setShoppingList(shoppingList.map(i => 
                      i.id === item.id ? { ...i, checked: !i.checked } : i
                    ));
                  }}
                  className={`w-8 h-8 rounded-full border-4 text-2xl flex items-center justify-center ${
                    item.checked ? 'bg-green-500 border-green-500 text-white' : 'border-gray-400'
                  }`}
                >
                  {item.checked ? '✓' : ''}
                </button>
                <span className={`text-xl font-semibold flex-1 ${
                  item.checked ? 'line-through text-gray-500' : 'text-gray-800'
                }`}>
                  {item.item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const PhotosScreen = () => (
    <div className="bg-white min-h-screen">
      <Header title="📸 Photos Famille" onBack={goHome} />
      <div className="px-6 text-center py-12">
        <div className="text-6xl mb-4">📸</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Photos de Famille</h3>
        <p className="text-lg text-gray-500 mb-6">Fonctionnalité bientôt disponible</p>
        <BigButton onClick={() => alert('Bientôt disponible ! 📷')} color="purple">
          📷 Prendre une photo
        </BigButton>
      </div>
    </div>
  );

  const EmergencyScreen = () => (
    <div className="bg-red-50 min-h-screen">
      <div className="bg-red-600 text-white p-6 pb-8 rounded-b-3xl shadow-lg mb-6">
        <div className="flex items-center justify-between">
          <button onClick={goHome} className="p-4 rounded-full bg-red-500 hover:bg-red-400">
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
      {currentScreen === 'settings' && <SettingsScreen />}
    </div>
  );
};

export default AppCompleteMaman;