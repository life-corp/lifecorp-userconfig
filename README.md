# lifecorp-userconfig
The best app ever..

## Installation
```shell
npm install git+https://github.com/life-corp/lifecorp-userconfig.git
```

### Useage:

```js
var lifecorpUserConfig = require( 'lifecorp-userconfig' )();

lifecorpUserConfig.getConfig()
.then(function( oUserConfig ){
	console.log( 'Lifecorp config path:', lifecorpUserConfig.getConfigPath() );
	console.log( ' ' );
	console.log( oUserConfig );
})
```