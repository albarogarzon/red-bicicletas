var map = L.map('main_map').setView([-31.416668, -64.183334], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
}).addTo(map);



$.ajax({
    dataType: "json",
    url: "api/bicicletas",
    success: function (result) {
        console.log(result)
        result.bicicletas.forEach(function (bici) {
            var marker = L.marker(bici.ubicacion,{title:bici.id}).addTo(map);

        })
    }
})