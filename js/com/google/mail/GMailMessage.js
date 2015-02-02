CLASS({
   "model_": "Model",
   "id": "com.google.mail.GMailMessage",
   "package": "com.google.mail",
   "name": "GMailMessage",
   "plural": "messages",
   "properties": [
      {
         "model_": "StringProperty",
         "name": "historyId",
         "help": "The ID of the last history record that modified this message."
      },
      {
         "model_": "StringProperty",
         "name": "id",
         "help": "The immutable ID of the message."
      },
      {
         "model_": "StringArrayProperty",
         "name": "labelIds",
         "help": "List of IDs of labels applied to this message."
      },
      {
         "model_": "Property",
         "name": "payload",
         "subType": "MessagePart",
         "help": "The parsed email structure in the message parts."
      },
      {
         "model_": "StringProperty",
         "name": "raw",
         "help": "The entire email message in an RFC 2822 formatted string. Returned in messages.get and drafts.get responses when the format=RAW parameter is supplied."
      },
      {
         "model_": "IntProperty",
         "name": "sizeEstimate",
         "help": "Estimated size in bytes of the message."
      },
      {
         "model_": "StringProperty",
         "name": "snippet",
         "help": "A short part of the message text."
      },
      {
         "model_": "StringProperty",
         "name": "threadId",
         "help": "The ID of the thread the message belongs to. To add a message or draft to a thread, the following criteria must be met: \u000a- The requested threadId must be specified on the Message or Draft.Message you supply with your request. \u000a- The References and In-Reply-To headers must be set in compliance with the <a href=\"https://tools.ietf.org/html/rfc2822\"RFC 2822 standard. \u000a- The Subject headers must match."
      }
   ],
   "actions": [],
   "constants": [],
   "messages": [],
   "methods": [],
   "listeners": [],
   "templates": [],
   "models": [],
   "tests": [],
   "relationships": [],
   "issues": []
});