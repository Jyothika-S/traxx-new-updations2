import { FullConfig, FullResult, Reporter, Suite, TestCase, TestError, TestResult, TestStep } from '@playwright/test/reporter'
import inspectionTestData from '../test-data/inspectionTestData.json'
import moment from 'moment';
import { TestInfo, test as test1} from '@playwright/test';
var fs = require('fs');
var os = require('os');
const path = require('path');
let fillValues = inspectionTestData.fillValues;
let expectContainValues = inspectionTestData.expectedData;
let stepdescription: string[] = [];
export default class MyReporter implements Reporter {
    dataSet = new Map();
    currentSpec: any;
    resultSet = new Map();
    expectedSet = new Map();
    stepTitlesSet = new Map();
    set = new Map();
    credentials: { username: string; password: string } = { username: '', password: '' };
    credentialsArray: { username: string; password: string }[] = [];
    configData: { currEnv: string; startTime: string; totalTest: number, objective: string, platform: string, totalDuration: string }[] = [];
    projectData: { name: string; baseURL: string }[] = [];
    fillCounter = 0;
    expectContainCounter = 0;

    username = process.env.USER_NAME || "";
    password = process.env.PASSWORD || "";
   

    public async addStepDetails(stepDescriptions: string[], expectedSteps: string, actualSteps: string, stepTitle: string, result: string = 'Pass') {
        console.log('> step descriptions:', stepDescriptions);
        console.log('> result:', result);
        console.log('--------------------------------------------------------')
        // if (!this.dataSet.has(this.currentSpec)) {
        //     this.dataSet.set(this.currentSpec, []);
        //     this.resultSet.set(this.currentSpec, []);
        //     this.expectedSet.set(this.currentSpec, []);
        //     this.stepTitlesSet.set(this.currentSpec, []);
        //     this.set.set(this.currentSpec, []);
        // }
    
        // stepDescriptions.forEach((description) => {
        //     if (!this.dataSet.get(this.currentSpec).includes(description)) {
        //         this.dataSet.get(this.currentSpec).push(description);
        //         this.expectedSet.get(this.currentSpec).push(expectedSteps);
        //         this.set.get(this.currentSpec).push(actualSteps);
        //         this.stepTitlesSet.get(this.currentSpec).push(stepTitle);
        //         this.resultSet.get(this.currentSpec).push(result);
        //     }
        // });

        if (!this.dataSet.has(this.currentSpec)) {
            this.dataSet.set(this.currentSpec, []);
            this.resultSet.set(this.currentSpec, []);
            this.expectedSet.set(this.currentSpec, []);
            this.stepTitlesSet.set(this.currentSpec, []);
            this.set.set(this.currentSpec, []);
          }
        
          stepDescriptions.forEach((description) => {
            if (!description.includes('Expecting the content ')) {
                // const phrases = ['Expecting the content ', 'Navigate to', 'Click on element', 'Provide input for'];
                // const hasPhrase = phrases.some(phrase => description.includes(phrase));

                // if (!hasPhrase) {
                if (!this.dataSet.get(this.currentSpec).includes(description)) {
                  this.dataSet.get(this.currentSpec).push(description);
                  this.expectedSet.get(this.currentSpec).push(expectedSteps);
                  this.set.get(this.currentSpec).push(actualSteps);
                  this.stepTitlesSet.get(this.currentSpec).push(stepTitle);
                  this.resultSet.get(this.currentSpec).push(result);
                }
              } else {
                this.dataSet.get(this.currentSpec).push(description);
                this.expectedSet.get(this.currentSpec).push(expectedSteps);
                this.set.get(this.currentSpec).push(actualSteps);
                this.stepTitlesSet.get(this.currentSpec).push(stepTitle);
                this.resultSet.get(this.currentSpec).push(result);
              }
          });
        // console.log('1221stepDescriptions: ',stepDescriptions)
    }

    public async updateCurrentSpec(spec: string) {
        this.currentSpec = spec;
    }

    onBegin(config: FullConfig, suite: Suite): void{
        // console.log('--',suite.suites[0].suites[0].suites[0].title)    

        this.projectData = config.projects.map(project => ({ name: project.name, baseURL: project.use.baseURL || ''}));

        console.log('1443Project Data:', this.projectData);

        console.log('currently running environment: ',suite.suites[0].title)
        console.log(`Test run started at ${moment().format("MMMM Do YYYY, h:mm:ss a")}
        - Number tests cases to run: ${suite.allTests().length}`)
        console.log('.......................................................................................')
        // console.log('Starting the run with', suite.allTests().length, 'tests');
        console.log('Test title: ', suite.allTests()[0].title ); 
        const currEnv = suite.suites[0].title;
        const startTime = moment().format("MMMM Do YYYY, h:mm:ss a");
        const totalTest = suite.allTests().length; 
        const objective = suite.allTests()[0].title;  
        const platform = `${os.type()} ${os.release()} (${os.arch()})`;
        console.log('!!!!',startTime, currEnv, totalTest)
        this.configData.push({ currEnv, startTime, totalTest, objective, platform, totalDuration: '' });
        console.log('111',this.configData[0]?.currEnv)
    }

