import { shop } from '../shop-data.js'
import { shopSessions } from '../shop.js';
import { useEffect, useState } from 'react';
import { randint } from "../utils";
import { supabase } from '../supabaseClient.js';
import { loadCurrentShop, getTimeToNextEpoch, getCurrentEpoch, createCurrentShop } from './shopLogic';



export default function ContentShop(){
    const isAdmin = localStorage.getItem('auth') == '123';
    const [playerData, setPlayerData] = useState([]);
    const [numCollection, setNumCollection] = useState(0);
    
    const [shopItems, setShopItems] = useState(createCurrentShop());
    console.log(typeof(shopItems),shopItems);
    const [currentEpoch, setCurrentEpoch] = useState(getCurrentEpoch());
    const [timeLeft, setTimeLeft] = useState(getTimeToNextEpoch());

    const [shopData, setShopData] = useState([]);

    useEffect(() => {
        const fetchPlayer = async () =>{
            const {data, error} = await supabase
            .from('Accounts')
            .select('*')
            .eq('login', localStorage.getItem('auth'))
            if(error) {console.log('error: ', error)}
            else {
                setPlayerData(data[0])
            }
      }
          fetchPlayer()
          
        }, []);

    useEffect(() => {
        const timer = setInterval(() => {
        const newTime = getTimeToNextEpoch();
        if (newTime <= 1000) {
                setTimeout(() => {
                    const newEpoch = getCurrentEpoch();
                    setCurrentEpoch(newEpoch);
                    
            }, 1000);
        }
        setTimeLeft(newTime);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (ms) => {
        const totalSec = Math.floor(ms / 1000);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };
    
    
    if(shopData == [] || playerData == []) <div>Загрузка...</div>;

    
    function createNewRandomShop(list){
        const newList = [];
        let uplList = list;
        let n = 1;
        for(let i =1; i <= 5; i++){
            const randomEl = uplList[randint(0, list.length-n)];

            uplList = uplList.filter(item => item.name !== randomEl.name);
            n++;
            newList.push({...randomEl, id: i});
        }
        return newList;
    }
    function onClick(){
        console.log(isAdmin);
    }
    const toBuy = async (item) => {
  // Проверяем баланс
  if (playerData.balance < item.price) {
    alert(`Ты бомж!`);
    return;
  }

  // Проверяем наличие товара
  if (item.remaining_stock <= 0) {
    alert(`${item.name} закончился`);
    return;
  }

  // Находим свободный слот
  const { data: emptySlot, error: slotError } = await supabase
    .from(playerData.inventoryList)
    .select('id')
    .eq('name', '')
    .order('id', { ascending: true })
    .lt('id', 5)
    .limit(1);

  if (slotError || !emptySlot || emptySlot.length === 0) {
    alert('Инвентарь полон!');
    return;
  }

  const slotId = emptySlot[0].id;

  

  // Обновляем инвентарь
  const { error: inventoryError } = await supabase
    .from(playerData.inventoryList)
    .update({
      name: item.name,
      info: item.info || '',
      image: item.image || null,
    })
    .eq('id', slotId);

  if (inventoryError) {
    console.error('Ошибка добавления в инвентарь:', inventoryError);
    alert('Предмет не добавлен в инвентарь');
    return;
  }


  // Обновляем баланс
  const newBalance = playerData.balance - item.price;
  const { error: balanceError } = await supabase
    .from('Accounts')
    .update({ balance: newBalance })
    .eq('login', localStorage.getItem('auth'));

  if (balanceError) {
    console.error('Ошибка обновления баланса:', balanceError);
    alert('Баланс не обновлён, но предмет куплен');
  } else {
    alert(`Вы купили ${item.name}!`);
  }

  // Обновляем данные игрока и магазина
  setPlayerData(prev => ({ ...prev, balance: newBalance }));
  const freshShop = await loadCurrentShop();
  
};
    async function  updateShop(){
        setShopList(shopSessions[numCollection%6]);
        setNumCollection(numCollection+1);
    }



    return(
        <div className="styleDiv" id="shop">
            <div className="styleDiv-Content">
                <h1>Магазин</h1>
                <div className="grid-ShopItems">
                    {shopItems.map((el) => (
                        <div key={el.id} className="cardShop">
                            <h2>{el.name}</h2>
                            
                            <div className="img-container">
                                <img src={el.image} alt="" />
                            </div>
                            <div className='container-info'><p>{el.info} </p></div>
                            <p>стоит {el.price}</p>
                            
                            
                            <div className="butContainer">
                                <button className="buttonToBuy" onClick={() => toBuy(el)}>
                                    Купить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <h1>Обновится через: {formatTime(timeLeft)}</h1>
                <div className="butContainer">
                    <button onClick={updateShop} style={{display: isAdmin ? '': 'none'}} className="buttonToRoll">
                        КЛИК
                    </button>
                </div>    
            </div>
        </div>
    );  
}