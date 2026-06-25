import { Tabs } from 'antd';
import Player from './player.jsx';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function ContentPlayers(){
    const [playersData, setPlayersData] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
          const fetchPlayer = async () => {
            
            const { data, error } = await supabase
              .from('Accounts') // ← имя вашей таблицы
              .select('*')
            if (error) {
              console.error('Ошибка:', error);
            } else {
              setPlayersData(data);
            }
          };
          fetchPlayer();
          setLoading(false);
        }, []);
      
    if(!playersData) return <div>Загрузка...</div>;


    return(
        <div className='styleDiv' id='players'>
            <div className='styleDiv-Content'>
                <Tabs 
                tabPosition={'top'}
                
                items={playersData.sort((a, b) => a.id - b.id).map( (item) => ({
                    label: item.name,
                    key:item.id,
                    children: <Player login={item.login}/>
                }))}
                />
            </div>
        </div>
    );
}