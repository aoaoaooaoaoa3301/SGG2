
export function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export const getStatusColor = (placeholder) => {
  switch (placeholder) {
    case 'Пройдено': return 'green';
    case 'Дроп': return 'red';
    case 'В процессе': return 'orange';
    case 'Рерол': return 'blue';
    default: return '';
  }
};