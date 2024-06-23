/**
 * @format
 */
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { createChat, getDBConnection } from './react/SQLite/db-service';
import { init } from './react/SQLite/db-init';
global.Buffer = global.Buffer || require('buffer').Buffer;

getDBConnection().then(async (db) => {
    await init(db);
}).catch((error) => {
    console.log(error)
});


AppRegistry.registerComponent(appName, () => App);
