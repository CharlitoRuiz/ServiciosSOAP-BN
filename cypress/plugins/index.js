/// <reference types="cypress" />
/// <reference types="@shelex/cypress-allure-plugin" />

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars

//* Plugin de Allure-Reporter
const allureWriter = require('@shelex/cypress-allure-plugin/writer');
// import allureWriter from "@shelex/cypress-allure-plugin/writer";

module.exports = (on, config) => {

  on('task', {
    sqlServerDB: sql => {
      return execSQL(sql, config.env.db1)
    },
  })

  allureWriter(on, config);
  return config
}

/**
 * It takes a SQL query and a config object, and returns a promise that resolves to the rows returned
 * by the query.
 * @param sql - The SQL query to execute.
 * @param config - This is the configuration object that Tedious needs to connect to the database.
 * @returns The function execSQL is being returned.
 */
const tedious = require('tedious')
function execSQL(sql, config) {
  const connection = new tedious.Connection(config);
  return new Promise((res, rej) => {
    connection.on('connect', err => {
      if (err) {
        rej(err);
      }

      const request = new tedious.Request(sql, function (err, rowCount, rows) {
        return err ? rej(err) : res(rows);
      });

      connection.execSql(request);
    });
  })
}


