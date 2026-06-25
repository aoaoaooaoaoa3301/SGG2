import { fakeFetchPlayers } from "../api";
import { useState, useEffect } from 'react';
import { Table, ConfigProvider } from 'antd';
import { supabase } from '../supabaseClient';
import { getStatusColor } from '../utils.js';

const styleFlex = {display:'flex', alignItems:'center', gap:'1rem'};
const itemsInInventory = [
  {
    name:'Свобода выбора',
    info:'Позволяет выбрать любую игру из колеса(не работает на коллекции)',
    img:'pictures/Free.png',
    price:4
  },
  {
    name:'Щит упрямства',
    info:'Блокирует получение дебаффа на один раз, если при покупке предмета, у игрока уже есть один дебафф, игнорирует его',
    img:'pictures/Shield.png',
    price:1
  },
  {
    name:'Щит упрямства',
    info:'Блокирует получение дебаффа на один раз, если при покупке предмета, у игрока уже есть один дебафф, игнорирует его',
    img:'pictures/Shield.png',
    price:1
  },
  {
    name:'Щит упрямства',
    info:'Блокирует получение дебаффа на один раз, если при покупке предмета, у игрока уже есть один дебафф, игнорирует его',
    img:'pictures/Shield.png',
    price:1
  },
  {
    
  },
  {
    
  },
  
]
const styleInput = {
    width:'100%',
    textAlign: 'center',
    borderRadius:'8rem'
}

const columns = [
  {
    title: 'Клетка',
    dataIndex: 'cage',
    key: 'cage',
    width: '10%',
  },  
  {
    title: 'Название',
    dataIndex: 'name',
    key: 'name',
    width: '20%',
  },
  {
    title: 'Оценка',
    dataIndex: 'rating',
    key: 'rating',
    width: '10%',
  },
  {
    title: 'Результат',
    dataIndex: 'result',
    key: 'result',
    width: '15%',
  },
  {
    title: 'Комментарий',
    dataIndex: 'commit',
    key: 'commit',
    className: 'wrap-cell',
  },
];




export default function Player({ login }) {
  const [playerData, setPlayerData] = useState();
  const [playerGames, setPlayerGames] = useState();
  const [loading, setLoading] = useState(true);
  const [playerInventory, setPlayerInventory] = useState([]);
  const [countCompleteGames, setCountCompleteGames] = useState(0);
  
  function createGameList(list){
    setCountCompleteGames(list.filter(i => (i.result == 'Пройдено')).length);
    return list.map( (item)=>({
      key: item.id,
      cage: item.cage,
      name: item.name,
      rating: `${item.rating}/10`,
      result: <p style={{...styleInput, backgroundColor: getStatusColor(item.result)}}>{item.result}</p>,
      commit: item.commit,
      
    }))
  }
  
  useEffect(() => {
      const fetchPlayer = async () => {
        const { data, error } = await supabase
          .from('Accounts')
          .select('*')
          .eq('login', login);
        if (error) {
          console.error('Ошибка:', error);
        } else {
          setPlayerData(data[0]);
          if (data[0]?.gameList) {
            await fetchPlayerGames(data[0].gameList);
            await fetchPlayerInventory(data[0].inventoryList);
          }
        }
      };
      const fetchPlayerInventory = async (table) => {
              const { data, error } = await supabase
                .from(table)
                .select('*')
              if (error) {
                console.error('Ошибка:', error);
              } else {
                setPlayerInventory(data);
              }}
      const fetchPlayerGames = async (table) => {
        const { data, error } = await supabase
          .from(table)
          .select('*')
        if (error) {
          console.error('Ошибка:', error);
        } else {
          setPlayerGames(createGameList(data));
        }
      };
      fetchPlayer();
      
    }, []);
  
  
  if (!playerData) return <div>Загрузка...</div>;

  function onClick(){
    console.log(playerData, playerGames, playerData.gameList);
  }

  return (
    <div className='player'>
      
      <div className='player-info'>
        <img className="player-img" src={playerData.image} alt="img1" />
        <div className='player-info-fio'>
                    <span onClick={onClick}>{playerData.name}</span>
                    <span>{playerData.info}</span>
                    
                    <div style={styleFlex}>
                        {playerInventory.sort((a, b) => a.id - b.id).map((item) =>(
                          <div className='itemInventory' key={item.id}>
                            <div className="item-container" style={{backgroundColor: ((item.id == 5) || (item.id == 6)) ? 'var(--color-debuff)' : 'var(--color-buff)'}}>
                              <img src={item.image} alt="" />
                              <p>{item?.image ? '' :item.name}</p>
                              <span className="cage-info">{item.info}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                    <span>Пройдено игр {countCompleteGames}</span>
                </div>
      </div>
      <ConfigProvider
                theme={{
                    components:{
                        Table:{
                          rowHoverBg:'var(--color-5side)',
                          bodySortBg:'var(--color-5side)',
                          headerBg:'var(--color-5side)',
                          headerColor: 'var(--color-white)',
                          colorBgContainer: 'var(--color-5side)',
                        }
                    }
                }}
                >
                
                    <Table style={{color:'black', marginBottom:'1rem'}} dataSource={playerGames} columns={columns} pagination={false}/>
                
            </ConfigProvider>
    </div>
  );
}