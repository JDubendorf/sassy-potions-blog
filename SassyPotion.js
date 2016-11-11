module.exports = function(mongoose, SassyComment) {  

	var SassyPotionSchema = new mongoose.Schema({
		sass: Number,
		ingredients: [ { name: String, quantity: Number } ],
		crystals: Boolean,
		name: String,
		gpa: Number
		// _id: ObjectId
		// comments: [SassyComment] // subdocument
	});

	var SassyPotion = mongoose.model("SassyPotion", SassyPotionSchema);

	return SassyPotion;
}