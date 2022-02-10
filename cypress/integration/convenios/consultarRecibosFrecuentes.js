/// <reference types="cypress" />
const convenios = require('../../fixtures/path.json')


describe('Convenios', () => {
    it('Consultar Recibos Frecuentes', () => {

        let path = convenios.convenios.path
        cy.fixture('../fixtures/convenios/consultarRecibosFrecuentes.xml').then((body) => {
            cy.postMethod(path, body).then((response) => {
                
                let xmlString = response.body;
                let parser = new DOMParser();
                let xml = parser.parseFromString(xmlString, "application/xml");
                
                    cy.convertToJson(xml).then((json) =>{
                        console.log(json)
                        expect(json).not.to.be.empty
                        json["soap-env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:recibosFrecuentes"]["sn:reciboFrecuente"].forEach(function(value, index, array) {
                            expect(json["soap-env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:recibosFrecuentes"]["sn:reciboFrecuente"][index]["sn:leyenda"])
                            .contains("CNFL - RECIBOS DE ELECTRICIDAD CNFL")
                            console.log(json["soap-env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:recibosFrecuentes"]["sn:reciboFrecuente"][index]["sn:leyenda"])
                        });
                        expect(json["soap-env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:recibosFrecuentes"]["sn:reciboFrecuente"][0]["sn:llave"].replace(/ /g,'')).equal('27556326')
                        expect(json["soap-env:Body"]["sn:respuesta"]["sn1:encabezado"]["xmlns:sn1"]).equals('http://www.bncr.fi.cr/soa/SN_ConsultaRecibosFrecuentes')
                        expect(json["soap-env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"]).equals('00')
                        expect(json["soap-env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:mensaje"]).equals('Transacción completa')
                    })
                
                expect(response.status).eq(200)
                assert.equal(response.headers['content-type'], 'text/xml; charset=utf-8')
            })
        })
        
    })
})