import { FullConfig, FullResult, Reporter, Suite, TestCase, TestError, TestResult, TestStep } from '@playwright/test/reporter'
import inspectionTestData from '../test-data/inspectionTestData.json'
import moment from 'moment';
var fs = require('fs');
var os = require('os');
const path = require('path');
let fillValues = inspectionTestData.fillValues;
import { ReusableMethods } from '../utils/reusable-methods';

export default class MyReporter implements Reporter {
  reusableMethods = new ReusableMethods();
  currentSpec: any;
  set = new Map();
  configData: { currEnv: string; startTime: string; totalTest: number, objective: string, platform: string, totalDuration: string }[] = [];
  projectData: { name: string; baseURL: string }[] = [];
  fillCounter = 0;

  screenshots: { screenshotsArray: string[] } = { screenshotsArray: [] };
  videoPaths: string[] = [];
  username = process.env.USER_NAME || "";
  password = process.env.PASSWORD || "";
  captureScreenshotAppended: boolean = false
  tests: any[] = [];
  stepDetails: { [key: string]: string } = {};

  /**
   * Collects paths to screenshot files stored in the 'screenshots' directory.
   * 
   * This method performs the following tasks:
   * 1. Constructs the path to the 'screenshots' directory relative to the current directory.
   * 2. Checks if the 'screenshots' directory exists.
   * 3. If the directory exists, reads all files within the directory.
   * 4. Maps the filenames to their full paths and stores them in the `screenshots.screenshotsArray` property.
   * 
   * @returns {Promise<void>} A promise that resolves once the screenshots have been collected.
   */
  public async collectScreenshots() {
    const screenshotsFolder = path.join(__dirname, 'screenshots');
    console.log(`screenshots folder: ${screenshotsFolder}`);
    if (fs.existsSync(screenshotsFolder)) {
      const files = fs.readdirSync(screenshotsFolder);
      this.screenshots.screenshotsArray = files.map(file => path.join(screenshotsFolder, file));
      console.log(`Found screenshots: ${this.screenshots.screenshotsArray}`);//screenshot path
    }
  }

  /**
   * Retrieves paths to video files stored in subdirectories of the 'test-results' directory.
   *
   * This method performs the following tasks:
   * 1. Constructs the path to the 'test-results' directory in the current working directory.
   * 2. Retrieves a list of all subdirectories within 'test-results'.
   * 3. Iterates over each subdirectory and checks for video files with a '.webm' extension.
   * 4. Constructs full paths to the video files found and maps them to their corresponding test names (subdirectory names).
   * 5. Logs details about directories and video files processed.
   * 6. Returns an object where keys are test names (subdirectory names) and values are arrays of video file paths.
   * 
   * @returns { { [key: string]: string[] } } An object mapping test names to arrays of video file paths.
   */
  public getVideoPath() {
    const testResultsDir = path.join(process.cwd(), 'test-results');
    console.log(`Test results directory: ${testResultsDir}`);
    // Get a list of all subdirectories within 'test-results'
    const directories = fs.readdirSync(testResultsDir).filter(file => fs.statSync(path.join(testResultsDir, file)).isDirectory());
    console.log(`Directories found: ${directories.join(', ')}`);

    const videoPaths: { [key: string]: string[] } = {};

    for (const dir of directories) {
      console.log(`Checking directory: ${dir}`); //current directory being checked

      // Construct the full path to the current subdirectory
      const videoDir = path.join(testResultsDir, dir);
      const testName = dir; // Assuming the directory name is the test name
      console.log(`Matching directory found: ${videoDir}`);

      // Get a list of all video files in the current subdirectory
      const videoFiles = fs.readdirSync(videoDir).filter(file => file.endsWith('.webm'));
      console.log(`Video files found: ${videoFiles}`);

      // If video files found, map them to its full paths and store in the videoPaths object
      if (videoFiles.length > 0) {
        videoPaths[testName] = videoFiles.map(videoFile => path.join(videoDir, videoFile));
      }
    }
    console.log('Complete videoPaths:', videoPaths);
    return videoPaths;
  }

