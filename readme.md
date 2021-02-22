## description
This is for the generation of unique clinical trial codes (e.g. SHR1210-315) in HENGRUI PHARMA.

## deployment

### server
1. install dependencies
```
    cd <path_to_package.json>
    npm install
```
2. deploy through pm2
```
    cd src/
    pm2 start index.js --name tcg_server
    pm2 list
    pm2 logs tcg_server --lines 50000
```

### client
1. build source code
```
    cd <path_to_package.json>
    npm install
    npm run build
```
2. rename 'dist' as 'tcg_client'
2. deploy through express and pm2
```
    npm install express
    pm2 start app.js --name tcg_client
```