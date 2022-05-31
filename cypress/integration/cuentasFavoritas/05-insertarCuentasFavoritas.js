/// <reference types="cypress" />
const cuentasFavoritas = require('../../fixtures/path.json')

describe('Cuentas Favoritas', () => {
    it('Insertar Cuentas Favoritas', () => {

        let path = cuentasFavoritas.cuentasFavoritas.path

        cy.fixture('../fixtures/cuentasFavoritas/insertarCuentasFavoritas.xml').then((body) => {

            let xmlString = body;
            let parser = new DOMParser();
            let xml = parser.parseFromString(xmlString, "application/xml");
            let numeroCliente = xml.getElementsByTagName("sn:numeroCliente")[0].childNodes[0].nodeValue;
            let numeroCuenta = xml.getElementsByTagName("sn:Producto")[0].childNodes[0].nodeValue +
                xml.getElementsByTagName("sn:Moneda")[0].childNodes[0].nodeValue +
                xml.getElementsByTagName("sn:Oficina")[0].childNodes[0].nodeValue +
                xml.getElementsByTagName("sn:numeroCuenta")[0].childNodes[0].nodeValue +
                xml.getElementsByTagName("sn:digitoVerificador")[0].childNodes[0].nodeValue

            cy.postMethod(path, body).then((response) => {

                let xmlString = response.body;
                let parser = new DOMParser();
                let xml = parser.parseFromString(xmlString, "application/xml");

                cy.convertToJson(xml).then((json) => {
                    expect(json).not.to.be.empty
                    expect(json["env:Body"]["sn:respuesta"]["xmlns:sn"]).equal('http://www.bncr.fi.cr/soa/SN_InsercionCuentasFavoritas')

                    if (json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"] == 99) {
                        assert.fail('Código ' + json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"]
                            + ', ' + json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:mensaje"])
                    }
                    else {

                        cy.sqlServerDB(`SELECT [PRODUCTO] + [MONEDA] + [OFICINA] + [CORRELATIVO] + [DIGITO] AS NumeroCuenta FROM [navigatr24_sample_db].[dbo].[IB_CUENTA_ALTERNA] WHERE [INUCLIEN] = ` + numeroCliente +
                            `AND [INGRESO] = (SELECT MAX([INGRESO]) FROM [navigatr24_sample_db].[dbo].[IB_CUENTA_ALTERNA] WHERE [INUCLIEN] = ` + numeroCliente + `)`).then((result) => {

                                expect(result).equals(numeroCuenta)
                            })

                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"]).equals('0')
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:mensaje"]).equals('Transacción Completa')
                    }
                })

                expect(response.status).eq(200)
                assert.equal(response.headers['content-type'], 'text/xml; charset=utf-8')
            })
        })
    })
})