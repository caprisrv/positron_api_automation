const
	newman = require('newman'),
	fs = require('fs'),
	csv = require('csv-parser'),
	traus = require('./traus-filewriter'),
	runs = require('./runs.json'),
	config = require('./config.json'),
	activeRuns = runs.filter(run => run.active),
	options = activeRuns.map(collection => {
		let data = undefined, dataLength = 0, results = [], aleternateHTMLFileName = '';
		
		//If report_filename value is not present in runs.json then it will generate a name with the following format: 'collectionName_DateTimeInISO'.
		if(!collection.report_filename) aleternateHTMLFileName = `${collection.collection}_${new Date().toISOString().slice(0, 16).replace(':', '')}`
		if (collection.data) {
			const [dataType, dataName] = collection.data.split(':');
			
			data = `${config.data.path}${dataName}${config.data.identifier}.${dataType}`;
			
			if (dataType.toLowerCase()) == 'csv') fs.createReadStream(data)
				.pipe(csv())
				.on('data', (data) => results.push(data))
				.on('end', () => {
					dataLength = results.lenght;
					console.log(`CSV Parse Complete. Length of ${dataLength}.`);
				});
			else if (dataType.toLowerCase() == 'json') {
				results = require(data);
				dataLength = results.length;
			} else throw new Error (`No data typr specified for the "${collection.collection}" collection. Please specify eitther csv or json in the data property in your active runs entry. Example: csv:test`);
			
		}
		
		return {
			collection: `${config.collection.path}${collection.collection}${config.collection.identifier}.json`,
			environment: (collection.environment ? `${config.environment.path}${collection.environment}${config.environment.identifier}.json` : ''),
			globals: (collection.globals ? `${config.globals.path}${collection.globals}${config.globals.identifier}.json` : ''),
			reporters: collection.reports || config.defaults.reports,
			iterationData: results,
			iterationCount: collection.delayBetweenRequests || dataLength || config.defaults.numOfIterations,
			delayRequest: collection.delayBetweenRequests || config.defaults.delayBetweenRequests,
			reporter: {
				htmlextra: {
					export: `${config.html.export}${collection.report_filename || aleternateHTMLFileName}.html`, //if  not specified, the file will be written to 'newman/' in the current working directory.
					titleSize: 1,
					logs: true,
					title: `${collection.collection}${(collection.report_filename ? ':' + collection.report_filename : '')}`,
					skipSensitiveData: true,
					darkTheme: true,
					testPaging: true
				},
				junit: {
					export: `${config.junit.export}${collection.report_filename || aleternateHTMLFileName}.xml`
				}
			},
			insecure: true,
			timeout: collection.globalTimeout || config.defaults.globalTimeout,
			timeoutRequest: collection.timeoutForRequest || config.defaults.timeoutForRequest,
			timeoutScript: collection.timeoutForScript || config.defaults.timeoutForScript,
			folder: collection.folder
		}
	});