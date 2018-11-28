import path from 'path';
import express from 'express';


const publicPath = path.join(__dirname, '/public');
export const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

export const server = app.listen(
	port, () => console.log(`express init, listening to port ${port}`),
);
