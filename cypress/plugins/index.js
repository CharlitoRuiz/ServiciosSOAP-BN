/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {

  on('task', {
    sqlServerDB: sql => {
      return execSQL(sql, config.env.db1)
    },
  })

  return config
}

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


