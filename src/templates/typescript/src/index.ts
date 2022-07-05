import app from "./app";

const port = process.env.PORT || 3000;

app.listen(port, (): void => console.log(`Server listening on Port ${port}`));
