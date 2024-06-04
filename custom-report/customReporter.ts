import { FullConfig, FullResult, Reporter, Suite, TestCase, TestError, TestResult, TestStep } from '@playwright/test/reporter'
import inspectionTestData from '../test-data/inspectionTestData.json'
import moment from 'moment';
import { TestInfo, test as test1} from '@playwright/test';
var fs = require('fs');
var os = require('os');
const path = require('path');
let fillValues = inspectionTestData.fillValues;
let stepdescription: string[] = [];
export default class MyReporter implements Reporter {
    dataSet = new Map();
    currentSpec: any;
    resultSet = new Map();
    expectedSet = new Map();
    stepTitlesSet = new Map();
    set = new Map();
    credentials: { username: string; password: string } = { username: '', password: '' };
    // configData: string[] = [];
    // configData: { [key: string]: string | number } = {};
    configData: { currEnv: string; startTime: string; totalTest: number, objective: string, platform: string, totalDuration: string }[] = [];
    // currentStepTitle: string = '';
    projectData: { name: string; baseURL: string }[] = [];
    fillCounter = 0;

    public async addStepDetails(stepDescriptions: string[], expectedSteps: string, actualSteps: string, stepTitle: string, result: string = 'Pass') {
        console.log('> step descriptions:', stepDescriptions);
        console.log('> result:', result);
        console.log('--------------------------------------------------------')
        if (!this.dataSet.has(this.currentSpec)) {
            this.dataSet.set(this.currentSpec, []);
            this.resultSet.set(this.currentSpec, []);
            this.expectedSet.set(this.currentSpec, []);
            this.stepTitlesSet.set(this.currentSpec, []);
            this.set.set(this.currentSpec, []);
        }
    // console.log('...this.dataSet: ',this.dataSet)
    // console.log('...this.currentSpec: ',this.currentSpec)
    // console.log('...this.resultSet: ',this.resultSet)
    // console.log('...this.expectedSet: ',this.expectedSet)
    // console.log('@@this.stepTitlesSet: ',this.stepTitlesSet)
    // console.log('...this.set: ',this.set)
    

        stepDescriptions.forEach((description) => {
            if (!this.dataSet.get(this.currentSpec).includes(description)) {
                this.dataSet.get(this.currentSpec).push(description);
                this.expectedSet.get(this.currentSpec).push(expectedSteps);
                this.set.get(this.currentSpec).push(actualSteps);
                this.stepTitlesSet.get(this.currentSpec).push(stepTitle);
                this.resultSet.get(this.currentSpec).push(result);
            }
        });
    }

    public async updateCurrentSpec(spec: string) {
        this.currentSpec = spec;
    }

