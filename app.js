const express = require('express'); //require --> CommonJs
const moviesJsonArray = require('./movies.json');
const crypto = require('node:crypto');
const {validateMovie, validatePartialMovie} = require('./schemas.js')

const app = express();

//Middleware to get complete json in future operations 
app.use(express.json());

//Middlewere para servir web estatica
app.use(express.static('web'));

//Get all movies, or by genre if param exists in url
app.get("/movies", (req,res)=>{
    
    //CORS
    res.header('Access-Control-Allow-Origin','*')

    const { genre } = req.query;

    if(genre){
        const filteredMovies = moviesJsonArray.filter((movie) => movie.genre.includes(genre));
        res.json(filteredMovies);
    }
    else{
        res.json(moviesJsonArray)
    }
})

//Get movie by id
app.get("/movies/:id", (req,res)=>{
    const { id } = req.params;
    const movie = moviesJsonArray.find((movie)=>movie.id === id); //TODO: Investigar usar some para case sensitive

    if(movie){
        res.json(movie);
    }
    else{
        res.status(404).json({message: "Movie not found"});
    }

})

//Save movie
app.post("/movies", (req,res)=>{

    const result = validateMovie(req.body);
    
    if(result.success){
        const newMovie = {
            id: crypto.randomUUID(),
            ...result.data, // TODO: investigar vs req.body
        }
        moviesJsonArray.push(newMovie);
        return res.status(201).json(newMovie);
    }
    else{

        return res.status(400).json({error: JSON.parse(result.error.message)});
    }
    

})

//Patch movie
app.patch("/movies/:id", (req,res)=>{

    const { id } = req.params;
    const result = validatePartialMovie(req.body);

    if(result.success){

        const movieIndex = moviesJsonArray.findIndex((movie)=>movie.id === id);
        if(movieIndex === -1){
            return res.status(404).json({message: "Movie not found"});
        }
        else{
            
            const updatedMovie = {
                ...moviesJsonArray[movieIndex],
                ...result.data
            }

            moviesJsonArray[movieIndex] = updatedMovie;
            
            return res.json(updatedMovie);          
        
        }
    }
    else{
        res.status(400).json({error: JSON.parse(result.error.message)})
    }

})

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{console.log(`Server listening on Port: ${PORT}`)});