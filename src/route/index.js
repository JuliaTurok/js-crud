// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Product {
  static #list = []
  static #count = 0

  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0,
  ) {
    this.id = ++Product.#count
    this.img = img
    this.title = title
    this.price = price
    this.description = description
    this.amount = amount
    this.category = Array.isArray(category)
      ? category
      : [{ id: 1, text: category }]
  }

  static add = (...data) => {
    const newProduct = new Product(...data)
    this.#list.push(newProduct)
  }

  static getList() {
    return this.#list
  }

  static getById(id) {
    return this.#list.find((product) => product.id === id)
  }

  static getRandomList(id) {
    const filteredList = this.#list.filter(
      (product) => product.id !== id,
    )
    const shuffledList = filteredList.sort(
      () => Math.random() - 0.5,
    )
    return shuffledList.slice(0, 3)
  }
}

Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  27000,
  10,
)

Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel`,
  `Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux`,
  [{ id: 2, text: 'Топ продажів' }],
  20000,
  10,
)
Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel`,
  `Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux`,
  [{ id: 1, text: 'Новинка' }],
  40000,
  10,
)

class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1
  static #count = 0
  static #list = []
  static #bonusAccount = new Map()
  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }
  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }
  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = this.calcBonusAmount(price)
    const currentBalance = Purchase.getBonusBalance(email)
    const updatedBalance =
      currentBalance + amount - bonusUse
    Purchase.#bonusAccount.set(email, updatedBalance)
    console.log(email, updatedBalance)

    return amount
  }
  constructor(data, product) {
    this.id = ++Purchase.#count
    this.firstname = data.firstname
    this.lastname = data.lastname

    this.phone = data.phone
    this.email = data.email

    this.comment = data.comment || null

    this.bonus = data.bonus || 0

    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount
    this.product = product
  }
  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)

    this.#list.push(newPurchase)

    return newPurchase
  }
  static getList = () => {
    return Purchase.#list.reverse().map((purchase) => {
      const bonusAmount = Purchase.calcBonusAmount(
        purchase.productPrice,
      )
      const totalPrice =
        purchase.productPrice * purchase.amount
      return {
        ...purchase,
        totalPrice: totalPrice,
        bonusAmount: bonusAmount,
      }
    })
  }
  static getById = (id) => {
    return Purchase.#list.find((item) => item.id === id)
  }
  static updateById = (id, data) => {
    const purchase = Purchase.getById(id)
    if (purchase) {
      if (data.firstname)
        purchase.firstname = data.firstname
      if (data.lastname) purchase.lastname = data.lastname
      if (data.phone) purchase.phone = data.phone
      if (data.email) purchase.email = data.email
      return true
    } else {
      return false
    }
  }
}
class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }
  static add = (name, factor) => {
    const newPromoCode = new Promocode(name, factor)
    Promocode.#list.push(newPromoCode)
    return newPromoCode
  }
  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }
  static calc = (promo, price) => {
    return price * promo.factor
  }
}
Promocode.add('SUMMER2023', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALE25', 0.75)
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  res.render('purchase-index', {
    style: 'purchase-index',
    data: {
      list: Product.getList(),
    },
  })
})

// ================================================================
// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/alert', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',
    data: {
      message: 'Операція успішна',
      info: 'Товар створений',
      link: '/',
      buttonText: 'Переглянути',
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// Роут для сторінки продукту
router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)
  const product = Product.getById(id)

  if (!product) {
    return res.status(404).send('Продукт не знайдено')
  }

  res.render('purchase-product', {
    style: 'purchase-product',
    data: {
      list: Product.getRandomList(id),
      product: product,
    },
  })
})

