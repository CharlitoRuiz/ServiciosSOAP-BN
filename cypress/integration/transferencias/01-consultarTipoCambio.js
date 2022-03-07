/// <reference types="cypress" />
const tipoCambio = require('../../fixtures/path.json')

describe('Transferencias', ()  => {
    it('Consultar tipo de cambio', () => {

        let path = tipoCambio.transferencias.path
        let BDlist = []

        cy.fixture('../fixtures/transferencias/consultarTipoCambio.xml').then((body) => {
            
            cy.sqlServerDB(`SELECT TOP 1000 * FROM [navigatr24_sample_db].[dbo].[IB_PARAMETRO] WHERE CAMPO in ('TCCOMPRA', 'TCVENTA', 'TCCOMPRAEURO', 'TCVENTAEURO')`).then((result) => {
                result.forEach(function(value, index, array) {
                    BDlist.push(result[index][2])
                });
            })

            cy.postMethod(path, body).then((response) => {

                let xmlString = response.body;
                let parser = new DOMParser();
                let xml = parser.parseFromString(xmlString, "application/xml");
                
                    cy.convertToJson(xml).then((json) =>{
                        expect(json).not.to.be.empty
                        expect(json["soap-env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:RowSet0"]["sn:RowSet0_Row"]["sn:TipoCompraDolares"]).equals(BDlist[0])
                        expect(json["soap-env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:RowSet0"]["sn:RowSet0_Row"]["sn:TipoVentaDolares"]).equals(BDlist[1])
                        expect(json["soap-env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:RowSet0"]["sn:RowSet0_Row"]["sn:TipoCompraEuros"]).equals(BDlist[2])
                        expect(json["soap-env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:RowSet0"]["sn:RowSet0_Row"]["sn:TipoVentaEuros"]).equals(BDlist[3])
                        expect(json["soap-env:Body"]["sn:respuesta"]["xmlns:sn"]).equals('http://www.bncr.fi.cr/soa/SN_ConsultarTipoCambio')
                    })

                    expect(response.status).eq(200)
                    assert.equal(response.headers['content-type'], 'text/xml; charset=utf-8')
            })
        })
    })
})