  /**
   * Called once before running tests. All tests have been already discovered and put into a hierarchy of {@link
   * Suite}s.
   * @param config Resolved configuration.
   * @param suite The root suite that contains all projects, files and test cases.
   */
  async onBegin(config: FullConfig, suite: Suite): Promise<void> {
    fs.readdirSync('custom-report/screenshots').forEach(file => fs.unlinkSync(path.join('custom-report', 'screenshots', file)));

    this.projectData = config.projects.map(project => ({ name: project.name, baseURL: project.use.baseURL || '' }));

    console.log('1443Project Data:', this.projectData);

    console.log('currently running environment: ', suite.suites[0].title)
    console.log(`Test run started at ${moment().format("MMMM Do YYYY, h:mm:ss a")}
        - Number tests cases to run: ${suite.allTests().length}`)
    console.log('.......................................................................................')
    // console.log('Starting the run with', suite.allTests().length, 'tests');
    console.log('Test title: ', suite.allTests()[0].title);
    const currEnv = suite.suites[0].title;
    const startTime = moment().format("MMMM Do YYYY, h:mm:ss a");
    const totalTest = suite.allTests().length;
    const objective = suite.allTests()[0].title;
    const platform = `${os.type()} ${os.release()} (${os.arch()})`;
    console.log('!!!!', startTime, currEnv, totalTest)
    this.configData.push({ currEnv, startTime, totalTest, objective, platform, totalDuration: '' });
    console.log('111', this.configData[0]?.currEnv)
  }

  /**
   * Called after a test has been started in the worker process.
   * @param test Test that has been started.
   * @param result Result of the test run, this object gets populated while the test runs.
   */
  onTestBegin(test: TestCase, result: TestResult): void {
    console.log(`Starting test ${test.title}`)
    this.tests.push({
      title: test.title,
      steps: [],
      result: '',
      error: null,
      startTime: moment().format("MMMM Do YYYY, h:mm:ss a"),
      stepDescriptionsSet: new Set()
    });

    console.log('this.tests: ', this.tests)
    console.log(`Starting test ${test.title}`);
  }

  /**
   * Called when something has been written to the standard output in the worker process.
   * @param chunk Output chunk.
   * @param test Test that was running. Note that output may happen when no test is running, in which case this will be [void].
   * @param result Result of the test run, this object gets populated while the test runs.
   */
  onStdOut(chunk: string | Buffer, test: void | TestCase, result: void | TestResult): void {  //standard output
    console.log(chunk)
  }

  /**
   * Called when a test step started in the worker process.
   * @param test Test that the step belongs to.
   * @param result Result of the test run, this object gets populated while the test runs.
   * @param step Test step instance that has started.
   */
  onStepBegin(test: TestCase, result: TestResult, step: TestStep): void {
    if (step.category === "test.step") {
      console.log('.......................................................................................')
      console.log('test step started: ', step.title)
      // this.currentStepTitle = step.title;
      console.log('.......................................................................................')
    }
  }

