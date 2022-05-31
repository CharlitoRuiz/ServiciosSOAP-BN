/// <reference types="cypress" />
const convenios = require('../../fixtures/path.json')


describe('Convenios', () => {
    it('Consultar Conectividad', () => {
        let path = convenios.convenios.path
        const failOnStatusCode = false

        cy.fixture('../fixtures/convenios/consultarConectividad.xml').then((body) => {
            let xmlString = body;
            let parser = new DOMParser();
            let xml = parser.parseFromString(xmlString, "application/xml");
            let convenio = xml.getElementsByTagName("sn:convenio")[0].childNodes[0].nodeValue
            let empresa = xml.getElementsByTagName("sn:empresa")[0].childNodes[0].nodeValue
            let tipoLlaveAcceso = xml.getElementsByTagName("sn:tipoLlaveAcceso")[0].childNodes[0].nodeValue
            let llaveAcceso = xml.getElementsByTagName("sn:llaveAcceso")[0].childNodes[0].nodeValue

            cy.postMethod(path, body, failOnStatusCode).then((response) => {
                let xmlString = response.body;
                let parser = new DOMParser();
                let xml = parser.parseFromString(xmlString, "application/xml");

                if (response.status == 200) {
                    cy.convertToJson(xml).then((json) => {
                        expect(json).not.to.be.empty
                        expect(json["env:Body"]["sn:respuesta"]["xmlns:sn"]).equals('http://www.bncr.fi.cr/soa/SN_ConectividadConsulta')
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:rubros"]["sn:rubro"]["sn:convenio"]).equals(convenio)
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:rubros"]["sn:rubro"]["sn:empresa"]).equals(empresa)
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:rubros"]["sn:rubro"]["sn:llaveAcceso"]).equals(llaveAcceso)
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:rubros"]["sn:rubro"]["sn:tipoLlaveAcceso"]).equals(tipoLlaveAcceso)
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"]).equals('00')
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:mensaje"]).equals('Transacción completa')
                    })

                    expect(response.status).eq(200)
                }

                else {
                    cy.convertToJson(xml).then((json) => {
                        expect(json).not.to.be.empty
                        assert.fail('Código ' + json["soapenv:Body"]["soapenv:Fault"]["faultstring"])
                    })
                }

                assert.equal(response.headers['content-type'], 'text/xml; charset=utf-8')
            })
        })
    })
})