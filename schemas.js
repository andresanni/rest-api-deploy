const z = require('zod');

const movieSchema = z.object({  
    title: z.string(),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().positive(),
    poster: z.string().url(),
    genre: z.array(
        z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Thriller']
    )
    ),
    rate: z.number().min(0).max(10)
});

//Validacion rigurosa
function validateMovie(movie){
    return movieSchema.safeParse(movie);
}

//Validacion flexible para actualizacion
function validatePartialMovie(movie){
    return movieSchema.partial().safeParse(movie);
}

module.exports = {
    validateMovie,
    validatePartialMovie
}