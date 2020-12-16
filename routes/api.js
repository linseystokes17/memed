const express = require("express");
// https://expressjs.com/en/guide/routing.html#express-router
const router = express.Router();
const watches = require("./api/watch.json");
const sql = require("mssql");
const sqlFetch = async (...args) => {
  try {
    const result = await sql.query(...args);
    const resultingRows = result.recordsets[0];
    return resultingRows;
  } catch (err) {
    const err2 = new Error(
      "Something went wrong with that last sql query. View the call stack here and more details in the next error:"
    );
    console.error(err2.message);
    console.log(err2.stack);
    throw err;
  }
};
function getPageAndCount(usersPage, usersCount, totalItems) {
  let page, count;
  if (!usersPage) {
    page = 1;
  } else {
    // parse the string as a decimal (Base 10) number
    page = parseInt(usersPage, 10);
    if (Number.isNaN(page)) {
      page = 1;
    }
  }
  if (!usersCount) {
    count = 6;
  } else {
    // parse the string as a decimal (Base 10) number
    count = parseInt(usersCount, 10);
    if (Number.isNaN(page)) {
      count = 6;
    }
  }
  var pageNum = Math.ceil(totalItems / count);
  // Set the max count can be to totalItems
  count = Math.min(totalItems, count);
  // Set the min count can be to 1
  count = Math.max(1, count);
  // Set the max page can be to pageNum
  page = Math.min(pageNum, page);
  // Set the min page can be to 1
  page = Math.max(1, page);
  return [page, count];
}
router.get("/getWatches", (req, res) => {
  // renders the index.ejs page
  res.json(watches);
});

router.get("/insurance_companies", async (req, res) => {
  const allProductsCount = await sqlFetch`
            SELECT COUNT(id) as count
             FROM insurance_companies
     `;
  const findAllCount = allProductsCount[0].count;
  let [page, count] = getPageAndCount(
    req.query.page,
    req.query.count,
    // get first row of returned results
    findAllCount
  );
  const offset = count * (page - 1);
  const insurance_companies = await sqlFetch`
    SELECT *
    FROM insurance_companies
    ORDER BY id
    OFFSET ${offset} ROWS
    FETCH NEXT ${count} ROWS ONLY
    `;
  res.json({
    insurance_companies: insurance_companies,
    count: findAllCount,
    pageNum: Math.ceil(findAllCount / count)
  });
});

router.get("/bills", async (req, res) => {
  const allProductsCount = await sqlFetch`
            SELECT COUNT(id) as count
             FROM bills
     `;
  const findAllCount = allProductsCount[0].count;
  let [page, count] = getPageAndCount(
    req.query.page,
    req.query.count,
    // get first row of returned results
    findAllCount
  );
  const offset = count * (page - 1);
  const bills = await sqlFetch`
    SELECT *
    FROM bills
    ORDER BY id
    OFFSET ${offset} ROWS
    FETCH NEXT ${count} ROWS ONLY
    `;
  res.json({
    bills: bills,
    count: findAllCount,
    pageNum: Math.ceil(findAllCount / count)
  });
});

router.get("/users", async (req, res) => {
  const allProductsCount = await sqlFetch`
            SELECT COUNT(id) as count
             FROM users
     `;
  const findAllCount = allProductsCount[0].count;
  let [page, count] = getPageAndCount(
    req.query.page,
    req.query.count,
    // get first row of returned results
    findAllCount
  );
  const offset = count * (page - 1);
  const users= await sqlFetch`
    SELECT *
    FROM users
    ORDER BY id
    OFFSET ${offset} ROWS
    FETCH NEXT ${count} ROWS ONLY
    `;
  res.json({
    users: users,
    count: findAllCount,
    pageNum: Math.ceil(findAllCount / count)
  });
});



router.get("/med_providers", async (req, res) => {
  const allProductsCount = await sqlFetch`
            SELECT COUNT(id) as count
             FROM med_providers
     `;
  const findAllCount = allProductsCount[0].count;
  let [page, count] = getPageAndCount(
    req.query.page,
    req.query.count,
    // get first row of returned results
    findAllCount
  );
  const offset = count * (page - 1);
  const med_providers = await sqlFetch`
    SELECT *
    FROM med_providers
    ORDER BY id
    OFFSET ${offset} ROWS
    FETCH NEXT ${count} ROWS ONLY
    `;
  res.json({
    med_providers: med_providers,
    count: findAllCount,
    pageNum: Math.ceil(findAllCount / count)
  });
});

router.get("/products", async (req, res) => {
  const allProductsCount = await sqlFetch`
            SELECT COUNT(id) as count
             FROM products
     `;
  const findAllCount = allProductsCount[0].count;
  let [page, count] = getPageAndCount(
    req.query.page,
    req.query.count,
    // get first row of returned results
    findAllCount
  );
  const offset = count * (page - 1);
  const products = await sqlFetch`
    SELECT *
    FROM products
    ORDER BY id
    OFFSET ${offset} ROWS
    FETCH NEXT ${count} ROWS ONLY
    `;
  res.json({
    products: products,
    count: findAllCount,
    pageNum: Math.ceil(findAllCount / count)
  });
});
module.exports = router;