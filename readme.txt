## Summary
Positron is an API test automation tool that utilizes postman collections, environments, and globals exports. It can run test remotely on Jenkins and has full integrations with TRAUS (Test Results and Assets Upload Service). All test runs in runs.json provide out of the box are valid test run formats in order of decreasing complexity.

##Prerequisite
1. Node.js and NPM should be installed in your system. Use following link to install the same. (https://nodejs.org/en/download/)
2. Install NEWMAN by running following command on cmd "npm install -g newman".

## How to setup:
1. Fork Repo (git clone https://saurabhimpetus@bitbucket.org/saurabhimpetus/api_automation.git)
2. Clone Repo (git clone https://saurabhimpetus@bitbucket.org/saurabhimpetus/api_automation.git)
3. Export data from Postman (Instructions in "How to export from Postman" below)
4. Add test run entry (sample test runs available in runs.json in root directory upon initial clone. All entry properties are documented below in "Individual test run entry (runs.json)")
5. Set one or more test run entries as active. (Note: Sample test run entries will fail because they use placeholder files.)
6. Use command "npm test" from Positron roor directory to execute active test run entries.

## How to export from Postman:
Collections:
1. Go to a collection in postman.
2. Click on the ... button for that collection.
3. Click export from the menu.
4. Export as collection v2.1 JSON format.
5. Choose location to be export to and export.

Environments:
1. Click on the gear/cog in the top right to the right of the eye icon.
2. Click on the "Download Environment" button to the right of the environment you wish to export.
3. Choose the location to export to and export.

Globals:
1. Click on the gear/cog in the top right to the right of the eye icon.
2. Click on the "Globals" button at the bottom of the dialog box. It is to the left of the "import" button.
3. Click on the "Download as JSON" button. It should be to the left of a cancel button.
4. Choose the location to the export to and export.

## Individual test run entry (runs.json)

- **folder** (optional): string or array[string] - This selects a specific folder in a collection to run. Multiple folders can be executed if put into an array of strings.
- **report_filename** (optional): string - This value should not be contain any spaces. This value is used to name reports for htmlextra and junit. If this value is removed then it will generate a name with the following format: 'collectionName_DateTimeInISO'.
- **TC** (optional): string (Formatted ID for Rally/Jira) - This is a test case ID that corresponds to an existing test case in a Rally or Jira.
- **TS** (optional): string (Formatted ID for Rally) - This is only usable by Rally. Do not set this value if TCMS SOR is Jira in config.json. This is the test set ID that used to upload a test result to a test case in a test set in Rally.
- **collection** (mandatory): string - Corresponds to a postman collection that should be used in this test run. Example: "collection": "placeholder": This points to (by default) a collection in the collection folder called  "placeholder.postman_collection.json".
- **environment** (optional): string - Corresponds to a postman environment that should be used in this test run. Example "environment": "placeholder": This points to (by default) an environment in the environment folder called "placeholder.postman_environment.json".
- **globals** (mandatory - If the selected collection uses postman globals variables a globals should be set or an error will be thrown): Corresponds to a postman globals file that should be used in this test run. Example: "globals": "placeholder": This points to (by default) a globals in the globals folder called "placeholder.postman_globals.json".
- **numOfIterations** (optional): number - The number of iterations that the test run will go to. This value is derived in a data driven test run. If this value is set in a data driven test run it will override the derived iteration for a data driven test run.
- **data** (optional): ("csv:file_name" or "json:file_name") - Please specify either csv or json in the data property in your active runs entry.
- **delayBetweenRequests** (optional): number (milliseconds) - This is the delay between each request sent.
- **globalTimeout** (optional): number (milliseconds) - This is the global timeout set for an entire test run duration.
- **reports** (optional): array[string] - Represents different reporters to be used. "junit", "cli", "htmlextra" and "html" are supported out of the box. More reporters can be added by running following command "npm i -S newman <reporter_name>" in the root directory, Example: "npm i -S newman newman-reporter-htmlextra.
- **timeoutForRequest** (optional): number (milliseconds) - The timeout set for individual requests.
- **timeoutForScript** (optional): number (milliseconds) - The timeout set for individual test scripts and pre-request scripts.
- **active**: boolean - This value determines if the test run will be executed or not. Multiple test run entries can be run in a single execution.

## Config (config.json):

- **useTCMS**: boolean - determines whether or not to use the "TRAUS" system to upload test result to Rally or Jira.
- **TCMS_SOR**: string ("rally" or "jira") - All other values end in an error. Chooses which system to upload test result.
- **data**:
	- **path**: string (file path) - path used to store postman data files.
	- **identifier**: string - sub extension identifier used to identify a data test file.
- **collection**:
	- **path**: string (file path) - path used to store postman collection files.
	- **identifier**: string - sub extension identifier used to identify a collection file.
- **environment**:
	- **path**: string (file path) - path used to store postman environment files.
	- **identifier**: string - sub extension identifier used to identify a environment file.
- **globals**:
	- **path**: string (file path) - path used to store postman globals files.
	- **identifier**: string - sub extension identifier used to identify a globals file.
- **html**:
	- **export**: string (file path) - The file path to export html reports to.
- **junit**:
	- **export**: string (file path) - The file path to export junit xml reports to.
- **defaults**:
	- **timeoutForRequest**: number (milliseconds) - The timeout set for individual requests. This value is used as a default if a test run does not include it.
	- **timeoutForScript** number (milliseconds) - The timeout set for individual test scripts and pre-request scripts. This value is used as a default if a test run does not include it.
	- **delayBetweenRequests** : number (milliseconds) - This is the delay between each request sent. This value is used as a default if a test run does not include it.
	- **globalTimeout** : number (milliseconds) - This is the global timeout set for an entire test run duration. This value is used as a default if a test run does not include it.
	- **numOfIterations** : number - The number of iterations that the test run will go to. This value is derived in a data driven test run. If this value is set in a data driven test run it will override the derived iteration for a data driven test run. This value is used as a default if a test run does not include it.
	- **reports** : array[string] - Represents different reporters to be used. "junit", "cli", "htmlextra" and "html" are supported out of the box. More reporters can be added. This value is used as a default if a test run does not include it.
	
## start.js:
- This is javascript file which is used to run specific folder or whole collection of requests, it also generate the html report and save it in a defined location.

## traus-filewriter.js
- This javascript file is used to write and upload the test cases in Rally or Jira and this file is internally called in start.js file.
	
Test Script that can be added to collection test section:

	//Retrieves test_response_time global variable. This value is used as a test for what the expected response time should be. Can be controlled on any level (Collection, Folder, Request) in pre-request scripts using pm.globals.set("test_response_time", value);
	let test_response_time = pm.globals.get("test_response_time");
	
	//Test to check if the status is code returned as 200
	pm.test("Status code is 200", function(){
		pm.response.to.have.status(200);
	});
	
	//Test to check for expected response time in ms.
	pm.test("Response time of " +pm.response.responseTime + "ms to meet target of " + test_response_time + "ms", function(){
		pm.expect(pm.response.responseTime).to.be.at.most(test_response_time);	
	});
	
	//Test to check if status contained "OK" value.
	pm.test("Status code name has string", function() {
		pm.response.to.have.status("OK");
	});
	
	//Only use this test if you are expecting an API to return in JSON format.
	pm.test("Response is JSON", function(){
		pm.expect(pm.response).to.be.json;	
	});
	
	
	//Checks to see if the API return with an empty response.
	pm.test("Check for empty response", function() {
		pm.expect(pm.response).to.be.withBody;
	});
	
	Sample Response 1:
	{
		"Key1":[
			"Value1",
			"Value2"
		],
		"Key2":[
			"Value1",
			"Value2"
		]
	}
	
	//Checks the count of keys in an array in JSON response. (See above Sample Response 1 for reference)
	var jsonData = pm.response.json();
	var keyCount = Object.keys(jsonData).length;
	
	pm.test("Verify key count", function() {
		pm.expect(keyCount).to.eql.(2);
	});
	
	//Check the count of values of each key in JSON response. (See above Sample Response 1 for reference)
	var valueCount = Object.values(jsonData)[0];
	valueCounts=[];
	valueCount.firEach(function(value)
	{
		valueCounts.push(value);
	});
	
	pm.test("Verify value count" function() {
		pm.expect(valueCounts.length).to.eql(2);
	});
	
	Sample Response 2:
	[
		{
			"stage": "New",
			"staus": "Draft",
			"id": "1"
		},
		{
			"stage": "New",
			"staus": "Test",
			"id": "2"
		},
		{
			"stage": "New",
			"staus": "Prod",
			"id": "3"
		}
	]
	
	//Check the stage value of each object in an array. (See above Sample Response 2 for reference)
	var jsonData = pm.response.json();
	var allStageValues = Object.values(jsonData);
	allStageValues.forEach(function(value)
	{
		pm.test("Verify Stage for " +value['id'] ,function() {
			pm.expect(value['stage']).is.to.eql("New");
		});
	}
	)
	
Postman Tips:
- If your new to Postman, please refer https://www.toolsqa.com/postman-tutorial/ for understanding in writing the postman scripts
- Enable data driven testing for a collection: https://learning.postman.com/docs/postman/collection-runs/working-with-data-files/
- Request Workflows: https://learning.postman.com/docs/postman/collection-runs/building-workflows/
- Environment and Global variables: https://learning.postman.com/docs/postman/variables-and-environments/variables/
- Pre-Request Scripts: https://learning.postman.com/docs/postman/scripts/pre-request-scripts/
- Test Scripts: https://learning.postman.com/docs/postman/scripts/test-scripts/
- Chai Reference for Postman test scripts: https://www.chaijs.com/api/bdd/