router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  if (amount < 1) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Некоректна кількість товару',
        link: `/purchase-product?id=${id}`,
        buttonText: 'Повернутись назад',
      },
    })
  }

  const product = Product.getById(id)
  console.log(id, amount)

  if (!product) {
    return res.status(404).send('Продукт не знайдено')
  }

  if (product.amount < 1) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такої кількості товару немає в наявності',
        link: `/purchase-product?id=${id}`,
        buttonText: 'Повернутись назад',
      },
    })
  }

  console.log(
    `Покупка створена: ID продукту: ${id}, Кількість: ${amount}`,
  )

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)
  return res.render('purchase-create', {
    style: 'purchase-create',
    data: {
      id: product.id,
      cart: [
        {
          text: `${product.title} (${amount} шт)`,
          price: productPrice,
        },
        {
          text: `Доставка`,
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })
})
router.post('/purchase-submit', function (req, res) {
  const id = Number(req.query.id)
  console.log('ID продукту:', id)
  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,
    comment,

    promocode,
    bonus,
  } = req.body
  console.log('ID продукту:', id)
  console.log('Загальна ціна:', totalPrice)
  console.log('Ціна товару:', productPrice)
  console.log('Кількість:', amount)
  console.log("Ім'я:", firstname)
  console.log('Прізвище:', lastname)
  console.log('Email:', email)
  console.log('Телефон:', phone)

  const product = Product.getById(id)
  if (!product) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Товар не знайдено',
        link: `/purchase-list`,
      },
    })
  }
  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Товару немає в потрібній кількості',
        link: `/purchase-list`,
        buttonText: 'Повернутись назад',
      },
    })
  }
  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)
  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Некоректні дані',
        link: `/purchase-list`,
        buttonText: 'Повернутись назад',
      },
    })
  }
  if (!firstname || !lastname || !email || !phone) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: `Заповніть обов'язкові поля`,
        info: 'Некоректні дані',
        link: `/purchase-product?id=${id}`,
        buttonText: 'Повернутись назад',
      },
    })
  }
  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)

    console.log(bonusAmount)
    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }
    Purchase.updateBonusBalance(email, totalPrice, bonus)
    totalPrice -= bonus
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode)
    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }
  if (totalPrice < 0) totalPrice = 0

  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,

      firstname,
      lastname,
      email,
      phone,
      promocode,
      comment,
    },
    product,
  )

  console.log('Створене замовлення:', purchase)
  res.render('alert', {
    style: 'alert',
    data: {
      message: 'Успішно',
      info: 'Замовлення створено',
      link: `/purchase-list?email=${email}`,
      buttonText: 'Переглянути',
    },
  })
})
// ================================================================
router.get('/purchase-list', function (req, res) {
  const email = req.query.email

  if (!email) {
    return res
      .status(400)
      .send('Email користувача не вказаний')
  }

  const list = Purchase.getList().filter(
    (purchase) => purchase.email === email,
  )

  if (list.length === 0) {
    return res
      .status(404)
      .send('Замовлень для цього користувача не знайдено') // Якщо замовлень немає
  }

  res.render('purchase-list', {
    style: 'purchase-list',
    data: {
      list: list,
    },
  })
})

// ================================================================
router.get('/order-info', function (req, res) {
  const id = Number(req.query.id)

  if (!id) {
    return res
      .status(400)
      .send('ID замовлення є обов’язковим')
  }

  const order = Purchase.getById(id)

  if (!order) {
    return res.status(404).send('Замовлення не знайдено')
  }

  res.render('order-info', {
    style: 'order-info',
    data: {
      id: order.id,
      firstname: order.firstname,
      lastname: order.lastname,
      phone: order.phone,
      email: order.email,
      product: order.product.title,
      comment: order.comment,
      productPrice: order.productPrice,
      deliveryPrice: order.deliveryPrice,
      totalPrice: order.totalPrice,
      bonusAmount: order.bonus,
    },
  })
})

// ================================================================
router.get('/update-info', function (req, res) {
  const id = Number(req.query.id)

  if (!id) {
    return res
      .status(400)
      .send('ID замовлення є обов’язковим')
  }

  const order = Purchase.getById(id)

  if (!order) {
    return res.status(404).send('Замовлення не знайдено')
  }

  res.render('update-info', {
    style: 'update-info',
    data: {
      id: order.id,
      firstname: order.firstname,
      lastname: order.lastname,
      phone: order.phone,
      email: order.email,
    },
  })
})

// ================================================================
router.post('/order-info', function (req, res) {
  const id = Number(req.body.id)

  if (!id) {
    return res
      .status(400)
      .send('ID замовлення є обов’язковим')
  }

  const updatedData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    phone: req.body.phone,
    email: req.body.email,
  }

  const updated = Purchase.updateById(id, updatedData)

  if (!updated) {
    return res.status(404).send('Замовлення не знайдено')
  }

  res.render('alert', {
    style: 'alert',
    data: {
      message: 'Успішно',
      info: 'Дані замовлення оновлено',
      link: `/order-info?id=${id}`,
      buttonText: 'Переглянути',
    },
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
