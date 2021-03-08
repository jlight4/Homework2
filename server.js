const Express = require('express');
const BodyParser = require('body-parser');
const Mongoose = require('mongoose');
const fs = require('fs');
const ProductService = require('./models/dataService');
const UserService = require('./models/dataService');

const Product = require('./models/product');
const User = require('./models/user');

const app = Express();

app.use(BodyParser.json());

const doActionThatMightFailValidation = async (request, response, action) => {
  try {
    await action();
  } catch (e) {
    response.sendStatus(
      e.code === 11000
      || e.stack.includes('ValidationError')
      || (e.reason !== undefined && e.reason.code === 'ERR_ASSERTION')
        ? 400 : 500,
    );
  }
};

// Product controls
app.get('/products', async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    response.json(await ProductService.getProducts());
  });
});

app.get('/products/:sku', async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    const getResult = await ProductService.getProductSku(request);
    if (getResult != null) {
      response.json(getResult);
    } else {
      response.sendStatus(404);
    }
  });
});

app.post('/products', async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    await new Product(request.body).save();
    response.sendStatus(201);
  });
});

app.delete('/products', async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    response.sendStatus((Product.deleteMany(request.query).deletedCount > 0 ? 200 : 404));
  });
});

app.delete('/products/:sku', async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    response.sendStatus((ProductService.deleteProductSku().deletedCount > 0 ? 200 : 404));
  });
});

app.put('/products/:sku', async (request, response) => {
  const { sku } = request.params;
  const product = request.body;
  product.sku = sku;
  await doActionThatMightFailValidation(request, response, async () => {
    await ProductService.putProductSku(sku, product);
  });
  response.sendStatus(200);
});

app.patch('/products/:sku', async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    const { sku } = request.params;
    const product = request.body;
    delete product.sku;
    const patchResult = await ProductService.patchProductSku(sku, product);
    if (patchResult != null) {
      response.json(patchResult);
    } else {
      response.sendStatus(404);
    }
  });
});

// User controls
app.get('/user', async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    response.json(await UserService.getUsers());
  });
});

app.post('/user', async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    await new User(request.body).save();
    response.sendStatus(201);
  });
});

app.delete('/user', async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    response.sendStatus((User.deleteMany(request.query).deletedCount > 0 ? 200 : 404));
  });
});

app.patch('/user/:ssn', async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    const { ssn } = request.params;
    const user = request.body;
    delete user.ssn;
    const patchResult = await UserService.patchUserSsn(ssn, user);
    if (patchResult != null) {
      response.json(patchResult);
    } else {
      response.sendStatus(404);
    }
  });
});

const passcode = fs.readFileSync('./Passcode/mongoDBpasscode.txt').toString();

(async () => {
  await Mongoose.connect(passcode, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  app.listen(8000);
})();
