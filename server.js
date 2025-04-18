// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');  // For generating unique client IDs

// Create the Express app
const app = express();

// Enable CORS for all origins
app.use(cors());

// Use body-parser to handle JSON data in the request body
app.use(bodyParser.json());

// GA4 Measurement Protocol configuration
const GA_MEASUREMENT_ID = 'G-8LT2WWTHY6';  // Replace with your GA4 Measurement ID
const GA_API_SECRET = 'h8xBnaQqSQOmed3VaQwScg';  // Replace with your API Secret

// Define the POST route for the form submission
app.post('/submit', async (req, res) => {
    const { name } = req.body;  // Get the name from the client-side form submission
    console.log('Received name:', name);  // Log the data to the console

    // Generate a unique client ID (this can be stored in a cookie or session for each user)
    const clientId = uuidv4();

    // Prepare the payload for GA4 Measurement Protocol
    const payload = {
        client_id: clientId,  // Use a unique client ID for each user/session
        events: [
            {
                name: 'test_event',  // Event name
                params: {
                    ep_name: name,  // Event parameter (user name from the form)
                    session_id: uuidv4(),  // Use a new session ID or session tracking if needed
                    engagement_time_msec: 100,  // Engagement time for the event (can be adjusted)
                }
            }
        ]
    };

    try {
        // Send the data to GA4 using Measurement Protocol
        const response = await axios.post(`https://www.google-analytics.com/mp/collect?api_secret=${GA_API_SECRET}`, payload);

        console.log('Data sent to GA4 successfully!', response.data);

        // Send a success response back to the client
        res.json({ message: 'Data received and sent to GA4 successfully!' });
    } catch (error) {
        console.error('Error sending data to GA4:', error);
        res.status(500).json({ message: 'Error sending data to GA4' });
    }
});

// Set the port to listen on
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
