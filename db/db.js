const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/spa_hw_db');
const { STRING, UUID, UUIDV4, } = Sequelize.DataTypes;

const User = conn.define('user', {
    name: {
        type: STRING
    }
});

const Language = conn.define('language', {
    name: {
        type: STRING
    }
});

const Learning = conn.define('learning', {});

const data = {
    users: ['Leona', 'LeBron', 'Goku', 'Veigar'],
    languages: ['Korean', 'French', 'Swahili' , 'Spanish', 'Navajo']
};

User.hasMany(Learning);
Learning.belongsTo(User);
Learning.belongsTo(Language);

const syncAndSeed = async() => {
    try {
        await conn.sync({ force: true });
        const [leona, lebron, goku, veigar] = await Promise.all(data.users.map((name) => User.create({name})));
        const [korean, french, swahili, spanish, navajo] = await Promise.all(data.languages.map((name) => Language.create({name})));
        await Promise.all([
            Learning.create({userId: leona.id, languageId: korean.id}),
            Learning.create({userId: lebron.id, languageId: spanish.id}),
            Learning.create({userId: goku.id, languageId: navajo.id}),
            Learning.create({userId: goku.id, languageId: french.id}),
            Learning.create({userId: veigar.id, languageId: swahili.id}),  
        ]);
    }
    catch(ex) {
        console.log(ex);
    }
};

module.exports = {
    syncAndSeed,
    models: {
        User,
        Language,
        Learning
    },
};