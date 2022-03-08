/// <reference types="cypress" />
const tarjetas = require('../../fixtures/path.json')

describe('Tarjetas', ()  => {
    it('Consultar Tarjetas Cliente', () => {

        let path = tarjetas.tarjetas.path

        cy.fixture('../fixtures/tarjetas/consultarTarjetasCliente.xml').then((body) => {

            cy.postMethod(path, body).then((response) => {

                let xmlString = response.body;
                let parser = new DOMParser();
                let xml = parser.parseFromString(xmlString, "application/xml");
                
                    cy.convertToJson(xml).then((json) =>{
                        expect(json).not.to.be.empty
                        expect(json["env:Body"]["sn:respuesta"]["xmlns:sn"]).equals('http://www.bncr.fi.cr/soa/SN_ConsultaDeTarjetasCliente')
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"]).equals('00')
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:mensaje"]).equals('Transacción completa')
                    })

                    expect(response.status).eq(200)
                    assert.equal(response.headers['content-type'], 'text/xml; charset=utf-8')
            })
        })
    })
})