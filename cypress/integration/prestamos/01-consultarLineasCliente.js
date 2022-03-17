/// <reference types="cypress" />
const lineasCliente = require('../../fixtures/path.json')

describe('Prestamos', ()  => {
    it('Consultar Lineas Cliente', () => {

        let path = lineasCliente.prestamos.path

        cy.fixture('../fixtures/prestamos/consultarLineasCliente.xml').then((body) => {
            
            cy.postMethod(path, body).then((response) => {

                let xmlString = response.body;
                let parser = new DOMParser();
                let xml = parser.parseFromString(xmlString, "application/xml");
                
                    cy.convertToJson(xml).then((json) =>{
                        expect(json).not.to.be.empty

                        if (json["soap-env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:datosLineas"]["sn:datosLinea"].length > 1) {
                            expect(json["soap-env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:datosLineas"]["sn:datosLinea"]).length.above(0)
                        }
                        else{
                            expect(json["soap-env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:datosLineas"]["sn:datosLinea"]).not.to.be.empty
                        }

                        expect(json["soap-env:Body"]["sn:respuesta"]["xmlns:sn"]).equals('http://www.bncr.fi.cr/soa/SN_ConsultaLineas')
                        expect(json["soap-env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["esq:codigo"]).equals('0')
                    })

                    expect(response.status).eq(200)
                    expect(response.body).contains('sn:datosLineas')
                    assert.equal(response.headers['content-type'], 'text/xml; charset=utf-8')
            })
        })
    })
})