/// <reference types="cypress" />
const prestamos = require('../../fixtures/path.json')

describe('Prestamos', ()  => {
    it('Procesar Pago Prestamos', () => {

        let path = prestamos.prestamos.path

        cy.fixture('../fixtures/prestamos/procesarPagoPrestamos.xml').then((body) => {
            let xmlString = body;
            let parser = new DOMParser();
            let xml = parser.parseFromString(xmlString, "application/xml");
            let numeroPrestamo = xml.getElementsByTagName("sn:numeroPrestamo")[0].childNodes[0].nodeValue;
            
            cy.postMethod(path, body).then((response) => {

                let xmlString = response.body;
                let parser = new DOMParser();
                let xml = parser.parseFromString(xmlString, "application/xml");
                
                    cy.convertToJson(xml).then((json) =>{
                        expect(json).not.to.be.empty
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:numeroPrestamo"]).equals(numeroPrestamo)
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:reciboSFB"]).to.not.equals(0)
                        expect(json["env:Body"]["sn:respuesta"]["xmlns:sn"]).equals('http://www.bncr.fi.cr/soa/SN_PagoPrestamo')
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"]).equals('00')
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:mensaje"]).equals('Transacción exitosa')
                    })

                    expect(response.status).eq(200)
                    assert.equal(response.headers['content-type'], 'text/xml; charset=utf-8')
            })
        })
    })
})