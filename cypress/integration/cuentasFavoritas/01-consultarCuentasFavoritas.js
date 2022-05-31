/// <reference types="cypress" />
const cuentasFavoritas = require('../../fixtures/path.json')

describe('Cuentas Favoritas', () => {
    it('Consultar Cuentas Favoritas', () => {

        let path = cuentasFavoritas.cuentasFavoritas.path
        cy.fixture('../fixtures/cuentasFavoritas/consultarCuentasFavoritas.xml').then((body) => {
            cy.postMethod(path, body).then((response) => {

                let xmlString = response.body;
                let parser = new DOMParser();
                let xml = parser.parseFromString(xmlString, "application/xml");

                cy.convertToJson(xml).then((json) => {
                    expect(json).not.to.be.empty
                    expect(json["env:Body"]["sn:respuesta"]["xmlns:sn"]).equals('http://www.bncr.fi.cr/soa/SN_ConsultaCuentasFavoritas')

                    if (json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"] == 99) {
                        assert.fail('Código ' + json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"]
                            + ', ' + json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:mensaje"])
                    }
                    else {
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"]).equals('0')
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:mensaje"]).equals('Transacción Completa')
                    }
                })

                // Validacion de codigos
                expect(response.status).eq(200)
                assert.equal(response.headers['content-type'], 'text/xml; charset=utf-8')
            })
        })
    })
})