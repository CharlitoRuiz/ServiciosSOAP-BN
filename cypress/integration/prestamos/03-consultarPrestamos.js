/// <reference types="cypress" />
const prestamos = require('../../fixtures/path.json')

describe('Prestamos', ()  => {
    it('Consultar Prestamos', () => {

        let path = prestamos.prestamos.path
        const failOnStatusCode = false

        cy.fixture('../fixtures/prestamos/consultarPrestamos.xml').then((body) => {
 
            cy.postMethod(path, body, failOnStatusCode).then((response) => {

                let xmlString = response.body;
                let parser = new DOMParser();
                let xml = parser.parseFromString(xmlString, "application/xml");
                
                if(response.status == 200){

                    cy.convertToJson(xml).then((json) =>{
                        expect(json).not.to.be.empty
                        expect(json["soapenv:Body"]["xmlns:sn"]).equals('http://www.bncr.fi.cr/soa/SN_ConsultaPrestamos')

                        if (json["soapenv:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:prestamos"]["sn:prestamo"].length > 1) {
                            json["soapenv:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:prestamos"]["sn:prestamo"].forEach(function(value, index, array) {
                                expect(json["soapenv:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:prestamos"]["sn:prestamo"][index]["sn:numeroCuenta"])
                                .length(22)
                            });
                        }
                    
                        else{
                            expect(json["soapenv:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:prestamos"]["sn:prestamo"][0]["sn:numeroCuenta"])
                            .length(22)
                        }

                        expect(json["soapenv:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"]).equals('00')
                        expect(json["soapenv:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:mensaje"]).equals('Transaccion completa')
                    })

                    expect(response.status).eq(200)
    
                }else{
                    
                    cy.convertToJson(xml).then((json) =>{
                        expect(json).not.to.be.empty
                        
                        assert.fail('Código ' + json["soapenv:Body"]["soapenv:Fault"]["detail"]["con:fault"]["con:errorCode"]
                            + ', ' + json["soapenv:Body"]["soapenv:Fault"]["detail"]["con:fault"]["con:reason"])
                    })
                }
                
                assert.equal(response.headers['content-type'], 'text/xml; charset=utf-8')
            })
        })
    })
})