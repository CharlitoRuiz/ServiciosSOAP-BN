/// <reference types="cypress" />
const tarjetas = require('../../fixtures/path.json')

describe('Tarjetas', ()  => {
    it('Pagar Tarjetas', () => {

        let path = tarjetas.tarjetas.path

        cy.fixture('../fixtures/tarjetas/pagarTarjetas.xml').then((body) => {
            let xmlString = body;
            let parser = new DOMParser();
            let xml = parser.parseFromString(xmlString, "application/xml");
            let numeroCuentaOrigen = xml.getElementsByTagName("sn:productoOrigen")[0].childNodes[0].nodeValue + xml.getElementsByTagName("sn:monedaOrigen")[0].childNodes[0].nodeValue +
            xml.getElementsByTagName("sn:oficinaOrigen")[0].childNodes[0].nodeValue + xml.getElementsByTagName("sn:numeroCuentaOrigen")[0].childNodes[0].nodeValue +
            xml.getElementsByTagName("sn:digitoVerificadorOrigen")[0].childNodes[0].nodeValue;
            let tarjeta = xml.getElementsByTagName("sn:tarjeta")[0].childNodes[0].nodeValue

            cy.postMethod(path, body).then((response) => {

                let xmlString = response.body;
                let parser = new DOMParser();
                let xml = parser.parseFromString(xmlString, "application/xml");
                
                    cy.convertToJson(xml).then((json) =>{
                        expect(json).not.to.be.empty
                        expect(json["env:Body"]["sn:respuesta"]["xmlns:sn"]).equals('http://www.bncr.fi.cr/soa/SN_PagoTarjetas')

                        if(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"] == 99){
                            assert.fail('Código ' + json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"] 
                                + ', ' + json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:mensaje"])
                        }
                        else{

                            let xmlComprobante = json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:Comprobante"]
                            let parser = new DOMParser();
                            let xml = parser.parseFromString(xmlComprobante, "application/xml");

                            cy.convertToJson(xml).then((json) =>{
                                expect(json).not.to.be.empty
                                expect(json["xmlns"]).equals('http://bncr.com/GeneraComprobante')
                                expect(json["RubroEncabezado"][1]["strValorRubro"]).to.not.equals(0)
                                expect(json["RubroEncabezado"][2]["strValorRubro"]).equals(tarjeta)
                                expect(json["RubroEncabezado"][8]["strValorRubro"].replace(/-/g,'')).equals(numeroCuentaOrigen)
                            })
                        
                            expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"]).equals('00')
                            expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:mensaje"]).equals('Transaccion completa')
                        }
                    })

                expect(response.status).eq(200)
                assert.equal(response.headers['content-type'], 'text/xml; charset=utf-8')
            })
        })
    })
})