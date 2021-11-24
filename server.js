const express = require('express');
const app = express();
const path = require('path');
const { syncAndSeed, models: {User, Language, Learning} } = require('./db/db');

app.use(express.json());

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res, next) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/users', async(req, res, next) => {
    try {
        res.send(await User.findAll())
    }
    catch(ex) {
        next(ex);
    }
});

app.get('/languages', async(req, res, next) => {
    try {
        res.send(await Language.findAll());
    }
    catch(ex) {
        next(ex);
    }
});

app.get('/users/:userId/learnings', async(req, res, next)=> {
    try {
        res.send(await Learning.findAll({ where: { userId: req.params.userId }}));
    }
    catch(ex){
      next(ex);
    }
});

app.post('/users/:userId/learnings', async(req, res, next)=> {
    try {
        const learning = await Learning.create({...req.body, userId: req.params.id});
        res.send(learning);
    }
    catch(ex){
      next(ex);
    }
});

app.delete('/learnings/:id', async(req, res, next)=> {
    try {
        const learning = await Learning.findByPk(req.params.id);
        await learning.destroy();
    }
    catch(ex){
      next(ex);
    }
});

const init = async() => {
    try {
        await syncAndSeed();
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
    }
    catch(ex) {
        console.log(ex);
    }
}

init();