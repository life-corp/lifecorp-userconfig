# lifecorp-userconfig
The best app ever..

### Useage:

```
var lifecorpUserConfig = require( 'lifecorp-userconfig' )();

lifecorpUserConfig.getConfig()
.then(function( oUserConfig ){
	console.log( 'Lifecorp config path:', lifecorpUserConfig.getConfigPath() );
	console.log( ' ' );
	console.log( oUserConfig );
})
```