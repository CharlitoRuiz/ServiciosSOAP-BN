/// <reference types="cypress" />
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getMethod', (path) => {
    cy.request({
        method:'GET', 
        url: '' + path,
        headers: {}
    }).then((response) => {
        return response
    })
})

Cypress.Commands.add('postMethod', (path, body) => {
    cy.request({
        method:'POST', 
        url: Cypress.config("baseUrl") + path,
        headers: {
            "ContentType": "text/xml; charset=utf-8"
        },
        body: body
    }).then((response) => {
        return response
    })
})