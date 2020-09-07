const fs = require('fs');

let testCases = [], sor = '';

const
	setSOR = incomingSOR => {
		if (incomingSOR !== 'rally' && incomingSOR !== 'jira') throw new Error('TCMS SOR must be all lowecase exactly "rally" or "jira". Please make sure the TCMS_SOR value is set in config.json.');
		console.log(`\nSOR set as ${incomingSOR}`);
		sor = incomingSOR;
		
	},
	getSOR = () => sor,
	addTC = (tc_id, files = [], ts_id) => {
		let formattedTC = '',
			formattedFileString = formatUploads(files);
			
		if (!ts_id) formattedTC = `${tc_id}=${formattedFileString}`
		else if (sor == 'rally') formattedTC = `${tc_id}:${ts_id}=${formattedFileString}`
		
		console.log(`Added Test Case ${tc_id}`);
		console.log(formattedTC);
		
		testCases.push(formattedTC);
		
	},
	formatUploads = uploads => {
		let formattedString = '';
		uploads.forEach((up, i) => formattedString += (i > 0 ? `,${up}` : up))
		return formattedString;
	},
	writeFile = () => {
		let fileData = `testCaseManagementSystem=${sor}`;
		testCases.forEach(tc => fileData += `\n${tc}`);
		console.log('TRAUS.properties.written');
		if (sor && testCases) fs.writeFileSync('TRAUS.properties', fileData, err => { if (err) throw err;});
		else throw new Error('TCMS is incorrectly configured. If TCMS is enabled then all active test run entries requires a TC value. Additionaly, there must be a value set for TCMS_SOR in config.json.')
	};
	
exports.setSOR = setSOR;
exports.getSOR = getSOR;
exports.addTC = addTC;
exports.writeFile = writeFile;