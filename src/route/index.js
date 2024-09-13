// Підключаємо технологію express для back-end сервера
const express = require('express')

// Видалив зайвий імпорт emit
// const { emit } = require('nodemon')

// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  // Виправив оголошення методу verifyPassword
  verifyPassword(password) {
    return this.password === password
  }

  static add(user) {
    this.#list.push(user)
  }

  static getList() {
    return this.#list
  }

  static getById(id) {
    return this.#list.find((user) => user.id === id)
  }

  static deleteById(id) {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById(id, data) {
    const user = this.getById(id)

    if (user) {
      this.update(user, data)
      return true
    } else {
      return false
    }
  }

  static update(user, { email }) {
    if (email) {
      user.email = email
    }
  }
}

// ================================================================
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  const list = User.getList()
  res.render('index', {
    style: 'index',
    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

// ================================================================

router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)
  console.log(User.getList())
  res.render('success-info', {
    style: 'success-info',
    info: 'користувач створений',
  })
})

// ================================================================
router.get('/user-delete', function (req, res) {
  const { id } = req.query

  User.deleteById(Number(id))
  res.render('success-info', {
    style: 'success-info',
    info: 'користувач видалений',
  })
})

// ================================================================
router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body
  let result = false
  const user = User.getById(Number(id))

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  res.render('success-info', {
    style: 'success-info',
    info: result
      ? 'Емайл пошта оновлена'
      : 'Сталася помилка',
  })
})

// ================================================================
class Product {
  static #list = []

  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.id = Math.floor(Math.random() * 90000) + 10000
    this.createDate = new Date().toISOString()
  }

  static getList() {
    return this.#list
  }

  static add(product) {
    this.#list.push(product)
  }

  // Додаємо повернення у методі getById
  static getById(id) {
    return this.#list.find((product) => product.id === id)
  }
  static update(product, data) {
    product.name = data.name || product.name
    product.price = data.price || product.price
    product.description =
      data.description || product.description
  }

  static updateById(id, data) {
    const product = this.getById(id)
    if (product) {
      this.update(product, data)
      return true
    } else {
      return false
    }
  }

  static deleteById(id) {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
}

// ================================================================

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-create', function (req, res) {
  const list = Product.getList()
  res.render('product-create', {
    style: 'product-create',
    page: {
      title: 'Product',
    },
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

// ================================================================
router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  if (!name || !price || !description) {
    return res.render('alert', {
      style: 'alert',
      info: 'Помилка. Всі поля повинні бути заповнені!',
      button: 'повернутися назад',
    })
  }
  Product.add(product)
  console.log(Product.getList())
  res.render('alert', {
    style: 'alert',
    info: 'товар успішно був доданий',
    button: 'переглянути результат',
  })
})

// ================================================================
router.get('/product-list', function (req, res) {
  const list = Product.getList()
  console.log(list)
  res.render('product-list', {
    style: 'product-list',
    page: {
      title: 'Список продуктів',
    },
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

// ================================================================
router.get('/product-edit', function (req, res) {
  const { id } = req.query

  const product = Product.getById(Number(id))

  if (!product) {
    return res.render('alert', {
      style: 'alert',
      infoStatus: 'Виникла помилка',
      info: 'Товар з таким ID не знайдено',
      button: 'повернутись назад',
    })
  }

  res.render('product-edit', {
    style: 'product-edit',
    data: { product },
  })
})

// ================================================================
router.post('/product-edit', function (req, res) {
  const { id, name, price, description } = req.body

  if (!id || !name || !price) {
    return res.render('alert', {
      style: 'alert',
      infoStatus: 'Виникла помилка',
      info: 'Будь ласка, заповніть всі поля форми',
      button: 'повернутись назад',
    })
  }
  const productId = Number(id)
  const product = Product.getById(productId)

  if (!product) {
    return res.render('alert', {
      style: 'alert',
      infoStatus: 'Помилка',
      info: 'Товар не знайдено',
      button: 'повернутись назад',
    })
  }

  const isUpdated = Product.updateById(productId, {
    name,
    price,
    description,
  })

  if (isUpdated) {
    return res.render('alert', {
      style: 'alert',
      infoStatus: 'Успіх',
      info: 'Товар успішно оновлено',
      button: 'переглянути результат',
    })
  } else {
    return res.render('alert', {
      style: 'alert',
      infoStatus: 'Помилка',
      info: 'Не вдалося оновити товар',
      button: 'повернутись назад',
    })
  }
})

// ================================================================
router.get('/product-delete', function (req, res) {
  const { id } = req.query

  Product.deleteById(Number(id))
  res.render('alert', {
    style: 'alert',
    infoStatus: 'Успіх',
    info: 'Товар видалено',
    button: 'повернутися назад',
  })
})

// ================================================================
// Підключаємо роутер до бек-енду
module.exports = router
