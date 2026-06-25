// GameField.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function GameField() {
  const [icons, setIcons] = useState([]);
  const currentLogin = localStorage.getItem('auth');

  // Загрузка всех иконок
  const loadIcons = async () => {
    const { data, error } = await supabase
      .from('IconsOnMap')
      .select('*');

    if (error) {
      console.error('Ошибка загрузки иконок:', error);
    } else {
      setIcons(data);
    }
  };

  // Обновление позиции иконки в Supabase
  const updateIconPosition = async (id, position) => {
    const { error } = await supabase
      .from('IconsOnMap')
      .update({ x: position.x, y: position.y })
      .eq('login', currentLogin); // ← защита!

    if (error) {
      console.error('Ошибка обновления позиции:', error);
    } else {
      // Опционально: обновить локальное состояние
      setIcons(prev =>
        prev.map(icon =>
          icon.id === id ? { ...icon, x: position.x, y: position.y } : icon
        )
      );
    }
  };

  // При монтировании — загрузить иконки
  useEffect(() => {
    loadIcons();
  }, []);


  return (
    <div
      className="game-field"
      style={{
        position: 'relative',
        width: '100%',
        height: '600px',
        backgroundColor: '#f5f5f5',
        border: '2px solid #ddd',
        overflow: 'hidden',
        touchAction: 'none', // для мобильных устройств
      }}
    >
      {icons.map((icon) => (
        <Icon
          key={icon.id}
          iconPosition={[icon.x,icon.y]}
          icon={icon.image}
          image={icon.image}
          isOwner={icon.login === currentLogin}
          onUpdatePosition={updateIconPosition}
        />
      ))}
    </div>
  );
}