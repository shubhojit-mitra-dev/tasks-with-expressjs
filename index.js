const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");

const camelCaseToTitle = (name, isTxt) => {
    let newName = name.replace(/([A-Z])/g , " $1");
    // newName = newName.toLowerCase();
    newName = isTxt ? newName.charAt(0).toUpperCase() + newName.slice(1, -4) : newName.charAt(0).toUpperCase() + newName.slice(1);
    return newName;
}

app.get('/', (req, res) => {
    fs.readdir('./files', (err, files) => {
        res.render("index", { files: files.map((file) => camelCaseToTitle(file, true))});
        if (err) console.error(err);
    })
})

app.get('/file/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}.txt`, 'utf-8', (err, data) => {
        if (err) console.error(err);
        res.render("notes", { filename: camelCaseToTitle(req.params.filename), data: data });
    })
})

app.get('/edit/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}.txt`, 'utf-8', (err, data) => {
        if (err) console.error(err);
        res.render("edit", { filename: camelCaseToTitle(req.params.filename), data: data });
    })
})

app.get('/file/delete/:filename', (req, res) => {
    fs.unlink(`./files/${req.params.filename.split(' ').join('')}.txt`, (err) => {
        if (err) console.error(err);
        res.redirect('/');
    })
});

app.post('/create', (req, res) => {
    fs.writeFile(`./files/${req.body.title.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("")}.txt`, req.body.description, (err) => {
        if (err) console.error(err);
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});