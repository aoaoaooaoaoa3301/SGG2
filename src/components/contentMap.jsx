import { fakeFetchMap } from "../api";
import { useState, useEffect } from 'react';
import Icon from './icon.jsx'; 
import { supabase } from '../supabaseClient';
import confetti from 'canvas-confetti';

export default function ContentMap(){
    const [mapData, setMapData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [icons, setIcons] = useState([]);
    const [isAllertWiner, setIsAllertWiner] = useState(true);
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
        console.log(currentLogin);
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

    useEffect(() => {
            const fetchData = async () => {
            try {
                const mapData = await fakeFetchMap();
                setMapData(mapData);
            } catch (err) {
                console.error('Ошибка загрузки:', err);
            } finally {
                setLoading(false);
            }
        };
        
    fetchData();
    loadIcons();

    if(isAllertWiner){
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
    }
    });
        
    if (loading) return <div>Загрузка...</div>;
    if (!mapData) return <div>Карты нет</div>;

    function onClick(){
        setIsAllertWiner(false);
    }

    return(
        <div className="styleDiv flex-center" id='map'>
            <div className="allertWinner" onClick={onClick} style={{visibility:isAllertWiner?'visible':'hidden'}}>
                
                <div style={{fontSize:'100px'}}>
                    Победитель 3его SSGG - <img style={{width:'100px'}} src="pictures/adzeen.jpg" alt="" /> Адзин
                </div>
            </div>
            <div className="styleDiv-Content game-field" style={{position:'relative'}}>
                
                {icons.map((icon) => (
                    <Icon
                        key={icon.id}
                        iconPosition={[icon.x,icon.y]}
                        icon={icon.image}
                        image={icon.image}
                        
                        isOwner={icon.login == currentLogin}
                        onUpdatePosition={updateIconPosition}
                    />
                ))}
                    
                {mapData.map( (cage,index) => (
                    <div key={index} className={"cage" + (cage.end == 'yes' ? "" : " " + (cage.special == 'yes' ? "cage-special" : (cage.line == 1 ? "cage-1line" : "cage-2line"))) }  style={{backgroundColor:cage.color}}>
                        {cage.name}
                        <span className="cage-info">{cage.info}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}