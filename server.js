const express = require('express');
const fs = require('fs');
const app = express();

// Setup
app.use(express.json());
app.use(express.static('.'));

const DATA_FILE = './data/data.json';

// Helper functions
function readData() {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET all members
app.get('/api/members', (req, res) => {
    res.json({ success: true, data: readData() });
});

// GET one member
app.get('/api/members/:id', (req, res) => {
    const members = readData();
    const member = members.find(m => m.id == req.params.id);
    res.json({ success: !!member, data: member });
});

// POST new member
app.post('/api/members', (req, res) => {
    const members = readData();
    const newMember = req.body;
    newMember.id = Math.max(...members.map(m => m.id), 0) + 1;
    members.push(newMember);
    writeData(members);
    res.json({ success: true, data: newMember });
});

// PUT update member
app.put('/api/members/:id', (req, res) => {
    const members = readData();
    const index = members.findIndex(m => m.id == req.params.id);
    if (index >= 0) {
        members[index] = { ...members[index], ...req.body, id: parseInt(req.params.id) };
        writeData(members);
        res.json({ success: true, data: members[index] });
    } else {
        res.json({ success: false });
    }
});

// DELETE member
app.delete('/api/members/:id', (req, res) => {
    const members = readData();
    const index = members.findIndex(m => m.id == req.params.id);
    if (index >= 0) {
        const deleted = members.splice(index, 1)[0];
        writeData(members);
        res.json({ success: true, data: deleted });
    } else {
        res.json({ success: false });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🏋️ Server running on port ${PORT}`));
