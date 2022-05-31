/// <reference types="cypress" />

//* Command para usar la peticion GET
Cypress.Commands.add('getMethod', (path) => {
    cy.request({
        method: 'GET',
        url: '' + path,
        headers: {}
    }).then((response) => {
        return response
    })
})

//* Command para usar la peticion POST
Cypress.Commands.add('postMethod', (path, body, failOnStatusCode) => {
    cy.request({
        method: 'POST',
        url: Cypress.config("baseUrl") + path,
        headers: {
            "ContentType": "text/xml; charset=utf-8"
        },
        body: body,
        failOnStatusCode: failOnStatusCode,
    }).then((response) => {
        return response
    })
})


//* Command para convertir un xml a formato json
//* Recibe de parametro el archivo xml
Cypress.Commands.add('convertToJson', (xml) => {
    var json = convertirXmlEnObjeto(xml)
    return json
})

//* Funcion llamada en el command
function convertirXmlEnObjeto(xml) {

    let object = {};
    let isRoot = false;

    if (xml.nodeType == 1) {
        if (xml.attributes.length > 0) {
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                object[attribute.nodeName] = attribute.nodeValue;
            }
        }
    }
    else if (xml.nodeType == 3) {
        object = xml.nodeValue;
    }
    else if (xml.nodeType == 9) {
        isRoot = true;
    }

    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            let item = xml.childNodes.item(i);
            let nodeName = item.nodeName;

            if (typeof (object[nodeName]) == "undefined") {
                if (nodeName == "#cdata-section") {
                    object = item.nodeValue;
                }
                else if (nodeName == "#text") {
                    if (item.childNodes.length < 1) {
                        object = item.nodeValue;
                    }
                    else {
                        object[nodeName] = convertirXmlEnObjeto(item);
                    }
                }
                else {
                    if (isRoot) {
                        object = convertirXmlEnObjeto(item);
                    }
                    else {
                        object[nodeName] = convertirXmlEnObjeto(item);
                    }
                }
            }
            else {
                if (typeof (object[nodeName].push) == "undefined") {
                    let attributeValue = object[nodeName];
                    object[nodeName] = new Array();
                    object[nodeName].push(attributeValue);
                }

                object[nodeName].push(convertirXmlEnObjeto(item));
            }
        }
    }

    return object;
}


//* Command para convertir un xml a json, diferente a la anterior porque esta convierte para un tipo de respuesta especifico, solo se usa en el procesarPago de COnvenios
Cypress.Commands.add('convertXmlToJson', (xml) => {
    var json = xmlToJson(xml)
    return json
})

//* Funciona llamada en el command
function xmlToJson(xml) {
    try {
        var obj = {};
        if (xml.children.length > 0) {
            for (var i = 0; i < xml.children.length; i++) {
                var item = xml.children.item(i);
                var nodeName = item.nodeName;

                if (typeof (obj[nodeName]) == "undefined") {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if (typeof (obj[nodeName].Push) == "undefined") {
                        var old = obj[nodeName];

                        obj[nodeName] = [];
                        obj[nodeName].Push(old);
                    }
                    obj[nodeName].Push(xmlToJson(item));
                }
            }
        } else {
            obj = xml.textContent;
        }
        return obj;
    } catch (e) {
        console.log(e.message);
    }
}

//* Command para ejecutar un script en la BD que tenemos configurada en el archivo "cypress.json"
Cypress.Commands.add('sqlServerDB', (query) => {
    if (!query) {
        throw new Error('Query must be set');
    }

    cy.task('sqlServerDB', query).then(response => {
        let result = [];

        const flatten = r => Array.isArray(r) && r.length === 1 ? flatten(r[0]) : r;

        if (response) {
            for (let i in response) {
                result[i] = [];
                for (let c in response[i]) {
                    result[i][c] = response[i][c].value;
                }
            }
            result = flatten(result);
        } else {
            result = response;
        }

        return result;
    });
});

//* Command para rellenar los ceros antes de un string (usada para llenar el campo numero de factura del xml)
Cypress.Commands.add('RellenarCeros', (num, width) => {
    return num
        .toString()
        .padStart(width, 0)
})

