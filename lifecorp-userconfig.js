/**
 * 09-06-2016
 * User config helper for Lifecorp nodejs projects.
 * ~~ Scott Johnson
 */


/** List jshint ignore directives here. **/
/* jslint node: true */
/* global JSON:false */

var Q = require( 'q' );
var path = require( 'path' );
var os = require( 'os' );
var fs = require( 'fs' );
var fse = require( 'fs-extra' );
var USER_HOME_PATH = path.resolve( os.homedir() );
var USER_LIFECORP_PATH = path.join( USER_HOME_PATH, '.lifecorp' );
var USER_CONFIG_PATH = path.join( USER_LIFECORP_PATH, 'lifecorp-config.json' );

var LifecorpUser = module.exports = function(){
	var oConfig = null;

	var self = {
		getConfig: function( fnCallback ){
			var deferred;
			var cConfigJson, oConfig;

			if ( oConfig ) {
				deferred = Q.defer();
				deferred.resolve( oConfig );

				if ( fnCallback ) {
					fnCallback.call( self, oConfig );
				}

				return deferred.promise;
			}

			return self.loadConfig( fnCallback );
		},// /getConfig()

		getConfigPath: function(){
			return USER_CONFIG_PATH;
		},// /getConfigPath()
		
		loadConfig: function( fnCallback ){
			var deferred = Q.defer();
			var cConfigJson, oConfig;

			// Make sure the config file exists.
			fse.ensureFileSync( USER_CONFIG_PATH );

			// Read in the config file.
			cConfigJson = fs.readFileSync( USER_CONFIG_PATH, 'utf8' );

			if ( cConfigJson.length < 1 ) {
				// File is empty.
				fse.outputFileSync( USER_CONFIG_PATH, '{}' );
				return {};
			}

			try {
				oConfig = JSON.parse( cConfigJson );

			}catch( e ){
				console.log( 'Failed to parse file:', USER_CONFIG_PATH );

				/**
				 * Try and parse it again so the failed parse shows in the
				 * console to the user.
				 */
				JSON.parse( cConfigJson );

			}

			if ( fnCallback ) {
				fnCallback.call( self, oConfig );
			}

			deferred.resolve( oConfig );
			return deferred.promise;
		},// /loadConfig()

		/**
		 * Validates if the config file has specific properties and if those
		 * properties are of a specific type. Typical properties are author_name, author_email ...etc.
		 */
		require: function( aProperties, fnCallback ){
			var deferred = Q.defer();
			
			this.getConfig()
			.then(function( oConfig ){
				var i, l, oProp, aErrors = [];

				for( i = 0, l = aProperties.length; i < l; i++ ) {
					oProp = aProperties[i];

					if ( !oConfig.hasOwnProperty( oProp.name ) ) {
						aErrors.push( ''.concat( 'Config has no "',oProp.name,'" property.' ) );
						continue;
					}

					if ( typeof oConfig[ oProp.name ] != oProp.type ) {
						aErrors.push( ''.concat( 'Config property "',oProp.name,'" must be a ',oProp.type,'.' ) );
						continue;
					}
				}// /for()

				deferred.resolve( aErrors );
			
				if ( fnCallback ) {
					fnCallback.call( self, aErrors );
				}

			}).done();
			
			return deferred.promise;
		}// /require()

	};// /self{}
	
	return self;
};// /LifecorpUser()