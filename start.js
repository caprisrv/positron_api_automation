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
			console.log("in data if");
			const [dataType, dataName] = collection.data.split(':');
			
			data = `${config.data.path}${dataName}${config.data.identifier}.${dataType}`;
			
			if (dataType.toLowerCase() == 'csv') fs.createReadStream(data)
				.pipe(csv())
				.on('data', (data) => results.push(data))
				.on('end', () => {
					console.log("in data if toLowerCase");
					dataLength = results.lenght;
					console.log(`CSV Parse Complete. Length of ${dataLength}.`);
				});
			else if (dataType.toLowerCase() == 'json') {
				console.log("in data else if");
				results = require(data);
				dataLength = results.length;
			} else throw new Error (`No data type specified for the "${collection.collection}" collection. Please specify eitther csv or json in the data property in your active runs entry. Example: csv:test`);
			
		}
		
		return {
			collection: `${config.collection.path}${collection.collection}${config.collection.identifier}.json`,
			environment: (collection.environment ? `${config.environment.path}${collection.environment}${config.environment.identifier}.json` : ''),
			globals: (collection.globals ? `${config.globals.path}${collection.globals}${config.globals.identifier}.json` : ''),
			reporters: collection.reports || config.defaults.reports,
			iterationData: results,
			iterationCount: collection.numOfIterations || dataLength || config.defaults.numOfIterations,
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
	
// call newman.run to pass 'options' object and wait for callback.
async function runTests() {
	for ( let run of activeRuns) {
		const
			index = activeRuns.indexOf(run),
			collectionName = (run.report_filename ? run.report_filename.split('.')[0] : options[index].reporter.htmlextra.export);
		console.log(
			`
=================== NEWMAN RUN PROPERTIES ==========================
Collection: ${run.collection}
Environment: ${run.environment}
Data: ${run.data}
Iterations: ${options[index].iterationCount}
Delay Between Requests: ${run.delayBetweenRequests || config.defaults.delayBetweenRequests}
Collection Folder: ${run.folder || 'Whole Collection'}
Global Timeout: ${run.globalTimeout || config.defaults.globalTimeout}
Request Timeout: ${run.timeoutForRequest || config.defaults.timeoutForRequest}
Script Timeout: ${run.timeoutForScript || config.defaults.timeoutForScript}
`
		);
		
		await new Promise(resolve => newman.run(
			options[index],
			err => {
				if (err) throw err;
				console.log(`${collectionName} finished. Results saved to ${run.report_filename}`);
				if (config.useTCMS) {
					let testCaseFiles = [];
					if (run.reports) {
						if (run.reports.includes('htmlextra')) testCaseFiles.push(options[index].reporter.htmlextra.export);
						if (run.reports.includes('junit')) testCaseFiles.push(options[index].reporter.junit.export);
					} else {
						if (config.defaults.reports.includes('htmlextra')) testCaseFiles.push(options[index].reporter.htmlextra.export);
						if (config.defaults.reports.includes('junit')) testCaseFiles.push(options[index].reporter.junit.export);
					}
					
					traus.setSOR(config.TCMS_SOR);
					if (!run.TS) traus.addTC(run.TC, testCaseFiles);
					else traus.addTC(run.TC, testCaseFiles, run.TS);
				}
				
				resolve();
				
			}
			
		)).then(() => console.log(`Test Run ${index + 1} has completed.`));
	} 
	
	if (config.useTCMS) traus.writeFile();
}

runTests();
	