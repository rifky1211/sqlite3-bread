const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const port = 3000;
const sqlite3 = require("sqlite3").verbose();
const dbFile = __dirname + "/crud.db";

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

app.get('/', (req, res) => {
  let query = `SELECT * FROM crud limit 2 offset 0`
  var page = parseInt(req.query.page);
  let size = parseInt(req.query.size);
  let offset = page * size;
  if(page && size){
    query = `select * from crud limit ${size} offset ${offset}`
  }
  db.all(query,[], (err, rows) => {
    db.all('select * from crud', (err,rowss) => {
      if(rowss){
        var jumlahData = rowss.length
        var jumlahHalaman = Math.ceil(jumlahData / 2);
      }
      if(rows){
        
        res.render('index', {data: rows, jumlahData, jumlahHalaman, page})
      }
    })
  })
})

app.post('/', (req, res) => {
  var page = parseInt(req.query.page);
  let query = `select * from crud where tanggal BETWEEN '${req.body.start}' and '${req.body.end}' and string like '%${req.body.string}%' and angka = ${req.body.integer} and desimal = ${req.body.float} and booleann = '${req.body.boolean}'`
  db.all(query, [], (err, rows) => {
  
      if(rows){
        var jumlahData = rows.length
        var jumlahHalaman = Math.ceil(jumlahData / 2);
        res.render('index', {data: rows, jumlahData, jumlahHalaman, page})
      }
    
  })
})

// app.post('/', (req, res) => {
//   let page = parseInt(req.query.page);
//   let size = parseInt(req.query.size);
//   let offset = page * size;
//   let query = `SELECT * FROM crud limit ${size} offset ${offset} `
  
//   db.all(query, [], (err, rows) => {
//     if(err) throw err

//     if(rows){
//       res.render('index', {data: rows})
//     }
//   })
// })


// app.get('/?page=:page', (req, res) => {
//   let page = req.query.page;
//   console.dir(page)
// })

// app.get('/page/:id', (req, res) => {
//   let halamanAktif = req.params.id;
//   let jumlahDataPerHalaman = 2;
//     // let jumlahData = rows.length;
//     // let jumlahHalaman = Math.ceil(jumlahData / 2);
//     let awalData = (jumlahDataPerHalaman * halamanAktif) - jumlahDataPerHalaman
//     let query1 = `SELECT * FROM crud`
// let query2 = `SELECT * FROM crud limit ${awalData},${jumlahDataPerHalaman}`
// db.all(query2, [], (err, rows) => {
//   if(err) throw err

//   if(rows){
//     res.render('page', {data: rows})
//   }
// })

// })

app.get('/add', (req, res) => res.render('add'))
app.post('/add', (req, res) => {
  let query = `insert into crud(string,angka,desimal,tanggal,booleann) values('${req.body.string}', ${req.body.integer}, ${req.body.float}, '${req.body.date}', '${req.body.boolean}')`
  db.run(query, (err) => {
    if(err) throw err;
    res.redirect('/')
  })
})

app.get('/delete/:id', (req, res) => {
  let index = req.params.id;
  let query = `DELETE FROM crud where id_data = '${index}'`
  db.run(query, (err) => {
    if(err) throw err;

    res.redirect('/')
  })
})


app.get('/edit/:id', (req,res) => {
  let index = req.params.id;
  let query = `select * from crud where id_data = '${index}'`
  db.get(query,[], (err, row) => {
    if(err) throw err;
    if(row){
      res.render('edit', {data: row})
    }
  })
})

app.post('/edit/:id', (req, res) => {
  let index = req.params.id;
  let query = `update crud set string = '${req.body.string}', angka = ${req.body.integer}, desimal = ${req.body.float}, tanggal = '${req.body.date}', booleann = '${req.body.boolean}' where id_data = '${index}'`
  db.run(query, [], (err) => {
    if(err) throw err;
    res.redirect('/')
  })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = db