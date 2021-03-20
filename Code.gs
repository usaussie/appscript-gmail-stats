// google sheet to store aggregate CSV info
var SHEET_URL = "https://docs.google.com/spreadsheets/d/your-id-here/edit#gid=0";
var MAIN_SHEET_TAB_NAME = "Columns";
var DIMENSION_SHEET_TAB_NAME = "Dimensions";


/*
*
* ONLY RUN THIS ONCE TO SET THE HEADER ROWS FOR THE GOOGLE SHEETS
*/
function set_sheet_headers() {
  
  var sheet = SpreadsheetApp.openByUrl(SHEET_URL).getSheetByName(MAIN_SHEET_TAB_NAME);
  sheet.appendRow(["Audit_Date","Inbox_Threads","Inbox_Unread_Count","Priority_Inbox_Threads", "Priority_Inbox_Unread_Count", "Spam_Threads", "Spam_Unread_Count", "Last_Hour_Count", "Not_Inbox_Unread","Last_Hour_Unsubscribe_Count","last_hour_from_my_domain","last_hour_not_from_my_domain","last_hour_sent"]);

  var sheet = SpreadsheetApp.openByUrl(SHEET_URL).getSheetByName(DIMENSION_SHEET_TAB_NAME);
  sheet.appendRow(["Audit_Date","Dimension","Value"]);
  
}

function getGmailStats() {
  
  var audit_date = new Date();

  var inbox_unread_count = GmailApp.getInboxUnreadCount();
  var inbox_threads = countQuery('label:inbox'); 
  var priority_inbox_threads = GmailApp.getPriorityInboxThreads().length;
  var priority_inbox_unread_count = GmailApp.getPriorityInboxUnreadCount();
  var spam_threads = GmailApp.getSpamThreads().length;
  var spam_unread_count = GmailApp.getSpamUnreadCount();
  var last_hour_count = countQuery('newer_than:1h in:anywhere'); 
  var not_inbox_unread = countQuery('!in:inbox is:unread'); 
  var last_hour_unsubscribe_count = countQuery('newer_than:1h unsubscribe');
  var last_hour_sent = countQuery('newer_than:1h in:sent');

  var last_hour_from_my_domain = countQuery('newer_than:1h from:yourdomain.com ');
  var last_hour_not_from_my_domain = countQuery('newer_than:1h !from:yourdomain.com ');

    //push data in as a multiple columns
  var ss = SpreadsheetApp.openByUrl(SHEET_URL).getSheetByName(MAIN_SHEET_TAB_NAME);
  ss.appendRow([audit_date,inbox_threads,inbox_unread_count,priority_inbox_threads, priority_inbox_unread_count, spam_threads, spam_unread_count, last_hour_count, not_inbox_unread,last_hour_unsubscribe_count,last_hour_from_my_domain,last_hour_not_from_my_domain,last_hour_sent]);

  
  //push data in as a dimension instead of multiple columns
  var ss = SpreadsheetApp.openByUrl(SHEET_URL).getSheetByName(DIMENSION_SHEET_TAB_NAME);
  ss.appendRow([audit_date,'inbox_unread_count', inbox_unread_count]);
  ss.appendRow([audit_date,'inbox_threads', inbox_threads]);
  ss.appendRow([audit_date,'priority_inbox_threads', priority_inbox_threads]);
  ss.appendRow([audit_date,'priority_inbox_unread_count', priority_inbox_unread_count]);
  ss.appendRow([audit_date,'spam_threads', spam_threads]);
  ss.appendRow([audit_date,'spam_unread_count', spam_unread_count]);
  ss.appendRow([audit_date,'last_hour_count', last_hour_count]);
  ss.appendRow([audit_date,'not_inbox_unread', not_inbox_unread]);
  ss.appendRow([audit_date,'last_hour_unsubscribe_count', last_hour_unsubscribe_count]);
  ss.appendRow([audit_date,'last_hour_from_my_domain', last_hour_from_my_domain]);
  ss.appendRow([audit_date,'last_hour_not_from_my_domain', last_hour_not_from_my_domain]);
  ss.appendRow([audit_date,'last_hour_sent',last_hour_sent]);


}

function countQuery(gmailQuery) {
  var pageToken;
  var return_count = 0;
  do {
    var threadList = Gmail.Users.Threads.list('me', {
      q: gmailQuery,
      pageToken: pageToken
    });
    if (threadList.threads && threadList.threads.length > 0) {
      threadList.threads.forEach(function(thread) {
        return_count++;
      });
    }
    pageToken = threadList.nextPageToken;
  } while (pageToken);

  return return_count;
}
