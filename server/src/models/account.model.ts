import client from "../services/pg.js";
import { userSnapshot, update, userData, userOrder } from "../types/basicTypes.js";
import { validate } from "../utils/validate.js";
import { getOffersById, getOrders } from "./offers.model.js";
import bcrypt = require("bcrypt");

function validateRegister(user: userData): boolean {
  const { email, password, name, surname, phonenumber } = user;

  if (validate.email(email) && validate.password(password) && validate.name(name) && validate.name(surname) && validate.phoneNumber(phonenumber))
    return true;
  else return false;
}

async function findUserWithEmailAndPassword(email: string, password: string) {
  const user = (await client.query("SELECT * from users WHERE email = $1", [email])).rows[0];

  if (user) {
    const orders = await getUserOrders(user.orders, 0); //można to skrócić za pomocą JOIN

    if (orders) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid)
        return {
          email: user.email,
          name: user.name,
          surname: user.surname,
          phoneNumber: user.phonenumber,
          orders,
        };
    }
  }
}

async function updateUser(updateValues: update, user: userSnapshot) {
  const orginalEmail = user.email;

  const { name, surname, newEmail, phonenumber } = updateValues;

  user.name = name && validate.name(name) ? name : user.name;
  user.surname = surname && validate.name(surname) ? surname : user.surname;
  user.email = newEmail && validate.email(newEmail) ? newEmail : user.email;
  user.phonenumber = phonenumber && validate.phoneNumber(String(phonenumber)) ? String(phonenumber) : user.phonenumber;

  const isEmailInUse = await client.query("SELECT user_id from users WHERE email = $1", [user.email]);

  if (!isEmailInUse || orginalEmail === user.email)
    return await client.query(`UPDATE users SET email = $1, name = $2, surname = $3, phonenumber = $4 WHERE email = $5`, [
      user.email,
      user.name,
      user.surname,
      user.phonenumber,
      orginalEmail,
    ]);
}

async function deleteUser(email: string) {
  return await client.query("DELETE from users WHERE email = $1", [email]);
}

async function updateUserOrders(orderID: string, index: number, user: userSnapshot) {
  user.orders.push({ id: orderID, carIndex: index });

  await client.query("UPDATE users SET orders = $1 WHERE email = $2", [JSON.stringify(user.orders), user.email]);

  return user;
}

async function addUserToDB(user: userData): Promise<void | Error> {
  const emailInUse = (await client.query("SELECT user_id from users WHERE email = $1", [user.email])).rowCount;

  if (emailInUse) return new Error("this email is already used");

  const { email, password, name, surname, phonenumber } = user;

  const encryptedPassword = await bcrypt.hash(password, 10);

  await client.query(`INSERT INTO users (email, password, name, surname, phonenumber, orders, "createdAt") VALUES ($1,$2,$3,$4,$5,$6,NOW())`, [
    email,
    encryptedPassword,
    name,
    surname,
    phonenumber,
    JSON.stringify([]),
  ]);
}

async function getUserOrders(userOrders: userOrder[], index: number, itemsCount: number = 4) {
  const ordersId: string[] = [];
  for (let i = 1; i <= itemsCount; i++) {
    const order = userOrders[userOrders.length - index - i];
    if (order) ordersId.push(order.id);
  }

  const orders = await getOrders(ordersId);

  if (!Array.isArray(orders)) return [];

  const cars_id = orders.map(order => order.car_id);
  const cars = await getOffersById(cars_id);

  return orders.map(orderData => {
    const car = JSON.parse(JSON.stringify(cars.find(car => car.id === orderData.car_id)));
    const data = JSON.parse(JSON.stringify(orderData));

    delete car._id, delete data.user_id, delete data.car_id;

    if (car)
      return {
        car,
        data,
      };
    else return { data, car: "This car is not avilable" };
  });
}

export { updateUser, deleteUser, updateUserOrders, findUserWithEmailAndPassword, addUserToDB, getUserOrders, validateRegister };
