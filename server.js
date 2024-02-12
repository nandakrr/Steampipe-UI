const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/runcmd', (req, res) => {
    const { companyName, accessKey, secretKey, sessionToken, exportFormat } = req.body;

    // Adjust the command to set environment variables using echo
    const exportCommands = `export AWS_ACCESS_KEY_ID=${accessKey} && export AWS_SECRET_ACCESS_KEY=${secretKey} && export AWS_SESSION_TOKEN=${sessionToken}`;
    
    // Specific command to run with dynamic file format
    const specificCommand = `steampipe check aws_compliance.benchmark.all_controls --export=${companyName}${exportFormat}`;

    const commandToRun = `${exportCommands} && cd /home/ubuntu/steampipe-mod-aws-well-architected/ && ${specificCommand}`;

    // Execute the adjusted command with an increased maxBuffer
    exec(commandToRun, { maxBuffer: 1024 * 1024 * 10 }, (error) => {
        if (error) {
            console.error(`Error executing command: ${error.message}`);
            res.status(500).json({ error: 'Error executing command' });
            return;
        }
        res.json({ message: 'executed' }); // Send a JSON response with a success message
    });
});

app.get('/download/:companyName:exportFormat', (req, res) => {
    const companyName = req.params.companyName;
    const exportFormat = req.params.exportFormat;

    // Specify the directory where the files are stored
    const directoryPath = '/home/ubuntu/steampipe-mod-aws-well-architected/';

    // Find the file matching the company name and export format
    const filePath = path.join(directoryPath, `${companyName}${exportFormat}`);

    // Send the file as an attachment for download
    res.download(filePath, `${companyName}${exportFormat}`, (err) => {
        if (err) {
            console.error(`Error downloading file: ${err.message}`);
            res.status(500).json({ error: 'Error downloading file' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