  /**
   * Called when a test step finished in the worker process.
   * @param test Test that the step belongs to.
   * @param result Result of the test run.
   * @param step Test step instance that has finished.
   */
  onStepEnd(test: TestCase, result: TestResult, step: TestStep): void {
    // Filter steps
    if (!step.title.includes('.click') && !step.title.includes('.fill') && !step.title.includes('page.goto') && !step.title.includes('Ensure that the content has:') && !step.title.includes('Verify that the value')) {
      return;
    }

    console.log('## step title', step.parent?.title);
    console.log('test step end: ', step.title);
    // console.log('step details result: ', result.stdout);

    // Initialize captureScreenshotFound to false for each step
    let captureScreenshotFound = false;

    if (result.stdout.length > 0) {  // Check for logs in the standard output
      //Iterate over logs in reverse order, starting from the last log entry
      for (let i = result.stdout.length - 1; i >= 0; i--) {
        const log = result.stdout[i];
        // Check if the current log contains "Capture Screenshot1"
        if (log.includes('Capture Screenshot1')) {
          captureScreenshotFound = true; // If found, set the flag to true
          // Removes log entry once matched to avoid redundant matches
          result.stdout.splice(i, 1);
          break;
        }
      }
    }

    let description: string = '';
    if (captureScreenshotFound) {
      if (step.title.includes('.click')) {
        description = 'Click on element with locator - ' + step.title.replace('.click', '') + ' Capture Screenshot';
      } else if (step.title.includes('.fill')) {
        this.fillCounter++; // Increment the counter for .fill steps
        description = 'Provide input for - ' + step.title.replace('.fill', '');
        if (step.title.includes(`locator.getByPlaceholder('Email ID')`)) {
          description += ` with value <b>${this.username}</b>`;
        } else if (step.title.includes(`locator.getByPlaceholder('Password')`)) {
          description += ` with value <b>${this.password}</b>`;
        } else if (this.fillCounter > 2) {
          const fillKeys = Object.keys(fillValues);
          const fillValue = fillValues[fillKeys[(this.fillCounter - 3) % fillKeys.length]];
          description += ` with value <b>${fillValue}</b>`;
        }
        description += ' Capture Screenshot';
      } else if (step.title.includes('page.goto')) {
        let endTitle: string | undefined;
        test.parent.parent?.suites.forEach(suite => {
          if (suite.parent && suite.parent.title) {
            endTitle = suite.parent.title;
          }
        });
        const matchedProject = this.projectData.find(project => project.name === endTitle);
        if (matchedProject) {
          description = 'Navigate to -' + matchedProject.baseURL + step.title.replace('page.goto', '') + ' Capture Screenshot';
        } else {
          description = 'Navigate to - ' + step.title.replace('page.goto', '') + ' Capture Screenshot';
        }
      } else {
        description = step.title + ' Capture Screenshot';
      }
    } else {
      if (step.title.includes('.click')) {
        description = 'Click on element with locator - ' + step.title.replace('.click', '');
      } else if (step.title.includes('.fill')) {
        this.fillCounter++; // Increment the counter for .fill steps
        description = 'Provide input for - ' + step.title.replace('.fill', '');
        if (step.title.includes(`locator.getByPlaceholder('Email ID')`)) {
          description += ` with value <b>${this.username}</b>`;
        } else if (step.title.includes(`locator.getByPlaceholder('Password')`)) {
          description += ` with value <b>${this.password}</b>`;
        } else if (this.fillCounter > 2) {
          const fillKeys = Object.keys(fillValues);
          const fillValue = fillValues[fillKeys[(this.fillCounter - 3) % fillKeys.length]];
          description += ` with value <b>${fillValue}</b>`;
        }
      } else if (step.title.includes('page.goto')) {
        let endTitle: string | undefined;
        test.parent.parent?.suites.forEach(suite => {
          if (suite.parent && suite.parent.title) {
            endTitle = suite.parent.title;
          }
        });
        const matchedProject = this.projectData.find(project => project.name === endTitle);
        if (matchedProject) {
          description = 'Navigate to -' + matchedProject.baseURL + step.title.replace('page.goto', '');
        } else {
          description = 'Navigate to - ' + step.title.replace('page.goto', '');
        }
      } else {
        description = step.title;
      }
    }

    const testObj = this.tests.find(testObj => testObj.title === test.title);
    if (testObj && !testObj.stepDescriptionsSet.has(description)) {
      testObj.steps.push({
        stepTitle: step.parent?.title || 'Unknown',
        description: description,
        status: step.error ? 'Fail' : 'Pass'
      });
      testObj.stepDescriptionsSet.add(description);
    }

    if (step.category === "test.step") {
      const durationInSeconds = Math.floor(step.duration / 1000);
      const durationInMilliseconds = step.duration % 1000;
      console.log(`Duration of ${step.title} is ${durationInSeconds}s ${durationInMilliseconds}ms`);

      if (step.error) {
        console.log(step.error.message);
        console.log(`** Result of  '${step.title}:' Fail **`);
      } else {
        console.log(`** Result of  '${step.title}:' Pass **`);
      }

      console.log('.......................................................................................');
    }
  }

  /**
   * Called after a test has been finished in the worker process.
   * @param test Test that has been finished.
   * @param result Result of the test run.
   */
  onTestEnd(test: TestCase, result: TestResult): void {
    switch (result.status) {
      case "failed":
      case "timedOut":
        console.log(`❌ Test - ${test.title} - failed\n>${result.error?.message}`);
        break;
      case "skipped":
        console.log(`⚠️ Test - ${test.title} skipped`);
        break;
      case "passed":
        console.log(`✔️  Test - ${test.title} passed`);
        break;
    }
    console.log('attachment33 ', result.attachments)
  }

