# enthusto
![screenshot](https://user-images.githubusercontent.com/296551/56260641-023e8480-60a6-11e9-9204-b52bde09ec9f.png)

## develop locally

> npm run start
or
> nodemon app.js

make sure you have mongo running in another tab
> mongod

## push to zeit


```
#copy .env.example to .env.prod and change mongolab uri
MONGOLAB_URI=mongodb://myuser:mypass@mymlabhash.mlab.com:31512/mydb
```


```
now --dotenv=.env.prod --public --npm

#make it point to enthusto.now.sh
now alias enthusto  

## free up instances
now ls enthusto
now rm enthusto
```

alltogether
```
now rm enthusto -y
now --dotenv=.env.prod --public --npm
now alias enthusto  
```

####possible TODOs

dont use roomID, use already established socket connections, namespace etc..

### socket reference
https://stackoverflow.com/a/40829919/403403

based off https://github.com/sahat/hackathon-starter
