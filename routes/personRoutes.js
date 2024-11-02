const express = require('express');
const Person = require('../models/Person');
const router = express.Router()
const { jwtAuthMiddleware, generateToken } = require('./../jwt');
const localAuthMiddleware = require('../auth');

//Signup
router.post('/signup', async (req, res) => {
    try {
        const data = req.body

        // Create a new Person decument using the Mongoose model
        const newPerson = new Person(data);

        // Save the new person in database
        const response = await newPerson.save();
        console.log('data saved');

        const payload = {
            id: response.id,
            username: response.username
        }
        
        const token = generateToken(payload)
        console.log('Token is:', token);
        
        res.status(200).json({response:response, token:token})

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server Error' });

    }

})

// Login router
router.post('/login', async (req, res)=>{
    try { 
        // Extract username and password from request body
        const {username, password} = req.body;

        // Find the user bu username
        const user = await Person.findOne({username:username})
        
        // If user does not exist or password does not match, return error
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error:"Invalid username or password"});
        }

        // generate Token 
        const payload = {
            id: user.id,
            username: user.username
        }

        const token = generateToken(payload);
        res.json({token})

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// Profile Route
router.get('/profile', jwtAuthMiddleware, async (req, res)=>{
    try {
        const userData = req.user;
        console.log("User data",userData);

        const userID = userData.id;
        const user = await Person.findById(userID);

        res.status(200).json(user)  ;      
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

router.get('/',jwtAuthMiddleware, async (req, res) => {
    try {
        const data = await Person.find()
        console.log('data fetched');
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server Error' });
    }
})

router.get('/:worktype', async (req, res) => {
    try {
        const worktype = req.params.worktype;
        if (worktype == 'chef' || worktype == 'manager' || worktype == 'waiter') {
            const response = await Person.find({ work: worktype })
            console.log('data fetched');
            res.status(200).json(response)
        } else {
            res.status(404).json({ error: 'Invalid work type' })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server Error' });

    }
})

router.put('/:id', async (req, res) => {
    try {
        const personId = req.params.id; // Extract the id from the URL parameter
        const updatedPersonData = req.body; // Updated data for the person

        const response = await Person.findByIdAndUpdate(personId, updatedPersonData, {
            new: true, // Return the updated document
            runValidators: true // Run Mongoose Validation
        })

        if (!response) {
            return res.status(404).json({ error: 'Person not found ' })
        }

        console.log('data updated');
        res.status(200).json(response)

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server Error' });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const personId = req.params.id;

        const response = await Person.findByIdAndDelete(personId);
        if (!response) {
            return res.status(404).json({ error: 'Person not found ' })
        }
        console.log('data deletes');
        res.status(200).json({ message: "person Deleted Successfully" })


    } catch (error) {

    }
})

module.exports = router