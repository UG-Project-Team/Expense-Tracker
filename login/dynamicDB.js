const mongoose = require('mongoose');
let connections = {}; // Cache for database connections

/**
 * Get a connection to a specific database dynamically
 * @param {String} dbName
 * @returns mongoose.Connection
 */
function getDatabaseConnection(dbName) {
    if (!connections[dbName]) {
        const dbURI = `mongodb://localhost:27017/${dbName}`;
        connections[dbName] = mongoose.createConnection(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        connections[dbName].on('connected', () => {
            console.log(`Connected to database: ${dbName}`);
        });

        connections[dbName].on('error', (err) => {
            console.error(`Error connecting to database: ${dbName}`, err);
        });
    }
    return connections[dbName];
}

module.exports = { getDatabaseConnection };
