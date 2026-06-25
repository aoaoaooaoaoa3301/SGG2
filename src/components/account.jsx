import { Table, ConfigProvider } from 'antd';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';
import { getStatusColor } from '../utils.js';

const styleFlex = {display:'flex', alignItems:'center', gap:'1rem'};
const styleInput = {
    width:'100%',
}
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
  
]

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
    
  },
];



export default function Account(){
    const [itemsInvent, setItemsInvent] = useState(itemsInInventory);
    const [playerData, setPlayerData] = useState([]);
    const [playerGames, setPlayerGames] = useState([]);
    const [playerGamesData, setPlayerGamesData] = useState([]);
    const [playerInventory, setPlayerInventory] = useState([]);
    const [countCompleteGames, setCountCompleteGames] = useState(0);
    
    
    useEffect(() =>{
      const fetchPlayer = async () =>{
        const {data, error} = await supabase
          .from('Accounts')
          .select('*')
          .eq('login', localStorage.getItem('auth'))
          if(error) {console.log('error: ', error)}
          else {
            setPlayerData(data[0])
            if (data[0]?.gameList) {
              await fetchPlayerGames(data[0].gameList);
              await fetchPlayerInventory(data[0].inventoryList);
            }
          }
      }
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
                setPlayerGamesData(data);
              }}

      fetchPlayer();
    }, []);

    if(!playerData) return <div>Загрузка...</div>;

    function createGameList(list){
      setCountCompleteGames(list.filter(i => (i.result == 'Пройдено')).length);
      return list.map( item => ({
        key: item.id,
        id: item.id,
        cage: <input onChange={(e) => handleInputChange(item.id, 'cage', e.target.value)} style={styleInput} type='number' placeholder={item.cage }/>,
        name: <input onChange={(e) => handleInputChange(item.id, 'name', e.target.value)} style={styleInput} placeholder={item.name }/>,
        rating:  <input onChange={(e) => handleInputChange(item.id, 'rating', e.target.value)} style={styleInput} type='number' placeholder={`${item.rating}/10`}/>,
        result: <input onChange={(e) => handleInputChange(item.id, 'result', e.target.value)} style={{...styleInput, backgroundColor: getStatusColor(item.result)}} placeholder={item.result}/>,
        commit: <input onChange={(e) => handleInputChange(item.id, 'commit', e.target.value)} style={styleInput} placeholder={item.commit}/>,
      }))

    }

    function logOutAccount(){
        localStorage.removeItem('auth');
        location.reload();
    }
    const toRemoveItem = async (event, item) => {
      event.preventDefault();
      const { error: updateError } = await supabase
        .from(playerData.inventoryList)
        .update({
        name: '',
        info: '',
        image: null,
        })
        .eq('id', item.id);

        if (updateError) {
          console.error('Ошибка обновления:', updateError);
          alert('Не удалось добавить предмет в инвентарь');
          return;
        }
        else {alert(`Вы удалили предмет ${item.name}`); location.reload();}
    };

    function toAddGame(){
      
      setPlayerGames([...playerGames,{
        key: playerGames.length + 1,
        id: playerGames.length + 1,
        cage: <input onChange={(e) => handleInputChange(playerGames.length + 1, 'cage', e.target.value)} style={styleInput} type='number' placeholder='клетка'/>,
        name: <input onChange={(e) => handleInputChange(playerGames.length + 1, 'name', e.target.value)} style={styleInput} placeholder='игра'/>,
        rating: <input onChange={(e) => handleInputChange(playerGames.length + 1, 'rating', e.target.value)} style={styleInput} type='number' placeholder='оценка'/>,
        result: <input onChange={(e) => handleInputChange(playerGames.length + 1, 'result', e.target.value)} style={{...styleInput, backgroundColor: getStatusColor('результат')}}  placeholder='результат'/>,
        commit: <input onChange={(e) => handleInputChange(playerGames.length + 1, 'commit', e.target.value)} style={styleInput} placeholder='комментарий'/>,
      }])

      setPlayerGamesData([
        ...playerGamesData,
        {
          id: playerGames.length + 1,
          cage: 0,
          name: '',
          rating: 0,
          result: '',
          commit: '',
        }
      ])
    }
    
    const handleInputChange = (id, field, value) => {
      setPlayerGamesData(prev =>
        prev.map(row =>
          row.id === id ? { ...row, [field]: value } : row
        )
      );
    };

    const saveAllRows = async () => {
      const savedData = playerGamesData.map(row => ({
        id: row.id,
        cage: row.cage,
        name: row.name,
        rating: row.rating,
        result: row.result,
        commit: row.commit,
      }));

      console.log('✅ Сохранённые строки:', savedData);
       try {
        const { error: deleteError } = await supabase
          .from(playerData.gameList)
          .delete()
          .neq('id', 0);

        if (deleteError) throw deleteError;

        if (savedData.length > 0) {
          const { error: insertError } = await supabase
            .from(playerData.gameList)
            .insert(savedData);

          if (insertError) throw insertError;
        }

        alert('✅ Таблица успешно сохранена!');
      } catch (err) {
        console.error('Ошибка сохранения:', err);
        alert('❌ Не удалось сохранить таблицу: ' + err.message);
      }
      };
    async function toPluseBalance(){
      const { error: inventoryError } = await supabase
        .from('Accounts')
        .update({
          balance: playerData.balance + 1
        })
        .eq('id', playerData.id);

      if (inventoryError) {
        console.error('Ошибка добавления в инвентарь:', inventoryError);
        alert('Предмет не добавлен в инвентарь');
        return;
      }
      else{alert(`баланс увеличился на 1`); location.reload()}
    }
    async function toMinusBalance(){
      if(playerData.balance <= 0){alert('баланс 0 брух');}

      else{
        const { error: inventoryError } = await supabase
          .from('Accounts')
          .update({
            balance: playerData.balance - 1
          })
          .eq('id', playerData.id);
  
        if (inventoryError) {
          console.error('Ошибка изменения баланса:', inventoryError);
          alert('Баланс не изменился');
          return;
        }
        else{alert(`баланс уменьшился на 1`); location.reload()}
      }
    }

    return(
        <div className='player'>
            <div className='player-info'>
                <img className='player-img' src={playerData.image} alt="img1" />
                
                <div className='player-info-fio'>
                    <div style={{...styleFlex , flexDirection:'column'}}>
                        <span>{playerData.name}</span>
                        <div style={styleFlex}>
                          <button onClick={toMinusBalance} className='buttonChangeBalance'>-</button>
                          <span>У тебя {playerData.balance} репутации</span>
                          <button onClick={toPluseBalance} className='buttonChangeBalance'>+</button>
                        </div>
                        <span>Пройдено игр {countCompleteGames}</span>
                    </div>
                    <div style={styleFlex}>
                        {playerInventory.sort((a, b) => a.id - b.id).map((item) =>(
                          <form onSubmit={(e) => toRemoveItem(e, item)} className='itemInventory' key={item.id}>
                            <div className="item-container" style={{backgroundColor: ((item.id == 5) || (item.id == 6)) ? 'var(--color-debuff)' : 'var(--color-buff)'}}>
                              <img src={item.image} alt="" />
                              <p>{item?.image ? '' :item.name}</p>
                              <span className="cage-info">{item.info}</span>
                            </div>
                            <button>🗑️</button>
                          </form>
                        ))}
                    </div>
                </div>
                
            </div>
            <button className='button-logOut' onClick={logOutAccount}>выйти из Аккаунта</button>
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
            <div className="butContainer" style={{gap:'1rem'}}>
              <button onClick={toAddGame} className='button-toAddGameStats'>+</button>
              <button onClick={saveAllRows} className='button-toAddGameStats'>✔</button>
              
            </div>
            
            
        </div>
    );  
}