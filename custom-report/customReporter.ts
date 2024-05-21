import { FullConfig, FullResult, Reporter, Suite, TestCase, TestError, TestResult, TestStep } from '@playwright/test/reporter'
import moment from 'moment';

export default class MyReporter implements Reporter {
     
    onBegin(config: FullConfig, suite: Suite): void{
        // console.log('--',suite.suites[0].suites[0].suites[0].title)
        console.log('currently running environment: ',suite.suites[0].title)
        console.log(`Test run started at ${moment().format("MMMM Do YYYY, h:mm:ss a")}
        - Number tests cases to run: ${suite.allTests().length}`)
        console.log('.......................................................................................')
        // console.log('Starting the run with', suite.allTests().length, 'tests');
        console.log('Test title: ', suite.allTests()[0].title ); 
    }

    onTestBegin(test: TestCase, result: TestResult): void{
        console.log('test started: ', test.title)
    }

    onStdOut(chunk: string|Buffer, test: void|TestCase, result: void|TestResult): void{  //standard output
        console.log(chunk)
    }

    onStepBegin(test: TestCase, result: TestResult, step: TestStep): void{
        if(step.category === "test.step"){
            console.log('.......................................................................................')
            console.log('test step started: ', step.title)
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
        // console.log('test step end: ', step.title)
            if (step.title.includes('.click')) {
                console.log('Clicked on -', step.title);
            } else if (step.title.includes('.fill')) {
                console.log('Provided input for -', step.title);
            } else {
                console.log('test step end: ', step.title);
            }
            if(step.category === "test.step"){
                console.log('.......................................................................................')
                // console.log('Status: ', result.status);
                // if (result.status === "failed") {
                //     console.log('Error: ', result.error?.message);
                // }
                if (step.error) {
                console.log(step.error.message);
                console.log("----fail----");
            } else {
                console.log("----pass----");
            }
                //console.log('.......................................................................................')
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

        // console.log('-- ontest end -- ',test)
        //list of steps but no status
        console.log('-- ontest end result--', test.results[0].steps);

        // console.log('Logs: ',result.stdout)
        // console.log('Attachments: ', test.results[0].attachments)
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
        console.log('--fullresult--',result)
    }

    // onExit(): Promise<void>{
        
    // }
  
    onStdErr(chunk: string|Buffer, test: void|TestCase, result: void|TestResult): void{

    }
  
    // printsToStdio(): boolean{

    // }
}