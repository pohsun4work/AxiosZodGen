import { factory, primaryKey } from '@mswjs/data';

export interface Fruit {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  unit: string;
}

export const db = factory({
  fruit: {
    id: primaryKey(String),
    name: String,
    price: Number,
    quantity: Number,
    color: String,
    unit: String,
  },
});

db.fruit.create({ id: '1', name: 'Apple', price: 32, quantity: 42, color: 'Red', unit: 'Kilogram' });
db.fruit.create({ id: '2', name: 'Banana', price: 32, quantity: 59, color: 'Yellow', unit: 'Bunch' });
db.fruit.create({ id: '3', name: 'Orange', price: 72, quantity: 70, color: 'Orange', unit: 'Piece' });
db.fruit.create({ id: '4', name: 'Pear', price: 72, quantity: 48, color: 'Green', unit: 'Box' });
db.fruit.create({ id: '5', name: 'Grapes', price: 71, quantity: 51, color: 'Purple', unit: 'Basket' });
