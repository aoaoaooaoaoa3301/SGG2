import { useState } from 'react';
import { Layout, Menu, ConfigProvider } from 'antd';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import ContentPlayers from './components/contentPlayers.jsx';
import ContentWheel from './components/contentWheel.jsx';
import ContentFaq from './components/contentFaq.jsx'
import ContentAccount from './components/contentAccount.jsx';
import ContentDice from './components/contentDice.jsx'
import ContentShop from './components/contentShop.jsx';
import ContentDebuffs from './components/contentDebuffs.jsx';
import Test from './components/test.jsx';


const { Sider, Content, Header } = Layout;

const catalogs = {
  map: '',
  wheel: <ContentWheel/>,
  
  dice: <ContentDice/>,
  players: <ContentPlayers/>,
  account: <ContentAccount />,
  shop:<ContentShop/>,
  debuffs: <ContentDebuffs/>,
  faq: <ContentFaq />,
};

const catalogNames = {
  map: 'Карта',
  wheel: 'Колесо Игр',
  
  dice: 'Кубик',
  players: 'Игроки',
  account: 'Аккаунт',
  shop: 'Магазин',
  debuffs: 'Дебафы',
  faq: 'Правила',
};

export function CatalogPage() {
  const { category } = useParams();

  if (!catalogs[category]) {
    return <div>Каталог не найден</div>;
  }

  return (
    <div>
      {catalogs[category]}
    </div>
  )
};

const getKeyFromPath = (pathname) => {
  if (pathname === '/' || pathname === '/SGG' || pathname === '/SGG/') {
    return 'map';
  }
  const match = pathname.match(/\/SGG\/([^/]+)/);
  const category = match ? match[1] : null;
  return catalogs[category] ? category : 'map';
};

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState((location.pathname == '/SGG2') || (location.pathname == '/SGG2/') || (location.pathname == 'SGG2/')? 'map' : (location.pathname).split('/')[2])
  const navigate = useNavigate();


  const menuItems = Object.keys(catalogs).map((key) => ({
    key,
    label: catalogNames[key],
  }));

  const handleMenuClick = ({ key }) => {
    setActiveKey(key);
    if(key == 'map') { navigate(`/`); }
    else{ navigate(`/${key}`); }
  };

  return (
      <Layout >

        
        <Sider
                  collapsible
                  collapsed={collapsed}
                  onCollapse={setCollapsed}
                  trigger={null}
                  width={'15rem'}
                >
                  <Menu
                    mode="inline"
                    inlineCollapsed={collapsed}
                    selectedKeys={[activeKey]}
                    items={menuItems}
                    onClick={handleMenuClick}
                  />
            </Sider>
          
        
        
        <Layout>
          
          <Header>
            <div >
              <h1>
                $uicide$quadGunterGame 2
              </h1>
            </div>
          </Header>
          

          <Content>
            <Outlet />
          </Content>
        </Layout>
        
      </Layout>

  );
};
