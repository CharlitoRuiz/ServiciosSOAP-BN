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
                
                expect(json["soapenv:Body"]["xmlns:sn"]).equals('http://www.bncr.fi.cr/soa/SN_ConsultaMovimientosCorporativo')
            
            })
                expect(response.status).eq(200)
                assert.equal(response.headers['content-type'], 'text/xml; charset=utf-8')
            })
        })
        
    })
})