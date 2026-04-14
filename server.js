import express from 'express'
import {rateLimit} from 'express-rate-limit'
import pool from './db/database.js'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(express.json())

//Rate Limiting
const limiter = rateLimit({
	windowMs: 15* 60 * 1000, //15 minute
	limit:100, //Limit each IP to 100 reqs per 1 minute
	message:'Request limit exceed, Try again later🌝',
	standardHeaders:'draft-8',
	legacyHeaders:false,
	ipv6Subnet:56
})

//Apply Rate limiting middleware to all requests
app.use(limiter)

app.get('/v1/',(req,res)=>{

    const query = `SELECT json_agg(json_build_object(
	'mythology_name', title,
	'region', region,
	'description', description,
	'time_start', time_start,
	'time_end', time_end,
	'creation_myth', creation_myth_story,
	
	--gods data object
	'gods', COALESCE((SELECT(json_agg(
		json_build_object(
			'name', g.name,
			'alternative_names', g.alternative_names,
			'description', g.description,
			'origin_story', g.origin_story,
			'deity_type', g.deity_type,
			'role', g.role,
			'tier', g.tier,
			'gender', g.gender,
			'powers', g.powers,
			'symbols', g.symbols,
			'weaknesses', g.weaknesses,
			'is_defied', g.is_deified,
			'defied_by', g.deified_by,
			'preview_img', g.preview_img
		)
	))FROM god g WHERE g.myth_id = myth.id), '[]'::json),
		

	--creature data object
	'creatures & Monsters', COALESCE((SELECT(json_agg(
		json_build_object(
			'name' , c.name,
			'alternative_names', c.alternative_names,
			'created_by', c.created_by,
			'description', c.description,
			'creature_type', c.creature_type,
			'material_nature', c.material_nature,
			'origin_story', c.origin_story,
			'powers', c.powers,
			'weaknesses', c.weaknesses,
			'is_mortal', c.is_mortal,
			'alignment', c.alignment,
			'killed_by' , c.killed_by,
			'preview_img', c.preview_img
		)
	))FROM creature c WHERE c.myth_id = myth.id), '[]'::json)

))FROM myth;
`
    pool.query(query, (err,result)=>{
        if(!err){
            const data =  result.rows[0].json_agg
            res.status(200).json(data)
        }else{
            res.status(500).json({message:"Failed to fetch data"})
        }
    })

})

app.get('/v1/mythologies',(req,res)=>{

    pool.query(`SELECT * FROM myth;`, (err,result)=>{
        if(!err){
            const data =  result.rows
            res.status(200).json(data)
        }else{
            res.status(500).json({message:"Failed to fetch data"})

    }
    })

})


app.get('/v1/gods',(req,res)=>{

    pool.query(`SELECT * FROM god;`, (err,result)=>{
        if(!err){
            const data =  result.rows
            res.status(200).json(data)

        }else{
            res.status(500).json({message:"Failed to fetch data"})

        }
    })

})

app.get('/v1/creatures',(req,res)=>{

    pool.query(`SELECT * FROM creature;`, (err,result)=>{
        if(!err){
            const data =  result.rows
            res.status(200).json(data)

        }else{
            res.status(500).json({message:"Failed to fetch data"})

        }
    })

})


app.listen(process.env.PORT,()=>{
    console.log("Server is running✅")
})