  /**
   * Called on some global error, for example unhandled exception in the worker process.
   * @param error The error.
   */
  onError(error: TestError): void {
    console.log(error.message)
  }

  /**
   * Called after all tests have been run, or testing has been interrupted. Note that this method may return a [Promise]
   * and Playwright Test will await it. Reporter is allowed to override the status and hence affect the exit code of the
   * test runner.
   * @param result Result of the full test run, `status` can be one of:
   * - `'passed'` - Everything went as expected.
   * - `'failed'` - Any test has failed.
   * - `'timedout'` - The
   * [testConfig.globalTimeout](https://playwright.dev/docs/api/class-testconfig#test-config-global-timeout) has
   * been reached.
   * - `'interrupted'` - Interrupted by the user.
   */
  onEnd(result: FullResult): Promise<{ status?: FullResult['status'] } | undefined | void> | void {
    console.log('on end result: ', result)
    console.log('.......................................................................................')
    console.log('Test status: ', result.status)
    console.log('Test start time: ', result.startTime)
    const durationInSeconds = Math.floor(result.duration / 1000);
    //const durationInMilliseconds = (result.duration % 1000).toFixed(3);
    const durationInMilliseconds = Math.round(result.duration % 1000);
    console.log(`Test duration: ${durationInSeconds}s ${durationInMilliseconds}ms`);
    const totalDuration = `${durationInSeconds}s ${durationInMilliseconds}ms`;
    console.log(`Test duration: ${totalDuration}`);
    if (this.configData.length > 0) {
      this.configData[0].totalDuration = totalDuration;
    }
    this.collectScreenshots();
    const videoPaths = this.getVideoPath();
    this.createHTML(videoPaths);
  }

  /**
   * Adds configuration data to the class's configData array.
   * @param data An object containing configuration data for a test execution,
   *             with properties currEnv, startTime, totalTest, objective, platform,
   *             and optionally totalDuration.
   */
  public async configValue(data: any) {
    this.configData.push(data);
  }

