function del_slack_posts() {
  var token = "xxxx";
  var channel_id = "yyyy";

  var data = getMessages(token, channel_id)

  for (var i = 0; i < data.messages.length; i++) {
    if (data.messages[i]["latest_reply"]) {
      var reps = getReplies(token, channel_id, data.messages[i]["ts"])
      for (var j = 0; j < reps.messages.length; j++) {
        deleteMessages(token, channel_id, reps.messages[j]["ts"])
      }
    }
    deleteMessages(token, channel_id, data.messages[i]["ts"])
  }
}

function getMessages(token, channel_id) {
  var url = "https://slack.com/api/conversations.history";
  var payload = {
    token: token,
    channel: channel_id,
    limit: 1000,
  };
  var options = {
    method: "post",
    payload: payload,
  };

  var response = UrlFetchApp.fetch(url, options);
  var json = response.getContentText();
  return JSON.parse(json);
}

function getReplies(token, channel_id, ts) {
  var url = "https://slack.com/api/conversations.replies";
  var payload = {
    token: token,
    channel: channel_id,
    ts: ts,
  };
  var options = {
    method: "post",
    payload: payload,
  };

  var response = UrlFetchApp.fetch(url, options);
  var json = response.getContentText();
  return JSON.parse(json);
}

function deleteMessages(token, channel_id, ts) {
    var urldelete = "https://slack.com/api/chat.delete";
    var payload = {
      token: token,
      channel: channel_id,
      ts: ts,
    };

    var options = {
      method: "post",
      payload: payload,
    };
    return UrlFetchApp.fetch(urldelete, options);
}
