"use strict"; // This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

exports.__esModule = true;
exports.environment = void 0;
exports.environment = {
  production: false,
  urlSignal: 'https://integrav4-signalrcore.bsginstitute.com',
  urlServicioAPI: 'https://integrav5-servicios.bsginstitute.com/api',
  urlServicioAPIReplica: 'https://integrav5-replica-servicios.bsginstitute.com/api'
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.