/// <reference types="cypress" />
const saldos = require('../../fixtures/path.json')


describe('saldos', () => {
    it('Consultar Saldos Corporativo', () => {

        let path = saldos.saldos.path
        let BDlist = []

        cy.fixture('../fixtures/saldos/consultarSaldosCorporativo.xml').then((body) => {
            let xmlString = body;
            let parser = new DOMParser();
            let xml = parser.parseFromString(xmlString, "application/xml");
            

        cy.postMethod(path, body).then((response) => {
                
            let xmlString = response.body;
            let parser = new DOMParser();
            let xml = parser.parseFromString(xmlString, "application/xml");
                
            cy.convertToJson(xml).then((json) =>{
                expect(json).not.to.be.empty
                
                expect(json["env:Body"]["sn:respuesta"]["xmlns:sn"]).equals('http://www.bncr.fi.cr/soa/SN_ConsultaSaldosCorporativo')
                expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"]).equals('0')
                expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:mensaje"]).equals('Transacción Completa')
            })
                expect(response.status).eq(200)
                assert.equal(response.headers['content-type'], 'text/xml; charset=utf-8')
            })
        })
        
    })
})