    onTestBegin(test: TestCase, result: TestResult): void{
        this.updateCurrentSpec(test.title);
        console.log(`Starting test ${test.title}`)
    }

    onStdOut(chunk: string|Buffer, test: void|TestCase, result: void|TestResult): void{  //standard output
        console.log(chunk)
    }

    onStepBegin(test: TestCase, result: TestResult, step: TestStep): void{
        if(step.category === "test.step"){
            console.log('.......................................................................................')
            console.log('test step started: ', step.title)
            // this.currentStepTitle = step.title;
            console.log('.......................................................................................')
        }
        
        // console.log('----onStepBegin result---- ', result)
        // console.log('onStepBegin result: ', result.attachments)
        
        // console.log('test printed frm onStepBegin',test)
        // console.log('result printed frm onStepBegin',result.stdout)
        // console.log('step printed frm onStepBegin',step)
        
        // console.log('!!!!!', step.category)
    }
    
    onStepEnd(test: TestCase, result: TestResult, step: TestStep): void{  
        if (!step.title.includes('.click') && !step.title.includes('.fill') && !step.title.includes('page.goto') && !step.title.includes('expect.soft.toContain')) {
            return;
        } 
        console.log('env Username:', this.username);
    console.log('env Password:', this.password);
        
        // if (step.title === 'Login to application') {
        //     const credentialsAnnotation = test.annotations.find(annotation => annotation.type === 'credentials');
        //     console.log('####credentialsAnnotation', credentialsAnnotation);
        //     console.log('#### test.annotations', test.annotations);
            console.log('## step title', step.parent?.title);
        //     console.log('#### result', result); //no annotation property
        //     if (credentialsAnnotation) {
        //         //console.log('Username:', credentialsAnnotation.description.split(', ')[1].split(': ')[1]););
        //         //console.log('Password:', credentialsAnnotation.description.split(', ')[1].split(': ')[1]);
        //         console.log('++++++++++from testinfo check+++++++: ', result);
        //         console.log('#####from testinfo check#####: ', credentialsAnnotation);
        //     }
        // }

        console.log('test step end: ', step.title)
            let description: string = '';
            
            if (step.title.includes('.click')) {
                description = 'Click on element with locator - ' + step.title.replace('.click', '');
            } 
            else if (step.title.includes('expect.soft.toContain')){
                const keys = Object.keys(expectContainValues);
                const key = keys[this.expectContainCounter % keys.length]; // get the current key
                const expectedValue = expectContainValues[key];
                description = `Ensure that the content has: <b>${expectedValue}</b>`;
                this.expectContainCounter++; 
            }
             else if (step.title.includes('.fill')) {
                this.fillCounter++;
                // to count .fill
                description = 'Provide input for - ' + step.title.replace('.fill', '');
                // if (this.fillCounter <= 2) {
                //   const credKeys = Object.keys(this.credentialsArray);
                //   const credValue = this.credentialsArray[credKeys[(this.fillCounter - 1) % credKeys.length]];
                //   description += ` with value ${credValue}`;
                // if (this.fillCounter === 1) {
                //     description += ` with value ${this.username}`;
                //   } else if (this.fillCounter === 2) {
                //     description += ` with value ${this.password}`;

                if (step.title.includes(`locator.getByPlaceholder('Email ID')`)) {
                    description += ` with value <b>${this.username}</b>`;
                } else if (step.title.includes(`locator.getByPlaceholder('Password')`)) {
                    description += ` with value <b>${this.password}</b>`;
                }   
                  
                } else if (this.fillCounter > 2) {
                  const fillKeys = Object.keys(fillValues);
                  const fillValue = fillValues[fillKeys[(this.fillCounter - 3) % fillKeys.length]];
                  description += ` with value <b>${fillValue}</b>`;
                // }
            } else if (step.title.includes('page.goto')) {
                let endTitle: string | undefined;
                test.parent.parent?.suites.forEach(suite => {
                    if (suite.parent && suite.parent.title) {
                    endTitle = suite.parent.title;
                    // console.log('123endTitle: ', endTitle);
                    }
                });
                
                const matchedProject = this.projectData.find(project => project.name === endTitle);
                if (matchedProject) {
                    description = 'Navigate to -' +matchedProject.baseURL + step.title.replace('page.goto', '');
                } else {
                    description = 'Navigate to - ' + step.title.replace('page.goto', '');
                }
            } else {
                description = step.title;
            }

            if (step.title !== '' && step.error === undefined && description !== '') {
                console.log('Expected Steps:', 'User should be able to ' + description);
                console.log('Actual Steps:', 'User is able to ' + description);
                this.addStepDetails([description], 'User should be able to ' + description, 'User is able to ' + description, step.parent?.title ?? 'Unknown');
            } else if (step.title !== '' && step.error !== undefined) {
                console.log('Expected Steps:', 'User should be able to ' + description);
                console.log('Actual Steps:', 'User is not able to ' + description);
                this.addStepDetails([description], 'User should be able to ' + description, 'User is not able to ' + description, step.parent?.title!, 'Fail');
            }
            
            stepdescription.push(description);
            // console.log("1331step description: ", stepdescription)

            if(step.category === "test.step"){
                const durationInSeconds = Math.floor(step.duration / 1000);
                const durationInMilliseconds = step.duration % 1000;
                console.log(`Duration of ${step.title} is ${durationInSeconds}s ${durationInMilliseconds}ms`);

                if (step.error) {
                console.log(step.error.message);
                console.log(`** Result of  '${step.title}:' Fail **`);
                } else {
                console.log(`** Result of  '${step.title}:' Pass **`);
                }

                console.log('.......................................................................................')
                return;
            }
    }
    
