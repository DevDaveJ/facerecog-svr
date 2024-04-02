const express = require('express');
const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

require("dotenv").config();
const stub = ClarifaiStub.grpc();
const WORKFLOW_ID = "Face";

const handleClarifaiCall = (req, res) => {
	// This will be used by every Clarifai endpoint call
	const metadata = new grpc.Metadata();
	metadata.set("authorization", "Key " + process.env.PAT);

	stub.PostWorkflowResults(
		{
			user_app_id: {
				"user_id": process.env.USER_ID,
				"app_id": process.env.APP_ID
			},
			workflow_id: WORKFLOW_ID,
			inputs: [
				{ data: { image: { url: req.body.input } } }
			]
		},
		metadata,
		(err, response) => {
			if (err) {
				res.status(500).json('data error in Clarifai');
				throw new Error(err);
			}

			if (response.status.code !== 10000) {
				throw new Error("Post workflow results failed, status: " + response.status.description);
			}

			// We'll get one WorkflowResult for each input we used above. Because of one input, we have here
			// one WorkflowResult.
			const results = response.results[0];
			
			// Each model we have in the workflow will produce one output.
			for (const output of results.outputs) {
				console.log("Output: ",{ output });

					const model = output.model;

				console.log("Predicted concepts for the model `" + model.id + "`:");
				for (const concept of output.data.concepts) {
					console.log("\t" + concept.name + " " + concept.value);
				}
			}
		}
	);
}

const handleImage = (req, res, db) => {
	const { id } = req.body;

	db('users')
		.increment('entries', 1)
		.where({ id: id })
		.returning('entries')
		.then(entries => {
			res.json(entries[0]);
		})
		.catch(err => res.status(400).json(err.detail))
}

module.exports = {
	handleImage,
	handleApiCall: handleClarifaiCall
};
