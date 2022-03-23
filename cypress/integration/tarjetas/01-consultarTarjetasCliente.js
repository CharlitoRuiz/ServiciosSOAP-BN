/// <reference types="cypress" />
const tarjetas = require('../../fixtures/path.json')

describe('Tarjetas', ()  => {
    it('Consultar Tarjetas Cliente', () => {

        let path = tarjetas.tarjetas.path

        cy.fixture('../fixtures/tarjetas/consultarTarjetasCliente.xml').then((body) => {

            cy.postMethod(path, body).then((response) => {

                let xmlString = response.body;
                let parser = new DOMParser();
                let xml = parser.parseFromString(xmlString, "application/xml");
                
                    cy.convertToJson(xml).then((json) =>{
                        expect(json).not.to.be.empty
                        expect(json["env:Body"]["sn:respuesta"]["xmlns:sn"]).equals('http://www.bncr.fi.cr/soa/SN_ConsultaDeTarjetasCliente')

                        if(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"] == 99){
                            assert.fail('Código ' + json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"] 
                                + ', ' + json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:mensaje"])
                        }
                        else{

                            if (json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:tarjetas"]["sn:tarjeta"].length > 1) {
                                json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:tarjetas"]["sn:tarjeta"].forEach(function(value, index, array) {
                                    expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:tarjetas"]["sn:tarjeta"][index]["sn:numeroTarjeta"])
                                    .length(19)
                                });
                            }
                        
                            else{
                                expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:tarjetas"]["sn:tarjeta"][0]["sn:numeroTarjeta"])
                                .length(19)
                            }
                        
                            expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"]).equals('00')
                            expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:mensaje"]).equals('Transacción completa')
                        }
                    })

                    expect(response.status).eq(200)
                    assert.equal(response.headers['content-type'], 'text/xml; charset=utf-8')
            })
        })
    })
})