    onTestEnd(test: TestCase, result: TestResult): void{
        // Reset the counters
        // this.fillCounter = 0;
        // this.expectContainCounter = 0;
        test.results.forEach((result) => {
            if (result.steps) {
              result.steps.forEach((step) => {
                if (step.title === 'Login to application') {
                  const credentialsAnnotation = test.annotations.find(annotation => annotation.type === 'credentials');
                  if (credentialsAnnotation && credentialsAnnotation.description) {
                    const [usernameLabel, usernameValue] = 
                    credentialsAnnotation.description.split(', ')[0].split(': ');
                    const [passwordLabel, passwordValue] = credentialsAnnotation.description.split(', ')[1].split(': ');
                    console.log('Username:', usernameValue);
                    console.log('Password:', passwordValue);
                    this.credentialsArray.push({ username: usernameValue, password: passwordValue });
                    console.log('Credentials:', this.credentialsArray);
                  }
                }
              });
            }
        });

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
    }
  
    onError(error: TestError): void{
        console.log(error.message)
    }
  
    onEnd(result: FullResult): Promise<{ status?: FullResult['status'] } | undefined | void> | void{
        // console.log('on end: ', result.status)
        console.log('.......................................................................................')
        // console.log(`Finished the run: ${result.status}`)
        console.log('Test status: ',result.status)
        console.log('Test start time: ',result.startTime)
        const durationInSeconds = Math.floor(result.duration / 1000);
        //const durationInMilliseconds = (result.duration % 1000).toFixed(3);
        const durationInMilliseconds = Math.round(result.duration % 1000);
        console.log(`Test duration: ${durationInSeconds}s ${durationInMilliseconds}ms`);
        const totalDuration = `${durationInSeconds}s ${durationInMilliseconds}ms`;
        console.log(`Test duration: ${totalDuration}`);
        if (this.configData.length > 0) {
            this.configData[0].totalDuration = totalDuration;
        }
        this.createHTML();
    }

    public async configValue(data: any) {
        this.configData.push(data);
    }
      
