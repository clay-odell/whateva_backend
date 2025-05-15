const app = require('./app');
const pool = require('./db');

const port = 5000;

pool.connect((err) => {
    if (err) {
        console.error('Failed to connect to the database', err);
        process.exit(1);

    } else {
        console.log('Connected to the database');
    }

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});