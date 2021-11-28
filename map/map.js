let A = ""
let B = ""

ymaps.ready(init)

async function fetchOHLC() {
    try {
        return fetch("http://192.168.88.128:8001/map_get")
            .then((res) => res.json())
            .then((json) => {
                console.log(json)

                A = json.pointa
                B = json.pointb
                return {
                    A,
                    B
                }

            })
            .catch(function (error) {
                console.log(error);
            });
    } catch (e) {
        console.log(e);
    }
}

async function calcDistMas() {
    let length_m = 'asd'
    let length_c = 'asd'
    let time_m = 'asd'
    let time_c = 'asd'
    var m = {
        l_m: 'asd',
        l_c: 'asd',
        t_m: 'asd',
        t_c: 'asd',
    }

    await fetchOHLC().then(data => {
        A = data.A, B = data.B
    })
    console.log(A)

    

    var multiRouteMas = new ymaps.multiRouter.MultiRoute({
        referencePoints: [
            `${ A }`,
            `Красноярск, ж/д станция ${ B } Россия`
        ],
        params: {
            routingMode: 'masstransit',
            results: 1
        }
    }, {
        // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
        boundsAutoApply: true
    })


    myMap.geoObjects.add(multiRouteMas)

    console.log( multiRouteMas.masstransit)

    console.log(await multiRouteMas.waitsucces())

   
        // Получение ссылки на активный маршрут.
        var activeRoute = await multiRouteMas.waitsucces()
        // Вывод информации о маршруте.
        m.l_m = activeRoute.properties.get("distance").text
        m.t_m = activeRoute.properties.get("duration").text
        m.t_m = m.t_m.replace('.', '')

        console.log("Длина маршрута поездки на электричке: " + m.l_m)
        console.log("Время прохождения поезда: " + m.t_m)
        // Для автомобильных маршрутов можно вывести 
        // информацию о перекрытых участках.
        if (activeRoute.properties.get("blocked")) {
            console.log("На маршруте имеются участки с перекрытыми дорогами.")
        }
        console.log("AA: " + m.l_m)
        console.log("BB: " + m.t_m)




    

    var multiRouteCar = new ymaps.multiRouter.MultiRoute({
        referencePoints: [
            `${ A }`,
            `Красноярск, ж/д станция ${ B } Россия`
        ],
        params: {
            
        }
    }, {
        // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
        boundsAutoApply: true
    })


    myMap.geoObjects.add(multiRouteCar)

    
        // Получение ссылки на активный маршрут.
        var activeRoute = await multiRouteCar.waitsucces()
        // Вывод информации о маршруте.
        m.l_c = activeRoute.properties.get("distance").text
        // length = length.split(' ')
        m.t_c = activeRoute.properties.get("duration").text
        m.t_c = m.t_c.replace('.', '')
        // time = time.split(' ')
        console.log("Длина: " + m.l_c);
        console.log("Время прохождения машины: " + m.t_c);

        // Для автомобильных маршрутов можно вывести 
        // информацию о перекрытых участках.
        
        // console.log("AA: " + length);
        // console.log("BB: " + time);

    



    fetch('/map_ok', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                c: {
                    length_c: m.l_c,
                    time_c: m.t_c,
                },
                m: {
                    length_m: m.l_m,
                    time_m: m.t_m
                }
            })

        })
        .then(response=>{
            if(response.redirected)
            window.location = response.url
        })

    // await fetchOHLC().then(data => {
    //     A = data.A, B = data.B
    // })
    // console.log(A)

    ymaps.route([
        // 'Москва, улица Крылатские холмы',
        // {
        //     point: 'Москва, метро Молодежная',
        //     // метро "Молодежная" - транзитная точка
        //     // (проезжать через эту точку, но не останавливаться в ней).
        //     type: 'viaPoint'
        // },
        // [55.731272, 37.447198], // метро "Кунцевская".
        // 'Москва, метро Пионерская'
        `${ A }`,
        `Красноярск, ж/д станция ${ B } Россия`],
        {
            multiRoute: false,
            routingMode: "masstransit"
        }
        
    ).then(function (route) {
        //myMap.geoObjects.add(route);
        // Зададим содержание иконок начальной и конечной точкам маршрута.
        // С помощью метода getWayPoints() получаем массив точек маршрута.
        // Массив транзитных точек маршрута можно получить с помощью метода getViaPoints.
        // var points = route.getWayPoints(),
        //     lastPoint = points.getLength() - 1;
        // // Задаем стиль метки - иконки будут красного цвета, и
        // // их изображения будут растягиваться под контент.
        // points.options.set('preset', 'islands#redStretchyIcon');
        // // Задаем контент меток в начальной и конечной точках.
        // points.get(0).properties.set('iconContent', 'Точка отправления');
        // points.get(lastPoint).properties.set('iconContent', 'Точка прибытия');

        // Проанализируем маршрут по сегментам.
        // Сегмент - участок маршрута, который нужно проехать до следующего
        // изменения направления движения.
        // Для того, чтобы получить сегменты маршрута, сначала необходимо получить
        // отдельно каждый путь маршрута.
        // Весь маршрут делится на два пути:
        // 1) от улицы Крылатские холмы до станции "Кунцевская";
        // 2) от станции "Кунцевская" до "Пионерская".

        var moveList = 'Трогаемся,</br>',
            way,
            segments;
        // Получаем массив путей.
       
        // for (var i = 0; i < route.getPaths().getLength(); i++) {
        //     way = route.getPaths().get(i);
        //     segments = way.getSegments();
        console.log( multiRouteMas.masstransit.TransferSegmentModel);
        //     for (var j = 0; j < segments.length; j++) {
        //         var street = segments[j].getStreet();
        //         moveList += ('Едем ' + segments[j].getHumanAction() + (street ? ' на ' + street : '') + ', проезжаем ' + segments[j].getLength() + ' м.,');
        //         moveList += '</br>'
        //     }
        // }
        // moveList += 'Останавливаемся.';
        // // Выводим маршрутный лист.
        // $('#list').append(moveList);
    })

}

async function calcDistCar() {

}

async function init() {
    
    geolocation = ymaps.geolocation
    myMap = new ymaps.Map('map', {
        center: [56, 92.55],
        zoom: 11,
        controls: ['smallMapDefaultSet']
    }, {
        searchControlProvider: 'yandex#search'
    });


    ymaps.multiRouter.MultiRoute.prototype.waitsucces = async function () {
        return new Promise((resolve, reject) => {
            if(this.getActiveRoute()){resolve(this.getActiveRoute())}
            else { this.model.events.add('requestsuccess', () => {
                
                resolve(this.getActiveRoute())
            })
        }
        })
    }

    // geolocation.get({
    //     provider: 'yandex',
    //     mapStateAutoApply: true
    // }).then(function (result) {
    //     // Красным цветом пометим положение, вычисленное через ip.
    //     result.geoObjects.options.set('preset', 'islands#redCircleIcon');
    //     result.geoObjects.get(0).properties.set({
    //         balloonContentBody: 'Мое местоположение'
    //     });
    //     myMap.geoObjects.add(result.geoObjects);
    // });

    // geolocation.get({
    //     provider: 'browser',
    //     mapStateAutoApply: true
    // }).then(function (result) {
    // Синим цветом пометим положение, полученное через браузер.
    // Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.
    //     result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
    //     myMap.geoObjects.add(result.geoObjects)
    // });

    await calcDistMas()
    
    // console.log("1: " + m.l_m);
    // console.log("2: " + m.t_m);
    // console.log("3: " + m.l_c);
    // console.log("4: " + m.t_c);
}