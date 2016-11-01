# AOTM 

## How to create SSL certificate for running local

Inside `ssl` folder run: 
``` 
$ openssl genrsa -out key.pem 1024 
$ openssl req -new -key key.pem -out certrequest.csr
... bunch of prompts
$ openssl x509 -req -in certrequest.csr -signkey key.pem -out cert.pem
```