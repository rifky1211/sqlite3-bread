const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { parse } = require("path");
const port = 3000;
const sqlite3 = require("sqlite3").verbose();
const dbFile = __dirname + "/crud.db";
var moment = require("moment"); // require

let db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (err) => {
  if (err) throw err;
});

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  const url = req.url == "/" ? "/?page=1" : req.url;
  let query = `select * from crud limit 2 offset 0`;
  let queryCount = `select count (*) as total from crud`;
  var page = parseInt(req.query.page) || 1;
  var size = 2;
  var offset = (page - 1) * size;
  let string = req.query.string;
  let angka = parseInt(req.query.integer);
  let desimal = parseFloat(req.query.float);
  let start = req.query.start;
  let end = req.query.end;
  let booleann = req.query.boolean;
  let params = [];

  if (page) {
    query = `select * from crud limit ${size} offset ${offset}`;
  }
  if (string || angka || desimal || start || end || booleann) {
    params.push({ string: string, angka, desimal, start, end, booleann });
  }

  if (params.length) {
    query = `select * from crud where `;
    queryCount = `select count (*) as total from crud where`;

    let flag = 0;
    let limit = ` limit 2 offset ${offset}`;
    if (params[0].string) {
      query += ` string like '%${params[0].string}%' `;
      queryCount += ` string like '%${params[0].string}%' `;
      flag = 1;
    }
    if (params[0].angka) {
      if (flag == 1) {
        query += ` AND`;
        queryCount += ` AND`;
      }
      query += ` angka = ${params[0].angka} `;
      queryCount += ` angka = ${params[0].angka} `;
      flag = 1;
    }
    if (params[0].desimal) {
      if (flag == 1) {
        query += ` AND`;
        queryCount += ` AND`;
      }
      query += ` desimal = ${params[0].desimal} `;
      queryCount += ` desimal = ${params[0].desimal} `;
      flag = 1;
    }
    if (params[0].start && params[0].end) {
      if (flag == 1) {
        query += ` AND`;
        queryCount += ` AND`;
      }
      query += ` tanggal between '${params[0].start}' and '${params[0].end}' `;
      queryCount += ` tanggal between '${params[0].start}' and '${params[0].end}' `;
      flag = 1;
    }
    if (params[0].booleann) {
      if (flag == 1) {
        query += ` AND`;
        queryCount += ` AND`;
      }
      query += ` booleann = '${params[0].booleann}' `;
      queryCount += ` booleann = '${params[0].booleann}' `;
    }
    query += ` ${limit}`;
  }
  db.all(queryCount, [], (err, rows) => {
    if (err) throw err;
    if (rows) {
      var jumlahData = rows[0].total;
      var jumlahHalaman = Math.ceil(jumlahData / 2);
    }
    db.all(query, [], (err, rows) => {
      if (err) throw err;
      if (rows) {
        res.render("index", {
          data: rows,
          jumlahData,
          jumlahHalaman,
          page,
          moment: moment,
          url,
          string,
          angka,
          desimal,
          start,
          end,
          booleann,
        });
      }
    });
  });
});

app.get("/add", (req, res) => res.render("add"));
app.post("/add", (req, res) => {
  let query = `insert into crud(string,angka,desimal,tanggal,booleann) values('${req.body.string}', ${req.body.integer}, ${req.body.float}, '${req.body.date}', '${req.body.boolean}')`;
  db.run(query, (err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.get("/delete/:id", (req, res) => {
  let index = req.params.id;
  let query = `DELETE FROM crud where id_data = '${index}'`;
  db.run(query, (err) => {
    if (err) throw err;

    res.redirect("/");
  });
});

app.get("/edit/:id", (req, res) => {
  let index = req.params.id;
  let query = `select * from crud where id_data = '${index}'`;
  db.get(query, [], (err, row) => {
    if (err) throw err;
    if (row) {
      res.render("edit", { data: row });
    }
  });
});

app.post("/edit/:id", (req, res) => {
  let index = req.params.id;
  let query = `update crud set string = '${req.body.string}', angka = ${req.body.integer}, desimal = ${req.body.float}, tanggal = '${req.body.date}', booleann = '${req.body.boolean}' where id_data = '${index}'`;
  db.run(query, [], (err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});