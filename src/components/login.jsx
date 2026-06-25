import { useState } from 'react';
import { players } from '../players-data.js'
import { ALLOWED_LOGINS } from '../allowedLogins.js';

export default function Login(){
    const [pincode, setPincode] = useState(null);
    const [isFound, setIsFound] = useState(true);
    
    const onChange = e => {
        setPincode(e.target.value);  
    }
    const onSubmit = event => {
        event.preventDefault();
        if (ALLOWED_LOGINS.includes(pincode.trim())) {
            localStorage.setItem('auth', pincode.trim());
            location.reload();
            setIsFound(true);
            } else {
            setIsFound(false);
        }
    }

    return(
        <div className="login-notification-container">
            <div className="login-notification">
                <h1>Введи пин код для входа</h1>
                <p className='error' style={{visibility: (!isFound) ? 'visible':'hidden'}}>Не верный код</p>
                <form onSubmit={onSubmit}>
                    <input type="text" onChange={onChange} value={pincode || ''}/>
                    <button type="submit">клик</button>
                </form>
            </div>
        </div>
    );  
}