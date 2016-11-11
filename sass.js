/* jshint esversion:6 */  
var express = require("express");

var app = express();

var mongoose = require("mongoose");

const PORT = process.env.port || 8000;

mongoose.connect("mongodb://localhost");

var SassyCommentConstructor = require("./SassyComment.js");
var SassyComment = SassyCommentConstructor(mongoose);

var SassyPotionConstructor = require("./SassyPotion.js");
var SassyPotion = SassyPotionConstructor(mongoose, SassyComment);

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

 
// GET /
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

// GET /api/potions
app.get("/api/potions", (req, res) => {
	SassyPotion.find({}).sort('-sass').exec((err, sassyPotions) =>{
		if (err) {
			res.status(500);
			res.send({status: "error", message: "sass overload"});
			return;
		}
		res.send(sassyPotions);
	});
});

// POST /api/potions
app.post("/api/potion", (req, res) => {
	//todo validate input

	var ingredientNames = req.body.ingredients.split(",");
	var ingredients = [ ];
	for (var each of ingredientNames) {
		ingredients.push({name: each, quantity: 1});
	}

	var newPotion = new SassyPotion({
		sass: req.body.sass,
		ingredients: ingredients,
		crystals: Math.random() > 0.5,
		name: req.body.name,
		gpa: 100 - req.body.sass
	});

	newPotion.save((err) => {
		if (err) {
			res.status(500);
			res.send({status: "error", message: "sass overload"});
			return;
		}
		res.send(newPotion);
	});

});

app.post('/api/potion/edit', (req, res) => {
	SassyPotion.findOneAndUpdate(
		{_id : req.body._id },
		{
			name: req.body.name,
			sass: req.body.sass,
			ingredients: req.body.ingredients.split(","),
			crystals: !!req.body.crystals,
			gpa: 100 - req.body.sass,
		},
		{
			new: true
		},
		(err, data) => {
			if (err) {
				res.status(500);
				res.send({status: "error", message: "sass overload"});
				return;
			}
			res.send(data);
		}
	);
});

app.post("/api/potion/ingredientSave", (req, res) => {
	var id = req.body._id;
	var ingredientNew = req.body.ingredient;
	var quantityNew = req.body.quantity;
	var ingrDel = req.body.ingredientDel;

	var newIngredient = {
		name: ingredientNew,
		quantity: quantityNew,
		_id: id
	}

	if (ingrDel === "noClass") {
		SassyPotion.update( { _id : id },
			{
				$push: { 
					ingredients: {
						name: ingredientNew,
						quantity: quantityNew,
						_id: id
					}
				}
			},
			{
				new: true
			},
			function(err, result) {
				res.send(result);
			}
		);
	} else {
		SassyPotion.update( { _id : id },
			{
				$pull: { 
					ingredients: {
						name: ingrDel
					}
				}
			},
			{
				new: true
			},
			function(err, result) {
				// res.send(result);
			}
		);
		SassyPotion.update( { _id : id },
			{
				$push: { 
					ingredients: {
						name: ingredientNew,
						quantity: quantityNew,
						_id: id
					}
				}
			},
			{
				new: true
			},
			function(err, result) {
				res.send(result);
			}
		);
	}
});

app.post("/api/potion/ingredientDelete", (req, res) => {
	var id = req.body._id;
	var ingredient = req.body.ingredient;

	SassyPotion.update( { _id : id },
		{
			$pull: { 
				ingredients: {
					name: ingredient
				}
			}
		},
		{
			new: true
		},
		function(err, result) {
			res.send(result);
		}
	);
});

app.use((req, res, next) => {
	res.status(404);
	res.send("File not found. Perhaps you weren't sassy enough.");
});

app.use((err, req, res, next) => {
	console.log(err);
	res.status(500);
	res.send("500 Error: Too much sass");
});

app.listen(PORT, () => {
	console.log("Sassy Server on Sassy Port: " + PORT);
});
























