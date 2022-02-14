/// <reference types="cypress" />
const cuentasFavoritas = require('../../fixtures/path.json')

describe('Cuentas favoritas', ()  => {
    it('Consultar Datos Cuenta', () => {

        let path = cuentasFavoritas.cuentasFavoritas.path
        let BDlist = []

        cy.fixture('../fixtures/cuentasFavoritas/consultarDatosCuenta.xml').then((body) => {
            let xmlString = body;
            let parser = new DOMParser();
            let xml = parser.parseFromString(xmlString, "application/xml");
            let numeroCuenta = xml.getElementsByTagName("sn:Producto")[0].childNodes[0].nodeValue + xml.getElementsByTagName("sn:Moneda")[0].childNodes[0].nodeValue +
            xml.getElementsByTagName("sn:Oficina")[0].childNodes[0].nodeValue + xml.getElementsByTagName("sn:numeroCuenta")[0].childNodes[0].nodeValue +
            xml.getElementsByTagName("sn:digitoVerificador")[0].childNodes[0].nodeValue;

            cy.postMethod(path, body).then((response) => {

                let xmlString = response.body;
                let parser = new DOMParser();
                let xml = parser.parseFromString(xmlString, "application/xml");

                cy.convertToJson(xml).then((json) =>{
                    expect(json).not.to.be.empty

                    let numeroCuentaResponse = json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:items"]["sn:item"]["sn:Producto"] + 
                    json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:items"]["sn:item"]["sn:Moneda"] + 
                    json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:items"]["sn:item"]["sn:Oficina"] + 
                    json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:items"]["sn:item"]["sn:numeroCuenta"] + 
                    json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:items"]["sn:item"]["sn:digitoVerificador"]
                    
                    expect(numeroCuenta).eq(numeroCuentaResponse)
                    expect(json["env:Body"]["sn:respuesta"]["xmlns:sn"]).equals('http://www.bncr.fi.cr/soa/SN_ConsultaDatosCuenta')

                    })

                    expect(response.status).eq(200)
                    assert.equal(response.headers['content-type'], 'text/xml; charset=utf-8')
                })
            })
        })
})