
const express = require('express');

const app = express();

app.get("/", (request, response) => {
    response.send("hello lovely person");
});

app.listen(3030, () => {
    console.log("check out the magic at: http://localhost:3030")
})