/// <reference types="cypress" />
const convenios = require('../../fixtures/path.json')

describe('Convenios', () => {
    it('Procesar Pago', () => {

        let path = convenios.convenios.path
        
        cy.fixture('../fixtures/convenios/procesarPago.xml').then((body) => {
            let xmlString = body;
            let parser = new DOMParser();
            let xml = parser.parseFromString(xmlString, "application/xml");
            let valorServicio = xml.getElementsByTagName("sn:valorServicio")[0].childNodes[0].nodeValue;
            let cuentaIBANOrigen = xml.getElementsByTagName("sn:cuentaIBANOrigen")[0].childNodes[0].nodeValue;
            let numeroFactura = xml.getElementsByTagName("sn:numeroFactura")[0].childNodes[0].nodeValue;

            const num = 1 
            let incrementoNumeroFactura = parseInt(numeroFactura) + parseInt(num);
            
            Number.prototype.zfill = function(size) {
                var numb = String(this);
                while (numb.length < (size || 2)) {
                  numb = '0' + numb;
                }
                return numb;
            }

            body = xmlString.replace(numeroFactura, incrementoNumeroFactura.zfill(20));

            cy.postMethod(path, body).then((response) => {
                let xmlString = response.body;
                let parser = new DOMParser();
                let xml = parser.parseFromString(xmlString, "application/xml");

                const msj = 'El recibo ya habia sido cancelado'
                let index = xmlString.search(msj)

                if(index >= 0){
                    cy.writeFile('cypress/fixtures/convenios/procesarPago.xml', body)    
                }

                cy.convertXmlToJson(xml).then((json) =>{
                    expect(json).not.to.be.empty
                    
                    if(json["soapenv:Envelope"]["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:recibos"]["sn:recibo"]["sn:resultado"]["esq:codigo"] == 0){
                            
                        let xmlComprobante = json["soapenv:Envelope"]["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:recibos"]["sn:recibo"]["sn:xmlComprobante"]
                        let parser = new DOMParser();
                        let xml = parser.parseFromString(xmlComprobante, "application/xml");

                        cy.writeFile('cypress/fixtures/convenios/procesarPago.xml', body)    
                        
                        cy.convertToJson(xml).then((json) =>{
                            expect(json).not.to.be.empty
                            expect(json["RubroEncabezado"][3]["strValorRubro"]).equals(valorServicio)
                            expect(json["RubroEncabezado"][8]["strValorRubro"]).to.not.equals(0)
                            expect(json["RubroEncabezado"][9]["strValorRubro"]).equals(cuentaIBANOrigen)
                        })

                        expect(json["soapenv:Envelope"]["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:recibos"]["sn:recibo"]["sn:resultado"]["esq:codigo"]).equals('0')
                        expect(json["soapenv:Envelope"]["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:recibos"]["sn:recibo"]["sn:resultado"]["esq:mensaje"]).equals('Transacción Procesada')
                    }
                    else {
                        assert.fail('Código ' + json["soapenv:Envelope"]["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:recibos"]["sn:recibo"]["sn:resultado"]["esq:codigo"] 
                            + ', ' + json["soapenv:Envelope"]["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:recibos"]["sn:recibo"]["sn:resultado"]["esq:mensaje"])
                    }
                })
            
                expect(response.status).eq(200)
                assert.equal(response.headers['content-type'], 'text/xml; charset=utf-8')
            })
        })
    })
})