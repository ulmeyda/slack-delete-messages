function del_slack_posts() {
  var token = "xxxx";
  var channel_id = "yyyy";
  var user_id = "zzzz";
  var cursor = '';

  while(1) {
    var data = getMessages(token, channel_id, cursor)

    for (var i = 0; i < data.messages.length; i++) {
      if (data.messages[i]["latest_reply"]) {
        var reps = getReplies(token, channel_id, data.messages[i]["ts"])
        for (var j = 0; j < reps.messages.length; j++) {
          if (reps.messages[j]['user'] == user_id) {
            deleteMessages(token, channel_id, reps.messages[j]["ts"])
          }
        }
      }
      if (data.messages[i]['user'] == user_id) {
        deleteMessages(token, channel_id, data.messages[i]["ts"])
      }
    }
    if (!data.response_metadata) return;
    cursor = data.response_metadata['next_cursor'];
  }
}

function getMessages(token, channel_id, cursor) {
  var url = "https://slack.com/api/conversations.history";
  var payload = {
    token: token,
    channel: channel_id,
    limit: 100,
    cursor: cursor,
    include_all_metadata: true,
  };
  var options = {
    method: "post",
    payload: payload,
  };

  var response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
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
  return JSON.parse(response.getContentText());
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
