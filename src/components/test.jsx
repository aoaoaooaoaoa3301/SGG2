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
    
    
        <Card className="w-[400px]">
          
          <Card.Header>
            <Card.Title>Become an Acme Creator!</Card.Title>
            <Card.Description>
              Visit the Acme Creator Hub to sign up today and start earning credits from your fans and
              followers.
            </Card.Description>
          </Card.Header>
          <Card.Footer>
            <Link
              aria-label="Go to Acme Creator Hub (opens in new tab)"
              href="https://heroui.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              Creator Hub
              <Link.Icon aria-hidden="true" />
            </Link>
          </Card.Footer>
        </Card>
      );
}