//Configuramos los parametros de la grafica (medidor circular)
var data = [
    {
        domain: { x: [0, 1], y: [0, 1] },
        value: 450,
        title: {
            text: "Variable recibida de la Pycom" },
            type: "indicator",
            mode: "gauge+number",
            delta: { reference: 400 },
            gauge: { axis: { range: [null, 500] } }
        }
    ];

//Creamos una configuracion para dimensionar la grafica
var layout = { width: 600, height: 400 };

//Creamos la grafica
Plotly.newPlot('temperature', data, layout);

//Con esta funcion actualizamos y animamos la grafica
function updateGauge(gaugeValue) {
    //Creamos una animacion de la grafica contenida dentro de 'temperature'
    Plotly.animate('temperature',{

        //Aqui cambiamos el valor mostrado por la grafica
        data: [{value: gaugeValue}],
        traces: [0],
        layout: {}
    }, {
        //Aqui definimos transiciones, duraciones y modos de animacion
        transition: {
            duration: 500,
            easing: 'cubic-in-out'
            },
        frame: {
                duration: 500
            }
        }
    )
}