  /**
   * Generates an HTML report based on the test execution data stored in the class.
   * 
   * This method performs the following tasks:
   * 1. Initializes required variables including the current date/time and the report file path.
   * 2. Checks for the existence of the 'reports' directory and creates it if it does not exist.
   * 3. Constructs the HTML content for the report, including headers, styles, and scripts.
   * 4. Adds execution details such as start time, environment, total tests, total duration, OS, and test scenario.
   * 5. Iterates over each test case and its steps to add detailed test step information to the report.
   * 6. Handles the addition of test step titles, descriptions, expected results, actual results, and status (pass/fail).
   * 7. Adds screenshots for steps that capture screenshots, ensuring they are linked correctly in the report.
   * 8. Adds video links related to each test case.
   * 9. Writes the constructed HTML content to the 'DetailedReport.html' file in the 'reports' directory.
   * 
   * @param videoPaths - An object where the keys are test names and the values are arrays of paths to video recordings.
   * @returns {Promise<void>}
   */
  async createHTML(videoPaths: { [key: string]: string[] }) {
    let htmlContent = '';
    const dateTime = moment().format("MMMM Do YYYY, h:mm:ss a");
    const filePath = path.join(process.cwd(), 'reports', 'DetailedReport.html');

    if (!fs.existsSync(path.join(process.cwd(), 'reports'))) {
      fs.mkdirSync(path.join(process.cwd(), 'reports'));
    }

    htmlContent += '<html><head><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script><script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script><title>Detailed Report</title></head>';
    let screenshotIndex = 0;
    htmlContent += '<body style="width: 100vw;height: 100vh;">';
    console.log('this.tests333: ', this.tests)
    this.tests.forEach((test, index) => {
      let isEnable = true;
      htmlContent += `<table class="table table-striped">`;
      htmlContent += `<tr style="white-space: nowrap;width:100%"><th style="width:25%;background-color:#95ac95" colspan="2">Execution Time</th><td style="width:25%;colspan="2">${test.startTime}</td>`;
      htmlContent += `<th style="background-color:#95ac95;width:25%" colspan="1">Environment</th><td style="width:25%;colspan="2"><b>${this.configData[0]?.currEnv}</b></td></tr>`;
      htmlContent += `<tr style="white-space: nowrap;width:100%"><th style="width:25%;background-color:#95ac95" colspan="2">Total tests</th><td style="width:25%;colspan="2">${this.tests.length}</td>`;
      htmlContent += `<th style="background-color:#95ac95;width:25%" colspan="1">Total Duration</th><td style="width:25%;colspan="2"><b>${this.configData[0]?.totalDuration}</b></td></tr>`;
      console.log('totalDuration: ', this.configData[0]?.totalDuration)
      htmlContent += `<tr style="white-space: nowrap;width:100%"><th style="background-color:#95ac95;width:25%" colspan="2">OS</th><td style="width:25%;colspan="2">${os.type()} ${os.release()} (${os.arch()})</td>`;
      htmlContent += `<tr style="white-space: nowrap;width:100%"><th style="background-color:#95ac95;width:25%" colspan="2">Test Scenario</th><td style="width:75%;font-size:14px;word-wrap:break-word;" colspan="2"><b>${test.title}</b></td></tr>`;
      htmlContent += `</table>`;

      htmlContent += '<table class="table table-striped">';
      htmlContent += '<tr style="background-color:#c8d9c8"><th style="border: 1px solid black"><b>Test Step</b></th><th style="border: 1px solid black;text-align:center"><b>Step</b></th><th style="border: 1px solid black"><b>Step Description</b></th><th style="border: 1px solid black"><b>Expected Result</b></th><th style="border: 1px solid black"><b>Actual Result</b></th><th style="border: 1px solid black;text-align:center"><b>Status</b></th><th style="border: 1px solid black;text-align:center"><b>Screenshot</b></th></tr>';

      let previousTitle = '';
      test.steps.forEach((step, stepIndex) => {
        if (step.stepTitle !== previousTitle) {
          htmlContent += `<tr><td style="font-weight:bold">${step.stepTitle}</td>`;
          previousTitle = step.stepTitle;
        } else {
          htmlContent += `<tr><td></td>`;
        }
        htmlContent += `<td style="text-align:center;vertical-align:middle;">${stepIndex + 1}</td>`;
        htmlContent += `<td>${step.description}</td>`;
        htmlContent += `<td>User should be able to ${step.description}</td>`;
        htmlContent += `<td>User is able to ${step.description}</td>`;
        htmlContent += `<td style="text-align:center;color:${step.status === 'Pass' ? 'green' : 'red'};font-weight:bolder;vertical-align:middle;">${step.status}</td>`;

        if (step.description.includes('Capture Screenshot')) {
          if (screenshotIndex < this.screenshots.screenshotsArray.length) {
            console.log(`Adding screenshot for step ${stepIndex + 1}: ${this.screenshots.screenshotsArray[screenshotIndex]}`);
            htmlContent = htmlContent.concat(`<td style="text-align:center;vertical-align:middle;"><a href="${this.screenshots.screenshotsArray[screenshotIndex]}" target="_blank">View</a></td></tr>`);
            screenshotIndex++;
          } else {
            console.log(`No more screenshots available for step ${stepIndex + 1}`);
            htmlContent = htmlContent.concat('<td>No Screenshot</td></tr>');
          }
        } else {
          htmlContent = htmlContent.concat('<td></td></tr>');
        }
        isEnable = false;
      });
      console.log('test title: ', test.title)
      //replaces one or more spaces, commas, or colons with a single hyphen
      const formattedTestTitle = test.title.replace(/[ ,:]+/g, '-');
      console.log('formattedTestTitle: ', formattedTestTitle)
      const testVideoPaths = Object.keys(videoPaths).filter(key => key.includes(formattedTestTitle)).flatMap(key => videoPaths[key]);
      console.log(`Adding video paths: ${testVideoPaths}`);
      testVideoPaths.forEach(videoPath => {
        htmlContent = htmlContent.concat(`<table class="table table-striped table-bordered"><tr style="outline: thin solid"><th style="text-align:center;background-color:#d8d8c8;vertical-align:middle;">Video Recording</th><td style="color:#FF5733;border:solid red;border-radius:15px;text-shadow: 0em 0em 1.0em red;font-weight:bolder;text-align:center;vertical-align:middle;"><a href="${videoPath}" target="_blank">Click Here</a></td></tr></table>`);
      });
      htmlContent += '</table>';
    });

    htmlContent += '</body></html>';
    fs.writeFileSync(filePath, htmlContent);
  }
}