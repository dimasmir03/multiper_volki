//map = require('./map/map')
express = require('express')
app = express()
excel = require('xlsx')
// var bodyParser = require('body-parser');
// var urlencodedParser = bodyParser.urlencoded({extended: false});

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.set('views', './views')
app.set('view engine', 'hbs')
let body
let datas = {
   mas: {

   },
   car: {

   }
}
let startStation // Станция отправления
let endStation // Станция прибытия
let typeVehicle // Тип транспорта
let wayLength // Длина маршрута (километры)
let wayTime // Время пути (минуты)
let pay = 8 // Зарплата водителя (руб/мин)
let wayCost
let bog
let bogCost
let wayCostc
let timeCostc

// Иланская
let il
let ilCost

// Мана
let mana
let manaCost

// Заозёрная
let zaoz
let zaozCost


app.listen("8001", (err) => {
   if (err) {
      console.log("Error: " + err)
      return
   }
   console.log("server is started")
   readexcel()
})

app.use('/pic', express.static(__dirname + "/pic"))
app.use('/', express.static(__dirname + "/main/"))
app.get('/', (res, req) => {
   req.sendFile(__dirname + "/main/main.html")
})

app.use('/', express.static(__dirname + "/map/"))
app.get('/map', (res, req) => {
   req.sendFile(__dirname + "/map/map.html")
})

app.post('/', (res, req) => {
   console.log(res.body);
   body = res.body

   //console.log("cost",datas.mas.cost,datas.car.cost);
   req.sendFile(__dirname + "/map/map.html")
})

app.get('/map_get', (res, req) => {
   req.json({
      pointa: body.pointa,
      pointb: body.pointb
   })
})

app.post('/map_ok', (res, req) => {
   console.log("ok", res.body);
   datas.mas = res.body.m
   datas.car = res.body.c
   //[datas.mas.cost,datas.car.cost] = bla(body)
   bla(body)
   req.redirect('/rasp.hbs')
})

app.get('/rasp.hbs', (res, req) => {
   req.render('rasp.hbs', {
      jd: {
         length: datas.mas.length_m,
         time: datas.mas.time_m,
         cost: datas.mas.cost
      },
      car: {
         length: datas.car.length_c,
         time: datas.car.time_c,
         cost: datas.car.cost
      }
   })
})

function readexcel() {
   bog = excel.readFile(__dirname + "/Krasnoyarsk - Bogotol(3).xls");
   bogCost = excel.utils.sheet_to_json(bog.Sheets[bog.SheetNames[0]])

   // Иланская
   il = excel.readFile(__dirname + "/Krasnoyarsk - Ilanskaya(2) (1).xls");
   ilCost = excel.utils.sheet_to_json(il.Sheets[il.SheetNames[0]])

   // Мана
   mana = excel.readFile(__dirname + "/Krasnoyarsk - Mana(1).xls");
   manaCost = excel.utils.sheet_to_json(mana.Sheets[mana.SheetNames[0]])

   // Заозёрная
   zaoz = excel.readFile(__dirname + "/Krasnoyarsk - Zaozernaya s  01.03.2020g.xls");
   zaozCost = excel.utils.sheet_to_json(zaoz.Sheets[zaoz.SheetNames[0]])
}

function bla(body) {
   console.log(datas);

   tariff = 9 // Тариф перевозки (руб/км)
   console.log(datas.car);
   console.log(parseInt(datas.car.time_c[0]+datas.car.time_c[1]));
   wayCostc = parseInt(datas.car.length_c[0]+datas.car.length_c[1]) * tariff
   timeCostc = parseInt(datas.car.time_c[0]+datas.car.time_c[1]) * pay
   body.pointa = "Платинум Арена"
   
   


   
   if (Object.keys(bogCost[0]).includes(body.pointa) && Object.keys(bogCost[0]).includes(body.pointb)) {
      wayCost = bogCost[Object.keys(bogCost[0]).indexOf(body.pointa) - 1][body.pointb]
      console.log(wayCost);
   } else if (Object.keys(ilCost[0]).includes(body.pointa) && Object.keys(ilCost[0]).includes(body.pointb)) {
      wayCost = ilCost[Object.keys(ilCost[0]).indexOf(body.pointa) - 1][body.pointb]
      console.log(wayCost);
   } else if (Object.keys(manaCost[0]).includes(body.pointa) && Object.keys(manaCost[0]).includes(body.pointb)) {
      wayCost = manaCost[Object.keys(manaCost[0]).indexOf(body.pointa) - 1][body.pointb]
      console.log(wayCost);
   } else if (Object.keys(zaozCost[0]).includes(body.pointa) && Object.keys(zaozCost[0]).includes(body.pointb)) {
      wayCost = zaozCost[Object.keys(zaozCost[0]).indexOf(body.pointa) - 1][body.pointb]
      console.log(wayCost);
   }
   
   

   //автобус
   // wayCost = 26
   // timeCost = 0
   //троллейбус и трамваи
   // wayCost = 22
   // timeCost = 0
   console.log(wayCost);
   datas.mas.cost = wayCost
   datas.car.cost = timeCostc + wayCostc
   // return [costm = wayCost,
   //    costc = timeCostc + wayCostc
   // ]
}