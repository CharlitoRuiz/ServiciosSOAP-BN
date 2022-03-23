/// <reference types="cypress" />
const cuentasFavoritas = require('../../fixtures/path.json')

describe('Cuentas Favoritas', ()  => {
    it('Consultar Cuentas Favoritas Propias', () => {

        let path = cuentasFavoritas.cuentasFavoritas.path
        let BDlist = []

        cy.fixture('../fixtures/cuentasFavoritas/consultarCuentasFavoritasPropias.xml').then((body) => {
            let xmlString = body;
            let parser = new DOMParser();
            let xml = parser.parseFromString(xmlString, "application/xml");
            let numeroCliente = xml.getElementsByTagName("sn:Cliente")[0].childNodes[0].nodeValue;

        cy.sqlServerDB(`SELECT TOP 1000 * FROM [navigatr24_sample_db].[dbo].[IB_CUENTA_ALTERNA] where INUCLIEN = ` + numeroCliente).then((result) => {
            // Si solo es una fila de la tabla
             if (result.length == 18){
                 BDlist.push(result[2].replace(/ /g,'') + result[3].replace(/ /g,'') + result[4].replace(/ /g,'') + result[5].replace(/ /g,'')
                 + result[6])
                 BDlist.sort()
            
            // si son mas de una fila de la tabla
            } else{
                result.forEach(function(value, index, array) {
                    BDlist.push(result[index][2].replace(/ /g,'') + result[index][3].replace(/ /g,'') + result[index][4].replace(/ /g,'') + result[index][5].replace(/ /g,'')
                    + result[index][6])
                    BDlist.sort()
                });
            } 

        })
            cy.postMethod(path, body).then((response) => {

                let xmlString = response.body;
                let parser = new DOMParser();
                let xml = parser.parseFromString(xmlString, "application/xml");
                
                    cy.convertToJson(xml).then((json) =>{
                        expect(json).not.to.be.empty
                        expect(json["env:Body"]["sn:respuesta"]["xmlns:sn"]).equals('http://www.bncr.fi.cr/soa/SN_ConsultaCuentasFavoritasPropias')

                        if(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"] == 99){
                            assert.fail('Código ' + json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"] 
                                + ', ' + json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:mensaje"])
                        }
                        else{
                            // si es mas de una fila de la tabla
                            if (json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:cuentasIB"]["sn:RowSet0_Row"].length > 1) {
                                json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:cuentasIB"]["sn:RowSet0_Row"].forEach(function(value, index, array) {
                                    expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:cuentasIB"]["sn:RowSet0_Row"][index]["sn:Cuenta"].replace(/-/g,''))
                                    .equals(BDlist[index])
                                    expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:cuentasIB"]["sn:RowSet0_Row"][index]["sn:esPropia"]).equal('N')
                                });
                            }
                            // si es solo una fila de la tabla
                            else{
                                expect(json["env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:cuentasIB"]["sn:RowSet0_Row"]["sn:Cuenta"].replace(/-/g,''))
                                .equals(BDlist[0])
                            }
                        
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