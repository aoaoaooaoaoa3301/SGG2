supabase// shopLogic.txt — исправленная версия
import { supabase } from '../supabaseClient';
import { shopSessions } from '../shop';
import {shop} from '../shop-data.js';

const EPOCH_DURATION_SEC = 2 * 60 * 60;

export const getCurrentEpoch = () => Math.floor(Date.now() / 1000 / EPOCH_DURATION_SEC);

// Теперь всегда используем epoch % 6
export const getCurrentCyclicEpoch = () => getCurrentEpoch() % 4;

export const initializeEpoch = async (cyclicEpoch) => {
  const { data: existing } = await supabase
    .from('Shop')
    .select('id')
    .eq('epoch', cyclicEpoch)
    .limit(1);

  if (existing?.length > 0) return;

  const sessionIndex = cyclicEpoch % shopSessions.length; // или просто cyclicEpoch
  const items = shopSessions[sessionIndex];
  const records = items.map(item => ({
    epoch: cyclicEpoch, // ← сохраняем 0–5
    id: item.id,
    name: item.name,
    info: item.info,
    image: item.image,
    price: item.price,
    initial_stock: item.count,
    remaining_stock: item.count
  }));

  const { error } = await supabase.from('Shop').upsert(records);
  if (error) throw error;
};

export const loadCurrentShop = async () => {
  const cyclicEpoch = getCurrentCyclicEpoch(); // ← 0–5
  await initializeEpoch(cyclicEpoch);
  const data = [];
  for(var i=0;i<6;i++){data.push(shop[cyclicEpoch+i])}
  return { epochId: cyclicEpoch, items: data };
};
export const createCurrentShop = () =>{
  const cyclicEpoch = getCurrentCyclicEpoch();
  const data = [];
  for(var i=0;i<5;i++){data.push(shop[cyclicEpoch*5+i])}
  return data ;
}

export const getTimeToNextEpoch = () => {
  const nowSec = Date.now() / 1000;
  const nextEpochStartSec = (getCurrentEpoch() + 1) * EPOCH_DURATION_SEC;
  return Math.max(0, (nextEpochStartSec - nowSec) * 1000);
};