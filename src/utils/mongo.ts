import mongoose from "mongoose";
import config from 'config';

export async function connectToMongo() {
	try {
		await mongoose.connect(config.get('adUri'))
		console.log('Connected to Database')
	} catch (e) {
		console.log(e)
		process.exit(1)
	}
}
