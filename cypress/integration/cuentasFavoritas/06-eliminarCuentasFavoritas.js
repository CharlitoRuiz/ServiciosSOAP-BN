/// <reference types="cypress" />
const cuentasFavoritas = require('../../fixtures/path.json')

describe('Cuentas Favoritas', () => {
    it('Eliminar Cuentas Favoritas', () => {

        let path = cuentasFavoritas.cuentasFavoritas.path
        let BDlist = []

        cy.fixture('../fixtures/cuentasFavoritas/eliminarCuentasFavoritas.xml').then((body) => {
            let xmlString = body;
            let parser = new DOMParser();
            let xml = parser.parseFromString(xmlString, "application/xml");
            let numeroCliente = xml.getElementsByTagName("sn:numeroCliente")[0].childNodes[0].nodeValue;
            let numeroCuenta = xml.getElementsByTagName("sn:producto")[0].childNodes[0].nodeValue +
                xml.getElementsByTagName("sn:moneda")[0].childNodes[0].nodeValue +
                xml.getElementsByTagName("sn:oficina")[0].childNodes[0].nodeValue +
                xml.getElementsByTagName("sn:numeroCuenta")[0].childNodes[0].nodeValue +
                xml.getElementsByTagName("sn:digitoVerificador")[0].childNodes[0].nodeValue

            cy.postMethod(path, body).then((response) => {

                let xmlString = response.body;
                let parser = new DOMParser();
                let xml = parser.parseFromString(xmlString, "application/xml");

                cy.sqlServerDB(`SELECT TOP 1000 * FROM [navigatr24_sample_db].[dbo].[IB_CUENTA_ALTERNA] where INUCLIEN = ` + numeroCliente).then((result) => {
                    // Si solo es una fila de la tabla
                    if (result.length == 18) {
                        BDlist.push(result[2].replace(/ /g, '') + result[3].replace(/ /g, '') + result[4].replace(/ /g, '') + result[5].replace(/ /g, '')
                            + result[6])
                        expect(BDlist[0]).not.includes(numeroCuenta)

                    } else {
                        result.forEach(function (value, index, array) {
                            BDlist.push(result[index][2].replace(/ /g, '') + result[index][3].replace(/ /g, '') + result[index][4].replace(/ /g, '') + result[index][5].replace(/ /g, '')
                                + result[index][6])
                            expect(BDlist[index]).not.includes(numeroCuenta)
                        });
                    }

                })

                cy.convertToJson(xml).then((json) => {
                    expect(json).not.to.be.empty
                    expect(json["env:Body"]["sn:respuesta"]["xmlns:sn"]).equals('http://www.bncr.fi.cr/soa/SN_EliminaCuentasFavoritas')

                    if (json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"] == 99) {
                        assert.fail('Código ' + json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"]
                            + ', ' + json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:mensaje"])
                    }
                    else {
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:cuentasEliminadas"]["sn:cuentaEliminada"]["sn:estado"]).equals('1')
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:cuentasEliminadas"]["sn:cuentaEliminada"]["sn:mensaje"]).equals('Cuenta Eliminada')
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"]).equals('0')
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:mensaje"]).equals('Transaccion Completa')
                    }
                })

                expect(response.status).eq(200)
                assert.equal(response.headers['content-type'], 'text/xml; charset=utf-8')
            })
        })
    })
})