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

Cypress.Commands.add('postMethod', (path, body, failOnStatusCode) => {
    cy.request({
        method:'POST', 
        url: Cypress.config("baseUrl") + path,
        headers: {
            "ContentType": "text/xml; charset=utf-8"
        },
        body: body,
        failOnStatusCode: failOnStatusCode,
    }).then((response) => {
        return response
    })
})

Cypress.Commands.add('convertToJson', (xml) =>{
    var json = convertirXmlEnObjeto(xml)
    return json
})


// Generic function
function convertirXmlEnObjeto(xml) {
    
    let object = {};
    let isRoot = false;

    if (xml.nodeType == 1) {
        if (xml.attributes.length > 0) {
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                object[attribute.nodeName] = attribute.nodeValue;
            }
        }
    } 
    else if (xml.nodeType == 3) { 
        object = xml.nodeValue;
    } 
    else if (xml.nodeType == 9) { 
        isRoot = true;
    }

    if (xml.hasChildNodes()) {
        for(var i = 0; i < xml.childNodes.length; i++) {
            let item = xml.childNodes.item(i);
            let nodeName = item.nodeName;

            if (typeof(object[nodeName]) == "undefined") {
                if (nodeName == "#cdata-section") {
                    object = item.nodeValue;
                } 
                else if (nodeName == "#text") { 
                    if (item.childNodes.length < 1) {
                        object = item.nodeValue;
                    } 
                    else {
                        object[nodeName] = convertirXmlEnObjeto(item);
                    }
                } 
                else {
                    if (isRoot) {
                        object = convertirXmlEnObjeto(item);
                    } 
                    else {
                        object[nodeName] = convertirXmlEnObjeto(item);
                    }
                }
            } 
            else {
                if (typeof(object[nodeName].push) == "undefined") {
                    let attributeValue = object[nodeName];
                    object[nodeName] = new Array();
                    object[nodeName].push(attributeValue);
                }

                object[nodeName].push(convertirXmlEnObjeto(item));
                }
            }
        }
    
        return object;  
}

Cypress.Commands.add('sqlServerDB', (query) => {
    if (!query) {
        throw new Error('Query must be set');
    }

    cy.task('sqlServerDB', query).then(response => {
        let result = [];

        const flatten = r => Array.isArray(r) && r.length === 1 ? flatten(r[0]) : r;

        if (response) {
            for (let i in response) {
                result[i] = [];
                for (let c in response[i]) {
                    result[i][c] = response[i][c].value;
                }
            }
            result = flatten(result);
        } else {
            result = response;
        }

        return result;
    });
});
