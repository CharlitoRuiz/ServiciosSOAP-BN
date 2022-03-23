/// <reference types="cypress" />
const movimientosIBC = require('../../fixtures/path.json')

describe('Consultar Movimientos', () => {
    it('Consultar Movimientos Corporativo', () => {

        let path = movimientosIBC.consultaMovimientos.path

        cy.fixture('../fixtures/consultaMovimientos/consultarMovimientosCorporativo.xml').then((body) => {
            
            cy.postMethod(path, body).then((response) => {
                
                let xmlString = response.body;
                let parser = new DOMParser();
                let xml = parser.parseFromString(xmlString, "application/xml");
                
                    cy.convertToJson(xml).then((json) =>{
                        expect(json).not.to.be.empty
                
                        if(json["soapenv:Body"]["xmlns:sn"] == 'http://www.bncr.fi.cr/soa/SN_ConsultaMovimientosCorporativo'){
                            expect(json["soapenv:Body"]["xmlns:sn"]).equals('http://www.bncr.fi.cr/soa/SN_ConsultaMovimientosCorporativo')
                        }
                        else{
                            assert.fail('Código ' + json["soapenv:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"] 
                                + ', ' + json["soapenv:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:mensaje"])
                        }
                    })

                expect(response.status).eq(200)
                assert.equal(response.headers['content-type'], 'text/xml; charset=utf-8')
            })
        }) 
    })
})