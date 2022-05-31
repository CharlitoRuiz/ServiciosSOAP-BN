/// <reference types="cypress" />
const convenios = require('../../fixtures/path.json')

describe('Convenios', () => {
    it('Procesar Pago Convenios', () => {
        let path = convenios.convenios.path

        cy.fixture('../fixtures/convenios/procesarPagoConvenios.xml').then((body) => {
            cy.postMethod(path, body).then((response) => {
                expect(response.status).eq(200)
                assert.equal(response.headers['content-type'], 'text/xml; charset=utf-8')
            })
        })
    })
})