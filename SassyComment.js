module.exports = function(mongoose) { 
	var SassyCommentSchema = new mongoose.Schema({
		author: String,
		content: String
	});

	var SassyComment = mongoose.model("SassyComment", SassyCommentSchema);

	return SassyComment;
};
