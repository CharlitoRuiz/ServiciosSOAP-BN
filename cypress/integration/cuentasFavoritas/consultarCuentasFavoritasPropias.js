/// <reference types="cypress" />
const cuentasFavoritas = require('../../fixtures/path.json')

describe('Cuentas Favoritas', ()  => {
    it('Consultar Cuentas Favoritas Propias', () => {

        let path = cuentasFavoritas.cuentasFavoritas.path
        cy.fixture('../fixtures/cuentasFavoritas/consultarCuentasFavoritasPropias.xml').then((body) => {
            cy.postMethod(path, body).then((response) => {

                let xmlString = response.body;
                let parser = new DOMParser();
                let xml = parser.parseFromString(xmlString, "application/xml");
                
                    cy.convertToJson(xml).then((json) =>{
                        expect(json).not.to.be.empty
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:cuentasIB"]["sn:RowSet0_Row"][1]["sn:Cuenta"]).equal('100-01-208-000084-2')
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:cuentasIB"]["sn:RowSet0_Row"][1]["sn:Secuencia"]).equal('17368876')
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:cuentasIB"]["sn:RowSet0_Row"][1]["sn:CtaNombre"]).equal('100-01-208-000084-2  JOSETH CASTRO JIMENEZ')
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:cuentasIB"]["sn:RowSet0_Row"][1]["sn:ACTIVADA"]).equal('2021-08-18T12:01:51.917-06:00')
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:cuentasIB"]["sn:RowSet0_Row"][1]["sn:Correo"]).equal("jcastroj@bncr.fi.cr")
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:cuentasIB"]["sn:RowSet0_Row"][1]["sn:esPropia"]).equal('N')
                        expect(json["env:Body"]["sn:respuesta"]["xmlns:sn"]).equals('http://www.bncr.fi.cr/soa/SN_ConsultaCuentasFavoritasPropias')
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"]).equals('0')
                        expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:mensaje"]).equals('Transacción Completa')
                    })

                    expect(response.status).eq(200)
                    assert.equal(response.headers['content-type'], 'text/xml; charset=utf-8')
            })
        })
    })

})