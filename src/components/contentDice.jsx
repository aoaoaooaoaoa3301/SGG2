import { dices } from "../dice-data.js";
import { useState, useRef, useEffect } from "react";
import { Select } from 'antd';
import clickSound from '/sound/turn-on-sound.mp3';
import switchSound from '/sound/unusual-switching-sound.mp3'
import reRollSound from '/sound/one-dice-is-thrown-on-the-table.mp3'

export default function ContentDice(){
    const [numDice, setNumDice] = useState(1);
    const [diceIndices, setDiceIndices] = useState([]);
    const intervalRef = useRef(null);
    const timeoutRef = useRef(null); 

    const onChangeInput = value => {
        setNumDice(value);
        const audioSwitch = new Audio(switchSound);
        audioSwitch.volume = 0.5;
        audioSwitch.play();
    }
    

    function toRollDice() {
        const audioClick = new Audio(clickSound);
        audioClick.volume = 0.8;
        audioClick.play();
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            clearTimeout(timeoutRef.current);
        }

        intervalRef.current = setInterval(() => {
            const newIndices = Array.from({ length: numDice }, () =>
        Math.floor(Math.random() * dices.length));
            const audioReRoll = new Audio(reRollSound);
            audioReRoll.volume = 0.5;
            audioReRoll.play();
            setDiceIndices(newIndices);
        }, 300);

        timeoutRef.current = setTimeout(() => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }, 5000);
    }

    const onSearch = value => {
        console.log('search:', value);
        
    };

    return(
        <div className="styleDiv" id="dice">
            <div className="styleDiv-Content">
                <h1>Счастливый кубик</h1>

                <div className="dice-container">
                    {diceIndices.map((el,index) => (
                        <img key={index} className="dice-img" src={dices[el].img} alt="" />
                    ))}
                    
                </div>
                <p style={{marginBottom:'1rem'}}>количество кубиков</p>
                <div id="roll" >
                    <Select
                            className="inputNumDices"
                            showSearch={{ optionFilterProp: 'label', onSearch }}
                            placeholder="1"
                            
                            onChange={onChangeInput}
                            options={[
                            {
                                value: 1,
                                label: '1',
                            },
                            {
                                value: '2',
                                label: '2',
                            },
                            {
                                value: 3,
                                label: '3',
                            },
                            {
                                value: 4,
                                label: '4',
                            },
                            {
                                value: 5,
                                label: '5',
                            },
                            ]}
                    />
                </div>
                <div className="butContainer">
                    <button onClick={toRollDice} className="buttonToRoll">
                        КЛИК
                    </button>
                </div>
            </div>
        </div>
    );  
}