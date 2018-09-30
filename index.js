/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/
 
'use strict';
const Alexa = require('alexa-sdk');
 
//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================
 
//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = process.env.APP_ID;
 
const SKILL_NAME = 'みんなの誕生日';
const HELP_MESSAGE = '誕生日を知りたい人の名前か、日付を教えて下さい。';
const HELP_REPROMPT = '';
const STOP_MESSAGE = 'byebye!';
 
//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/data
//=========================================================================================================================================
var dataofbirthay = [
    //'FullName:NickName:Birthday:Profile',
	‘日本太郎::1970-01-01:1'
    ];
 
var ListUpItems = function(value) {
    var valuebirthdate = value.split(':')[2].split('-')[1] + '-' + value.split(':')[2].split('-')[2];
    //var birthdate = 'XX-XX';
    if ((this.namae != null && value.indexOf(this.namae) != -1) || (this.birth != null && valuebirthdate.indexOf(this.birth) != -1)){
        return true;
    }
    else 
        return false;
};
 
function ReturnItems(obj){
    var speechOutput = '';
    var listUpitem = dataofbirthay.filter(ListUpItems, obj);
    if (obj.namae != null)
    {
        if (listUpitem.length > 0)
        {
        	if (listUpitem.length > 1)
        	{
        		speechOutput = obj.namae + 'さんは' + listUpitem.length + '人います。';
        	}
            listUpitem.forEach(function(item) {
                speechOutput = speechOutput + '、' + item.split(':')[0]  + 'さんの誕生日は' + item.split(':')[2];
            });
            speechOutput = speechOutput  + 'です。';
        } else
        {
            speechOutput = speechOutput + 'ごめんなさい、' + obj.namae  + 'さんの誕生日を知りません。';
        }
    } else if (obj.birth != null)
    {
        if (listUpitem.length > 0)
        {
            speechOutput = obj.birth.replace('-','月') + '日が誕生日の人は' + listUpitem.length + '人います。';
            listUpitem.forEach(function(item) {
                speechOutput = speechOutput + '、' + item.split(':')[0] + 'さん';
            });
            speechOutput = speechOutput + 'です。';
        } else
        {
            speechOutput = speechOutput + 'ごめんなさい、' + obj.birth.replace('-','月') + '日が誕生日の人を知りません。';
        }
    }
    return speechOutput;
}
 
//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================
 
const handlers = {
    'LaunchRequest': function () {
        this.emit('AMAZON.HelpIntent');
    },
    'Names': function () {
        var Names = this.event.request.intent.slots.Name.value;
        console.log('SearchName:' + Names);
        var namaeandbirthday = { namae:Names, birth:null };
        
        var speechOutput = ReturnItems(namaeandbirthday);
        
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'Dates': function () {
    	var speechOutput = 'ごめんなさい、月日だけでもう一度試してみて下さい。';
        var Dates = this.event.request.intent.slots.Date.value;
        console.log('SearchDate:' + Dates);
        if (Dates != null)
        {
        	var namaeandbirthday = { namae:null, birth:Dates.split('-')[1] + '-' + Dates.split('-')[2] };
        
        	speechOutput = ReturnItems(namaeandbirthday);
        }
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;
 
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
    	this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    }
};
 
exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
