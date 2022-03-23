/// <reference types="cypress" />
const convenios = require('../../fixtures/path.json')


describe('Convenios', () => {
    it('Consultar Recibos Frecuentes', () => {

        let path = convenios.convenios.path
        let BDlist = []

        cy.fixture('../fixtures/convenios/consultarRecibosFrecuentes.xml').then((body) => {
            let xmlString = body;
            let parser = new DOMParser();
            let xml = parser.parseFromString(xmlString, "application/xml");
            let numeroCliente = xml.getElementsByTagName("sn:numeroCliente")[0].childNodes[0].nodeValue;
            let numeroEmpresa = xml.getElementsByTagName("sn:codigoEmpresa")[0].childNodes[0].nodeValue;
            let numeroConvenio = xml.getElementsByTagName("sn:codigoConvenio")[0].childNodes[0].nodeValue;

        cy.sqlServerDB(`SELECT TOP 50 * FROM [navigatr24_sample_db].[dbo].[ib_movto_frecuente] where inuclien = ` 
        + numeroCliente +` and empresa =` + numeroEmpresa + `and convenio = ` + numeroConvenio).then((result) => {

             if (result.length == 10){
                    BDlist.push(result[8].replace(/ /g,''))
                
            } else{
                result.forEach(function(value, index, array) {
                    BDlist.push(result[index][8].replace(/ /g,''))
                });
            } 

        })

        cy.postMethod(path, body).then((response) => {
                
            let xmlString = response.body;
            let parser = new DOMParser();
            let xml = parser.parseFromString(xmlString, "application/xml");
                
            cy.convertToJson(xml).then((json) =>{
                expect(json).not.to.be.empty

                const tag = 'soap-env:Body'
                let index = xmlString.search(tag)
                        
                if(index >= 0){
                
                    if (json["soap-env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:recibosFrecuentes"]["sn:reciboFrecuente"].length > 1) {
                        json["soap-env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:recibosFrecuentes"]["sn:reciboFrecuente"].forEach(function(value, index, array) {
                            expect(json["soap-env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:recibosFrecuentes"]["sn:reciboFrecuente"][index]["sn:llave"].replace(/ /g,''))
                            .equals(BDlist[index])
                        });
                    }
                    else{
                        expect(json["soap-env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:recibosFrecuentes"]["sn:reciboFrecuente"]["sn:llave"].replace(/ /g,''))
                        .equals(BDlist[0])
                    }
                
                    expect(json["soap-env:Body"]["sn:respuesta"]["sn1:encabezado"]["xmlns:sn1"]).equals('http://www.bncr.fi.cr/soa/SN_ConsultaRecibosFrecuentes')
                    expect(json["soap-env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"]).equals('00')
                    expect(json["soap-env:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:mensaje"]).equals('Transacción completa')
                
                }else{
                    
                    assert.fail('Código ' + json["soapenv:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:estado"] 
                        + ', ' + json["soapenv:Body"]["sn:respuesta"]["sn:cuerpo"]["sn:salidaServicio"]["sn:resultado"]["sn:mensaje"])
                }
            })
                expect(response.status).eq(200)
                assert.equal(response.headers['content-type'], 'text/xml; charset=utf-8')
            })
        })
    })
})
