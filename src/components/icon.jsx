// Icon.jsx
import { useRef } from 'react';

export default function Icon({ icon, isOwner, onUpdatePosition, iconPosition, image }) {
  const iconRef = useRef(null);

  const handleDragStart = (e) => {
    console.log(isOwner);
    if (!isOwner) return; // только владелец может двигать

    e.preventDefault(); // предотвращает выделение текста и т.д.

    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = iconRef.current.offsetLeft;
    const startTop = iconRef.current.offsetTop;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      const newLeft = startLeft + dx;
      const newTop = startTop + dy;

      // Ограничиваем границы поля
      const containerRect = iconRef.current.closest('.game-field').getBoundingClientRect();
      const maxX = containerRect.width - iconRef.current.offsetWidth;
      const maxY = containerRect.height - iconRef.current.offsetHeight;

      iconRef.current.style.left = `${Math.max(0, Math.min(newLeft, maxX))}px`;
      iconRef.current.style.top = `${Math.max(0, Math.min(newTop, maxY))}px`;
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      // Переводим пиксели в проценты от размера поля
      const rect = iconRef.current.getBoundingClientRect();
      const containerRect = iconRef.current.closest('.game-field').getBoundingClientRect();

      const xPercent = ((rect.left - containerRect.left) / containerRect.width) * 100;
      const yPercent = ((rect.top - containerRect.top) / containerRect.height) * 100;

      // Обновляем в Supabase
      onUpdatePosition(icon.id, {
        x: parseFloat(xPercent.toFixed(2)),
        y: parseFloat(yPercent.toFixed(2)),
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={iconRef}
      style={{
        position: 'absolute',
        left: `${iconPosition[0]}%`,
        top: `${iconPosition[1]}%`,
        zIndex:'10',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        cursor: isOwner ? 'move' : 'default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        userSelect: 'none',
        transition: 'transform 0.1s ease',
      }}
      onMouseDown={handleDragStart}
      onDragStart={(e) => e.preventDefault()} 
    >
    </div>
  );
}