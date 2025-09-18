const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'src')));

// Path to config-fields.json
const CONFIG_FIELDS_PATH = path.join(__dirname, 'src', 'DATA', 'config-fields.json');

// Get all templates
app.get('/api/templates', (req, res) => {
    try {
        const data = fs.readFileSync(CONFIG_FIELDS_PATH, 'utf8');
        const templates = JSON.parse(data);
        res.json(templates);
    } catch (error) {
        console.error('Error reading templates:', error);
        res.status(500).json({ error: 'Failed to read templates' });
    }
});

// Update a template
app.put('/api/templates/:index', (req, res) => {
    try {
        const index = parseInt(req.params.index);
        const updatedTemplate = req.body;

        const data = fs.readFileSync(CONFIG_FIELDS_PATH, 'utf8');
        const templates = JSON.parse(data);

        if (index < 0 || index >= templates.length) {
            return res.status(404).json({ error: 'Template not found' });
        }

        templates[index] = updatedTemplate;
        fs.writeFileSync(CONFIG_FIELDS_PATH, JSON.stringify(templates, null, 2), 'utf8');

        res.json(updatedTemplate);
    } catch (error) {
        console.error('Error updating template:', error);
        res.status(500).json({ error: 'Failed to update template' });
    }
});

// Create a new template
app.post('/api/templates', (req, res) => {
    try {
        const newTemplate = req.body;

        const data = fs.readFileSync(CONFIG_FIELDS_PATH, 'utf8');
        const templates = JSON.parse(data);

        templates.push(newTemplate);
        fs.writeFileSync(CONFIG_FIELDS_PATH, JSON.stringify(templates, null, 2), 'utf8');

        res.status(201).json(newTemplate);
    } catch (error) {
        console.error('Error creating template:', error);
        res.status(500).json({ error: 'Failed to create template' });
    }
});

// Delete a template
app.delete('/api/templates/:index', (req, res) => {
    try {
        const index = parseInt(req.params.index);

        const data = fs.readFileSync(CONFIG_FIELDS_PATH, 'utf8');
        const templates = JSON.parse(data);

        if (index < 0 || index >= templates.length) {
            return res.status(404).json({ error: 'Template not found' });
        }

        templates.splice(index, 1);
        fs.writeFileSync(CONFIG_FIELDS_PATH, JSON.stringify(templates, null, 2), 'utf8');

        res.status(200).json({ message: 'Template deleted successfully' });
    } catch (error) {
        console.error('Error deleting template:', error);
        res.status(500).json({ error: 'Failed to delete template' });
    }
});

// Serve the template manager page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'template-manager.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});