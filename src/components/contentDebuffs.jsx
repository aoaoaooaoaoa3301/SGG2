import { useState, useEffect } from 'react';
import { randint } from "../utils";
import clickSound from '/sound/cassette-player-button.mp3';
import { debuffs } from "../debuffs-data";
import { supabase } from '../supabaseClient.js';


export default function ContentDebuffs(){
    const [gotedDebuffData, setGotedDebuffData] = useState(`тут будет игра`);
    const [playerData, setPlayerData] = useState([]);
    const [inventoryData, setInventoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        const fetchPlayer = async () =>{
            const {data, error} = await supabase
            .from('Accounts')
            .select('*')
            .eq('login', localStorage.getItem('auth'))
            if(error) {console.log('error: ', error)}
            else {
                setPlayerData(data[0])
                if(data[0]?.inventoryList){fetchInventory(data[0].inventoryList)}
            }
            } 
        const fetchInventory = async (table) =>{
            const {data, error} = await supabase
            .from(table)
            .select('*');
            if(error) {console.log('error: ', error)}
            else {
                setInventoryData(data);
            }
        }
        fetchPlayer();
        if(inventoryData != []){setLoading(false);}
    }, []);
    if(loading)return <div>Загрузка...</div>;

    const valueDebuffSubmit = async (event) => {
        const audio = new Audio(clickSound);
        audio.play();
        event.preventDefault();
        const debuff = debuffs[randint(0,debuffs.length-1)];
        setGotedDebuffData(debuff);
        
        console.log(inventoryData,playerData,playerData.inventoryList);

        const { data: emptySlot, error } = await supabase
            .from(playerData.inventoryList)
            .select('id')
            .eq('name', '')
            .order('id', { ascending: true })
            .gte('id', 5)  
            .lt('id', 7) 
            .limit(1);
            
        if (!emptySlot || emptySlot.length === 0) {
            alert('Инвентарь полон!');
            return;
        }
        const slotId = emptySlot[0].id;

        const { error: updateError } = await supabase
            .from(playerData.inventoryList)
            .update({
            name: debuff.name,
            info: debuff.info || '',
            image: null,
            })
            .eq('id', slotId);

        if (updateError) {
            console.error('Ошибка обновления:', updateError);
            alert('Не удалось добавить предмет в инвентарь');
            return;
        }
        else{alert(`Тебе выпало ${debuff.name}`)}
    }

    return(
        <div className="styleDiv" id='roll'>
            <div className="styleDiv-Content">
                <h1>💀Дебафы💀</h1>

                <h1>{gotedDebuffData.name}</h1>
                <p>{gotedDebuffData.info}</p>

                <div className="butContainer">
                    <button onClick={valueDebuffSubmit} className="buttonToRoll">
                        КЛИК
                    </button>
                </div>
                
                
            </div>
        </div>
    );
}