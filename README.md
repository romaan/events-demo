# Events Demo

I have implemented the basic functionality asked for in the assignment. I have not
gone ahead implemented a bootstrap CSS framework or writing test cases.

I have used GraphQL, NextJS and React framework. I have also dockerised the demo.

I have also not organised the code into components, only because it was a simple App.

# Build Docker

```
docker build -t demo-event .
docker run --name demo-event -d -p 3000:3000 demo-event 
```sh
