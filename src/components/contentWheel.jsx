import React, { useState, useEffect, useRef } from 'react';
import { Dice6, Clock, Trophy, Copy, X } from 'lucide-react';
// Импортируем массив, который делает твой Python-скрипт (без хардкода внутри компонента)
import { gamesData } from '../games_export'; 

const SECTOR_COLORS = [
  "#c9b3e3", // розовато-сиреневый
  "#b8a3d9", 
  "#a793cf", 
  "#9683c5", 
  "#8573bb", 
  "#7463b1"  // с синим подтоном
];
const CATEGORIES = ["All Games", "💎 Hidden Gem", "👑 Classic", "🔥 Hardcore", "📖 Cinematic", "⚡ Fast-paced", "🎯 Tryhard", "🎲 Chaos", "🧠 Brain"];

export default function GameRoulette() {
    const [filter, setFilter] = useState("All Games");
    const [duration, setDuration] = useState(5);
    const [wheelGames, setWheelGames] = useState([]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [winner, setWinner] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentAngle, setCurrentAngle] = useState(0);

    const canvasRef = useRef(null);

    // Функция генерации случайного набора игр на основе фильтра
    const generateWheelGames = (currentFilter) => {
        const filtered = currentFilter === "All Games" 
            ? gamesData 
            : gamesData.filter(g => g.category === currentFilter);
        
        if (filtered.length === 0) {
            return [{ name: "No games found!", tags: [], timeToBeat: "N/A", dices: "0", category: "None", appId: "0" }];
        }

        // Перемешиваем и берём до 12 случайных игр
        const shuffled = [...filtered].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(12, shuffled.length));
    };

    // Первичная инициализация и обновление при смене фильтра руками
    useEffect(() => {
        setWheelGames(generateWheelGames(filter));
    }, [filter]);

    // Отрисовка колеса на Canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || wheelGames.length === 0) return;
        const ctx = canvas.getContext('2d');
        const size = 500;
        ctx.clearRect(0, 0, size, size);

        const numSectors = wheelGames.length;
        const arc = (2 * Math.PI) / numSectors;
        const center = size / 2;
        const radius = size / 2 - 10;

        ctx.save();
        ctx.translate(center, center);
        ctx.rotate((currentAngle * Math.PI) / 180);

        wheelGames.forEach((game, i) => {
            const angle = i * arc;
            
            ctx.beginPath();
            ctx.fillStyle = SECTOR_COLORS[i % SECTOR_COLORS.length];
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, angle, angle + arc);
            ctx.lineTo(0, 0);
            ctx.fill();
            ctx.strokeStyle = "rgb(21, 21, 39)";
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.save();
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 14px Arial";
            ctx.rotate(angle + arc / 2);
            ctx.textAlign = "right";
            const displayName = game.name && game.name.length > 15 ? game.name.substring(0, 15) + "..." : (game.name || "");
            ctx.fillText(displayName, radius - 30, 5);
            ctx.restore();
        });

        ctx.restore();

        ctx.beginPath();
        ctx.arc(center, center, 15, 0, 2 * Math.PI);
        ctx.fillStyle = "rgb(83, 0, 190)";
        ctx.strokeStyle = "rgb(21, 21, 39)";
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
    }, [wheelGames, currentAngle]);

    const handleSpin = () => {
        if (isSpinning) return;

        // Фикс: Генерируем НОВЫЙ пул игр прямо в момент нажатия на SPIN
        const freshGames = generateWheelGames(filter);
        if (freshGames[0]?.name === "No games found!") return;
        
        setWheelGames(freshGames);
        setIsSpinning(true);
        setWinner(null);

        const spinDuration = Math.max(0.5, duration) * 1000;
        const startDegrees = currentAngle % 360;
        const extraDegrees = 1800 + Math.random() * 360; // Минимум 5 полных оборотов
        const targetDegrees = startDegrees + extraDegrees;

        const startTime = performance.now();

        const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / spinDuration, 1);
            
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const newAngle = startDegrees + (targetDegrees - startDegrees) * easeOut;
            
            setCurrentAngle(newAngle);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setIsSpinning(false);
                
                // Рассчитываем победителя по актуальному новому пулу игр
                const finalAngle = (360 - (newAngle % 360)) % 360;
                const sectorAngle = 360 / freshGames.length;
                const winningIndex = Math.floor(finalAngle / sectorAngle) % freshGames.length;
                
                setWinner(freshGames[winningIndex]);
                setShowModal(true);
            }
        };

        requestAnimationFrame(animate);
    };

    return (
        
        <div className='styleDiv'>
            <h1>Колесо Игр</h1>
            <div style={styles.container}>
                <div style={styles.leftPane}>
                    <div style={styles.canvasContainer}>
                        <canvas ref={canvasRef} width={500} height={500} style={styles.canvas} />
                        <div style={styles.pointer}></div>
                    </div>
                </div>

                <div style={styles.rightPane}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>ВЫБОР КОЛЛЕКЦИИ:</label>
                        <select 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)}
                            disabled={isSpinning}
                            style={styles.select}
                        >
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>СКОРОСТЬ СПИНА (СЕКУНД):</label>
                        <input 
                            type="number" 
                            value={duration} 
                            onChange={(e) => setDuration(parseFloat(e.target.value) || 5)}
                            disabled={isSpinning}
                            style={styles.input}
                        />
                    </div>

                    <p style={styles.statusText}>
                        {isSpinning ? "КОЛЕСО КРУТИТЬСЯ..." : "НАЖМИ ЧТОБ ЗАПУСТИТЬ!"}
                    </p>
                    <button 
                        onClick={handleSpin} 
                        disabled={isSpinning} 
                        style={{...styles.btn, backgroundColor: isSpinning ? 'var(--color-main-second)' : 'var(--color-main)'}}
                    >
                        {isSpinning ? "🔥 КРУТИТЬСЯ..." : "КРУТИТЬ КОЛЕСО"}
                    </button>

                </div>

                {showModal && winner && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modalCard}>
                            <div style={styles.modalCoverContainer}>
                                <img 
                                    src={`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${winner.appId}/library_600x900.jpg`}
                                    alt={winner.name}
                                    onError={(e) => { e.target.src = "https://via.placeholder.com/210x315?text=No+Cover"; }}
                                    style={styles.modalCover}
                                />
                            </div>

                            <div style={styles.modalInfo}>
                                <span style={styles.modalSubtitle}>ТЕБЕ ВЫПАЛО:</span>
                                <h2 style={styles.modalTitle}>{winner.name}</h2>

                                <div style={styles.infoRow}>
                                    <Clock size={18} color="var(--color-white)" />
                                    <span style={styles.infoText}>ВРЕМЯ ПРОХОЖДЕНИЯ: {winner.timeToBeat}</span>
                                </div>

                                <div style={styles.infoRow}>
                                    <Dice6 size={18} color="var(--color-white)" />
                                    <span style={styles.infoText}>КУБИКОВ: {winner.dices}</span>
                                </div>

                                {winner.category && winner.category !== 'None' && (
                                    <div style={styles.badge}>
                                        <Trophy size={14} style={{marginRight: 4}} />
                                        {winner.category}
                                    </div>
                                )}

                                <div style={styles.tagsContainer}>
                                    <span style={styles.tagsHeader}>🎮 ТЭГИ:</span>
                                    <div style={styles.tagsList}>
                                        {winner.tags && winner.tags.map(tag => (
                                            <span key={tag} style={styles.tagBadge}>{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                <div style={styles.modalActions}>
                                    <button 
                                        onClick={() => navigator.clipboard.writeText(winner.name)} 
                                        style={styles.copyBtn}
                                    >
                                        СКОПИРОВАТЬ НАЗВАНИЕ
                                    </button>
                                    <button 
                                        onClick={() => setShowModal(false)} 
                                        style={styles.closeBtn}
                                    >
                                        <X size={16} style={{marginRight: 6}} /> ЗАКРЫТЬ
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', background: 'none', width: '100%', height: '100vh', borderRadius: '12px', padding: '20px', color: '#ffffff', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box', position: 'relative' },
    leftPane: { width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    canvasContainer: { position: 'relative', width: '500px', height: '500px' },
    canvas: { width: '100%', height: '100%' },
    pointer: { position: 'absolute',rotate:'60deg', right: '-10px', top: '235px', width: '0', height: '0', borderTop: '15px solid transparent', borderBottom: '15px solid transparent', borderLeft: '25px solid var(--color-main)', zIndex: 10 },
    rightPane: { width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 20px' },
    formGroup: { marginBottom: '20px', display: 'flex', flexDirection: 'column' },
    label: { color: 'var(--color-main)', fontWeight: 'bold', fontSize: '12px', marginBottom: '8px' },
    select: { backgroundColor: 'var(--color-2side)', color: '#fff',textShadow:  '1px 1px 5px var(--color-white)', padding: '10px', borderRadius: '6px', border: 'none', fontSize: '14px', outline: 'none',cursor:'pointer' },
    input: { backgroundColor: 'var(--color-2side)', color: '#fff',textShadow:  '1px 1px 5px var(--color-white)', padding: '10px', borderRadius: '6px', border: 'none', fontSize: '14px', outline: 'none' },
    btn: { color: '#fff',textShadow:  '1px 1px 5px var(--color-white)', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s' },
    statusText: { color: 'var(--color-main)', marginTop: '15px', fontSize: '14px', fontWeight: 'bold' },
    modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(20, 21, 23, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, borderRadius: '12px' },
    modalCard: { display: 'flex', backgroundColor: '#1d1f21', border: '2px solid var(--color-main)', borderRadius: '8px', width: '760px', height: '380px', overflow: 'hidden' },
    modalCoverContainer: { width: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '25px', backgroundColor: '#141517' },
    modalCover: { width: '210px', height: '315px', objectFit: 'cover', borderRadius: '4px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' },
    modalInfo: { flex: 1, padding: '25px', display: 'flex', flexDirection: 'column', position: 'relative' },
    modalSubtitle: { color: 'var(--color-main)', fontSize: '12px', fontWeight: 'bold' },
    modalTitle: { fontSize: '24px', fontWeight: 'bold', margin: '5px 0 20px 0', color: '#fff' },
    infoRow: { display: 'flex', alignItems: 'center', marginBottom: '8px' },
    infoText: { marginLeft: '10px', color: 'var(--color-white)', fontSize: '14px' },
    badge: { display: 'flex', alignItems: 'center', backgroundColor: '#2c3e50', color: '#fff', padding: '5px 10px', borderRadius: '4px', width: 'fit-content', fontSize: '12px', fontWeight: 'bold', margin: '10px 0' },
    tagsContainer: { marginTop: '15px' },
    tagsHeader: { color: '#969696', fontSize: '12px', display: 'block', marginBottom: '6px' },
    tagsList: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
    tagBadge: { backgroundColor: 'var(--color-1side)', color: 'var(--color-white)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px' },
    modalActions: { marginTop: 'auto', display: 'flex', gap: '10px' },
    copyBtn: { display: 'flex', alignItems: 'center', backgroundColor: '#3c3f41', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' },
    closeBtn: { display: 'flex', alignItems: 'center', backgroundColor: '#8b2525', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' },
};