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

  // Données par défaut
  useEffect(() => {
    // Événements du jour
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    setEvents([
      { id: 1, title: 'Dr. Martin', time: '14:30', date: today, type: 'medical', important: true },
      { id: 2, 'title': 'Appel Marie', time: '16:00', date: tomorrow, type: 'family', important: false }
    ]);

    // Médicaments
    setMedicines([
      { id: 1, name: 'Vitamine D', time: '08:00', taken: true, color: 'yellow' },
      { id: 2, name: 'Tension', time: '14:30', taken: false, color: 'white' },
      { id: 3, name: 'Calcium', time: '20:00', taken: false, color: 'white' }
    ]);

    // Contacts famille
    setContacts([
      { id: 1, name: 'Pierre', relation: 'Fils', phone: '06.12.34.56.78', emoji: '👨', urgent: false },
      { id: 2, name: 'Marie', relation: 'Fille', phone: '06.87.65.43.21', emoji: '👩', urgent: false },
      { id: 3, name: 'Dr. Martin', relation: 'Médecin', phone: '01.23.45.67.89', emoji: '👨‍⚕️', urgent: true },
      { id: 4, name: 'Urgences', relation: 'SAMU', phone: '15', emoji: '🚑', urgent: true }
    ]);

    // Liste de courses
    setShoppingList([
      { id: 1, item: 'Pain', checked: false, category: 'Boulangerie' },
      { id: 2, item: 'Lait', checked: false, category: 'Frais' },
      { id: 3, item: 'Pommes', checked: false, category: 'Fruits' }
    ]);

    // Météo simulée
    setWeather({
      temperature: 22,
      condition: 'ensoleillé',
      emoji: '☀️',
      advice: 'Parfait pour sortir ! Une veste légère suffira.'
    });
  }, []);

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
        w-full p-6 rounded-3xl text-2xl font-bold transition-all shadow-lg
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
  const Header = ({ title, onBack = null }) => (
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
        {onBack && <div className="w-16"></div>}
      </div>
    </div>
  );

  // ÉCRAN D'ACCUEIL
  const HomeScreen = () => (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <Header title="🏠 Accueil" />
      
      {/* Informations du jour */}
      <div className="px-6 space-y-4 mb-8">
        {/* Heure et météo */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {getCurrentTime()}
            </div>
            {weather && (
              <div>
                <div className="text-3xl mb-2">{weather.emoji} {weather.temperature}°C</div>
                <p className="text-xl text-gray-700">{weather.condition}</p>
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
        <div className="bg-yellow-50 rounded-3xl p-6 shadow-lg border-2 border-yellow-200">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">💊 Médicaments</h2>
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
                  <button className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-600">
                    Pris
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
        
        {/* Bouton d'urgence toujours visible */}
        <BigButton onClick={() => goToScreen('emergency')} urgent={true}>
          🚨 URGENCE
        </BigButton>
      </div>
    </div>
  );

  // ÉCRAN CONTACTS
  const ContactsScreen = () => (
    <div className="bg-white min-h-screen">
      <Header title="📞 Mes Contacts" onBack={goHome} />
      
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
        
        {/* Messages rapides */}
        <div className="bg-purple-50 rounded-3xl p-6 border-2 border-purple-200 mt-8">
          <h3 className="text-2xl font-bold text-purple-800 mb-4">💬 Messages Rapides</h3>
          <div className="space-y-3">
            <button className="w-full p-4 bg-white rounded-xl text-xl text-left hover:bg-purple-50 border border-purple-200">
              "Comment ça va ?"
            </button>
            <button className="w-full p-4 bg-white rounded-xl text-xl text-left hover:bg-purple-50 border border-purple-200">
              "Peux-tu m'appeler ?"
            </button>
            <button className="w-full p-4 bg-white rounded-xl text-xl text-left hover:bg-purple-50 border border-purple-200">
              "Je pense à vous ❤️"
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ÉCRAN SANTÉ
  const HealthScreen = () => (
    <div className="bg-white min-h-screen">
      <Header title="🏥 Ma Santé" onBack={goHome} />
      
      <div className="px-6 space-y-6">
        {/* Médicaments détaillés */}
        <div className="bg-yellow-50 rounded-3xl p-6 border-2 border-yellow-300">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">💊 Mes Médicaments</h2>
          {medicines.map(med => (
            <div key={med.id} className="bg-white rounded-2xl p-4 mb-3 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{med.name}</h3>
                  <p className="text-lg text-gray-600">⏰ {med.time}</p>
                  <p className="text-sm text-gray-500">Pilule {med.color}</p>
                </div>
                <button 
                  className={`px-6 py-3 rounded-xl text-xl font-bold ${
                    med.taken 
                      ? 'bg-green-500 text-white' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  onClick={() => {
                    setMedicines(medicines.map(m => 
                      m.id === med.id ? {...m, taken: !m.taken} : m
                    ));
                  }}
                >
                  {med.taken ? '✅ Pris' : '💊 Marquer pris'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Prochains rendez-vous */}
        <div className="bg-blue-50 rounded-3xl p-6 border-2 border-blue-300">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">🏥 Mes Rendez-vous</h2>
          {events.filter(e => e.type === 'medical').map(event => (
            <div key={event.id} className="bg-white rounded-2xl p-4 mb-3 shadow">
              <div className="flex items-center gap-4">
                <span className="text-3xl">🏥</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{event.title}</h3>
                  <p className="text-lg text-blue-600">
                    {formatDate(event.date)} à {event.time}
                  </p>
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
        
        {/* Actions rapides */}
        <div className="space-y-4">
          <BigButton onClick={() => window.location.href = 'tel:15'} urgent={true}>
            🚑 Appeler SAMU (15)
          </BigButton>
          <BigButton onClick={() => window.location.href = 'tel:0123456789'} color="blue">
            👨‍⚕️ Appeler Dr. Martin
          </BigButton>
        </div>
      </div>
    </div>
  );

  // ÉCRAN LISTE COURSES
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
                  item.checked ? 'bg-green-100' : 'bg-white'
                } border-2 ${item.checked ? 'border-green-300' : 'border-gray-200'}`}
              >
                <button
                  onClick={() => {
                    setShoppingList(shoppingList.map(i => 
                      i.id === item.id ? {...i, checked: !i.checked} : i
                    ));
                  }}
                  className={`w-8 h-8 rounded-full border-4 text-2xl ${
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
          
          {/* Bouton ajouter */}
          <button className="w-full mt-6 p-4 bg-blue-500 text-white rounded-2xl text-xl font-bold hover:bg-blue-600">
            ➕ Ajouter un article
          </button>
        </div>
        
        {/* Articles suggérés */}
        <div className="bg-orange-50 rounded-3xl p-6 border-2 border-orange-300 mt-6">
          <h3 className="text-xl font-bold text-orange-800 mb-4">💡 Suggestions</h3>
          <div className="grid grid-cols-2 gap-3">
            {['Œufs', 'Beurre', 'Yaourts', 'Bananes', 'Poulet', 'Pâtes'].map(item => (
              <button 
                key={item}
                className="p-3 bg-white rounded-xl border border-orange-200 hover:bg-orange-50 text-lg"
                onClick={() => {
                  const newItem = {
                    id: Date.now(),
                    item: item,
                    checked: false,
                    category: 'Suggéré'
                  };
                  setShoppingList([...shoppingList, newItem]);
                }}
              >
                ➕ {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ÉCRAN PHOTOS
  const PhotosScreen = () => (
    <div className="bg-white min-h-screen">
      <Header title="📸 Photos Famille" onBack={goHome} />
      
      <div className="px-6">
        <div className="text-center text-xl text-gray-600 mb-6">
          Vos plus beaux souvenirs de famille
        </div>
        
        {/* Albums */}
        <div className="space-y-4">
          <div className="bg-pink-50 rounded-3xl p-6 border-2 border-pink-200">
            <h3 className="text-2xl font-bold text-pink-800 mb-4">👶 Petits-enfants</h3>
            <div className="grid grid-cols-2 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-white rounded-2xl p-4 text-center">
                  <div className="text-6xl mb-2">👶</div>
                  <p className="text-lg font-semibold">Photo {i}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-3xl p-6 border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">👨‍👩‍👧‍👦 Famille</h3>
            <div className="grid grid-cols-2 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-white rounded-2xl p-4 text-center">
                  <div className="text-6xl mb-2">👨‍👩‍👧‍👦</div>
                  <p className="text-lg font-semibold">Souvenir {i}</p>
                </div>
              ))}
            </div>
          </div>
          
          <BigButton onClick={() => alert('Fonctionnalité bientôt disponible')} color="purple">
            📷 Prendre une nouvelle photo
          </BigButton>
        </div>
      </div>
    </div>
  );

  // ÉCRAN URGENCE
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
        
        {/* Numéros d'urgence */}
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
        
        {/* Contacts famille d'urgence */}
        <div className="bg-white rounded-3xl p-6 border-4 border-red-300">
          <h3 className="text-2xl font-bold text-red-800 mb-4 text-center">
            📞 Appeler la Famille
          </h3>
          <div className="space-y-3">
            {contacts.filter(c => !c.urgent || c.relation === 'Médecin').slice(0, 3).map(contact => (
              <button
                key={contact.id}
                onClick={() => window.location.href = `tel:${contact.phone.replace(/[.\s]/g, '')}`}
                className="w-full p-4 bg-blue-500 text-white rounded-2xl text-xl font-bold hover:bg-blue-600 flex items-center gap-4"
              >
                <span className="text-2xl">{contact.emoji}</span>
                <span>Appeler {contact.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Message d'urgence automatique */}
        <div className="bg-yellow-50 rounded-3xl p-6 border-2 border-yellow-300">
          <h3 className="text-xl font-bold text-yellow-800 mb-3">
            📱 Message d'urgence automatique
          </h3>
          <p className="text-lg text-yellow-700 mb-4">
            Envoie votre position et "J'ai besoin d'aide" à toute la famille
          </p>
          <button className="w-full p-4 bg-yellow-500 text-white rounded-2xl text-xl font-bold hover:bg-yellow-600">
            📧 Envoyer alerte famille
          </button>
        </div>
      </div>
    </div>
  );

  // ÉCRAN AGENDA SIMPLE
  const CalendarScreen = () => (
    <div className="bg-white min-h-screen">
      <Header title="📅 Mon Agenda" onBack={goHome} />
      
      <div className="px-6">
        {/* Événements à venir */}
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
                    <p className="text-lg text-blue-600">
                      {formatDate(event.date)}
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      ⏰ {event.time}
                    </p>
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
        
        {/* Actions rapides */}
        <div className="space-y-4">
          <BigButton onClick={() => alert('Fonctionnalité bientôt disponible')} color="green">
            ➕ Ajouter un rendez-vous
          </BigButton>
          <BigButton onClick={() => alert('Fonctionnalité bientôt disponible')} color="purple">
            📞 Appeler pour prendre RDV
          </BigButton>
        </div>
      </div>
    </div>
  );

  // Rendu principal
  return (
    <div className="font-sans max-w-md mx-auto bg-gray-100 min-h-screen">
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'contacts' && <ContactsScreen />}
      {currentScreen === 'health' && <HealthScreen />}
      {currentScreen === 'shopping' && <ShoppingScreen />}
      {currentScreen === 'photos' && <PhotosScreen />}
      {currentScreen === 'emergency' && <EmergencyScreen />}
      {currentScreen === 'calendar' && <CalendarScreen />}
    </div>
  );
};

export default AppCompleteMaman;