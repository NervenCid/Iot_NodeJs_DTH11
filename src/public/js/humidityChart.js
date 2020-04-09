//Configuramos los parametros de la grafica (medidor circular)
var dataHumidity = [
    {
        domain: { x: [0, 1], y: [0, 1] },
        value: 0,
        title: {
            text: "Humedad" },
            type: "indicator",
            mode: "gauge+number",
            gauge: { axis: { range: [null, 100] } }
        }
    ];

//Creamos una configuracion para dimensionar la grafica
var layoutHumidity = {
    autosize: false,
    width: 300,
    height: 200,
    margin: {
        l: 30,
        r: 30,
        b: 2,
        t: 10,
        pad: 4
      }
};

//Creamos la grafica
Plotly.newPlot('humidityChart', dataHumidity, layoutHumidity);

//Con esta funcion actualizamos y animamos la grafica
function updateGaugeHumidity(gaugeValue) {
    //Creamos una animacion de la grafica contenida dentro de 'humidityChart'
    Plotly.animate('humidityChart',{

        //Aqui cambiamos el valor mostrado por la grafica
        data: [{value: gaugeValue}],
        traces: [0],
        layout: {}
    }, {
        //Aqui definimos transiciones, duraciones y modos de animacion
        transition: {
            duration: 1,
            easing: 'cubic-in-out'
            },
        frame: {
                duration: 5
            }
        }
    )
}