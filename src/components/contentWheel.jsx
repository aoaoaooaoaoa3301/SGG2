import { fakeFetchGames } from "../api";
import { useState, useEffect } from 'react';
import { randint } from "../utils";
import { Select } from 'antd';
import clickSound from '/sound/cassette-player-button.mp3';


// Изменить Cascader на AutoComplete



export default function ContentWheel(){
    const [gamesData, setGamesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [valueGame, setValueGame] = useState('');
    const [winningIndex, setWinningIndex] = useState(null);
    const [spinTape, setSpinTape] = useState([]);
    const [gotedGameData, setGotedGameData] = useState(`тут будет игра`);
    
    

    useEffect(() => {
        const fetchData = async () => {
        try {
            const gamesData = await fakeFetchGames();
            setGamesData(gamesData);
        } catch (err) {
            console.error('Ошибка загрузки:', err);
        } finally {
            setLoading(false);
        }
    };
    
    fetchData();
    });
    
    if (loading) return <div>Загрузка...</div>;
    if (!gamesData) return <div>Игр нет</div>;

    const valueGameSubmit = (event) => {
        const audio = new Audio(clickSound);
        audio.play();
        event.preventDefault();
        const tagsForGames = valueGame.split(',').map(item => item.trim());
        const foundedGames = [];

        
        for( const game of gamesData){
            if(tagsForGames.every(found => game.tag.includes(found))){
                foundedGames.push(game);
            }
        }
        if (isSpinning) return;
        const randomCorrection = randint(-27, 30);
        console.log(randomCorrection);
        startSpin(foundedGames,randomCorrection);
    }

    const valueGameChange = value => {
        console.log(`selected ${value}`);
        setValueGame(value);
    };

    const onSearch = value => {
        console.log('search:', value);
    };


    //Wheel Code
    const itemHeight = 60; 
    const stopIndex = 90; 
    const totalItems = 100; // общая длина ленты

    // DOM
    const wheel = document.getElementById('wheel');
    //const durationInput = document.getElementById('duration');

    let isSpinning = false;
    let animationId = null;
    let tape = [];

    // Генерация случайной ленты
    function generateTape(list) {
      const new_list = list.map((game) =>(game.name));
      const tape = [];
      for (let i = 0; i < totalItems; i++) {
        tape.push(new_list[Math.floor(Math.random() * new_list.length)]);
      }
      return tape;
    }


    function startSpin(list, randomCorrection) {
      isSpinning = true;
      
      setWinningIndex(null);
      // Генерируем новую ленту
      tape = generateTape(list);
      setSpinTape(tape);

      // Позиция 90-го элемента (в реальной ленте)
      const targetElementIndex = stopIndex;
      const targetPosition = -(targetElementIndex * itemHeight);
      

      // Время анимации
      const duration = parseFloat(3); // сек

      // Анимация с ease-out
      const startTime = performance.now();
      const startPosition = 0;

      function animate(currentTime) {
        const elapsed = (currentTime - startTime) / 1000;
        

        if (elapsed < duration) {
          // Плавное замедление
          const t = elapsed / duration;
          const eased = 1 - Math.pow(1 - t, 4); 
          const currentY = startPosition + (targetPosition - startPosition) * eased;
          wheel.style.transform = `translateY(${currentY + randomCorrection}px)`;
          animationId = requestAnimationFrame(animate);
        }
        
        else {
            wheel.style.transform = `translateY(${targetPosition}px)`;
            console.log(list);
            const item = list.find(game => game.name === tape[targetElementIndex + 1]);
            console.log(item);
            setGotedGameData(`Выскочившая игра под наимованием ${item.name} за нее тебе положено ${item.dices} 🎲`);
            setWinningIndex(targetElementIndex + 1);
            isSpinning = false;
            
        }
      }

      requestAnimationFrame(animate);
    }
    return(
        <div className="styleDiv" id='roll'>
            <div className="styleDiv-Content">
                <h1>Супер-Пупер Колесо</h1>
                <div className="container" id="container">
                    <div className="wheel-pack">
                        <div className="pointer pointer-left"></div>
                        <div className="pointer pointer-right"></div>

                        <div className="wheel-container">
                            <div className="wheel" id="wheel">
                                {spinTape.map((item, index) => (
                                    <div key={index} id={index} className='wheel-item' style={{color: winningIndex == index ? `var(--color-main)` : `var(--color-white)`}}>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>  
                    
                    <div className="controls">
                        {/* <div>
                            <label>Время прокрутки: <input id="duration" type="number" defaultValue={3} min="3" max="10"/> с</label>
                        </div> */}
                    </div>
                </div>
                <p>{gotedGameData}</p>
                <form onSubmit={valueGameSubmit}>
                    <label>
                        <Select
                            className="tagsInput"
                            showSearch={{ optionFilterProp: 'label', onSearch }}
                            placeholder="Выбери коллекцию"
                            onChange={valueGameChange}
                            options={[
                            {
                                value: 'Detective',
                                label: 'Detective',
                            },
                            {
                                value: 'Horror',
                                label: 'Horror',
                            },
                            {
                                value: 'Martial arts',
                                label: 'Martial arts',
                            },
                            {
                                value: 'Race',
                                label: 'Race',
                            },
                            {
                                value: 'Rogue-like',
                                label: 'Rogue-like',
                            },
                            {
                                value: 'Souls-like',
                                label: 'Souls-like',
                            },
                            {
                                value: 'Space',
                                label: 'Space',
                            },
                            {
                                value: 'War',
                                label: 'War',
                            },
                            ]}
                        />
                    </label>
                    <div className="butContainer">
                        <button type="submit" id="buttonToRoll" className="buttonToRoll">
                            КЛИК
                        </button>
                    </div>
                </form>
                
            </div>
        </div>
    );
}