    onBegin(config: FullConfig, suite: Suite): void{
        // console.log('--',suite.suites[0].suites[0].suites[0].title)
        
        // config.projects.forEach(project => {
        //     console.log(`000Name: ${project.name}, BaseURL: ${project.use.baseURL}`);
        //     const beginTitle = project.name;
        //     // console.log('1234Begin Title: ' + beginTitle);
        // });      

        // config.projects.forEach(project => {
        //     const projectInfo = `Name: ${project.name}, BaseURL: ${project.use.baseURL}`;
        //     this.projectData.push(projectInfo);
        //     console.log('1441projectInfo: ', projectInfo);
            
        //     const beginTitle = project.name;
        //     console.log('1442beginTitle',beginTitle);
        // });

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
        // this.configValue(currEnv)
        // this.configValue(startTime)
        // this.configValue(totaltest)
        // this.configValue('startTime', startTime);
        // this.configValue('totalTests', totaltest);
        // this.configValue('currEnv', currEnv)
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
        if (!step.title.includes('.click') && !step.title.includes('.fill') && !step.title.includes('page.goto')) {
            return;
        } 
        
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

            // if (step.title.includes('.click')) {
            //     console.log('Clicked on -', step.title);
            // } else if (step.title.includes('.fill')) {
            //     console.log('Provided input for -', step.title);
            // } else {
            //     console.log('test step end: ', step.title);
            // }
            //------------------------------
            let description: string = '';
           
            if (step.title.includes('.click')) {
                description = 'Click on element with locator - ' + step.title.replace('.click', '');
            } else if (step.title.includes('.fill')) {
                this.fillCounter++; // to count .fill

                description = 'Provide input for - ' + step.title.replace('.fill', '');

                // append values from fillValues after excluding the first two .fill steps -> login credentials since its in env
                if (this.fillCounter > 2) {
                    const fillKeys = Object.keys(fillValues);
                    const fillValue = fillValues[fillKeys[(this.fillCounter - 3) % fillKeys.length]];
                    description += ` with value ${fillValue}`;
                }

            } else if (step.title.includes('page.goto')) {
                let endTitle: string | undefined;
                test.parent.parent?.suites.forEach(suite => {
                    if (suite.parent && suite.parent.title) {
                    endTitle = suite.parent.title;
                    console.log('123endTitle: ', endTitle);
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
        // console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
        // console.log('onStepEnd result status: ', result.status)
        // console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
        // console.log('onStepEnd test.results: ', test.results[0].attachments)
        // console.log('onStepEnd result: ', result.attachments)
    }
    
    onTestEnd(test: TestCase, result: TestResult): void{
        // console.log('test ended: ', test.title)
        // console.log('result: ', result.status)

        // console.log('-- ontest end -- ',result)

        // console.log('-- ontest end -- ',test.results)
        
        // step titles
        // test.results.forEach((result) => {
        //     if (result.steps) {
        //       result.steps.forEach((step) => {
        //         console.log('title: ',step.title);
        //       });
        //     }
        //   });       

        // console.log('Logs: ',result.stdout)
        // console.log('Attachments: ', test.results[0].attachments)
        const credentialsArray: { username: string; password: string }[] = [];
        test.results.forEach((result) => {
            if (result.steps) {
              result.steps.forEach((step) => {
                if (step.title === 'Login to application') {
                  const credentialsAnnotation = test.annotations.find(annotation => annotation.type === 'credentials');
                  console.log('####credentialsAnnotation', credentialsAnnotation);
                  if (credentialsAnnotation && credentialsAnnotation.description) {
                    const [usernameLabel, usernameValue] = 
                    credentialsAnnotation.description.split(', ')[0].split(': ');
                    const [passwordLabel, passwordValue] = credentialsAnnotation.description.split(', ')[1].split(': ');
                    console.log('Username:', usernameValue);
                    console.log('Password:', passwordValue);
                    credentialsArray.push({ username: usernameValue, password: passwordValue });
                    console.log('Credentials:', credentialsArray);
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

    // public async configValue(key: string, value: string | number) {
    //     this.configData[key] = value.toString();
    //     console.log('%%%%%%%')
    //     console.log(JSON.stringify(this.configData['startTime']));

    //     console.log(this.configData['totalTests'])
    //     console.log(this.configData['currEnv'])
    // }
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
        
        htmlContent = htmlContent.concat('<tr style=\"white-space: nowrap;width=100%\"><th style=\"background-color:#95ac95;width=25%\" colspan=\"2\">Objective</th><td style = \"width=75%;font-size:14px;word-wrap:break-word;\" colspan=\"2\"><b>' + this.configData[0]?.objective + '</b></td></tr>')

        htmlContent = htmlContent.concat('<tr style="background-color:#c8d9c8"><th style="border: 1px solid black"><b>Test Scenario</b></th><th style="border: 1px solid black;text-align:center"><b>Step</b></th><th style="border: 1px solid black"><b>Step Description</b></th><th style="border: 1px solid black"><b>Expected Result</b></th><th style="border: 1px solid black"><b>Actual Result</b></th><th style="border: 1px solid black;text-align:center"><b>Status</b></th><th style="border: 1px solid black;text-align:center"><b>Screenshot</b></th></tr>');
          

        // console.log('#####Datasets:', this.dataSet);
        // this.dataSet.forEach((steps, spec) => {
        //     steps.forEach((step, index) => {
        //         htmlContent = htmlContent.concat(`<tr><td style=\"font-weight:bold\">${spec}</td><td>${index + 1}</td><td>${step}</td><td>${this.expectedSet.get(spec)[index]}</td><td>${this.set.get(spec)[index]}</td><td>${this.resultSet.get(spec)[index]}</td><td></td></tr>`);
        //     });
        // });

        const reusableMethods = {
            screenshots: [] 
        };
    
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
        console.log('htmlContent: ', htmlContent);
      }   
}