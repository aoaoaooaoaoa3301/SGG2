// shopLogic.txt — исправленная версия
import { supabase } from '../supabaseClient';
import { shopSessions } from '../shop';

const EPOCH_DURATION_SEC = 4 * 60 * 60;

export const getCurrentEpoch = () => Math.floor(Date.now() / 1000 / EPOCH_DURATION_SEC);

// Теперь всегда используем epoch % 6
export const getCurrentCyclicEpoch = () => getCurrentEpoch() % 6;

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
  const { data, error } = await supabase
    .from('Shop')
    .select('*')
    .eq('epoch', cyclicEpoch) // ← ищем по 0–5
    .order('id', { ascending: true });

  if (error) throw error;
  return { epochId: cyclicEpoch, items: data };
};

export const getTimeToNextEpoch = () => {
  const nowSec = Date.now() / 1000;
  const nextEpochStartSec = (getCurrentEpoch() + 1) * EPOCH_DURATION_SEC;
  return Math.max(0, (nextEpochStartSec - nowSec) * 1000);
};