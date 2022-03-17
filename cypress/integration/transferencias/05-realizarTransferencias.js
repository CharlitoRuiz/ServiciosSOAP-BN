/// <reference types="cypress" />
const transferencias = require('../../fixtures/path.json')

describe('Transferencias', ()  => {
    it('Realizar Transferencias', () => {

        let path = transferencias.transferencias.path

        cy.fixture('../fixtures/transferencias/realizarTransferencias.xml').then((body) => {
            let xmlString = body;
            let parser = new DOMParser();
            let xml = parser.parseFromString(xmlString, "application/xml");
            let numeroCuentaOrigen = xml.getElementsByTagName("sn:productoOrigen")[0].childNodes[0].nodeValue + xml.getElementsByTagName("sn:monedaOrigen")[0].childNodes[0].nodeValue +
            xml.getElementsByTagName("sn:oficinaOrigen")[0].childNodes[0].nodeValue + xml.getElementsByTagName("sn:numeroCuentaOrigen")[0].childNodes[0].nodeValue +
            xml.getElementsByTagName("sn:digitoVerificadorOrigen")[0].childNodes[0].nodeValue;
            let numeroCuentaDestino = xml.getElementsByTagName("sn:productoDestino")[0].childNodes[0].nodeValue + xml.getElementsByTagName("sn:monedaDestino")[0].childNodes[0].nodeValue +
            xml.getElementsByTagName("sn:oficinaDestino")[0].childNodes[0].nodeValue + xml.getElementsByTagName("sn:numeroCuentaDestino")[0].childNodes[0].nodeValue +
            xml.getElementsByTagName("sn:digitoVerificadorDestino")[0].childNodes[0].nodeValue;
            

            cy.postMethod(path, body).then((response) => {

                let xmlString = response.body;
                let parser = new DOMParser();
                let xml = parser.parseFromString(xmlString, "application/xml");
                
                    cy.convertToJson(xml).then((json) =>{
                        expect(json).not.to.be.empty
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:cuentaAcreditada"].replace(/-/g,'')).equals(numeroCuentaDestino)
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:cuentaDebitada"].replace(/-/g,'')).equals(numeroCuentaOrigen)
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:Comprobante"]).not.to.be.empty
                        expect(json["env:Body"]["sn:respuesta"]["xmlns:sn"]).equals('http://www.bncr.fi.cr/soa/SN_RealizaTransferencias')
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"]).equals('0')
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:mensaje"]).equals('Transacción procesada')
                    })

                    expect(response.status).eq(200)
                    assert.equal(response.headers['content-type'], 'text/xml; charset=utf-8')
            })
        })
    })
})