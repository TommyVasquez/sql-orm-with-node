const db = require('./db');
const { Movie, Person } = db.models;
// const { Op } = require('sequelize');
const { Op } = db.Sequelize;

(async () => {
    await db.sequelize.sync({ force: true });

    try {
        const movie = await Movie.create({
            title: 'Toy Story',
            runtime: 81,
            releaseDate: '1995-11-22',
            isAvailableOnVHS: true,
        });
        // console.log(movie.toJSON());

        const movie2 = await Movie.create({
            title: 'The Incredibles',
            runtime: 115,
            releaseDate: '2004-04-14',
            isAvailableOnVHS: true,
        });
        // console.log(movie2.toJSON());

        // New Person record
        const person = await Person.create({
            firstName: 'Tom',
            lastName: 'Hanks',
        });
        // console.log(person.toJSON());

        const person2 = await Person.build({
            firstName: 'Brad',
            lastName: 'Bird',
        }); // person2 is not stored in the database yet
        await person2.save(); // person2 is now stored in the database
        // console.log(person2.toJSON());

        // New instance
        const movie3 = await Movie.build({
            title: 'Toy Story 3',
            runtime: 103,
            releaseDate: '2010-06-18',
            // isAvailableOnVHS: false,
        });
        await movie3.save(); // save the record
        // console.log(movie3.toJSON());

        // const movieById = await Movie.findByPk(1);
        // console.log(movieById.toJSON());

        // const movieByRuntime = await Movie.findOne({
        //     where: { runtime: 115 },
        // });
        // console.log(movieByRuntime.toJSON());

        // const movies = await Movie.findAll({
        //     where: {
        //         runtime: {
        //             [Op.gt]: 110,
        //         },
        //         isAvailableOnVHS: true,
        //     },
        // });
        // // SELECT * FROM Movies WHERE runtime = 92 AND isAvailableOnVHS = true;
        // console.log(movies.map((movie) => movie.toJSON()));

        const movies = await Movie.findAll({
            attributes: ['id', 'title', 'releaseDate'], // return only id and title
            where: {
                releaseDate: {
                    [Op.gte]: '1995-01-01',
                },
                isAvailableOnVHS: true,
            },
        });
        console.log(movies.map((movie) => movie.toJSON()));

        const pelis = await Movie.findAll({
            attributes: ['id', 'title', 'releaseDate'],
            where: {
                releaseDate: {
                    [Op.gte]: '1995-01-01',
                },
            },
            order: [['releaseDate', 'ASC']], // dates in ascending order
        });
        console.log(pelis.map((peli) => peli.toJSON()));

        const toyStory3 = await Movie.findByPk(3);
        await toyStory3.update(
            {
                title: 'Trinket Tale 3', // this will be ignored
                isAvailableOnVHS: true,
            },
            { fields: ['isAvailableOnVHS'] }
        );

        console.log(toyStory3.get({ plain: true }));
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map((err) => err.message);
            console.error('Validation errors: ', errors);
        } else {
            throw error;
        }
    }
})();
