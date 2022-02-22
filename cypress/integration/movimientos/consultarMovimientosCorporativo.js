/// <reference types="cypress" />
const saldos = require('../../fixtures/path.json')


describe('movimientos', () => {
    it('Consultar Movimientos Corporativo', () => {

        let path = saldos.saldos.path

        cy.fixture('../fixtures/movimientos/consultarMovimientosCorporativo.xml').then((body) => {
            let xmlString = body;
            let parser = new DOMParser();
            let xml = parser.parseFromString(xmlString, "application/xml");
            
        cy.postMethod(path, body).then((response) => {
                
            let xmlString = response.body;
            let parser = new DOMParser();
            let xml = parser.parseFromString(xmlString, "application/xml");
                
            cy.convertToJson(xml).then((json) =>{
                expect(json).not.to.be.empty
                
                expect(json["soapenv:Body"]["xmlns:sn"]).equals('http://www.bncr.fi.cr/soa/SN_ConsultaMovimientos')
            
            })
                expect(response.status).eq(200)
                assert.equal(response.headers['content-type'], 'text/xml; charset=utf-8')
            })
        })
        
    })
})