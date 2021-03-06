/** CONFIGURATIONS **/


function retryOnFail(scriptSteps)
{
  var retryCount = 3;
  var success = false;
  for (var i = 0; i < retryCount && !success; i++)
  {
    try {
      console.log("This is run number: " + (i + 1) + " of "+ retryCount);
      scriptSteps();
      success = true;     
    } catch(err){
      console.log("Script failed, trying again.");
    }
  }
  if (!success) {
    throw "Script failed all " + retryCount + " attempts.  Investigate alert.";
  }
}



retryOnFail(function() {
// Theshold for duration of entire script - fails test if script lasts longer than X (in ms)
// Script-wide timeout for all wait and waitAndFind functions (in ms)
// ## Fix this so the step timeout is different from teh 
  var StepTimeout = 15000;
  var ScriptTimeout = 90000;
  // Change to any User Agent you want to use.
  // Leave as "default" or empty to use the Synthetics default.
  var UserAgent = "default";
  var continueFlag = true;
  /** HELPER VARIABLES AND FUNCTIONS **/
  
  // ########### try/catch wrapper for function steps ##################
  function stepCheck(contFlag, stepNo, stepName, stepFunc)
  {
    if (!contFlag){
      console.log("Continue Flag is false.  Skipping step " + stepNo + ": " + stepName);
      return;
    }
    else{
      log(stepNo, stepName);
      try {
        var stepResult = stepFunc();
        return stepResult;
      } catch(err){
        log(stepNo, ': ' + stepName + ' failed: ' + err.message);
        continueFlag = false;
        throw(err);
      }
    }
  }

  var assert = require('assert'),
    By = $driver.By,
    browser = $browser.manage(),
    startTime = Date.now(),
    stepStartTime = Date.now(),
    prevMsg = '',
    prevStep = 0,
    lastStep = 9999,
  VARS = {};

  var log = function(thisStep, thisMsg) {
    if (thisStep > 1 || thisStep == lastStep) {
      var totalTimeElapsed = Date.now() - startTime;
      var prevStepTimeElapsed = totalTimeElapsed - stepStartTime;
      console.log('Step ' + prevStep + ': ' + prevMsg + ' FINISHED. It took ' + prevStepTimeElapsed + 'ms to complete.');
      $util.insights.set('Step ' + prevStep + ': ' + prevMsg, prevStepTimeElapsed);
      if (ScriptTimeout > 0 && totalTimeElapsed > ScriptTimeout) {
        throw new Error('Script timed out. ' + totalTimeElapsed + 'ms is longer than script timeout threshold of ' + ScriptTimeout + 'ms.');
      }
    }
    if (thisStep > 0 && thisStep != lastStep) {
      stepStartTime = Date.now() - startTime;
      console.log('Step ' + thisStep + ': ' + thisMsg + ' STARTED at ' + stepStartTime + 'ms.');
      prevMsg = thisMsg;
      prevStep = thisStep;
    }
  };

  function isAlertPresent() {
    try {
      var thisAlert = $browser.switchTo().alert();
      return true;
    } catch (err) { return false; }
  }

  // Returns Boolean of whether something ("el") is selected.
  function isElementSelected(el) { return $browser.findElement(el).isSelected(); }


  function isTextPresentIn(text, selector) {
    return $browser.findElement(selector)
      .getText()
      .then(function (wholetext) {
        try{
        return wholetext.indexOf(text) != -1;
        } catch(err) {
        return false;
        }
      })
  }
  

  function isTextPresent(text) {
    return isTextPresentIn(text, By.tagName('html'));
  }

  /** BEGINNING OF SCRIPT **/

  console.log('Starting synthetics script: nopCommerce_NR');
  console.log('Default timeout is set to ' + (ScriptTimeout/1000) + ' seconds');
  console.log('Variables set in this script: ', VARS);

  // Setting User Agent is not then-able, so we do this first (if defined and not default)
  if (UserAgent && (0 !== UserAgent.trim().length) && (UserAgent != 'default')) {
    $browser.addHeader('User-Agent', UserAgent);
    console.log('Setting User-Agent to ' + UserAgent);
  }
  
  log(1, '$browser.get("http://nop.cs.rackspace.com/")');
  $browser.get("http://nop.cs.rackspace.com/");
  
  // Step2
  //log(2, 'Find "Electronics" link and click.');
  console.log("Step 2: Find electronics started");
  $browser.waitForElement(By.linkText("Electronics"), StepTimeout);
  var electronics = $browser.findElement(By.linkText("Electronics"));
  electronics.then(function(electronics){ 
    console.log("starting then function"); 
    electronics.click(); 
    console.log("then fucntion ran");
    })
  .thenCatch(function(err){ 
    console.log("thenCatch function ran");
    throw err; 
    });
  console.log("Step 2: Find electronics complete");

/* 
  try {
    electronics.click();
    log(1.1, "Clicked the thing.");
  } catch(err) {
    log(1.1, "Clicking didn't work.");
    throw err;
  }
  */

  // Step 3
  log(3, 'Find "Camera & Photo" link and click.');
  $browser.waitForElement(By.xpath("//div[@class=\'side-2\']//a[normalize-space(.)=\'Camera & photo\']"), StepTimeout);
  var camera = $browser.findElement(By.xpath("//div[@class=\'side-2\']//a[normalize-space(.)=\'Camera & photo\']"));
  camera.click();
                                    
  // Step 4
  log(4, 'Add to cart');
  $browser.waitForElement(By.css("input.button-2.product-box-add-to-cart-button"), StepTimeout);
  var addCart1 = $browser.findElement(By.css("input.button-2.product-box-add-to-cart-button"));
  addCart1.click();

  // Step 5
  log(5, 'Second add to cart step');
  $browser.waitForElement(By.id("add-to-cart-button-14"), StepTimeout);
  var addCart2 = $browser.findElement(By.id("add-to-cart-button-14"));
  addCart2.click();

  // Step 6
  log(6, 'Go to cart.');
  $browser.waitForElement(By.xpath("//div[@class=\'footer-upper\']//a[.=\'Shopping cart\']"), StepTimeout);
  var footer = $browser.findElement(By.xpath("//div[@class=\'footer-upper\']//a[.=\'Shopping cart\']"));
  footer.click();
  
  // Das Ende
  log(lastStep, '');
  console.log('Browser script execution SUCCEEDED.');
});
/** END OF SCRIPT **/
