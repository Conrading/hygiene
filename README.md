
## BackEnd Module
```
$ npm install nodemon
```
```
$ npm install express
```
```
$ npm install body-parser
```
```
$ npm install cors
```
```
$ npm install express-fileupload
```
```
$ npm install pg
```
#### Running Server
```
$ npm run server
```
#### Notice

> FrondEnd module is stored within `patronize-frond` folder:

* remember adding `"server": "nodemon server.js"` under `"scripts"` in `package.json` inside `nodejs` folder; 
* in `package.json` in `patronize-frond` folder, adding `"proxy": "http://localhost:5011"` alongside with `"devDependencies"` same layer;
* then running *npm run server*; server listen to port 5011

> storagelist.JSON is database, storing play parameters, relevant article please refer to [Read/Write JSON Files with Node.js](https://medium.com/@osiolabs/read-write-json-files-with-node-js-92d03cc82824)
> also store in PostgreSQL
