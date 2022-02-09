/// <reference types="cypress" />
const convenios = require('../../fixtures/path.json')

describe('Convenios', () => {
    it('Consultar Recibos Frecuentes', () => {
        let path = convenios.convenios.path
        cy.fixture('../fixtures/convenios/consultarRecibosFrecuentes.xml')
        .then((body) => {
            cy.postMethod(path, body).then((response) => {
                console.log(response.body)
                expect(response.status).eq(200)
                expect(response.body).contains('CNFL')
                expect(response.body).not.to.be.empty
                assert.equal(response.headers['content-type'], 'text/xml; charset=utf-8')
                //cy.screenshot()
            })
        })
        
    })
})