    public async createHTML() {
        let k = 0;
        var currentdate = new Date();
        let isEnable: boolean = false;
        const filePath = path.join(process.cwd(), 'reports', 'DetailedReport.html');
        console.log('process.cwd()',process.cwd());
        var exisitingHtmlContent = [];
        let htmlContent = '';
          const dateTime = `${currentdate.getDate()}/${currentdate.getMonth() + 1}/${currentdate.getFullYear()} ${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`;
          console.log('dateTime',dateTime);
          
        if (!fs.existsSync(path.join(process.cwd(), 'reports'))) {
            fs.mkdirSync(path.join(process.cwd(), 'reports'));
            console.log('process.cwd()',process.cwd());
        }
        // if (await reusableMethods.checkFileExists(filePath)) {
        //   console.log('File exists!');
        //   exisitingHtmlContent = await reusableMethods.readAllLines(filePath);
        //   htmlContent = exisitingHtmlContent[0];
        // }
      
        htmlContent = htmlContent.concat('<html><head><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script><script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script><title>Detailed Report</title></head>');
        htmlContent = htmlContent.concat('<body style="width: 100vw;height: 100vh;">');
        htmlContent = htmlContent.concat('<table class="table table-striped">');
        htmlContent = htmlContent.concat('<tr style="white-space: nowrap;width=100%"><th style="width=25%;background-color:#95ac95" colspan="2">Execution Time</th><td style="width=25%;colspan="2">' + this.configData[0]?.startTime + '</td>');
        htmlContent = htmlContent.concat('<th style="background-color:#95ac95;width=25%" colspan="1">Environment</th><td style="width=25%;colspan="2"><b>' + this.configData[0]?.currEnv + '</b></td></tr>');


        htmlContent = htmlContent.concat('<tr style="white-space: nowrap;width=100%"><th style="width=25%;background-color:#95ac95" colspan="2">Total tests</th><td style="width=25%;colspan="2">' + this.configData[0]?.totalTest + '</td>');
        htmlContent = htmlContent.concat('<th style="background-color:#95ac95;width=25%" colspan="1">Total Duration</th><td style="width=25%;colspan="2"><b>' + this.configData[0]?.totalDuration + '</b></td></tr>');

        htmlContent = htmlContent.concat('<tr style="white-space: nowrap;width=100%"><th style="background-color:#95ac95;width=25%" colspan="2">OS</th><td style="width=25%;colspan="2">' + this.configData[0]?.platform + '</td>');
        
        htmlContent = htmlContent.concat('<tr style=\"white-space: nowrap;width=100%\"><th style=\"background-color:#95ac95;width=25%\" colspan=\"2\">Test Scenario</th><td style = \"width=75%;font-size:14px;word-wrap:break-word;\" colspan=\"2\"><b>' + this.configData[0]?.objective + '</b></td></tr>')

        htmlContent = htmlContent.concat('<tr style="background-color:#c8d9c8"><th style="border: 1px solid black"><b>Test Step</b></th><th style="border: 1px solid black;text-align:center"><b>Step</b></th><th style="border: 1px solid black"><b>Step Description</b></th><th style="border: 1px solid black"><b>Expected Result</b></th><th style="border: 1px solid black"><b>Actual Result</b></th><th style="border: 1px solid black;text-align:center"><b>Status</b></th><th style="border: 1px solid black;text-align:center"><b>Screenshot</b></th></tr>');
          

        // console.log('#####Datasets:', this.dataSet);
        // this.dataSet.forEach((steps, spec) => {
        //     steps.forEach((step, index) => {
        //         htmlContent = htmlContent.concat(`<tr><td style=\"font-weight:bold\">${spec}</td><td>${index + 1}</td><td>${step}</td><td>${this.expectedSet.get(spec)[index]}</td><td>${this.set.get(spec)[index]}</td><td>${this.resultSet.get(spec)[index]}</td><td></td></tr>`);
        //     });
        // });

        const reusableMethods = {
            screenshots: [] 
        };
        // console.log('121this.dataSet: ',this.dataSet)
        this.dataSet.forEach((steps, spec) => {
            let isEnable = true;
            let addedTitles = new Set();
            for (let j = 0; j < steps.length; j++) {
                // htmlContent = htmlContent.concat(`<tr><td style=\"font-weight:bold\">${this.stepTitlesSet.get(spec)[j]}</td>`);
                let title = this.stepTitlesSet.get(spec)[j];
                if (!addedTitles.has(title)) {
                    htmlContent = htmlContent.concat(`<tr><td style="font-weight:bold">${title}</td>`);
                    addedTitles.add(title);
                } else {
                    htmlContent = htmlContent.concat('<tr><td></td>');
                }


                htmlContent = htmlContent.concat(`<td style=\"text-align:center;vertical-align:middle;\">${j + 1}</td>`);

                htmlContent = htmlContent.concat(`<td>${steps[j]}</td><td>${this.expectedSet.get(spec)[j]}</td><td>${this.set.get(spec)[j]}</td>`);
    
                if (this.resultSet.get(spec)[j] == 'Pass') {
                    htmlContent = htmlContent.concat(`<td style=\"text-align:center;color:green;font-weight:bolder;vertical-align:middle;\">${this.resultSet.get(spec)[j]}</td>`);
                } else {
                    htmlContent = htmlContent.concat(`<td style=\"text-align:center;color:red;font-weight:bolder;vertical-align:middle;\">${this.resultSet.get(spec)[j]}</td>`);
                }
    
                if (steps[j].includes('Capture Screenshot')) {
                    htmlContent = htmlContent.concat(`<td style=\"text-align:center;vertical-align:middle;\"><a href=\"${reusableMethods.screenshots[k]}\">View</a></td></tr>`);
                    k++;
                } else {
                    htmlContent = htmlContent.concat('<td></td></tr>');
                }
    
                isEnable = false;
            }
        });

        htmlContent = htmlContent.concat("</table></body></html>");

        fs.writeFileSync(filePath, htmlContent, () => { });
        // console.log('htmlContent: ', htmlContent);
      }   
}