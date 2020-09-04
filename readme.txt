## Summary
Positron is an API test automation tool that utilizes postman collections, environments, and globals exports. It can run test remotely on Jenkins and has full integrations with TRAUS (Test Results and Assets Upload Service). All test runs in runs.json provide out of the box are valid test run formats in order of decreasing complexity.

## How to setup:
1. Fork Repo
2. Clone Repo
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

