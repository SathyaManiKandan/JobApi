require('dotenv').config();
const connectDB = require('./db/connect');
require('express-async-errors');
const express = require('express');
const app = express();
const jobRouter = require('./routes/jobs');
const authRouter = require('./routes/auth');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authenticateUser = require('./middleware/authentication')
app.use(express.json());
// extra packages

// routes
app.use('/api/v1/auth', authRouter );
app.use('/api/v1/jobs' , authenticateUser, jobRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

 start();
