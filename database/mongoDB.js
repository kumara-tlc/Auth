// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

/*
	Check this for details about replica set
	https://stackoverflow.com/questions/51461952/mongodb-v4-0-transaction-mongoerror-transaction-numbers-are-only-allowed-on-a
	https://stackoverflow.com/a/67341026
*/
mongoose
	.connect(
		process.env.DATABASE_CONNECTION_STRING ||
			"mongodb://127.0.0.1:27017/tlc?replicaSet=rs0",
		{
			useUnifiedTopology: true,
		}
	)
	.then(() => {
		console.log(`Connected to database`);
	})
	.catch((err) => {
		console.log("Database connection error: " + err.toString());
		process.exit(1);
	});

exports.mongoose = mongoose;
