/// <reference types="cypress" />
const convenios = require('../../fixtures/path.json')

describe('Convenios', () => {
    it('Procesar Pago', () => {

        let path = convenios.convenios.path
        
        cy.fixture('../fixtures/convenios/procesarPago.xml').then((body) => {
            let xmlString = body;
            let parser = new DOMParser();
            let xml = parser.parseFromString(xmlString, "application/xml");
            
            cy.postMethod(path, body).then((response) => {
                let xmlString = response.body;
                let parser = new DOMParser();
                let xml = parser.parseFromString(xmlString, "application/xml");

                console.log(xml)
                
            })
        })
    })
})