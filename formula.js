/*
    Добавить общественный транспорт
*/

excel = require('xlsx');

startStation // Станция отправления
endStation // Станция прибытия
typeVehicle // Тип транспорта
wayLength // Длина маршрута (километры)
wayTime // Время пути (минуты)
pay // Зарплата водителя (руб/мин)

// Боготол
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

// Косачи - ДЕФФЕКТНАЯ ТАБЛИЦА

if (typeVehicle == 'Легковой'){
    tariff = 9 // Тариф перевозки (руб/км)
    wayCost = wayLength * tariff
    timeCost = wayTime * pay
}
else if (typeVehicle == 'Газель'){
    tariff = 11
    wayCost = wayLength * tariff
    timeCost = wayTime * pay
}
else if (typeVehicle == 'Электрички'){
    if(Object.keys(bogCost[0]).includes(startStation) && Object.keys(bogCost[0]).includes(endStation)){
        wayCost = bogCost[Object.keys(bogCost[0]).indexOf(startStation) - 1][endStation]
    }
    else if(Object.keys(ilCost[0]).includes(startStation) && Object.keys(ilCost[0]).includes(endStation)){
        wayCost = ilCost[Object.keys(ilCost[0]).indexOf(startStation) - 1][endStation]
    }
    else if(Object.keys(manaCost[0]).includes(startStation) && Object.keys(manaCost[0]).includes(endStation)){
        wayCost = manaCost[Object.keys(manaCost[0]).indexOf(startStation) - 1][endStation]
    }
    else if(Object.keys(zaozCost[0]).includes(startStation) && Object.keys(zaozCost[0]).includes(endStation)){
        wayCost = zaozCost[Object.keys(zaozCost[0]).indexOf(startStation) - 1][endStation]
    }
    timeCost = 0
}
else if (typeVehicle == 'Автобус'){
    wayCost = 26
    timeCost = 0
}
else if (typeVehicle == 'Троллейбус' || typeVehicle == 'Трамвай'){
    wayCost = 22
    timeCost = 0
}

price = wayCost + timeCost