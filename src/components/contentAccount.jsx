import { useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import Login from "./login";
import Account from "./account";



export default function ContentAccount(){
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('auth'); // сокращённое имя, чтобы избежать конфликтов
        if (token) {
            // Опционально: проверить токен на валидность (например, запросом к /api/me)
            setIsAuthenticated(true);
        }
    setLoading(false);
    }, []);

    if (loading) return <div>Загрузка...</div>;

    return(
        <div className="styleDiv" id="account">
            <div className="styleDiv-Content" >
                {isAuthenticated ? <Account /> : <Login />}
            </div>
        </div>
    );  
}