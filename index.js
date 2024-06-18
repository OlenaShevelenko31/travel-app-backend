import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import User from './models/User.js'; 
import tracker from './routes/tracker.js'

dotenv.config();
mongoose.connect(process.env.ATLAS_URL);

const app = express();
app.use(express.json());
app.use(cors());
app.use("/tracker" , tracker)




app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      
      if (user) {
        if (user.password === password) {
          res.json({ success: true, userId: user._id });
        } else {
          res.json({ success: false, message: 'The password is incorrect' });
        }
      } else {
        res.json({ success: false, message: 'User not found' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  app.post('/', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const user = new User({ name, email, password }); 
      await user.save();
      res.json({ success: true, userId: user._id });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  });


  
  
// Global ERROR Middleware
app.use((err, req, res, next) => {
  res.status(500).send('Something went WRONG!!!');
});


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
